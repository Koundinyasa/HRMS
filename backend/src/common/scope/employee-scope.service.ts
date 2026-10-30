import { ForbiddenException, Injectable, BadRequestException } from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../../database/database.service';
import { ADMIN_PORTAL_ROLES } from '../constants/roles';

export const EMPLOYEE_ACCESS_DENIED = 'EMPLOYEE_ACCESS_DENIED';

type ScopeUser = {
  employeeId?: unknown;
  roleId?: unknown;
  companyId?: unknown;
} | null | undefined;

const same = (a: unknown, b: unknown): boolean =>
  String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase() &&
  String(a ?? '').trim() !== '';

/**
 * Decides whether the signed-in user may read or act on ONE other
 * employee's data. Routes that take an employee id from the request must call
 * this before touching that employee.
 *
 * Allowed when the target is:
 *  - the caller themselves, or
 *  - a direct report of the caller (Employee.ReportingManagerID), or
 *  - anyone in the caller's company, when the caller is HR Admin or Super
 *    Admin (an admin-portal role).
 *
 * Everything else, including an unknown or deleted employee, gets the same
 * 403, so the answer does not reveal which ids exist.
 */
@Injectable()
export class EmployeeScopeService {
  constructor(private readonly db: DatabaseService) {}

  /** True for HR Admin and Super Admin. */
  isAdminPortalUser(user: ScopeUser): boolean {
    const roleId = Number(user?.roleId);
    return (ADMIN_PORTAL_ROLES as readonly number[]).includes(roleId);
  }

  async canAccess(user: ScopeUser, targetEmployeeId: unknown): Promise<boolean> {
    const target = String(targetEmployeeId ?? '').trim();
    const caller = String(user?.employeeId ?? '').trim();
    if (!target || target.length > 50 || !caller) return false;
    if (same(target, caller)) return true;

    const pool = await this.db.connect();
    const result = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), target)
      .query(
        'SELECT CompanyID, ReportingManagerID FROM Employee WHERE EmployeeID = @EmployeeID AND Deleted = 0',
      );
    const row = result.recordset?.[0];
    if (!row) return false;

    if (same(row.ReportingManagerID, caller)) return true;

    return (
      this.isAdminPortalUser(user) &&
      Number.isFinite(Number(user?.companyId)) &&
      Number(row.CompanyID) === Number(user?.companyId)
    );
  }

  async assertCanAccess(user: ScopeUser, targetEmployeeId: unknown): Promise<void> {
    const target = String(targetEmployeeId ?? '').trim();
    if (!target || target.length > 50) {
      throw new BadRequestException('Invalid employeeId');
    }
    if (!(await this.canAccess(user, target))) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'You do not have access to this employee.',
        code: EMPLOYEE_ACCESS_DENIED,
      });
    }
  }
}

