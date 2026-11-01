/*
  Employee List > Remove employee.

  USP_DeleteEmployee removes an employee WITHOUT erasing anything (soft delete):
    - Employee.Deleted = 1
    - Mst_Users.IsActive = 0  (the login stops working)
  Attendance, leave, payroll and document history stay in place, and the row can
  be brought back with:  UPDATE Employee SET Deleted = 0 ...;  UPDATE Mst_Users SET IsActive = 1 ...;

  The API (DELETE /api/admin/employee-details/:employeeId) calls it, then ends every
  open login of the employee (USP_Auth_RevokeAllForEmployee).

  Result row: StatusCode (200 ok, 404 not in this company, 409 refused) and Message.

  For the TL to confirm before running (the columns below are the ones other
  procedures already use: Employee.EmployeeID / CompanyID / RoleID / Deleted /
  EmploymentStatusID and Mst_Users.EmployeeId / IsActive):
    1. USP_GetEmployeesByCompanyId must leave out Deleted = 1 rows, or the removed
       employee will still show in the list.
    2. If Employee has an audit table (the pattern in USP_HierarchicalLeaveAction is
       HRMSDEV_Audit..<Table>_Audit), enable the audit line below. @DeletedBy is the
       Mst_Users.ID of the admin who removed the employee.
    3. Decide whether an employee who is somebody's reporting authority or approver
       may be removed. This version does not check it.
*/
CREATE OR ALTER PROCEDURE [dbo].[USP_DeleteEmployee]
    @EmployeeID VARCHAR(100),
    @CompanyID  INT,
    @DeletedBy  INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- Same answer for "does not exist" and "belongs to another company".
    IF NOT EXISTS (
        SELECT 1 FROM dbo.Employee
        WHERE EmployeeID = @EmployeeID AND CompanyID = @CompanyID
    )
    BEGIN
        SELECT 404 AS StatusCode, 'Employee not found.' AS Message;
        RETURN;
    END

    IF EXISTS (
        SELECT 1 FROM dbo.Employee
        WHERE EmployeeID = @EmployeeID AND CompanyID = @CompanyID AND Deleted = 1
    )
    BEGIN
        SELECT 409 AS StatusCode, 'This employee has already been removed.' AS Message;
        RETURN;
    END

    -- Never remove the last active Admin (RoleID 1) of a company.
    IF EXISTS (
        SELECT 1 FROM dbo.Employee
        WHERE EmployeeID = @EmployeeID AND CompanyID = @CompanyID AND RoleID = 1
    )
    AND (
        SELECT COUNT(*) FROM dbo.Employee
        WHERE CompanyID = @CompanyID AND RoleID = 1
          AND Deleted = 0 AND EmploymentStatusID = 1
    ) <= 1
    BEGIN
        SELECT 409 AS StatusCode, 'The last Admin of the company cannot be removed.' AS Message;
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- INSERT INTO HRMSDEV_Audit..Employee_Audit
        -- SELECT @DeletedBy, GETDATE(), * FROM dbo.Employee WHERE EmployeeID = @EmployeeID;

        UPDATE dbo.Employee
        SET    Deleted = 1
        WHERE  EmployeeID = @EmployeeID AND CompanyID = @CompanyID;

        UPDATE dbo.Mst_Users
        SET    IsActive = 0
        WHERE  EmployeeId = @EmployeeID;

        COMMIT TRAN;

        SELECT 200 AS StatusCode, 'Employee removed.' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        THROW;
    END CATCH
END
GO
