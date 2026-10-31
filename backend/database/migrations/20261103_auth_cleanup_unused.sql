/* ============================================================================
   20261103_auth_cleanup_unused.sql      (Part A of the session schema cleanup)

   Removes two things the 30-minute session design no longer uses:

     1. dbo.AuthSessions.LastSeenAt     - the heartbeat no longer writes to the
                                          database, so nothing sets or reads it.
     2. dbo.USP_Auth_TouchSession       - a do-nothing procedure; the backend no
                                          longer calls it.

   Checked on HRMSDEV before writing this file:
     - No index, default or constraint depends on LastSeenAt.
     - No stored procedure reads or writes LastSeenAt (the only "hits" were the
       output column alias OtherLastSeenAt in USP_Auth_CreateSession).
     - No other stored procedure calls USP_Auth_TouchSession.

   Safe to run more than once. Run AFTER 20261102_auth_session_30min.sql.
   ============================================================================ */
SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRAN;

IF COL_LENGTH(N'dbo.AuthSessions', N'LastSeenAt') IS NOT NULL
BEGIN
    ALTER TABLE dbo.AuthSessions DROP COLUMN LastSeenAt;
    PRINT 'Dropped dbo.AuthSessions.LastSeenAt';
END
ELSE PRINT 'dbo.AuthSessions.LastSeenAt already removed';

IF OBJECT_ID(N'dbo.USP_Auth_TouchSession', N'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.USP_Auth_TouchSession;
    PRINT 'Dropped dbo.USP_Auth_TouchSession';
END
ELSE PRINT 'dbo.USP_Auth_TouchSession already removed';

COMMIT TRAN;

-- Result: the columns that remain on AuthSessions
SELECT c.name AS ColumnName, t.name AS DataType, c.is_nullable AS IsNullable
FROM   sys.columns c
JOIN   sys.types   t ON t.user_type_id = c.user_type_id
WHERE  c.object_id = OBJECT_ID(N'dbo.AuthSessions')
ORDER  BY c.column_id;
