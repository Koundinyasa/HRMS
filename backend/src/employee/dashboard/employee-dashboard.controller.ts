import { Controller, Get,Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './employee-dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('employee/dashboard')
@UseGuards(JwtAuthGuard)
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

   @UseGuards(JwtAuthGuard)
    @Get('list')
    async getHolidayList(@Req() req) {
      return this.dashboardService.getHolidayList(
          req.user.employeeId,
      );
  
    }

  @Get('test')
    test() {
    return 'Dashboard works';
}

@Get('approval-summary')
@UseGuards(JwtAuthGuard)
async getApprovalSummary(@Req() req: any) {
  return this.dashboardService.getApprovalSummary(
    req.user.employeeId,
  );
}
}