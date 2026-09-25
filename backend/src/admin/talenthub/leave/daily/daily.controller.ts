import {
  Controller,
  Get,
  Query,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { DailyService } from './daily.service';
import { SaveLeaveFormDto } from './dto/save-leave-form.dto';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { ReprocessDto } from './dto/reprocess.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportDailyDto } from './dto/import-daily.dto';
import { GetMonthlyLeaveCalendarDto } from './dto/get-monthly-leave-calendar.dto';

@Controller('admin/ta/leave/daily')
@UseGuards(JwtAuthGuard)
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}
  //===============================
  //Apply leave
  //================================
  // Leave Policies

  @Get('policies')
  async getPolicies() {
    return this.dailyService.getPolicies();
  }

  // Pay Months

  @Get('months')
  async getMonths() {
    return this.dailyService.getMonths();
  }

  // Leave Types

  @Get('leavetypes')
  async getLeaveTypes() {
    return this.dailyService.getLeaveTypes();
  }
  // Employee Grid

  @Get('employees')
  async getEmployees(
    @Query('policyId') policyId: number,
    @Query('month') month: string,
  ) {
    return this.dailyService.getEmployees(policyId, month);
  }
  // Leave Form

  @Get('leaveform')
  async getLeaveForm(
    @Query('employeeId') employeeId: number,
    @Query('date') date: string,
  ) {
    return this.dailyService.getLeaveForm(employeeId, date);
  }
  // Save Leave Form

  @Post('leaveform')
  async saveLeaveForm(@Body() dto: SaveLeaveFormDto) {
    return this.dailyService.saveLeaveForm(dto);
  }

  // Apply Leave

  @Post('apply')
  async applyLeave(@Body() dto: ApplyLeaveDto) {
    return this.dailyService.applyLeave(dto);
  }
  // Reprocess

  @Post('reprocess')
  async reprocess(@Body() dto: ReprocessDto) {
    return this.dailyService.reprocess(dto);
  }

  //============================================
  //Import
  //=========================================

  // we can reuse the policies and months apis here because they return same data
  //- Template Types
  //operation is not known

  // ==========================================
  // Import Daily Leave
  // ==========================================

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importDailyLeave(
    @UploadedFile() file: any,
    @Body() dto: ImportDailyDto,
  ) {
    return this.dailyService.importDailyLeave(file, dto);
  }

  // startig from here actual SPs
  // ==========================================
  // Monthly Leave Calendar
  // ==========================================

  @Post('monthly-leave-calendar')
  async getMonthlyLeaveCalendar(
    @Req() req: any,
    @Body() dto: GetMonthlyLeaveCalendarDto,
  ) {
    return this.dailyService.getMonthlyLeaveCalendar(dto, req.user.companyId);
  }
}
