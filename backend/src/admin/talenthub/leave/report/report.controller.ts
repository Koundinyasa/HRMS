import {
  Controller,
  Get,
  Body,
  Post,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { ReportService } from './report.service';
import { ReportExportService } from './report-export.service';
import { LeaveSummaryDetailedDto } from './dto/leave-summary-detailed.dto';
import { LeaveHistoryDateWiseReportDto } from './dto/leave-history-date-wise-report.dto';
import { LeaveHistoryMonthWiseReportDto } from './dto/leave-history-month-wise-report.dto';

@Controller('admin/ta/leave/report')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly reportExportService: ReportExportService,
  ) {}

  // ==========================================
  // Pay Months
  // ==========================================

  @Get('months')
  async getMonths() {
    return this.reportService.getMonths();
  }

  // ==========================================
  // Attendance Independent Report
  // ==========================================

  @Get('attendanceindependent')
  async getAttendanceIndependentReport(
    @Query('month') month: string,
    @Query('groupBy') groupBy?: string,
  ) {
    return this.reportService.getAttendanceIndependentReport(month, groupBy);
  }

  // ==========================================
  // Top Attendance Report
  // ==========================================

  @Get('topattendance')
  async getTopAttendanceReport(
    @Query('fromMonth') fromMonth: string,
    @Query('toMonth') toMonth: string,
  ) {
    return this.reportService.getTopAttendanceReport(fromMonth, toMonth);
  }

  // ==========================================
  // Top Leave Taken Report
  // ==========================================

  @Get('topleavetaken')
  async getTopLeaveTakenReport(
    @Query('fromMonth') fromMonth: string,
    @Query('toMonth') toMonth: string,
  ) {
    return this.reportService.getTopLeaveTakenReport(fromMonth, toMonth);
  }

  // Starting from here actual SPs
  // ==========================================
  // Availed Leave Report
  // ==========================================

  @Post('availed')
  async getAvailedReport(@Req() req: any, @Body() body: any) {
    return this.reportService.getAvailedReport(
      req.user.companyId,
      body.FromMonth,
      body.ToMonth,
      body.LeavePolicyId ? Number(body.LeavePolicyId) : undefined,
    );
  }

  @Get('test')
  async testReport() {
    return {
      success: true,
      message: 'Report controller is working',
    };
  }

  @Post('attendance')
  async getAttendanceReport(@Req() req: any, @Body() body: any) {
    return this.reportService.getAttendanceReport(
      req.user.companyId,
      body.FromMonth,
      body.ToMonth,
    );
  }

  @Post('leave-taken')
  async getLeaveTakenReport(@Req() req: any, @Body() body: any) {
    return this.reportService.getLeaveTakenReport(
      req.user.companyId,
      body.FromMonth,
      body.ToMonth,
    );
  }

  @Post('allotment')
  async getLeaveAllotmentReport(@Req() req: any, @Body() body: any) {
    return this.reportService.getLeaveAllotmentReport(
      req.user.companyId,
      body.FromMonth,
      body.ToMonth,
      body.LeavePolicyId ? Number(body.LeavePolicyId) : undefined,
    );
  }

  @Post('summary-detailed')
  async getLeaveSummaryDetailed(
    @Req() req: any,
    @Body() dto: LeaveSummaryDetailedDto,
  ) {
    return this.reportService.getLeaveSummaryDetailed(
      req.user.companyId,
      dto.FromMonth,
      dto.ToMonth,
    );
  }

  @Post('history/date-wise')
  async getLeaveHistoryDateWiseReport(
    @Req() req: any,
    @Body() dto: LeaveHistoryDateWiseReportDto,
  ) {
    return this.reportService.getLeaveHistoryDateWiseReport(
      req.user.companyId,
      dto.FromDate,
      dto.ToDate,
    );
  }

  @Post('history/month-wise')
  async getLeaveHistoryMonthWiseReport(
    @Req() req: any,
    @Body() dto: LeaveHistoryMonthWiseReportDto,
  ) {
    return this.reportService.getLeaveHistoryMonthWiseReport(
      req.user.companyId,
      dto.FromMonth,
      dto.ToMonth,
    );
  }

  // ==========================================
  // Generic Report Excel Export
  // ==========================================

  @Post('export')
  async exportReport(@Req() req: any, @Body() body: any, @Res() res: Response) {
    const companyId = req.user.companyId;

    const report = body.report;

    if (!report) {
      return res.status(400).json({
        success: false,
        message: 'Report is required.',
      });
    }

    const result = await this.reportService.getReportExportData(
      report,
      companyId,
      body,
    );

    const file = await this.reportExportService.generateExcel(
      result.data,
      result.fileName,
    );

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

      'Content-Disposition': `attachment; filename="${result.fileName}.xlsx"`,

      'Content-Length': file.length,
    });

    res.send(file);
  }
}
