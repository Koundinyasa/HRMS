/*
  20261030_create_auth_sessions.sql

  Login sessions: tables, indexes and the USP_Auth_* procedures the backend
  uses (src/auth/session/auth-session.service.ts).

  Safe to run more than once: tables, indexes and defaults are created only if
  missing, and procedures use CREATE OR ALTER.

  Source: scripted from the HRMSDEV development database on 2026-10-30.
  The older, unused session objects (UserSessions, USP_CreateUserSession and
  related) are deliberately not part of this script.
*/
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID(N'dbo.AuthSessions', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[AuthSessions](
        [SessionID] [uniqueidentifier] NOT NULL,
        [FamilyID] [uniqueidentifier] NOT NULL,
        [EmployeeID] [varchar](100) NOT NULL,
        [RefreshTokenHash] [char](64) NOT NULL,
        [CreatedAt] [datetime2](0) NOT NULL,
        [LastUsedAt] [datetime2](0) NULL,
        [IdleExpiresAt] [datetime2](0) NOT NULL,
        [AbsoluteExpiresAt] [datetime2](0) NOT NULL,
        [RevokedAt] [datetime2](0) NULL,
        [RevokedReason] [varchar](30) NULL,
        [ReplacedBySessionID] [uniqueidentifier] NULL,
        [IPAddress] [varchar](45) NULL,
        [UserAgent] [varchar](300) NULL,
        CONSTRAINT PK_AuthSessions PRIMARY KEY CLUSTERED (SessionID)
    )
END
GO

IF OBJECT_ID(N'dbo.AuthUserSecurity', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[AuthUserSecurity](
        [EmployeeID] [varchar](25) NOT NULL,
        [MustChangePassword] [bit] NOT NULL,
        [PasswordChangedAt] [datetime2](0) NULL,
        [UpdatedAt] [datetime2](0) NOT NULL,
        CONSTRAINT PK_AuthUserSecurity PRIMARY KEY CLUSTERED (EmployeeID)
    )
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_AuthSessions_Employee' AND object_id = OBJECT_ID(N'dbo.AuthSessions'))
    CREATE NONCLUSTERED INDEX IX_AuthSessions_Employee ON dbo.AuthSessions (EmployeeID, RevokedAt);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_AuthSessions_Family' AND object_id = OBJECT_ID(N'dbo.AuthSessions'))
    CREATE NONCLUSTERED INDEX IX_AuthSessions_Family ON dbo.AuthSessions (FamilyID)
        INCLUDE (RevokedAt, IdleExpiresAt, AbsoluteExpiresAt);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_AuthSessions_TokenHash' AND object_id = OBJECT_ID(N'dbo.AuthSessions'))
    CREATE UNIQUE NONCLUSTERED INDEX UX_AuthSessions_TokenHash ON dbo.AuthSessions (RefreshTokenHash);
GO

IF NOT EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = N'DF_AuthSessions_CreatedAt')
    ALTER TABLE dbo.AuthSessions ADD CONSTRAINT DF_AuthSessions_CreatedAt DEFAULT (SYSUTCDATETIME()) FOR CreatedAt;
IF NOT EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = N'DF_AuthUserSecurity_Must')
    ALTER TABLE dbo.AuthUserSecurity ADD CONSTRAINT DF_AuthUserSecurity_Must DEFAULT ((0)) FOR MustChangePassword;
IF NOT EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = N'DF_AuthUserSecurity_Updated')
    ALTER TABLE dbo.AuthUserSecurity ADD CONSTRAINT DF_AuthUserSecurity_Updated DEFAULT (SYSUTCDATETIME()) FOR UpdatedAt;
GO

-- Object:  StoredProcedure [dbo].[USP_Auth_CreateSession]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_CreateSession]
    @SessionID        UNIQUEIDENTIFIER,
    @FamilyID         UNIQUEIDENTIFIER,
    @EmployeeID       VARCHAR(100),
    @RefreshTokenHash CHAR(64),
    @IdleMinutes      INT,
    @AbsoluteMinutes  INT,
    @IPAddress        VARCHAR(45)  = NULL,
    @UserAgent        VARCHAR(300) = NULL
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
        SELECT 400 AS StatusCode, N'Invalid session parameters.' AS Message;
        RETURN;
    END

    DECLARE @Now           DATETIME2(0) = SYSUTCDATETIME();
    DECLARE @AbsoluteExp   DATETIME2(0) = DATEADD(MINUTE, @AbsoluteMinutes, @Now);
    DECLARE @IdleExp       DATETIME2(0) = DATEADD(MINUTE, @IdleMinutes, @Now);

    -- Idle expiry can never run past the absolute limit.
    IF @IdleExp > @AbsoluteExp SET @IdleExp = @AbsoluteExp;

    INSERT INTO dbo.AuthSessions
        (SessionID, FamilyID, EmployeeID, RefreshTokenHash,
         CreatedAt, LastUsedAt, IdleExpiresAt, AbsoluteExpiresAt,
         IPAddress, UserAgent)
    VALUES
        (@SessionID, @FamilyID, @EmployeeID, @RefreshTokenHash,
         @Now, @Now, @IdleExp, @AbsoluteExp,
         @IPAddress, @UserAgent);

    SELECT 200 AS StatusCode, N'Session created.' AS Message;
END
GO
-- Object:  StoredProcedure [dbo].[USP_Auth_GetUserSecurity]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_GetUserSecurity]
    @EmployeeID VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT CAST(ISNULL((SELECT MustChangePassword
                        FROM   dbo.AuthUserSecurity
                        WHERE  EmployeeID = @EmployeeID), 0) AS BIT) AS MustChangePassword;
END
GO
-- Object:  StoredProcedure [dbo].[USP_Auth_IsSessionActive]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_IsSessionActive]
    @FamilyID UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Now DATETIME2(0) = SYSUTCDATETIME();

    SELECT CAST(
               CASE WHEN EXISTS (SELECT 1
                                 FROM   dbo.AuthSessions
                                 WHERE  FamilyID = @FamilyID
                                   AND  RevokedAt IS NULL
                                   AND  IdleExpiresAt > @Now
                                   AND  AbsoluteExpiresAt > @Now)
                    THEN 1 ELSE 0 END
           AS BIT) AS IsActive;
END
GO
-- Object:  StoredProcedure [dbo].[USP_Auth_PurgeExpired]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_PurgeExpired]
    @RetentionDays INT = 30,
    @BatchSize     INT = 5000
AS
BEGIN
    SET NOCOUNT ON;

    IF @RetentionDays IS NULL OR @RetentionDays < 0 SET @RetentionDays = 30;
    IF @BatchSize IS NULL OR @BatchSize <= 0 SET @BatchSize = 5000;

    DECLARE @Cutoff  DATETIME2(0) = DATEADD(DAY, -@RetentionDays, SYSUTCDATETIME());
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
-- Object:  StoredProcedure [dbo].[USP_Auth_RevokeAllForEmployee]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
    SET    RevokedAt = SYSUTCDATETIME(),
           RevokedReason = @Reason
    WHERE  EmployeeID = @EmployeeID
      AND  RevokedAt IS NULL
      AND  (@ExceptFamilyID IS NULL OR FamilyID <> @ExceptFamilyID);

    SET @Count = @@ROWCOUNT;

    SELECT 200 AS StatusCode, @Count AS RevokedCount;
END
GO
-- Object:  StoredProcedure [dbo].[USP_Auth_RevokeSession]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_RevokeSession]
    @FamilyID UNIQUEIDENTIFIER,
    @Reason   VARCHAR(30) = 'logout'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Count INT;

    UPDATE dbo.AuthSessions
    SET    RevokedAt = SYSUTCDATETIME(),
           RevokedReason = @Reason
    WHERE  FamilyID = @FamilyID
      AND  RevokedAt IS NULL;

    SET @Count = @@ROWCOUNT;

    SELECT 200 AS StatusCode, @Count AS RevokedCount;
END
GO
-- Object:  StoredProcedure [dbo].[USP_Auth_RotateSession]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
            @OutAbsExp     DATETIME2(0)     = NULL;

    IF @OldRefreshTokenHash IS NULL
       OR @NewSessionID IS NULL
       OR @NewRefreshTokenHash IS NULL
       OR @IdleMinutes IS NULL OR @IdleMinutes <= 0
    BEGIN
        SELECT @StatusCode AS StatusCode, @Code AS Code, @Message AS Message,
               @OutEmployeeID AS EmployeeID, @OutFamilyID AS FamilyID,
               @OutIdleExp AS IdleExpiresAt, @OutAbsExp AS AbsoluteExpiresAt;
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
               @RevokedReason = RevokedReason
        FROM   dbo.AuthSessions WITH (UPDLOCK, HOLDLOCK)
        WHERE  RefreshTokenHash = @OldRefreshTokenHash;

        IF @OldSessionID IS NULL
        BEGIN
            SELECT @StatusCode = 401, @Code = 'INVALID', @Message = N'Session not found.';
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
                       @Message = N'Refresh token reuse detected. The session was ended.';
            END
            ELSE
            BEGIN
                SELECT @StatusCode = 401, @Code = 'REVOKED', @Message = N'Session has ended.';
            END
        END
        ELSE IF @Now >= @IdleExpiresAt OR @Now >= @AbsExpiresAt
        BEGIN
            UPDATE dbo.AuthSessions
            SET    RevokedAt = @Now, RevokedReason = 'expired'
            WHERE  SessionID = @OldSessionID;

            SELECT @StatusCode = 401, @Code = 'EXPIRED', @Message = N'Session has expired.';
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
                 CreatedAt, LastUsedAt, IdleExpiresAt, AbsoluteExpiresAt,
                 IPAddress, UserAgent)
            VALUES
                (@NewSessionID, @FamilyID, @EmployeeID, @NewRefreshTokenHash,
                 @Now, @Now, @NewIdleExp, @AbsExpiresAt,
                 @IPAddress, @UserAgent);

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
           @OutIdleExp AS IdleExpiresAt, @OutAbsExp AS AbsoluteExpiresAt;
END
GO
-- Object:  StoredProcedure [dbo].[USP_Auth_SetMustChangePassword]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[USP_Auth_SetMustChangePassword]
    @EmployeeID      VARCHAR(100),
    @MustChange      BIT,
    @PasswordChanged BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF NULLIF(LTRIM(RTRIM(@EmployeeID)), '') IS NULL OR @MustChange IS NULL
    BEGIN
        SELECT 400 AS StatusCode, N'EmployeeID and MustChange are required.' AS Message;
        RETURN;
    END

    DECLARE @Now DATETIME2(0) = SYSUTCDATETIME();

    BEGIN TRAN;

    UPDATE dbo.AuthUserSecurity WITH (UPDLOCK, SERIALIZABLE)
    SET    MustChangePassword = @MustChange,
           PasswordChangedAt  = CASE WHEN @PasswordChanged = 1 THEN @Now ELSE PasswordChangedAt END,
           UpdatedAt          = @Now
    WHERE  EmployeeID = @EmployeeID;

    IF @@ROWCOUNT = 0
        INSERT INTO dbo.AuthUserSecurity (EmployeeID, MustChangePassword, PasswordChangedAt, UpdatedAt)
        VALUES (@EmployeeID, @MustChange,
                CASE WHEN @PasswordChanged = 1 THEN @Now ELSE NULL END, @Now);

    COMMIT TRAN;

    SELECT 200 AS StatusCode, N'Saved.' AS Message;
END
GO
