
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { DashboardService } from './dashboard.service';

import { AttendanceOverviewDto } from './dto/attendance-overview.dto';
import { EmployeeDashboardDto } from './dto/employee-dashboard.dto';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
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
