import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { Permission } from '../common/decorators/permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('employee')
@UseGuards(JwtAuthGuard)  // all routes in this controller require auth
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.employeeService.getProfile(user.employeeId);
  }

  @Get('menus')
  getMenus(@CurrentUser() user: any) {
    return this.employeeService.getRoleMenus(user.employeeId);
  }

  @Post('test-rbac')
  @UseGuards(PermissionGuard)
  @Permission(16, 'CanAdd')
  testRBAC() {
    return { success: true, message: 'RBAC test passed' };
  }
}