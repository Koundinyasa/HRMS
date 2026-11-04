import { Injectable, Logger } from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../../database/database.service';
import { REPORTING_MANAGER_ROLE_ID } from '../constants/menu-codes';
import { ADMIN_PORTAL_ROLES } from '../constants/roles';

type MenuUser = { employeeId?: unknown; roleId?: unknown } | null | undefined;

const CACHE_TTL_MS = 30_000;
const CACHE_MAX_ENTRIES = 5_000;

/**
 * Answers "which menus are enabled for this signed-in user?" from the same
 * tables the sidebar uses (Mst_Menu + RoleMenuPermission), so the menus a user
 * sees and the routes the backend allows can never drift apart.
 *
 * Rules (match USP_GetUserInfo and Usp_AdminDashboard):
 *  - a menu counts when Mst_Menu.IsActive = 1 and the permission row is active;
 *  - admin-portal roles (HR Admin, Super Admin) also need CanView = 1;
 *  - an employee who has an active reportee also holds the Reporting Manager
 *    role (RoleID 4), which is what grants the Review menu.
 *
 * Answers are cached for 30 seconds per user, so a menu change in the database
 * is live within half a minute without a deploy.
 */
@Injectable()
export class MenuAccessService {
  private readonly logger = new Logger(MenuAccessService.name);
  private readonly cache = new Map<string, { codes: Set<string>; expires: number }>();

  constructor(private readonly db: DatabaseService) {}

  async menuCodesFor(user: MenuUser): Promise<Set<string>> {
    const employeeId = String(user?.employeeId ?? '').trim();
    const roleId = Number(user?.roleId);
    if (!employeeId || !Number.isInteger(roleId)) return new Set();

    const key = `${employeeId.toLowerCase()}|${roleId}`;
    const hit = this.cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.codes;

    const codes = await this.load(employeeId, roleId);

    if (this.cache.size >= CACHE_MAX_ENTRIES) this.cache.clear();
    this.cache.set(key, { codes, expires: Date.now() + CACHE_TTL_MS });
    return codes;
  }

  private async load(employeeId: string, roleId: number): Promise<Set<string>> {
    const pool = await this.db.connect();

    const roles = new Set<number>([roleId]);
    const reportee = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId)
      .query(
        `SELECT TOP 1 1 AS HasReportee
           FROM Employee
          WHERE ReportingManagerID = @EmployeeID
            AND Deleted = 0
            AND EmploymentStatusID = 1`,
      );
    if (reportee.recordset?.length) roles.add(REPORTING_MANAGER_ROLE_ID);

    const needsCanView = (ADMIN_PORTAL_ROLES as readonly number[]).includes(roleId);
    const roleIds = [...roles];
    const request = pool.request();
    roleIds.forEach((id, i) => request.input(`r${i}`, sql.Int, id));
    const inList = roleIds.map((_, i) => `@r${i}`).join(', ');

    const result = await request.query(
      `SELECT DISTINCT m.MenuCode
         FROM RoleMenuPermission p
         JOIN Mst_Menu m ON m.MenuId = p.MenuID
        WHERE p.RoleID IN (${inList})
          AND p.Isactive = 1
          AND m.IsActive = 1
          ${needsCanView ? 'AND p.CanView = 1' : ''}`,
    );

    const codes = new Set<string>(
      (result.recordset ?? []).map((r: any) => String(r.MenuCode)),
    );
    this.logger.debug(`Menus for ${employeeId} (roles ${roleIds.join(',')}): ${codes.size}`);
    return codes;
  }
}
