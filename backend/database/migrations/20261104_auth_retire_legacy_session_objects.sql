/* ============================================================================
   20261104_auth_retire_legacy_session_objects.sql   (Part B of the cleanup)

   Retires the OLD session system (the one used before AuthSessions). Nothing
   is deleted here: every object is only RENAMED with the prefix zzRetired_, so
   if anything turns out to still depend on one, the rename can be undone (see
   the rollback block at the bottom). A later step (Part C) drops them for good
   once a week has passed with no problems.

   Why it is safe:
     - No code in the repo (backend, frontend, attendance-service) calls any of
       these procedures; they were checked by name.
     - No view or procedure other than the ones below reads the old table or
       the two old columns.
     - dbo.UserSessions holds 7 rows, the newest from 6 Oct 2026.

   Left in place on purpose (harmless, nothing reads them; dropped in Part C):
     - dbo.Mst_Users.ActiveSessionId
     - dbo.MainRoleMaster.RestrictConcurrentLogin
     - HRMSDEV_Audit.dbo.UserSessions_Audit (history of the old table)

   Safe to run more than once. Run AFTER 20261103_auth_cleanup_unused.sql.
   ============================================================================ */
SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @procs TABLE (OldName SYSNAME PRIMARY KEY);
INSERT INTO @procs (OldName) VALUES
 (N'USP_CreateUserSession'),
 (N'USP_CheckUserSession'),
 (N'USP_ExpireStaleSessions'),
 (N'USP_GetActiveSessions'),
 (N'USP_LogoutUserSession'),
 (N'USP_TerminateSession'),
 (N'USP_Validateuser_D'),
 (N'usp_SetUserActiveSession'),
 (N'usp_ValidateUserSession'),
 (N'usp_ClearUserActiveSession');

BEGIN TRAN;

DECLARE @old SYSNAME, @full NVARCHAR(300), @new SYSNAME;

DECLARE c CURSOR LOCAL FAST_FORWARD FOR SELECT OldName FROM @procs;
OPEN c;
FETCH NEXT FROM c INTO @old;
WHILE @@FETCH_STATUS = 0
BEGIN
    SET @full = N'dbo.' + @old;
    SET @new  = N'zzRetired_' + @old;
    IF OBJECT_ID(@full, N'P') IS NOT NULL
       AND OBJECT_ID(N'dbo.' + @new, N'P') IS NULL
    BEGIN
        EXEC sp_rename @objname = @full, @newname = @new, @objtype = N'OBJECT';
        PRINT 'Renamed ' + @full + ' -> ' + @new;
    END
    ELSE PRINT 'Skipped ' + @full + ' (not found or already renamed)';
    FETCH NEXT FROM c INTO @old;
END
CLOSE c; DEALLOCATE c;

IF OBJECT_ID(N'dbo.UserSessions', N'U') IS NOT NULL
   AND OBJECT_ID(N'dbo.zzRetired_UserSessions', N'U') IS NULL
BEGIN
    EXEC sp_rename @objname = N'dbo.UserSessions', @newname = N'zzRetired_UserSessions', @objtype = N'OBJECT';
    PRINT 'Renamed dbo.UserSessions -> zzRetired_UserSessions';
END
ELSE PRINT 'Skipped dbo.UserSessions (not found or already renamed)';

COMMIT TRAN;

-- Result: what is now retired, and whatever still carries an old name
SELECT type_desc, name, modify_date
FROM   sys.objects
WHERE  name LIKE N'zzRetired[_]%'
   OR  name IN (SELECT OldName FROM @procs)
   OR  name = N'UserSessions'
ORDER  BY name;

/* ----------------------------------------------------------------------------
   ROLLBACK (only if something still needs an old object). Run the lines for the
   object that is needed, for example:

     EXEC sp_rename N'dbo.zzRetired_USP_Validateuser_D', N'USP_Validateuser_D', N'OBJECT';
     EXEC sp_rename N'dbo.zzRetired_UserSessions',       N'UserSessions',       N'OBJECT';
   ---------------------------------------------------------------------------- */
