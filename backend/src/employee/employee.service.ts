import {Injectable,UnauthorizedException,NotFoundException,BadRequestException,ForbiddenException} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';


@Injectable()
export class EmployeeService {
  constructor(
    private readonly dbService: DatabaseService,
  ) {}
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

  return {
    success: true,
    data: {
      ...profile,
      menus: this.buildMenuTree(menus),
    },
  };
}

  private buildMenuTree(menus: any[], parentId: number | null = null): any[] {
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

  async getWelcomeMessage(employeeId: string) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_Welcomemessage');

    return {
      success: true,
      data: result.recordset[0],
    };
  }
}