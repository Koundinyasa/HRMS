import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

import { TimeOfficeSettingsService } from './settings.service';

import { UpdateGeneralSettingsDto } from './dto/update-general-settings.dto';

import { UpdateAutoProcessDto } from './dto/update-auto-process.dto';

import { UpdateMailSchedulerDto } from './dto/update-mail-scheduler.dto';

import { UpdatePunchIntegrationDto } from './dto/update-punch-integration.dto';

import { ReadPunchDataDto } from './dto/read-punch-data.dto';

@Controller('admin/timeattendance/timeoffice/settings')

@UseGuards(JwtAuthGuard)

export class TimeOfficeSettingsController {
  constructor(
    private readonly timeOfficeSettingsService: TimeOfficeSettingsService,
  ) {}

  // =========================================================
  // GENERAL SETTINGS
  // =========================================================

  // 1. Get General Settings

  @Get('general')
  async getGeneralSettings() {
    return this.timeOfficeSettingsService.getGeneralSettings();
  }

  // 2. Update General Settings

  @Put('general')
  async updateGeneralSettings(
    @Body() dto: UpdateGeneralSettingsDto,
  ) {
    return this.timeOfficeSettingsService.updateGeneralSettings(
      dto,
    );
  }

  // =========================================================
  // AUTO PROCESS
  // =========================================================

  // 3. Get Auto Process Settings

  @Get('autoprocess')
  async getAutoProcessSettings() {
    return this.timeOfficeSettingsService.getAutoProcessSettings();
  }

  // 4. Update Auto Process Settings

  @Put('autoprocess')
  async updateAutoProcessSettings(
    @Body() dto: UpdateAutoProcessDto,
  ) {
    return this.timeOfficeSettingsService.updateAutoProcessSettings(
      dto,
    );
  }

  // =========================================================
  // MAIL SCHEDULER
  // =========================================================

  // 5. Get Mail Scheduler Settings

  @Get('mailscheduler')
  async getMailSchedulerSettings() {
    return this.timeOfficeSettingsService.getMailSchedulerSettings();
  }

  // 6. Update Mail Scheduler Settings

  @Put('mailscheduler')
  async updateMailSchedulerSettings(
    @Body() dto: UpdateMailSchedulerDto,
  ) {
    return this.timeOfficeSettingsService.updateMailSchedulerSettings(
      dto,
    );
  }

  // =========================================================
  // PUNCH INTEGRATION
  // =========================================================

  // 7. Get Punch Integration Settings

  @Get('punchintegration')
  async getPunchIntegrationSettings() {
    return this.timeOfficeSettingsService.getPunchIntegrationSettings();
  }

  // 8. Update Punch Integration Settings

  @Put('punchintegration')
  async updatePunchIntegrationSettings(
    @Body() dto: UpdatePunchIntegrationDto,
  ) {
    return this.timeOfficeSettingsService.updatePunchIntegrationSettings(
      dto,
    );
  }


  // 9. Read Punch Data

  @Post('punchintegration/readdata')
  async readPunchData(
    @Body() dto: ReadPunchDataDto,
  ) {
    return this.timeOfficeSettingsService.readPunchData(dto);
  }
}