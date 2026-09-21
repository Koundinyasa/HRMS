import { Injectable, InternalServerErrorException, NotFoundException , BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';

@Injectable()
export class DashboardService {
  constructor(
    private readonly dbService: DatabaseService,
  ) { }

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
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_GetUserInfo');

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
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_GetUserInfo');

    const menus = Array.isArray(result.recordsets?.[1])
      ? result.recordsets[1]
      : [];

    return {
      success: true,
      data: this.buildMenuTree(menus),
    };
  }

  async getHolidayList(employeeId: string) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_GetUserInfo');

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

  private buildMenuTree(
    menus: any[],
    parentId: number | null = null,
  ): any[] {
    return menus
      .filter(menu => (menu.ParentId ?? null) === parentId)
      .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
      .map(menu => ({
        menuId: menu.MenuId,
        menuName: menu.MenuName,
        routeUrl: menu.RouteUrl,
        iconClass: menu.IconClass ?? null,
        children: this.buildMenuTree(menus, menu.MenuId),
      }));


  }

   async getApprovalSummary(employeeId: string) {
  try {
    const pool = await this.dbService.connect();
 
    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_GetUserInfo');
 
    const allRows = result.recordsets.flat();
 
    const pendingApprovals =
      allRows.find(
        (row) =>
          row.PendingApprovals !== undefined &&
          typeof row.PendingApprovals === 'number',
      )?.PendingApprovals ?? 0;
 
    const myRequestsDetails =
      result.recordsets
        .find((recordset) =>
          recordset.some(
            (row) => typeof row.MyRequests === 'string',
          ),
        )
        ?.map((row) => ({
          RequestType: row.MyRequests,
          RequestCount: Number(row.RequestCount ?? 0),
        })) ?? [];
 
    const myApprovalsDetails =
      result.recordsets
        .find((recordset) =>
          recordset.some(
            (row) => typeof row.MyApprovals === 'string',
          ),
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
        .input(
          'Date',
          sql.Date,
          date ? new Date(date) : null,
        )
        .execute('USP_GetTeamAttendance');
 
      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching team attendance:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to fetch team attendance.',
      );
    }
  }
 

}
