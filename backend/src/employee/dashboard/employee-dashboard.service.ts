import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

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

}
