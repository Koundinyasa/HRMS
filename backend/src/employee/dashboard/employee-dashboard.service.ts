import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
 
@Injectable()
export class DashboardService {
  constructor(private readonly dbService: DatabaseService) {}

  // USP_GetUserInfo returns five result sets (profile, menus, holidays,
  // attendance summary, events) and the dashboard asks for several of them in
  // the same moment (profile, menus, holidays, approvals). Running it once per
  // request meant 3 to 4 identical executions for every dashboard load. The
  // calls for the same employee that arrive within a few seconds now share one
  // execution. The result is only read, never changed, by the callers. A failed
  // call is not kept, so the next request tries again.
  private static readonly USER_INFO_SHARE_MS = 5000;
  private readonly userInfoRuns = new Map<
    string,
    { startedAt: number; run: Promise<sql.IProcedureResult<any>> }
  >();

  private getUserInfoResult(
    employeeId: string,
  ): Promise<sql.IProcedureResult<any>> {
    const now = Date.now();
    const existing = this.userInfoRuns.get(employeeId);
    if (
      existing &&
      now - existing.startedAt < DashboardService.USER_INFO_SHARE_MS
    ) {
      return existing.run;
    }

    // drop finished entries so the map cannot grow without limit
    for (const [key, entry] of this.userInfoRuns) {
      if (now - entry.startedAt >= DashboardService.USER_INFO_SHARE_MS) {
        this.userInfoRuns.delete(key);
      }
    }

    const run = this.dbService
      .connect()
      .then((pool) =>
        pool
          .request()
          .input('EmployeeID', employeeId)
          .execute('USP_GetUserInfo'),
      );
    this.userInfoRuns.set(employeeId, { startedAt: now, run });
    run.catch(() => {
      if (this.userInfoRuns.get(employeeId)?.run === run) {
        this.userInfoRuns.delete(employeeId);
      }
    });
    return run;
  }
 
  async getWelcomeMessage(employeeId: string) {
    const pool = await this.dbService.connect();
 
    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_Welcomemessage');
 
    return {
      success: true,
      data: result.recordset?.[0],
    };
  }
 
  // async getProfile(employeeId: string) {
  //   const pool = await this.dbService.connect();
 
  //   const result = await pool
  //     .request()
  //     .input('EmployeeID', employeeId)
  //     .execute('USP_GetUserInfo');
 
  //   const profile = result.recordsets?.[0]?.[0];
 
  //   if (!profile) {
  //     throw new NotFoundException('Employee not found');
  //   }
 
  //   const menus = result.recordsets?.[1] || [];
 
  //   return {
  //     success: true,
  //     data: {
  //       ...profile,
  //       menus: this.buildMenuTree(menus),
  //     },
  //   };
  // }
 
  async getProfile(employeeId: string) {
    const result = await this.getUserInfoResult(employeeId);
 
    const profile = result.recordsets?.[0]?.[0];
 
    if (!profile) {
      throw new NotFoundException('Employee not found');
    }
 
    const menus = result.recordsets?.[1] || [];
    //const holidays = result.recordsets?.[2] || [];
    const attendanceSummary = result.recordsets?.[3]?.[0] || null;
    const upcomingEvents = result.recordsets?.[4] || [];
 
    return {
      success: true,
      data: {
        profile,
        menus: this.buildMenuTree(menus),
        attendanceSummary,
        upcomingEvents,
      },
    };
  }
 
  async getRoleMenus(employeeId: string) {
    const result = await this.getUserInfoResult(employeeId);
 
    const menus = Array.isArray(result.recordsets?.[1])
      ? result.recordsets[1]
      : [];
 
    return {
      success: true,
      data: this.buildMenuTree(menus),
    };
  }
 
  async getHolidayList(employeeId: string) {
    const result = await this.getUserInfoResult(employeeId);
 
    const holidays = Array.isArray(result.recordsets?.[2])
      ? result.recordsets[2]
      : [];
 
    const formattedHolidays = holidays.map((holiday) => {
      const date = holiday.HolidayDate;
 
      let formattedDate: string | null = null;
 
      if (date) {
        const d = new Date(date);
 
        formattedDate = d.toLocaleDateString('en-CA', {
          timeZone: 'Asia/Kolkata',
        });
      }
 
      return {
        ...holiday,
        HolidayDate: formattedDate,
      };
    });
 
    return {
      success: true,
      data: formattedHolidays,
    };
  }
 
  private buildMenuTree(menus: any[], parentId: number | null = null): any[] {
    return menus
      .filter((menu) => (menu.ParentId ?? null) === parentId)
      .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
      .map((menu) => ({
        menuId: menu.MenuId,
        menuName: menu.MenuName,
        routeUrl: menu.RouteUrl,
        iconClass: menu.IconClass ?? null,
        children: this.buildMenuTree(menus, menu.MenuId),
      }));
  }
 
  async getApprovalSummary(employeeId: string) {
    try {
      const result = await this.getUserInfoResult(employeeId);
      const recordsets = result.recordsets as unknown as Array<
        Array<Record<string, any>>
      >;
 
      const allRows = recordsets.flat();
 
      const pendingApprovals =
        allRows.find(
          (row) =>
            row.PendingApprovals !== undefined &&
            typeof row.PendingApprovals === 'number',
        )?.PendingApprovals ?? 0;
 
      const myRequestsDetails =
        recordsets
          .find((recordset) =>
            recordset.some((row) => typeof row.MyRequests === 'string'),
          )
          ?.map((row) => ({
            RequestType: row.MyRequests,
            RequestCount: Number(row.RequestCount ?? 0),
          })) ?? [];
 
      const myApprovalsDetails =
        recordsets
          .find((recordset) =>
            recordset.some((row) => typeof row.MyApprovals === 'string'),
          )
          ?.map((row) => ({
            RequestType: row.MyApprovals,
            RequestCount: Number(row.RequestCount ?? 0),
          })) ?? [];
 
      const myRequests = myRequestsDetails.reduce(
        (total, item) => total + item.RequestCount,
        0,
      );
 
      const pendingApprovalTotal = myApprovalsDetails.reduce(
        (total, item) => total + item.RequestCount,
        0,
      );
 
      return {
        PendingApprovals: pendingApprovalTotal,
        MyRequests: myRequests,
        MyRequestsDetails: myRequestsDetails,
        MyApprovalsDetails: myApprovalsDetails,
      };
    } catch (error) {
      console.error('Error fetching approval summary:', error);
      throw error;
    }
  }
  async getTeamAttendance(
    companyId: number,
    employeeId: string,
    date?: string,
  ) {
    try {
      const pool = await this.dbService.connect();
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('Date', sql.Date, date ? new Date(date) : null)
        .execute('USP_GetTeamAttendance');
 
      return result.recordset;
    } catch (error) {
      console.error('Error while fetching team attendance:', error);
 
      throw new InternalServerErrorException(
        'Unable to fetch team attendance.',
      );
    }
  }
 
 
   async getMonthlyLeaveCalendar(
    employeeId: string,
    companyId: number,
    year?: number,
    month?: number,
  ) {
    if (!employeeId) {
      throw new BadRequestException('EmployeeID is required.');
    }
 
    if (!Number.isInteger(companyId) || companyId <= 0) {
      throw new BadRequestException('Invalid CompanyID.');
    }
 
    if (
      year !== undefined &&
      (!Number.isInteger(year) || year < 1900 || year > 2099)
    ) {
      throw new BadRequestException('Invalid Year.');
    }
 
    if (
      month !== undefined &&
      (!Number.isInteger(month) || month < 1 || month > 12)
    ) {
      throw new BadRequestException('Invalid Month.');
    }
 
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('Year', sql.Int, year ?? null)
        .input('Month', sql.Int, month ?? null)
        .input('CompanyId', sql.Int, companyId)
        .input('BranchId', sql.Int, null)
        .execute('usp_GetMonthlyLeaveCalendar');

      // The procedure takes only Year, Month, CompanyId and BranchId (same
      // call as the Review screen) and returns the whole company, so keep
      // this employee's rows here.
      const allRows: any[] = result.recordset ?? [];
      const statusRow = allRows[0];
 
      if (statusRow?.StatusCode !== undefined) {
        const statusCode = Number(statusRow.StatusCode);
        const message = String(statusRow.Message ?? 'Unknown response.');
 
        if (statusCode === 400) {
          throw new BadRequestException(message);
        }
 
        if (statusCode === 404) {
          throw new NotFoundException(message);
        }
 
        throw new InternalServerErrorException(message);
      }
 
      const wanted = employeeId.trim().toLowerCase();
      const rows = allRows.filter(
        (r) => String(r?.EmployeeID ?? '').trim().toLowerCase() === wanted,
      );

      return {
        success: true,
        statusCode: 200,
        message: 'Monthly leave calendar retrieved successfully.',
        data: rows,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
 
      console.error('Error fetching monthly leave calendar:', error);
 
      throw new InternalServerErrorException(
        'Failed to retrieve monthly leave calendar.',
      );
    }
  }
}
   
 