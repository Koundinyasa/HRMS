import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { CreateAttendanceConfigurationDto } from './dto/create-attendance-configuration.dto';
import { ConfigurationService } from './configuration.service';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

@Controller('admin/ta/attendance/configurations')
@UseGuards(JwtAuthGuard)
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  // ==========================================
  // Attendance Configuration
  // ==========================================

  @Get('configuration')
  async getAttendanceConfiguration() {
    return this.configurationService.getAttendanceConfiguration();
  }
  // ==========================================
  // Salary Calendar Days
  // ==========================================

  @Get('salarycalendardays')
  async getSalaryCalendarDays() {
    return this.configurationService.getSalaryCalendarDays();
  }

  // ==========================================
  // Attendance Types
  // ==========================================

  @Get('attendancetypes')
  async getAttendanceTypes() {
    return this.configurationService.getAttendanceTypes();
  }

  // ==========================================
  // Create Attendance Configuration
  // ==========================================

  @Post('save')
  async createAttendanceConfiguration(
    @Req() req,
    @Body()
    dto: CreateAttendanceConfigurationDto,
  ) {
    return this.configurationService.createAttendanceConfiguration(
      req.user.employeeId,
      dto,
    );
  }
}
