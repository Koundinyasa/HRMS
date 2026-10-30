import { GetEmployeeAttendanceCountDto } from './dto/get-employee-attendance-count.dto';

import {
  Body,
  Controller,
  Post,
  Query,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EmployeeScopeService } from '../common/scope/employee-scope.service';
import { RequiresMenu } from '../common/decorators/module-gate.decorator';
import { MenuCode } from '../common/constants/menu-codes';

import { MonthlyLeaveCalendarDto } from './dto/monthly-leave-calendar.dto';
import { MissedPunchEmployeesDto } from './dto/missed-punch-employees.dto';
import { EmployeePunchDashboardDto } from './dto/employee-punch-dashboard.dto';
import { EmployeeRawPunchesDto } from './dto/employee-raw-punches.dto';
import { EmployeeDashboardCountsDto } from './dto/employee-dashboard-counts.dto';
import { EmployeeMonthlyAttendanceDetailsDto } from './dto/employee-monthly-attendance-details.dto';
import { EmployeeAttendanceOverviewDto } from './dto/employee-attendance-overview.dto';
import { EmployeeDashboardDetailsDto } from './dto/employee-dashboard-details.dto';
import { HierarchicalLeaveActionDto } from '../employee/leave/dto/hierarchical-leave-action.dto';
// Review is the reporting-manager menu. Force Leave Approval (HR Admin) also
// uses the approval route.
@RequiresMenu(MenuCode.Review)
@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly scope: EmployeeScopeService,
  ) {}

  // 1. Monthly Leave Calendar
  @UseGuards(JwtAuthGuard)
  @Post('monthlyleavecalendar')
  async getMonthlyLeaveCalendar(
    @Req() req: any,
    @Body() dto: MonthlyLeaveCalendarDto,
  ) {
    return this.reviewService.getMonthlyLeaveCalendar(dto, req.user.companyId);
  }

  // 2. Pending Leave Requests
  @UseGuards(JwtAuthGuard)
  @Post('pendingleaverequests')
  async getPendingLeaveRequests(@Req() req: any) {
    return this.reviewService.getPendingLeaveRequests(req.user.employeeId);
  }

  // 3. Missed Punch Employees
  @UseGuards(JwtAuthGuard)
  @Post('missedpunchemployees')
  async getMissedPunchEmployees(
    @Req() req: any,
    @Body() dto: MissedPunchEmployeesDto,
  ) {
    return this.reviewService.getMissedPunchEmployees(dto, req.user.companyId);
  }

  // 4. Employee Punch Dashboard
  @UseGuards(JwtAuthGuard)
  @Post('employeepunchdashboard')
  async getEmployeePunchDashboard(
    @Req() req: any,
    @Body() dto: EmployeePunchDashboardDto,
  ) {
    await this.scope.assertCanAccess(req.user, dto.employeeId);
    return this.reviewService.getEmployeePunchDashboard(
      dto.employeeId,
      dto.selectedDate,
      dto.viewType,
      dto.showAll,
    );
  }

  // 5. Employee Raw Punches
  @UseGuards(JwtAuthGuard)
  @Post('employeerawpunches')
  async getEmployeeRawPunches(
    @Req() req: any,
    @Body() dto: EmployeeRawPunchesDto,
  ) {
    await this.scope.assertCanAccess(req.user, dto.employeeId);
    return this.reviewService.getEmployeeRawPunches(dto.employeeId, dto.date);
  }

  // 6. Employee Dashboard Counts
  @UseGuards(JwtAuthGuard)
  @Post('employeedashboardcounts')
  async getEmployeeDashboardCounts(
    @Req() req: any,
    @Body() dto: EmployeeDashboardCountsDto,
  ) {
    return this.reviewService.getEmployeeDashboardCounts(
      req.user.companyId,
      dto.fromDate,
      dto.toDate,
    );
  }
  // 7. Employee Monthly Attendance Details
  @UseGuards(JwtAuthGuard)
  @Post('employeemonthlyattendancedetails')
  async getEmployeeMonthlyAttendanceDetails(
    @Req() req: any,
    @Body() dto: EmployeeMonthlyAttendanceDetailsDto,
  ) {
    await this.scope.assertCanAccess(req.user, dto.employeeId);
    return this.reviewService.getEmployeeMonthlyAttendanceDetails(
      dto.employeeId,
      req.user.companyId,
      dto.month,
      dto.year,
      dto.classificationId,
    );
  }
  // 8. Employee Attendance Overview
  @UseGuards(JwtAuthGuard)
  @Post('employeeattendanceoverview')
  async getEmployeeAttendanceOverview(
    @Req() req: any,
    @Body() dto: EmployeeAttendanceOverviewDto,
  ) {
    await this.scope.assertCanAccess(req.user, dto.employeeId);
    return this.reviewService.getEmployeeAttendanceOverview(
      dto.employeeId,
      req.user.companyId,
      dto.year,
      dto.month,
    );
  }
  // 9. Employee Dashboard Details
  @UseGuards(JwtAuthGuard)
  @Post('employeedashboarddetails')
  async getEmployeeDashboardDetails(
    @Req() req: any,
    @Body() dto: EmployeeDashboardDetailsDto,
  ) {
    return this.reviewService.getEmployeeDashboardDetails(
      dto.insightId,
      req.user.companyId,
      dto.fromDate,
      dto.toDate,
    );
  }
  //10. Reporting Employee List
  @Get('reporting-employees')
  @UseGuards(JwtAuthGuard)
  async getReportingManagerEmployeeList(@Req() req) {
    const reportingUserId = Number(
      req.user?.createdBy ?? req.user?.userId ?? 0,
    );
    return this.reviewService.getReportingManagerEmployeeList(
      reportingUserId,
    );
  }
  // Approval / Rejection
  @RequiresMenu(MenuCode.Review, MenuCode.ForceLeaveApproval)
  @UseGuards(JwtAuthGuard)
  @Post('approval')
  async hierarchicalLeaveAction(
    @Req() req,
    @Body() body: HierarchicalLeaveActionDto,
  ) {
    return this.reviewService.hierarchicalLeaveAction(
      body.approvalId,
      req.user.employeeId,
      body.actionStatusId,
      body.remarks,
    );
  }
  //Dropdown for Attendance Statuses
  @Get('attendance-statuses')
  @UseGuards(JwtAuthGuard)
  async getAttendanceStatuses(@Req() req: any) {
    return this.reviewService.getAttendanceStatuses(req.user.companyId);
  }
}
