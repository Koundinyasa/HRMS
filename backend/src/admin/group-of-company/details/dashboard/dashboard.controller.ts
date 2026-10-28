import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { EmployeeDashboardDto } from './employee-dashboard.dto';
import { GroupCompanyDashboardService } from './dashboard.service';

type AuthenticatedRequest = Request & {
  user: {
    companyId: number;
  };
};

@Controller('admin/group-of-company/details/dashboard')
export class GroupCompanyDashboardController {
  constructor(
    private readonly dashboardService: GroupCompanyDashboardService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('employee-dashboard')
  getEmployeeDashboard(
    @Req() request: AuthenticatedRequest,
    @Body() dto: EmployeeDashboardDto,
  ) {
    return this.dashboardService.getEmployeeDashboard(
      request.user.companyId,
      dto,
    );
  }
}
