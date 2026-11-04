/*
  20261102_auth_session_30min.sql

  Session rules (Phase 1, step S1):
    - a login lasts at most AbsoluteMinutes (the backend passes 30);
    - it ends after IdleMinutes (the backend passes 5) without a refresh; the
      browser refreshes only while the user is active;
    - one login at a time per employee: a new sign-in always ends the older
      ones. (The earlier 'block' / 'off' modes and the 120 / 1800 second
      "active window" are gone: the @Mode and @ActiveWindowSeconds parameters
      are still accepted so older copies of the backend keep working, but they
      are ignored.)
    - every USP_Auth_* procedure that touches AuthSessions now uses ONE clock,
      GETDATE() (server local time). Before this, some used GETDATE() and
      others SYSUTCDATETIME(), so expiry times could be hours apart.
    - the procedures also return IdleRemainingSeconds and
      AbsoluteRemainingSeconds, so the browser can show a countdown without
      depending on any clock.
    - USP_Auth_TouchSession is kept as a do-nothing procedure (the heartbeat no
      longer writes to the database). LastSeenAt is no longer written; the
      column is removed later by the schema-cleanup script.

  Effect on people: every login that exists when this script runs is ended once
  (their rows hold times from two different clocks), so everybody signs in again.

  Run BEFORE starting the new backend. Safe to run more than once.
  Select the HRMS database first (no USE line). Do not save this file from SSMS.

  Before running, keep a copy of the live procedures (the TL changed some of
  them directly on the database):
    SELECT OBJECT_NAME(object_id), OBJECT_DEFINITION(object_id)
    FROM sys.procedures WHERE name LIKE 'USP[_]Auth[_]%';
*/
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

/* ---- 1. Default for CreatedAt on the same clock -------------------------- */
IF EXISTS (SELECT 1 FROM sys.default_constraints
           WHERE name = N'DF_AuthSessions_CreatedAt'
             AND parent_object_id = OBJECT_ID(N'dbo.AuthSessions')
             AND definition LIKE N'%sysutcdatetime%')
BEGIN
    ALTER TABLE dbo.AuthSessions DROP CONSTRAINT DF_AuthSessions_CreatedAt;
    ALTER TABLE dbo.AuthSessions ADD CONSTRAINT DF_AuthSessions_CreatedAt DEFAULT (GETDATE()) FOR CreatedAt;
END
GO

/* ---- 2. End every login that is open now (mixed clocks in old rows) ------ */
UPDATE dbo.AuthSessions
SET    RevokedAt = GETDATE(), RevokedReason = 'expired'
WHERE  RevokedAt IS NULL;
GO

/* ---- 3. USP_Auth_CreateSession ------------------------------------------- */
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_CreateSession]
    @SessionID           UNIQUEIDENTIFIER,
    @FamilyID            UNIQUEIDENTIFIER,
    @EmployeeID          VARCHAR(100),
    @RefreshTokenHash    CHAR(64),
    @IdleMinutes         INT,
    @AbsoluteMinutes     INT,
    @IPAddress           VARCHAR(45)  = NULL,
    @UserAgent           VARCHAR(300) = NULL,
    @DeviceName          VARCHAR(100) = NULL,
    @Mode                VARCHAR(10)  = NULL,   -- ignored: always one login at a time
    @ActiveWindowSeconds INT          = NULL    -- ignored
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF @SessionID IS NULL
       OR @FamilyID IS NULL
       OR NULLIF(LTRIM(RTRIM(@EmployeeID)), '') IS NULL
       OR @RefreshTokenHash IS NULL
       OR @IdleMinutes IS NULL OR @IdleMinutes <= 0
       OR @AbsoluteMinutes IS NULL OR @AbsoluteMinutes <= 0
    BEGIN
        SELECT 400 AS StatusCode, 'BAD_REQUEST' AS Code, N'Invalid session parameters.' AS Message,
               0 AS ReplacedCount, CAST(NULL AS VARCHAR(100)) AS OtherDeviceName,
               CAST(NULL AS DATETIME2(0)) AS OtherLastSeenAt,
               CAST(NULL AS INT) AS IdleRemainingSeconds, CAST(NULL AS INT) AS AbsoluteRemainingSeconds;
        RETURN;
    END

    DECLARE @Now         DATETIME2(0) = GETDATE();
    DECLARE @AbsoluteExp DATETIME2(0) = DATEADD(MINUTE, @AbsoluteMinutes, @Now);
    DECLARE @IdleExp     DATETIME2(0) = DATEADD(MINUTE, @IdleMinutes, @Now);
    DECLARE @Replaced    INT = 0;
    DECLARE @LockResult  INT;
    DECLARE @LockName    NVARCHAR(255) = N'auth_login:' + @EmployeeID;

    -- Idle expiry can never run past the absolute limit.
    IF @IdleExp > @AbsoluteExp SET @IdleExp = @AbsoluteExp;

    BEGIN TRY
        BEGIN TRAN;

        -- Two logins of the same employee at the same moment are handled one
        -- after the other, so exactly one survives.
        EXEC @LockResult = sp_getapplock
             @Resource = @LockName, @LockMode = 'Exclusive',
             @LockOwner = 'Transaction', @LockTimeout = 5000;

        IF @LockResult < 0
        BEGIN
            ROLLBACK TRAN;
            SELECT 503 AS StatusCode, 'BUSY' AS Code, N'Please try again.' AS Message,
                   0 AS ReplacedCount, CAST(NULL AS VARCHAR(100)) AS OtherDeviceName,
                   CAST(NULL AS DATETIME2(0)) AS OtherLastSeenAt,
                   CAST(NULL AS INT) AS IdleRemainingSeconds, CAST(NULL AS INT) AS AbsoluteRemainingSeconds;
            RETURN;
        END

        -- Logins that already timed out are closed with their real reason, so
        -- they are not reported as "replaced".
        UPDATE dbo.AuthSessions
        SET    RevokedAt = @Now,
               RevokedReason = CASE WHEN AbsoluteExpiresAt <= @Now THEN 'expired' ELSE 'idle' END
        WHERE  EmployeeID = @EmployeeID
          AND  RevokedAt IS NULL
          AND  (AbsoluteExpiresAt <= @Now OR IdleExpiresAt <= @Now);

        -- Whatever is still open is a live login on another device or tab.
        -- One row per login is unrevoked at any time, so this counts logins.
        UPDATE dbo.AuthSessions
        SET    RevokedAt = @Now, RevokedReason = 'replaced'
        WHERE  EmployeeID = @EmployeeID
          AND  RevokedAt IS NULL;

        SET @Replaced = @@ROWCOUNT;

        INSERT INTO dbo.AuthSessions
            (SessionID, FamilyID, EmployeeID, RefreshTokenHash,
             CreatedAt, LastUsedAt, IdleExpiresAt, AbsoluteExpiresAt,
             IPAddress, UserAgent, DeviceName)
        VALUES
            (@SessionID, @FamilyID, @EmployeeID, @RefreshTokenHash,
             @Now, @Now, @IdleExp, @AbsoluteExp,
             @IPAddress, @UserAgent, @DeviceName);

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        THROW;
    END CATCH

    SELECT 200 AS StatusCode, 'OK' AS Code, N'Session created.' AS Message,
           @Replaced AS ReplacedCount, CAST(NULL AS VARCHAR(100)) AS OtherDeviceName,
           CAST(NULL AS DATETIME2(0)) AS OtherLastSeenAt,
           DATEDIFF(SECOND, @Now, @IdleExp)     AS IdleRemainingSeconds,
           DATEDIFF(SECOND, @Now, @AbsoluteExp) AS AbsoluteRemainingSeconds;
END
GO

/* ---- 4. USP_Auth_IsSessionActive ------------------------------------------
   IsActive, Reason (why it is over: replaced, logout, expired = 30-minute
   limit, idle = no activity, ...) and the seconds left on both clocks.
   Returns no row when the login is unknown (for example already purged).
----------------------------------------------------------------------------- */
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_IsSessionActive]
    @FamilyID UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Now DATETIME2(0) = GETDATE();

    -- An active login has exactly one unrevoked row. Otherwise the newest row
    -- that was ended on purpose explains the end; a plain 'rotated' row only
    -- means "replaced by a newer token" and is the last choice.
    SELECT TOP (1)
           CAST(CASE WHEN RevokedAt IS NULL
                      AND IdleExpiresAt > @Now
                      AND AbsoluteExpiresAt > @Now THEN 1 ELSE 0 END AS BIT) AS IsActive,
           CAST(CASE WHEN RevokedAt IS NOT NULL THEN RevokedReason
                     WHEN AbsoluteExpiresAt <= @Now THEN 'expired'
                     WHEN IdleExpiresAt <= @Now THEN 'idle'
                     ELSE NULL END AS VARCHAR(30)) AS Reason,
           CASE WHEN RevokedAt IS NULL AND IdleExpiresAt > @Now AND AbsoluteExpiresAt > @Now
                THEN DATEDIFF(SECOND, @Now, IdleExpiresAt) ELSE 0 END     AS IdleRemainingSeconds,
           CASE WHEN RevokedAt IS NULL AND IdleExpiresAt > @Now AND AbsoluteExpiresAt > @Now
                THEN DATEDIFF(SECOND, @Now, AbsoluteExpiresAt) ELSE 0 END AS AbsoluteRemainingSeconds
    FROM   dbo.AuthSessions
    WHERE  FamilyID = @FamilyID
    ORDER BY CASE WHEN RevokedAt IS NULL THEN 0
                  WHEN RevokedReason = 'rotated' THEN 2
                  ELSE 1 END,
             CreatedAt DESC;
END
GO

/* ---- 5. USP_Auth_TouchSession: kept so older callers do not fail ---------- */
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_TouchSession]
    @FamilyID UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 200 AS StatusCode;
END
GO

/* ---- 6. USP_Auth_RotateSession --------------------------------------------
   Called only when the browser asks for a refresh, which it does only while
   the user is active. Refused when the 30-minute limit has passed ('expired')
   or the idle window ran out ('idle'). The absolute limit is never extended.
----------------------------------------------------------------------------- */
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_RotateSession]
    @OldRefreshTokenHash CHAR(64),
    @NewSessionID        UNIQUEIDENTIFIER,
    @NewRefreshTokenHash CHAR(64),
    @IdleMinutes         INT,
    @IPAddress           VARCHAR(45)  = NULL,
    @UserAgent           VARCHAR(300) = NULL,
    @RaceGraceSeconds    INT          = 10
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @StatusCode INT           = 400,
            @Code       VARCHAR(20)   = 'BAD_REQUEST',
            @Message    NVARCHAR(200) = N'Invalid rotation parameters.';

    DECLARE @OutEmployeeID VARCHAR(100)     = NULL,
            @OutFamilyID   UNIQUEIDENTIFIER = NULL,
            @OutIdleExp    DATETIME2(0)     = NULL,
            @OutAbsExp     DATETIME2(0)     = NULL,
            @OutReason     VARCHAR(30)      = NULL,
            @OutIdleSecs   INT              = NULL,
            @OutAbsSecs    INT              = NULL;

    IF @OldRefreshTokenHash IS NULL
       OR @NewSessionID IS NULL
       OR @NewRefreshTokenHash IS NULL
       OR @IdleMinutes IS NULL OR @IdleMinutes <= 0
    BEGIN
        SELECT @StatusCode AS StatusCode, @Code AS Code, @Message AS Message,
               @OutEmployeeID AS EmployeeID, @OutFamilyID AS FamilyID,
               @OutIdleExp AS IdleExpiresAt, @OutAbsExp AS AbsoluteExpiresAt,
               @OutReason AS RevokedReason,
               @OutIdleSecs AS IdleRemainingSeconds, @OutAbsSecs AS AbsoluteRemainingSeconds;
        RETURN;
    END

    DECLARE @Now           DATETIME2(0) = GETDATE(),
            @OldSessionID  UNIQUEIDENTIFIER,
            @FamilyID      UNIQUEIDENTIFIER,
            @EmployeeID    VARCHAR(100),
            @IdleExpiresAt DATETIME2(0),
            @AbsExpiresAt  DATETIME2(0),
            @RevokedAt     DATETIME2(0),
            @RevokedReason VARCHAR(30),
            @DeviceName    VARCHAR(100),
            @NewIdleExp    DATETIME2(0),
            @EndReason     VARCHAR(30);

    BEGIN TRY
        BEGIN TRAN;

        -- Lock the row so two simultaneous refreshes are handled one after the other.
        SELECT @OldSessionID  = SessionID,
               @FamilyID      = FamilyID,
               @EmployeeID    = EmployeeID,
               @IdleExpiresAt = IdleExpiresAt,
               @AbsExpiresAt  = AbsoluteExpiresAt,
               @RevokedAt     = RevokedAt,
               @RevokedReason = RevokedReason,
               @DeviceName    = DeviceName
        FROM   dbo.AuthSessions WITH (UPDLOCK, HOLDLOCK)
        WHERE  RefreshTokenHash = @OldRefreshTokenHash;

        IF @OldSessionID IS NULL
        BEGIN
            SELECT @StatusCode = 401, @Code = 'INVALID', @Message = N'Session not found.',
                   @OutReason = 'expired';
        END
        ELSE IF @RevokedAt IS NOT NULL
        BEGIN
            IF @RevokedReason = 'rotated'
               AND DATEDIFF(SECOND, @RevokedAt, @Now) <= @RaceGraceSeconds
            BEGIN
                SELECT @StatusCode = 401, @Code = 'RACE',
                       @Message = N'Token was just refreshed. Retry with the new cookie.';
            END
            ELSE IF @RevokedReason = 'rotated'
            BEGIN
                -- An old token came back after its replacement was issued.
                UPDATE dbo.AuthSessions
                SET    RevokedAt = @Now, RevokedReason = 'reuse_detected'
                WHERE  FamilyID = @FamilyID AND RevokedAt IS NULL;

                SELECT @StatusCode = 409, @Code = 'REUSED',
                       @Message = N'Refresh token reuse detected. The session was ended.',
                       @OutReason = 'reuse_detected';
            END
            ELSE
            BEGIN
                SELECT @StatusCode = 401, @Code = 'REVOKED', @Message = N'Session has ended.',
                       @OutReason = @RevokedReason;
            END
        END
        ELSE IF @Now >= @AbsExpiresAt OR @Now >= @IdleExpiresAt
        BEGIN
            -- The 30-minute limit wins over the idle window when both have passed.
            SET @EndReason = CASE WHEN @Now >= @AbsExpiresAt THEN 'expired' ELSE 'idle' END;

            UPDATE dbo.AuthSessions
            SET    RevokedAt = @Now, RevokedReason = @EndReason
            WHERE  SessionID = @OldSessionID;

            SELECT @StatusCode = 401, @Code = 'EXPIRED', @Message = N'Session has expired.',
                   @OutReason = @EndReason;
        END
        ELSE
        BEGIN
            -- Slide the idle window, but never past the absolute limit.
            SET @NewIdleExp = DATEADD(MINUTE, @IdleMinutes, @Now);
            IF @NewIdleExp > @AbsExpiresAt SET @NewIdleExp = @AbsExpiresAt;

            UPDATE dbo.AuthSessions
            SET    RevokedAt           = @Now,
                   RevokedReason       = 'rotated',
                   ReplacedBySessionID = @NewSessionID,
                   LastUsedAt          = @Now
            WHERE  SessionID = @OldSessionID;

            INSERT INTO dbo.AuthSessions
                (SessionID, FamilyID, EmployeeID, RefreshTokenHash,
                 CreatedAt, LastUsedAt, IdleExpiresAt, AbsoluteExpiresAt,
                 IPAddress, UserAgent, DeviceName)
            VALUES
                (@NewSessionID, @FamilyID, @EmployeeID, @NewRefreshTokenHash,
                 @Now, @Now, @NewIdleExp, @AbsExpiresAt,
                 @IPAddress, @UserAgent, @DeviceName);

            SELECT @StatusCode = 200, @Code = 'OK', @Message = N'Session refreshed.',
                   @OutEmployeeID = @EmployeeID, @OutFamilyID = @FamilyID,
                   @OutIdleExp = @NewIdleExp, @OutAbsExp = @AbsExpiresAt,
                   @OutIdleSecs = DATEDIFF(SECOND, @Now, @NewIdleExp),
                   @OutAbsSecs  = DATEDIFF(SECOND, @Now, @AbsExpiresAt);
        END

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        THROW;
    END CATCH

    SELECT @StatusCode AS StatusCode, @Code AS Code, @Message AS Message,
           @OutEmployeeID AS EmployeeID, @OutFamilyID AS FamilyID,
           @OutIdleExp AS IdleExpiresAt, @OutAbsExp AS AbsoluteExpiresAt,
           @OutReason AS RevokedReason,
           @OutIdleSecs AS IdleRemainingSeconds, @OutAbsSecs AS AbsoluteRemainingSeconds;
END
GO

/* ---- 7. The three procedures that were still on SYSUTCDATETIME ------------ */
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_RevokeSession]
    @FamilyID UNIQUEIDENTIFIER,
    @Reason   VARCHAR(30) = 'logout'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Count INT;

    UPDATE dbo.AuthSessions
    SET    RevokedAt = GETDATE(),
           RevokedReason = @Reason
    WHERE  FamilyID = @FamilyID
      AND  RevokedAt IS NULL;

    SET @Count = @@ROWCOUNT;

    SELECT 200 AS StatusCode, @Count AS RevokedCount;
END
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_RevokeAllForEmployee]
    @EmployeeID     VARCHAR(100),
    @Reason         VARCHAR(30)      = 'password_changed',
    @ExceptFamilyID UNIQUEIDENTIFIER = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Count INT;

    UPDATE dbo.AuthSessions
    SET    RevokedAt = GETDATE(),
           RevokedReason = @Reason
    WHERE  EmployeeID = @EmployeeID
      AND  RevokedAt IS NULL
      AND  (@ExceptFamilyID IS NULL OR FamilyID <> @ExceptFamilyID);

    SET @Count = @@ROWCOUNT;

    SELECT 200 AS StatusCode, @Count AS RevokedCount;
END
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_PurgeExpired]
    @RetentionDays INT = 30,
    @BatchSize     INT = 5000
AS
BEGIN
    SET NOCOUNT ON;

    IF @RetentionDays IS NULL OR @RetentionDays < 0 SET @RetentionDays = 30;
    IF @BatchSize IS NULL OR @BatchSize <= 0 SET @BatchSize = 5000;

    DECLARE @Cutoff  DATETIME2(0) = DATEADD(DAY, -@RetentionDays, GETDATE());
    DECLARE @Batch   INT = 1;
    DECLARE @Deleted INT = 0;

    WHILE @Batch > 0
    BEGIN
        DELETE TOP (@BatchSize)
        FROM   dbo.AuthSessions
        WHERE  (RevokedAt IS NOT NULL AND RevokedAt < @Cutoff)
           OR  AbsoluteExpiresAt < @Cutoff
           OR  IdleExpiresAt < @Cutoff;

        SET @Batch = @@ROWCOUNT;
        SET @Deleted = @Deleted + @Batch;
    END

    SELECT 200 AS StatusCode, @Deleted AS DeletedRows;
END
GO
