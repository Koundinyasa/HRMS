/*
  20261031_auth_single_session.sql

  One login at a time per employee (Phase 1, step 1C).

  - AuthSessions gets LastSeenAt (set by the browser heartbeat) and DeviceName
    (for example "Chrome on Windows").
  - USP_Auth_CreateSession ends the employee's other active logins ("replaced")
    or refuses the new login, depending on @Mode, in one transaction.
  - USP_Auth_IsSessionActive and USP_Auth_RotateSession also say WHY a login
    ended, so the browser can tell "signed in on another device" from
    "logged out" and "timed out".
  - USP_Auth_TouchSession (new) records that a tab is still open.

  Run 20261030_create_auth_sessions.sql first. Safe to run more than once.
  Select the HRMS database before running (no USE line on purpose).
*/
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

IF COL_LENGTH(N'dbo.AuthSessions', N'LastSeenAt') IS NULL
    ALTER TABLE dbo.AuthSessions ADD LastSeenAt DATETIME2(0) NULL;
GO
IF COL_LENGTH(N'dbo.AuthSessions', N'DeviceName') IS NULL
    ALTER TABLE dbo.AuthSessions ADD DeviceName VARCHAR(100) NULL;
GO

/* ---------------------------------------------------------------------------
   USP_Auth_CreateSession
   @Mode: 'replace' (default) = end the employee's other active logins,
          'block'   = refuse (409 ACTIVE_ELSEWHERE) while another login was
                      seen within @ActiveWindowSeconds, otherwise replace,
          'off'     = allow any number of logins.
--------------------------------------------------------------------------- */
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
    @Mode                VARCHAR(10)  = 'replace',
    @ActiveWindowSeconds INT          = 120
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
       OR @Mode IS NULL OR @Mode NOT IN ('replace', 'block', 'off')
    BEGIN
        SELECT 400 AS StatusCode, 'BAD_REQUEST' AS Code, N'Invalid session parameters.' AS Message,
               0 AS ReplacedCount, CAST(NULL AS VARCHAR(100)) AS OtherDeviceName,
               CAST(NULL AS DATETIME2(0)) AS OtherLastSeenAt;
        RETURN;
    END

    DECLARE @Now         DATETIME2(0) = SYSUTCDATETIME();
    DECLARE @AbsoluteExp DATETIME2(0) = DATEADD(MINUTE, @AbsoluteMinutes, @Now);
    DECLARE @IdleExp     DATETIME2(0) = DATEADD(MINUTE, @IdleMinutes, @Now);
    DECLARE @Replaced    INT = 0;
    DECLARE @LockResult  INT;
    DECLARE @LockName    NVARCHAR(255) = N'auth_login:' + @EmployeeID;
    DECLARE @OtherDevice VARCHAR(100), @OtherSeen DATETIME2(0);

    -- Idle expiry can never run past the absolute limit.
    IF @IdleExp > @AbsoluteExp SET @IdleExp = @AbsoluteExp;

    BEGIN TRY
        BEGIN TRAN;

        IF @Mode <> 'off'
        BEGIN
            -- Two logins of the same employee at the same moment are handled
            -- one after the other, so exactly one survives.
            EXEC @LockResult = sp_getapplock
                 @Resource = @LockName, @LockMode = 'Exclusive',
                 @LockOwner = 'Transaction', @LockTimeout = 5000;

            IF @LockResult < 0
            BEGIN
                ROLLBACK TRAN;
                SELECT 503 AS StatusCode, 'BUSY' AS Code, N'Please try again.' AS Message,
                       0 AS ReplacedCount, CAST(NULL AS VARCHAR(100)) AS OtherDeviceName,
                       CAST(NULL AS DATETIME2(0)) AS OtherLastSeenAt;
                RETURN;
            END

            IF @Mode = 'block'
            BEGIN
                SELECT TOP (1)
                       @OtherDevice = DeviceName,
                       @OtherSeen   = COALESCE(LastSeenAt, LastUsedAt, CreatedAt)
                FROM   dbo.AuthSessions
                WHERE  EmployeeID = @EmployeeID
                  AND  RevokedAt IS NULL
                  AND  IdleExpiresAt > @Now
                  AND  AbsoluteExpiresAt > @Now
                  AND  COALESCE(LastSeenAt, LastUsedAt, CreatedAt) > DATEADD(SECOND, -@ActiveWindowSeconds, @Now)
                ORDER BY COALESCE(LastSeenAt, LastUsedAt, CreatedAt) DESC;

                IF @@ROWCOUNT > 0
                BEGIN
                    ROLLBACK TRAN;
                    SELECT 409 AS StatusCode, 'ACTIVE_ELSEWHERE' AS Code,
                           N'This account is already signed in on another device.' AS Message,
                           0 AS ReplacedCount, @OtherDevice AS OtherDeviceName,
                           @OtherSeen AS OtherLastSeenAt;
                    RETURN;
                END
            END

            -- One row per login is unrevoked at any time, so this counts logins.
            UPDATE dbo.AuthSessions
            SET    RevokedAt = @Now, RevokedReason = 'replaced'
            WHERE  EmployeeID = @EmployeeID
              AND  RevokedAt IS NULL;

            SET @Replaced = @@ROWCOUNT;
        END

        INSERT INTO dbo.AuthSessions
            (SessionID, FamilyID, EmployeeID, RefreshTokenHash,
             CreatedAt, LastUsedAt, LastSeenAt, IdleExpiresAt, AbsoluteExpiresAt,
             IPAddress, UserAgent, DeviceName)
        VALUES
            (@SessionID, @FamilyID, @EmployeeID, @RefreshTokenHash,
             @Now, @Now, @Now, @IdleExp, @AbsoluteExp,
             @IPAddress, @UserAgent, @DeviceName);

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        THROW;
    END CATCH

    SELECT 200 AS StatusCode, 'OK' AS Code, N'Session created.' AS Message,
           @Replaced AS ReplacedCount, CAST(NULL AS VARCHAR(100)) AS OtherDeviceName,
           CAST(NULL AS DATETIME2(0)) AS OtherLastSeenAt;
END
GO

/* ---------------------------------------------------------------------------
   USP_Auth_IsSessionActive: same answer as before (IsActive) plus the reason
   a login is over: replaced, logout, expired, password_changed, ...
   Returns no row when the login is unknown (for example already purged).
--------------------------------------------------------------------------- */
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_IsSessionActive]
    @FamilyID UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Now DATETIME2(0) = SYSUTCDATETIME();

    -- An active login has exactly one unrevoked row. Otherwise the newest row
    -- that was ended on purpose explains the end; a plain 'rotated' row only
    -- means "replaced by a newer token" and is the last choice.
    SELECT TOP (1)
           CAST(CASE WHEN RevokedAt IS NULL
                      AND IdleExpiresAt > @Now
                      AND AbsoluteExpiresAt > @Now THEN 1 ELSE 0 END AS BIT) AS IsActive,
           CAST(CASE WHEN RevokedAt IS NOT NULL THEN RevokedReason
                     WHEN IdleExpiresAt <= @Now OR AbsoluteExpiresAt <= @Now THEN 'expired'
                     ELSE NULL END AS VARCHAR(30)) AS Reason
    FROM   dbo.AuthSessions
    WHERE  FamilyID = @FamilyID
    ORDER BY CASE WHEN RevokedAt IS NULL THEN 0
                  WHEN RevokedReason = 'rotated' THEN 2
                  ELSE 1 END,
             CreatedAt DESC;
END
GO

/* ---------------------------------------------------------------------------
   USP_Auth_TouchSession: "this tab is still open". Does not extend the login;
   at most one write every 20 seconds per login.
--------------------------------------------------------------------------- */
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_TouchSession]
    @FamilyID UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Now DATETIME2(0) = SYSUTCDATETIME();

    UPDATE dbo.AuthSessions
    SET    LastSeenAt = @Now
    WHERE  FamilyID = @FamilyID
      AND  RevokedAt IS NULL
      AND  IdleExpiresAt > @Now
      AND  AbsoluteExpiresAt > @Now
      AND  (LastSeenAt IS NULL OR LastSeenAt < DATEADD(SECOND, -20, @Now));

    SELECT 200 AS StatusCode;
END
GO

/* ---------------------------------------------------------------------------
   USP_Auth_RotateSession: unchanged rules; also returns RevokedReason and
   carries DeviceName / LastSeenAt over to the new token row.
--------------------------------------------------------------------------- */
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
            @OutReason     VARCHAR(30)      = NULL;

    IF @OldRefreshTokenHash IS NULL
       OR @NewSessionID IS NULL
       OR @NewRefreshTokenHash IS NULL
       OR @IdleMinutes IS NULL OR @IdleMinutes <= 0
    BEGIN
        SELECT @StatusCode AS StatusCode, @Code AS Code, @Message AS Message,
               @OutEmployeeID AS EmployeeID, @OutFamilyID AS FamilyID,
               @OutIdleExp AS IdleExpiresAt, @OutAbsExp AS AbsoluteExpiresAt,
               @OutReason AS RevokedReason;
        RETURN;
    END

    DECLARE @Now           DATETIME2(0) = SYSUTCDATETIME(),
            @OldSessionID  UNIQUEIDENTIFIER,
            @FamilyID      UNIQUEIDENTIFIER,
            @EmployeeID    VARCHAR(100),
            @IdleExpiresAt DATETIME2(0),
            @AbsExpiresAt  DATETIME2(0),
            @RevokedAt     DATETIME2(0),
            @RevokedReason VARCHAR(30),
            @DeviceName    VARCHAR(100),
            @NewIdleExp    DATETIME2(0);

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
        ELSE IF @Now >= @IdleExpiresAt OR @Now >= @AbsExpiresAt
        BEGIN
            UPDATE dbo.AuthSessions
            SET    RevokedAt = @Now, RevokedReason = 'expired'
            WHERE  SessionID = @OldSessionID;

            SELECT @StatusCode = 401, @Code = 'EXPIRED', @Message = N'Session has expired.',
                   @OutReason = 'expired';
        END
        ELSE
        BEGIN
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
                 CreatedAt, LastUsedAt, LastSeenAt, IdleExpiresAt, AbsoluteExpiresAt,
                 IPAddress, UserAgent, DeviceName)
            VALUES
                (@NewSessionID, @FamilyID, @EmployeeID, @NewRefreshTokenHash,
                 @Now, @Now, @Now, @NewIdleExp, @AbsExpiresAt,
                 @IPAddress, @UserAgent, @DeviceName);

            SELECT @StatusCode = 200, @Code = 'OK', @Message = N'Session refreshed.',
                   @OutEmployeeID = @EmployeeID, @OutFamilyID = @FamilyID,
                   @OutIdleExp = @NewIdleExp, @OutAbsExp = @AbsExpiresAt;
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
           @OutReason AS RevokedReason;
END
GO
