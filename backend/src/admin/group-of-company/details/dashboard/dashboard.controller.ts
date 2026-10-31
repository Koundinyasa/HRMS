
import {
  Controller,
  Post,
  Body,
  Req,
} from '@nestjs/common';

import { DashboardService } from './dashboard.service';

import { AttendanceOverviewDto } from './dto/attendance-overview.dto';
import { EmployeeDashboardDto } from './dto/employee-dashboard.dto';

import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller(
  'admin/group-of-company/details/dashboard',
)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  // ==========================================
  // Employee Dashboard
  // ==========================================

  @Post('employee-dashboard')
  async getEmployeeDashboard(
    @Req() req: any,
    @Body() dto: EmployeeDashboardDto,
  ) {
    const companyId = req.user.companyId;

    return this.dashboardService.getEmployeeDashboard(
      companyId,
      dto,
    );
  }
}
