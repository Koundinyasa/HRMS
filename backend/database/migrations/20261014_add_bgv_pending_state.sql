SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF COL_LENGTH('dbo.BackgroundVerifications', 'StartedBy') IS NULL
BEGIN
    ALTER TABLE dbo.BackgroundVerifications
        ADD StartedBy VARCHAR(25) NULL;
END;

ALTER TABLE dbo.BackgroundVerifications
    ALTER COLUMN VerifiedBy VARCHAR(25) NULL;

ALTER TABLE dbo.BackgroundVerifications
    ALTER COLUMN VerificationDate DATETIME2 NULL;

ALTER TABLE dbo.BackgroundVerifications
    ALTER COLUMN IsClear BIT NULL;

EXEC sys.sp_executesql N'
    UPDATE dbo.BackgroundVerifications
    SET StartedBy = VerifiedBy
    WHERE StartedBy IS NULL
      AND VerifiedBy IS NOT NULL;
';

COMMIT TRANSACTION;
