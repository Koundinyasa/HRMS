import type { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Req,
} from '@nestjs/common';

import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';
import { RequiresMenu } from '../../../../common/decorators/module-gate.decorator';
import { MenuCode } from '../../../../common/constants/menu-codes';
import { EmployeeScopeService } from '../../../../common/scope/employee-scope.service';

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
import { EmployeeRawPunchesDto } from '../../../../review/dto/employee-raw-punches.dto';
import { GetEmployeeAttendanceOverviewDto } from './dto/get-employee-attendance-overview.dto';
import { EmployeeMonthlyAttendanceDetailsDto } from './dto/employee-monthly-attendance-details.dto';
@Roles(...ADMIN_PORTAL_ROLES)
@RequiresMenu(MenuCode.TimeOfficeDashboard)
@Controller('admin/timeattendance/timeoffice/punchprocess')
export class PunchProcessController {
  constructor(
    private readonly punchProcessService: PunchProcessService,
    private readonly scope: EmployeeScopeService,
  ) {}

  // =====================================================
  // Starts actual Sps from here
  //======================================================
  // @Get('dashboard/counts')
  // async getAttendanceDashboardCounts(
  //   @Query() dto: GetAttendanceDashboardDto,
  // ) {
  //   return this.punchProcessService.getAttendanceDashboardCounts(dto);
  // }




//get dashboard counts api - Actual API
  @Get('dashboard/counts')
  async getAttendanceDashboardCounts(@Req() req: any) {
    const companyId = req.user.companyId;
 
    return this.punchProcessService.getAttendanceDashboardCounts(companyId);
  }
 
 
  // =====================================================
  // YESTERDAY PRESENT COUNT
  // =====================================================
 
  @Get('dashboard/yesterday-present-count')
  async getYesterdayPresentCount(
    @Req() req: Request,
    @Query() dto: GetYesterdayPresentCountDto,
  ) {
    const companyId = (req as any).user.companyId;
    return this.punchProcessService.getYesterdayPresentCount(companyId, dto);
  }

  @Get('dashboard/yesterday-present-employees')
  async getYesterdayPresentEmployees(
    @Req() req: Request,
    @Query() dto: GetYesterdayPresentCountDto,
  ) {
    const companyId = (req as any).user.companyId;
    return this.punchProcessService.getYesterdayPresentEmployees(companyId, dto);
  }
 
 
  // =====================================================
  // YESTERDAY ABSENT EMPLOYEES
  // =====================================================
  @Get('yesterday-absent-employees')
  async getYesterdayAbsentEmployees(
    @Req() req: Request,
    @Query() dto: GetYesterdayAbsentEmployeesDto,
  ) {
    const companyId = (req as any).user.companyId;
    return this.punchProcessService.getYesterdayAbsentEmployees(companyId, dto);
  }
 
 
  // =====================================================
  // ON LEAVE EMPLOYEES
  // =====================================================
 
  @Get('dashboard/on-leave-employees')
  async getOnLeaveEmployees(
    @Req() req: Request,
    @Query() dto: GetOnLeaveEmployeesDto,
  ) {
    const companyId = (req as any).user.companyId;
    return this.punchProcessService.getOnLeaveEmployees(companyId, dto);
  }
 
  // =====================================================
  // LATE IN EMPLOYEES
  // =====================================================
 
  @Get('dashboard/late-in-employees')
  async getLateInEmployees(
    @Req() req: Request,
    @Query() dto: GetLateInEmployeesDto,
  ) {
    const companyId = (req as any).user.companyId;
    return this.punchProcessService.getLateInEmployees(companyId, dto);
  }
 
  // =====================================================
  // EARLY IN EMPLOYEES
  // =====================================================
 
  @Get('dashboard/early-in-employees')
  async getEarlyInEmployees(
    @Req() req: Request,
    @Query() dto: GetEarlyInEmployeesDto,
  ) {
    const companyId = (req as any).user.companyId;
    return this.punchProcessService.getEarlyInEmployees(companyId, dto);
  }
 
  // =====================================================
  // EARLY OUT EMPLOYEES
  // =====================================================
 
  @Get('dashboard/early-out-employees')
  async getEarlyOutEmployees(
    @Req() req: Request,
    @Query() dto: GetEarlyOutEmployeesDto,
  ) {
    const companyId = (req as any).user.companyId;
    return this.punchProcessService.getEarlyOutEmployees(companyId, dto);
  }
 
 
  // =====================================================
  // YET TO LOGIN EMPLOYEES
  // =====================================================
  @Get('dashboard/yet-to-login')
  async getYetToLoginEmployees(
    @Req() req: Request,
    @Query() dto: GetYetToLoginEmployeesDto,
  ) {
    const companyId = (req as any).user.companyId;
    return this.punchProcessService.getYetToLoginEmployees(companyId, dto);
  }
 
 
  // =====================================================
  // LOGGED IN EMPLOYEES
  // =====================================================
 
  @Get('dashboard/logged-in-employees')
  async getLoggedInEmployees(
    @Req() req: Request,
    @Query() dto: GetLoggedInEmployeesDto,
  ) {
    const companyId = (req as any).user.companyId;
    return this.punchProcessService.getLoggedInEmployees(companyId, dto);
  }
 





  @Get('dashboard/average-ot-work-hours')
  async getAverageOtWorkHours(@Req() req: any) {
    return this.punchProcessService.getAverageOtWorkHours(req.user.companyId);
  }
 

 
  // =====================================================
  // ATTENDANCE DASHBOARD OVERVIEW
  // =====================================================
 
  // @Get('dashboard/overview')
  // async getAttendanceDashboardOverview(
  //   @Query() dto: GetAttendanceDashboardOverviewDto,
  // ) {
  //   return this.punchProcessService.getAttendanceDashboardOverview(dto);
  // }
 
 


  // =====================================================
  // ATTENDANCE DASHBOARD OVERVIEW
  // =====================================================
 
  @Get('dashboard/overview')
  async getAttendanceDashboardOverview(@Req() req: any) {
    const companyId = req.user.companyId;
 
    return this.punchProcessService.getAttendanceDashboardOverview(companyId);
  }
  // =====================================================
  // LATE IN / EARLY OUT GRAPH
  // =====================================================
 
  // @Get('dashboard/late-in-early-out-graph')
  // async getLateInEarlyOutGraph(
  //   @Query() dto: GetLateInEarlyOutGraphDto,
  // ) {
  //   return this.punchProcessService.getLateInEarlyOutGraph(dto);
  // }
 

  @Get('dashboard/late-in-early-out-graph')
  async getLateInEarlyOutGraph(@Req() req: any) {
    const companyId = req.user.companyId;
 
    return this.punchProcessService.getLateInEarlyOutGraph(companyId);
  }
 
  // =====================================================
  // MISSED PUNCH EMPLOYEES
  // =====================================================
 
  @Get('process/missed-punch-employees')
  async getMissedPunchEmployees(
    @Req() req: Request,
    @Query() dto: GetMissedPunchEmployeesDto,
  ) {
    const companyId = (req as any).user.companyId;
    return this.punchProcessService.getMissedPunchEmployees(companyId, dto);
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


  @Post('employeerawpunches')
  async getEmployeeRawPunches(
    @Req() req: any,
    @Body() dto: EmployeeRawPunchesDto,
  ) {
    await this.scope.assertCanAccess(req.user, dto.employeeId);
    return this.punchProcessService.getEmployeeRawPunches(
      dto.employeeId,
      dto.date,
    );
  }
//=========================================================
//Get holiday week off employees 
//============================================================
@Get('holiday-weekoff-employees')
async getHolidayWeekOffEmployees(
  @Req() req: Request,
  @Query('date') date?: string,
  @Query('type') type?: string,
) {
  const companyId = (req as any).user.companyId;

  return this.punchProcessService.getHolidayWeekOffEmployees(
    companyId,
    date,
    type,
  );
}

//==================================================
//employee dashboard 
//================================================
@Get('employee-dashboard-counts')
async getEmployeeDashboardCounts(
  @Req() req: Request,
  @Query('fromDate') fromDate?: string,
  @Query('toDate') toDate?: string,
) {
  const companyId = (req as any).user.companyId;

  return this.punchProcessService.getEmployeeDashboardCounts(
    companyId,
    fromDate,
    toDate,
  );
}
//===================================================
// Employee Dashboard details 
//====================================================
@Get('employee-dashboard-details')
async getEmployeeDashboardDetails(
  @Req() req: Request,
  @Query('insightId') insightId: string,
  @Query('fromDate') fromDate?: string,
  @Query('toDate') toDate?: string,
) {
  const companyId = (req as any).user.companyId;

  return this.punchProcessService.getEmployeeDashboardDetails(
    Number(insightId),
    companyId,
    fromDate,
    toDate,
  );
}
//================================================
// Attendance overview 
//=============================================
@Get('employee-attendance-overview')
async getEmployeeAttendanceOverview(
  @Req() req: any,
  @Query() dto: GetEmployeeAttendanceOverviewDto,
) {
  const companyId = req.user.companyId;
  await this.scope.assertCanAccess(req.user, dto.employeeId);

  return this.punchProcessService.getEmployeeAttendanceOverview(
    dto.employeeId,
    companyId,
    dto.year,
    dto.month,
  );
}


//================================================
// Attendace overview drop down
//==============================================
@Get('employees-by-company')
async getEmployeesByCompany(
  @Req() req: Request,
  @Query('branchId') branchId?: string,
) {
  const companyId = (req as any).user.companyId;
 
  return this.punchProcessService.getEmployeesByCompany(
    companyId,
    branchId === undefined ? undefined : Number(branchId),
  );
}
//=====================================================
//Monthly overview
//=================================================
@Get('employee-monthly-attendance-details')
async getEmployeeMonthlyAttendanceDetails(
  @Req() req: Request,
  @Query() dto: EmployeeMonthlyAttendanceDetailsDto,
) {
  const companyId = (req as any).user.companyId;
  await this.scope.assertCanAccess((req as any).user, dto.employeeId);
 
  return this.punchProcessService.getEmployeeMonthlyAttendanceDetails(
    companyId,
    dto,
  );
}
 //=====================================================
// Attendance Policy and Shift Dropdown
//=====================================================
 
@Get('attendance-policy-shifts')
async getAttendancePolicyAndShift(@Req() req: any) {
  const companyId = req.user.companyId;
 
  return this.punchProcessService.getAttendancePolicyAndShift(companyId);
}

}
