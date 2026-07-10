import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  DashboardSummaryDto,
  WelcomeDto,
  MenuDto,
  KpiSummaryDto,
  DepartmentCountDto,
  GenderCountDto,
  AgeGroupCountDto,
} from './dto/dashboard.summary.dto';

@Injectable()
export class AdminDashboardService {
  private readonly logger = new Logger(AdminDashboardService.name);

  constructor(private readonly db: DatabaseService) {}

  async getDashboard(employeeId: string): Promise<DashboardSummaryDto> {
    try {
      this.logger.log(`[1] getDashboard called with employeeId: ${employeeId}`);

      const pool = await this.db.connect();
      this.logger.log(`[2] DB pool connected`);

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .execute('Usp_AdminDashboard');

      this.logger.log(`[3] SP executed. recordsets count: ${result.recordsets.length}`);
      this.logger.log(`[4] recordsets lengths: ${result.recordsets.map((r: any[]) => r.length).join(', ')}`);

      const [
        welcomeRows,
        menuRows,
        summaryRows,
        departmentRows,
        genderRows,
        ageGroupRows,
      ] = result.recordsets;

      this.logger.log(`[5] welcomeRows[0]: ${JSON.stringify(welcomeRows?.[0])}`);
      this.logger.log(`[6] summaryRows[0]: ${JSON.stringify(summaryRows?.[0])}`);

      // ── Result Set 0 : Welcome ──────────────────────────────
      const w = welcomeRows[0];
      const welcome: WelcomeDto = {
        fullName:           w.FullName,
        shortName:          w.ShortName,
        code:               w.Code,
        profilePhoto:       w.ProfilePhoto       ?? null,
        companyId:          Number(w.CompanyID),
        companyCode:        w.CompanyCode,
        companyName:        w.CompanyName,
        branchName:         w.BranchName,
        branchCode:         w.BranchCode,
        routingUrl:         w.RoutingUrl,
        deptId:             Number(w.DeptID),
        department:         w.Department,
        roleId:             Number(w.RoleID),
        defaultRole:        w.DefaultRole,
        designationId:      Number(w.DesignationID),
        designation:        w.Designation,
        welcomeMessage:     w.WelcomeMessage,
        lastLoginDateTime:  w.LastLoginDateTime  ?? null,
        lastLogoutDateTime: w.LastLogoutDateTime ?? null,
        loginFailedCount:   Number(w.LoginFailedCount),
        isAccountLocked:    Boolean(w.Isaccountlocked),
        accountLockedTime:  w.Accountlockedtime  ?? null,
        employeeId:         w.EmployeeID,
        email:              w.Email,
        mobileNo:           w.Mobileno           ?? null,
      };
      this.logger.log(`[7] welcome mapped`);

      // ── Result Set 1 : Menus ────────────────────────────────
      const menus: MenuDto[] = menuRows.map((m: any) => ({
        menuId:       Number(m.MenuId),
        parentId:     m.ParentId != null ? Number(m.ParentId) : null,
        menuName:     m.MenuName,
        routeUrl:     m.RouteUrl,
        displayOrder: Number(m.DisplayOrder),
      }));
      this.logger.log(`[8] menus mapped: ${menus.length} items`);

      // ── Result Set 2 : KPI Summary ──────────────────────────
      const s = summaryRows[0];
      const summary: KpiSummaryDto = {
        totalEmployees:      Number(s.totalEmployees),
        joinedEmployee:      Number(s.joinedEmployee),
        confirmationPending: Number(s.confirmationPending),
        leftEmployee:        Number(s.leftEmployee),
        openPositions:       Number(s.openPositions),
      };
      this.logger.log(`[9] summary mapped`);

      // ── Result Set 3 : Department Wise Count ────────────────
      const departmentWiseCount: DepartmentCountDto[] = departmentRows.map(
        (d: any) => ({
          department: d.Department,
          count:      Number(d.Count),
        }),
      );
      this.logger.log(`[10] departmentWiseCount mapped: ${departmentWiseCount.length} items`);

      // ── Result Set 4 : Gender Wise Count ────────────────────
      const genderWiseCount: GenderCountDto[] = genderRows.map((g: any) => ({
        gender:     g.Gender,
        count:      Number(g.Count),
        percentage: Number(g.Percentage),
      }));
      this.logger.log(`[11] genderWiseCount mapped: ${genderWiseCount.length} items`);

      // ── Result Set 5 : Age Group Wise Count ─────────────────
      const ageGroupWiseCount: AgeGroupCountDto[] = ageGroupRows.map(
        (a: any) => ({
          ageBetween: a.AgeBetween,
          female:     Number(a.Female),
          male:       Number(a.Male),
        }),
      );
      this.logger.log(`[12] ageGroupWiseCount mapped: ${ageGroupWiseCount.length} items`);

      return {
        welcome,
        menus,
        summary,
        departmentWiseCount,
        genderWiseCount,
        ageGroupWiseCount,
      };

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Admin dashboard failed: ${message}`, stack);
      throw new InternalServerErrorException('Could not load admin dashboard');
    }
  }
}