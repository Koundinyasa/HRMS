import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { CreateAttendanceConfigurationDto } from './dto/create-attendance-configuration.dto';
import { ConfigurationService } from './configuration.service';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('admin/ta/attendance/configurations')
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
