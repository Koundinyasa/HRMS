SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF COL_LENGTH('dbo.JoiningApprovals', 'EmployeeCode') IS NULL
BEGIN
    ALTER TABLE dbo.JoiningApprovals
        ADD EmployeeCode VARCHAR(6) NULL;
END;

IF COL_LENGTH('dbo.JoiningApprovals', 'EmployeeID') IS NULL
BEGIN
    ALTER TABLE dbo.JoiningApprovals
        ADD EmployeeID VARCHAR(50) NULL;
END;

COMMIT TRANSACTION;
