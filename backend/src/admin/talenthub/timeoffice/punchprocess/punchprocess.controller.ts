import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Req,
} from '@nestjs/common';


import { PunchProcessService } from './punchprocess.service';

import { GetAttendanceDashboardDto } from './dto/get-attendance-dashboard.dto';
import { GetYesterdayPresentCountDto } from './dto/get-yesterday-present-count.dto';
import { GetYesterdayAbsentEmployeesDto } from './dto/get-yesterday-absent-employees.dto';
import { GetOnLeaveEmployeesDto } from './dto/get-on-leave-employees.dto';
import { GetLateInEmployeesDto } from './dto/get-late-in-employees.dto';
import { GetEarlyInEmployeesDto } from './dto/get-early-in-employees.dto';
import { GetEarlyOutEmployeesDto } from './dto/get-early-out-employees.dto';
import { GetYetToLoginEmployeesDto } from './dto/get-yet-to-login-employees.dto';
import { GetLoggedInEmployeesDto } from './dto/get-logged-in-employees.dto';
import { GetAverageOtWorkHoursDto } from './dto/get-average-ot-work-hours.dto';
import { GetAttendanceDashboardOverviewDto } from './dto/get-attendance-dashboard-overview.dto';
import { GetLateInEarlyOutGraphDto } from './dto/get-late-in-early-out-graph.dto';
import { GetMissedPunchEmployeesDto } from './dto/get-missed-punch-employees.dto';
import { ProcessHistoryDto } from './dto/process-history.dto';
import { AttendanceProcessingDashboardDto } from './dto/attendance-processing-dashboard.dto';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';
import { RequiresMenu } from '../../../../common/decorators/module-gate.decorator';
import { MenuCode } from '../../../../common/constants/menu-codes';

@Roles(...ADMIN_PORTAL_ROLES)
@RequiresMenu(MenuCode.TimeOfficeDashboard)
@Controller('admin/timeattendance/timeoffice/punchprocess')
export class PunchProcessController {
  constructor(private readonly punchProcessService: PunchProcessService) {}

  // =====================================================
  // Starts actual Sps from here
  //======================================================
  @Get('dashboard/counts')
  async getAttendanceDashboardCounts(
    @Query() dto: GetAttendanceDashboardDto,
  ) {
    return this.punchProcessService.getAttendanceDashboardCounts(dto);
  }
 
 
  // =====================================================
  // YESTERDAY PRESENT COUNT
  // =====================================================
 
  @Get('dashboard/yesterday-present-count')
  async getYesterdayPresentCount(
    @Query() dto: GetYesterdayPresentCountDto,
  ) {
    return this.punchProcessService.getYesterdayPresentCount(dto);
  }
 
 
  // =====================================================
  // YESTERDAY ABSENT EMPLOYEES
  // =====================================================
  @Get('yesterday-absent-employees')
  async getYesterdayAbsentEmployees(
    @Query() dto: GetYesterdayAbsentEmployeesDto,
  ) {
    return this.punchProcessService.getYesterdayAbsentEmployees(dto);
  }
 
 
  // =====================================================
  // ON LEAVE EMPLOYEES
  // =====================================================
 
  @Get('dashboard/on-leave-employees')
  async getOnLeaveEmployees(
    @Query() dto: GetOnLeaveEmployeesDto,
  ) {
    return this.punchProcessService.getOnLeaveEmployees(dto);
  }
 
  // =====================================================
  // LATE IN EMPLOYEES
  // =====================================================
 
  @Get('dashboard/late-in-employees')
  async getLateInEmployees(
    @Query() dto: GetLateInEmployeesDto,
  ) {
    return this.punchProcessService.getLateInEmployees(dto);
  }
 
  // =====================================================
  // EARLY IN EMPLOYEES
  // =====================================================
 
  @Get('dashboard/early-in-employees')
  async getEarlyInEmployees(
    @Query() dto: GetEarlyInEmployeesDto,
  ) {
    return this.punchProcessService.getEarlyInEmployees(dto);
  }
 
  // =====================================================
  // EARLY OUT EMPLOYEES
  // =====================================================
 
  @Get('dashboard/early-out-employees')
  async getEarlyOutEmployees(
    @Query() dto: GetEarlyOutEmployeesDto,
  ) {
    return this.punchProcessService.getEarlyOutEmployees(dto);
  }
 
 
  // =====================================================
  // YET TO LOGIN EMPLOYEES
  // =====================================================
  @Get('dashboard/yet-to-login')
  async getYetToLoginEmployees(
    @Query() dto: GetYetToLoginEmployeesDto,
  ) {
    return this.punchProcessService.getYetToLoginEmployees(dto);
  }
 
 
  // =====================================================
  // LOGGED IN EMPLOYEES
  // =====================================================
 
  @Get('dashboard/logged-in-employees')
  async getLoggedInEmployees(
    @Query() dto: GetLoggedInEmployeesDto,
  ) {
    return this.punchProcessService.getLoggedInEmployees(dto);
  }
 
 
  // =====================================================
  // AVERAGE OT WORK HOURS
  // =====================================================
 
  @Get('dashboard/average-ot-work-hours')
  async getAverageOtWorkHours(
    @Query() dto: GetAverageOtWorkHoursDto,
  ) {
    return this.punchProcessService.getAverageOtWorkHours(dto);
  }
 
 
  // =====================================================
  // ATTENDANCE DASHBOARD OVERVIEW
  // =====================================================
 
  @Get('dashboard/overview')
  async getAttendanceDashboardOverview(
    @Query() dto: GetAttendanceDashboardOverviewDto,
  ) {
    return this.punchProcessService.getAttendanceDashboardOverview(dto);
  }
 
 
  // =====================================================
  // LATE IN / EARLY OUT GRAPH
  // =====================================================
 
  @Get('dashboard/late-in-early-out-graph')
  async getLateInEarlyOutGraph(
    @Query() dto: GetLateInEarlyOutGraphDto,
  ) {
    return this.punchProcessService.getLateInEarlyOutGraph(dto);
  }
 
 
  // =====================================================
  // MISSED PUNCH EMPLOYEES
  // =====================================================
 
  @Get('process/missed-punch-employees')
  async getMissedPunchEmployees(
    @Query() dto: GetMissedPunchEmployeesDto,
  ) {
    return this.punchProcessService.getMissedPunchEmployees(dto);
  }
 
  @Post('history')
  async getProcessHistory(
    @Req() req: Request,
    @Body() dto: ProcessHistoryDto,
  ) {
    const companyId = (req as any).user.companyId;
 
    return this.punchProcessService.getProcessHistory(
      companyId,
      dto,
    );
  }
 
 
  @Get('dashboard/processing')
  async getAttendanceProcessingDashboard(
    @Req() req: Request,
    @Query() dto: AttendanceProcessingDashboardDto,
  ) {
    const companyId = (req as any).user.companyId;
 
    return this.punchProcessService.getAttendanceProcessingDashboard(
      companyId,
      dto,
    );
  }
}
