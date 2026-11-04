import { Controller, Get, Req, Query } from '@nestjs/common';
import { DashboardService } from './employee-dashboard.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
 
@Controller('employee/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
 
  @Get('welcome')
  getWelcomeMessage(@CurrentUser() user: any) {
    return this.dashboardService.getWelcomeMessage(user.employeeId);
  }
 
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.dashboardService.getProfile(user.employeeId);
  }
 
  @Get('menus')
  getMenus(@CurrentUser() user: any) {
    return this.dashboardService.getRoleMenus(user.employeeId);
  }
 
  @Get('list')
  async getHolidayList(@Req() req) {
    return this.dashboardService.getHolidayList(req.user.employeeId);
  }
  @Get('approval-summary')
  async getApprovalSummary(@Req() req: any) {
    return this.dashboardService.getApprovalSummary(req.user.employeeId);
  }
  @Get('team-attendance')
  async getTeamAttendance(@Req() req: any, @Query('date') date?: string) {
    const companyId = req.user.companyId;
    const employeeId = req.user.employeeId;
 
    return this.dashboardService.getTeamAttendance(companyId, employeeId, date);
  }
 
 
  @Get('monthly-leave-calendar')
  async getMonthlyLeaveCalendar(
    @CurrentUser()
    user: { employeeId: string; companyId: number },
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.dashboardService.getMonthlyLeaveCalendar(
      user.employeeId,
      Number(user.companyId),
      year === undefined ? undefined : Number(year),
      month === undefined ? undefined : Number(month),
    );
  }
}
 
 