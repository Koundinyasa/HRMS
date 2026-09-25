import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

import { PunchProcessService } from './punchprocess.service';

import { ProcessDto } from './dto/process.dto';

import { PunchDto } from './dto/punch.dto';

import { AttendanceOverviewDto } from './dto/attendance-overview.dto';
import { AttendanceMonthlySummaryDto } from './dto/attendance-monthly-summary.dto';
import { AttendancePunchDetailsDto } from './dto/attendance-punch-details.dto';
import { AttendanceRequestStatusDto } from './dto/attendance-request-status.dto';
import { TaInsightsDto } from './dto/ta-insights.dto';
import { TaInsightsDetailsDto } from './dto/ta-insights-details.dto';

@Controller('admin/timeattendance/timeoffice/punchprocess')
@UseGuards(JwtAuthGuard)
export class PunchProcessController {
  constructor(private readonly punchProcessService: PunchProcessService) {}

  // =====================================================
  // DASHBOARD
  // =====================================================

  // Dashboard Summary

  @Get('dashboard/summary')
  async getDashboardSummary() {
    return this.punchProcessService.getDashboardSummary();
  }

  // Employees by status
  // ON_LEAVE / EARLY_IN / ABSENT / EARLY_OUT

  @Get('dashboard/employees')
  async getDashboardEmployees(@Query('status') status: string) {
    return this.punchProcessService.getDashboardEmployees(status);
  }

  // Attendance Overview Chart

  @Get('dashboard/attendanceoverview')
  async getAttendanceOverviewChart() {
    return this.punchProcessService.getAttendanceOverviewChart();
  }

  // Punch Mode Distribution

  @Get('dashboard/punchmodedistribution')
  async getPunchModeDistribution() {
    return this.punchProcessService.getPunchModeDistribution();
  }

  // Attendance Irregularities

  @Get('dashboard/irregularities')
  async getAttendanceIrregularities() {
    return this.punchProcessService.getAttendanceIrregularities();
  }

  // Average Working Hours

  @Get('dashboard/averageworkinghours')
  async getAverageWorkingHours() {
    return this.punchProcessService.getAverageWorkingHours();
  }

  // Average OT Hours

  @Get('dashboard/averageothours')
  async getAverageOtHours() {
    return this.punchProcessService.getAverageOtHours();
  }

  // Policies / Shifts

  @Get('dashboard/policies')
  async getDashboardPolicies() {
    return this.punchProcessService.getDashboardPolicies();
  }

  // Pending Requests

  @Get('dashboard/pendingrequests')
  async getPendingRequests() {
    return this.punchProcessService.getPendingRequests();
  }

  // =====================================================
  // PROCESS
  // =====================================================

  // Process Summary

  @Get('process/summary')
  async getProcessSummary(@Query() dto: ProcessDto) {
    return this.punchProcessService.getProcessSummary(dto);
  }

  // Process button

  @Post('process')
  async processAttendance(@Body() dto: ProcessDto) {
    return this.punchProcessService.processAttendance(dto);
  }

  // Missed Punch

  @Get('process/missedpunch')
  async getMissedPunch(@Query() dto: ProcessDto) {
    return this.punchProcessService.getMissedPunch(dto);
  }

  // Shift Unassigned

  @Get('process/shiftunassigned')
  async getShiftUnassigned(@Query() dto: ProcessDto) {
    return this.punchProcessService.getShiftUnassigned(dto);
  }

  // Yet To Process

  @Get('process/yettoprocess')
  async getYetToProcess(@Query() dto: ProcessDto) {
    return this.punchProcessService.getYetToProcess(dto);
  }

  // Processed

  @Get('process/processed')
  async getProcessed(@Query() dto: ProcessDto) {
    return this.punchProcessService.getProcessed(dto);
  }

  // Re-Process Effective Date

  @Get('process/reprocesseffectivedate')
  async getReprocessEffectiveDate(@Query() dto: ProcessDto) {
    return this.punchProcessService.getReprocessEffectiveDate(dto);
  }

  // All Re-Process

  @Get('process/allreprocess')
  async getAllReprocess(@Query() dto: ProcessDto) {
    return this.punchProcessService.getAllReprocess(dto);
  }

  // Punch Requests

  @Get('process/punchrequests')
  async getPunchRequests() {
    return this.punchProcessService.getPunchRequests();
  }

  // Process History

  @Get('process/history')
  async getProcessHistory() {
    return this.punchProcessService.getProcessHistory();
  }

  // =====================================================
  // PUNCH
  // =====================================================

  @Get('punch')
  async getPunchDetails(@Query() dto: PunchDto) {
    return this.punchProcessService.getPunchDetails(dto);
  }

  // =====================================================
  // ATTENDANCE OVERVIEW
  // =====================================================

  // Employee search/list

  @Get('attendanceoverview/employees')
  async getAttendanceEmployees(@Query('search') search?: string) {
    return this.punchProcessService.getAttendanceEmployees(search);
  }

  // Daily Attendance Grid

  @Get('attendanceoverview')
  async getAttendanceOverview(@Query() dto: AttendanceOverviewDto) {
    return this.punchProcessService.getAttendanceOverview(dto);
  }

  // Monthly Overview / Summary

  @Get('attendanceoverview/monthlysummary')
  async getAttendanceMonthlySummary(@Query() dto: AttendanceMonthlySummaryDto) {
    return this.punchProcessService.getAttendanceMonthlySummary(dto);
  }

  // Punch Details

  @Get('attendanceoverview/punchdetails')
  async getAttendancePunchDetails(@Query() dto: AttendancePunchDetailsDto) {
    return this.punchProcessService.getAttendancePunchDetails(dto);
  }

  // Request Status

  @Get('attendanceoverview/requeststatus')
  async getAttendanceRequestStatus(@Query() dto: AttendanceRequestStatusDto) {
    return this.punchProcessService.getAttendanceRequestStatus(dto);
  }
  //====================================================
  // TA INSIGHTS
  //=============================================
  //
  @Get('tainsights')
  async getTaInsights(@Query() dto: TaInsightsDto) {
    return this.punchProcessService.getTaInsights(dto);
  }
  //
  @Get('tainsights/details')
  async getTaInsightsDetails(@Query() dto: TaInsightsDetailsDto) {
    return this.punchProcessService.getTaInsightsDetails(dto);
  }
  // =====================================================
  // IMPORT
  // =====================================================

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPunchFile(@UploadedFile() file: any) {
    return this.punchProcessService.uploadPunchFile(file);
  }
}
