/*
  02-export-hotpath-definitions.sql
  READ-ONLY. Dumps the source of the Phase 1 hot-path stored procedures, every
  user-defined function, and the attendance classification lookup, so they can
  be reviewed offline. Nothing is changed.

  Run from PowerShell (the -y 0 switch keeps long text on one value):

    sqlcmd -S localhost -C -U preetham -d HRMSDEV -h -1 -y 0 `
      -i "backend\database\diagnostics\02-export-hotpath-definitions.sql" `
      -o "backend\database\diagnostics\output\definitions.txt"

  sqlcmd asks for the password; type it there. Do not put it on the command line.
*/
SET NOCOUNT ON;

PRINT '##### CLASSIFICATIONS: Mst_AttendanceClassification';
SELECT * FROM Mst_AttendanceClassification;

PRINT '##### FUNCTIONS (name, type)';
SELECT name, type_desc FROM sys.objects WHERE type IN ('FN','IF','TF') AND is_ms_shipped = 0 ORDER BY name;

DECLARE @names TABLE (n sysname);
INSERT INTO @names VALUES
 ('USP_EmployeeMonthlyAttendanceDetails'),
 ('usp_GetMonthlyLeaveCalendar'),
 ('USP_GetEmployeeDashboardCounts'),
 ('usp_GetEmployeeAttendanceOverview'),
 ('USP_GetUserInfo'),
 ('Usp_AdminDashboard'),
 ('USP_GetTeamAttendance'),
 ('USP_GetEmployeePunchDashboard'),
 ('USP_GetEmployeeRawPunches'),
 ('USP_Welcomemessage');

DECLARE @n sysname, @def nvarchar(max);
DECLARE c CURSOR LOCAL FAST_FORWARD FOR
  SELECT o.name, OBJECT_DEFINITION(o.object_id)
  FROM sys.objects o
  WHERE o.type IN ('P','FN','IF','TF')
    AND (o.name IN (SELECT n FROM @names) OR o.type IN ('FN','IF','TF'))
    AND o.is_ms_shipped = 0
  ORDER BY o.type, o.name;
OPEN c;
FETCH NEXT FROM c INTO @n, @def;
WHILE @@FETCH_STATUS = 0
BEGIN
  PRINT '##### DEFINITION: ' + @n;
  SELECT @def;
  PRINT '##### END: ' + @n;
  FETCH NEXT FROM c INTO @n, @def;
END
CLOSE c; DEALLOCATE c;
