import {
  Controller,
  Get,
  Query,
  Req,
} from '@nestjs/common';

import { ReviewService } from './review.service';
import { MonthlyLeaveCalendarDto } from './dto/monthly-leave-calendar.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MissedPunchEmployeesDto } from './dto/missed-punch-employees.dto';
import { EmployeePunchDashboardDto } from './dto/employee-punch-dashboard.dto';
import { EmployeeRawPunchesDto } from './dto/employee-raw-punches.dto';
import { EmployeeDashboardCountsDto } from './dto/employee-dashboard-counts.dto';
import { EmployeeMonthlyAttendanceDetailsDto } from './dto/employee-monthly-attendance-details.dto';
import { EmployeeAttendanceOverviewDto } from './dto/employee-attendance-overview.dto';
import { EmployeeDashboardDetailsDto } from './dto/employee-dashboard-details.dto';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('monthlyleavecalendar')
  async getMonthlyLeaveCalendar(
    @Query() dto: MonthlyLeaveCalendarDto,
  ) {
    return this.reviewService.getMonthlyLeaveCalendar(dto);
  }
  @UseGuards(JwtAuthGuard)
@Get('pendingleaverequests')
async getPendingLeaveRequests(
  @Req() req: any,
) {
  return this.reviewService.getPendingLeaveRequests(
    req.user.employeeId,
  );
}
@UseGuards(JwtAuthGuard)
@Get('missedpunchemployees')
async getMissedPunchEmployees(
  @Query() dto: MissedPunchEmployeesDto,
) {
  return this.reviewService.getMissedPunchEmployees(dto);
}
@UseGuards(JwtAuthGuard)
@Get('employeepunchdashboard')
async getEmployeePunchDashboard(
  @Query() dto: EmployeePunchDashboardDto,
) {
  return this.reviewService.getEmployeePunchDashboard(
    dto.employeeId,
    dto.selectedDate,
    dto.viewType,
  );
}
@UseGuards(JwtAuthGuard)
@Get('employeerawpunches')
async getEmployeeRawPunches(
  @Query() dto: EmployeeRawPunchesDto,
) {
  return this.reviewService.getEmployeeRawPunches(
    dto.employeeId,
    dto.date,
  );
}
@UseGuards(JwtAuthGuard)
@Get('employeedashboardcounts')
async getEmployeeDashboardCounts(
  @Query() dto: EmployeeDashboardCountsDto,
) {
  return this.reviewService.getEmployeeDashboardCounts(
    dto.companyId,
    dto.fromDate,
    dto.toDate,
  );
}
@UseGuards(JwtAuthGuard)
@Get('employeemonthlyattendancedetails')
async getEmployeeMonthlyAttendanceDetails(
  @Query() dto: EmployeeMonthlyAttendanceDetailsDto,
) {
  return this.reviewService.getEmployeeMonthlyAttendanceDetails(
    dto.employeeId,
    dto.companyId,
    dto.month,
    dto.year,
    dto.flag,
  );
}
@UseGuards(JwtAuthGuard)
@Get('employeeattendanceoverview')
async getEmployeeAttendanceOverview(
  @Query() dto: EmployeeAttendanceOverviewDto,
) {
  return this.reviewService.getEmployeeAttendanceOverview(
    dto.employeeId,
    dto.companyId,
    dto.year,
    dto.month,
  );
}
@UseGuards(JwtAuthGuard)
@Get('employeedashboarddetails')
async getEmployeeDashboardDetails(
  @Query() dto: EmployeeDashboardDetailsDto,
) {
  return this.reviewService.getEmployeeDashboardDetails(
    dto.insightId,
    dto.companyId,
    dto.fromDate,
    dto.toDate,
  );
}
}