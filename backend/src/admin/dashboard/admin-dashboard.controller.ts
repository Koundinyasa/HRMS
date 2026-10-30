import {
  Controller,
  Get,
  UseGuards,
  Param,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { DashboardSummaryDto } from './dto/dashboard.summary.dto';
import { ClassificationWiseCountDto } from './dto/Classification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permission } from '../../common/decorators/permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../common/constants/roles';

const ADMIN_DASHBOARD_MENU_ID = 1 || 2;

@Roles(...ADMIN_PORTAL_ROLES)
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
    @CurrentUser() user: { companyId: number },
    @Param('classificationId', ParseIntPipe) classificationId: number,
  ): Promise<ClassificationWiseCountDto> {
    return this.adminDashboardService.getClassificationWiseCount(
      classificationId,
      Number(user.companyId),
    );
  }
 
  @Get('ping')
  ping() {
    return { ok: true };
  }
 
 
 
 
  @Get('team-employees')
  @Permission(ADMIN_DASHBOARD_MENU_ID, 'CanView')
  async getTeamEmployeeDetails(
    @CurrentUser() user: { companyId: number },
    @Query('flag', ParseIntPipe) flag: number,
    @Query('leadEmployeeId') leadEmployeeId?: string,
  ) {
    if (![1, 2].includes(flag)) {
      throw new BadRequestException(
        'Invalid flag. Use 1 for Team Leads or 2 for Employees.',
      );
    }
 
    if (flag === 2 && !leadEmployeeId) {
      throw new BadRequestException(
        'leadEmployeeId is required when flag is 2.',
      );
    }
 
    return this.adminDashboardService.getTeamEmployeeDetails(
      Number(user.companyId),
      flag,
      leadEmployeeId,
    );
  }
 
 
 
   @Get('classifications')
  async getClassificationDropdown() {
    return this.adminDashboardService.getClassificationDropdown();
  }
 
 
 
 
 
 
 
 
 
}
 
 