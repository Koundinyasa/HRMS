import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { DashboardSummaryDto } from './dto/dashboard.summary.dto';
import { ClassificationWiseCountDto } from './dto/Classification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permission } from '../../common/decorators/permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

const ADMIN_DASHBOARD_MENU_ID = 1 || 2;

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  /**
   * GET /admin/dashboard/summary
   *
   * Calls Usp_AdminDashboard @EmployeeID and returns:
   *   welcome             → user info + greeting message
   *   menus               → role-based menu permissions
   *   summary             → KPI cards (total, joined, pending, left, open positions)
   *   departmentWiseCount → employee count per department
   *   genderWiseCount     → gender split with percentage
   *   ageGroupWiseCount   → age bracket breakdown (male / female)
   */
  @Get('summary')
  @Permission(ADMIN_DASHBOARD_MENU_ID, 'CanView')
  async getSummary(
    @CurrentUser() user: { employeeId: string },
  ): Promise<DashboardSummaryDto> {
    return this.adminDashboardService.getDashboard(user.employeeId);
  }

  @Get('classification/:classificationId')
  @Permission(ADMIN_DASHBOARD_MENU_ID, 'CanView')
  async getClassificationWiseCount(
    @Param('classificationId', ParseIntPipe) classificationId: number,
  ): Promise<ClassificationWiseCountDto> {
    return (this.adminDashboardService as any).getClassificationWiseCount(
      classificationId,
    );
  }

  @Get('ping')
  ping() {
    return { ok: true };
  }
}
