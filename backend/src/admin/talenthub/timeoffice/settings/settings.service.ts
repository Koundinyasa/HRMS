import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';

import { UpdateGeneralSettingsDto } from './dto/update-general-settings.dto';

import { UpdateAutoProcessDto } from './dto/update-auto-process.dto';

import { UpdateMailSchedulerDto } from './dto/update-mail-scheduler.dto';

import { UpdatePunchIntegrationDto } from './dto/update-punch-integration.dto';

import { ReadPunchDataDto } from './dto/read-punch-data.dto';

@Injectable()
export class TimeOfficeSettingsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // =========================================================
  // GENERAL SETTINGS
  // =========================================================

  // 1. Get General Settings

  async getGeneralSettings() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_TimeOffice_Settings_General_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching general settings:', error);

      throw new InternalServerErrorException(
        'Unable to fetch general settings.',
      );
    }
  }

  // 2. Update General Settings

  async updateGeneralSettings(dto: UpdateGeneralSettingsDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('OverTime', dto.overTime)
        .input('CompensatoryWork', dto.compensatoryWork)
        .input('WorkFromHome', dto.workFromHome)
        .input('EnableTASupervisor', dto.enableTASupervisor)
        .input('AutoShift', dto.autoShift)
        .input('TAProcessStartDate', dto.taProcessStartDate || null)
        .input(
          'DisplayAllScreensBasedOnProcessDate',
          dto.displayAllScreensBasedOnProcessDate,
        )
        .input('PunchSecondsRoundOff', dto.punchSecondsRoundOff || null)
        .input('DuplicatePunchPeriod', dto.duplicatePunchPeriod ?? null)
        .input(
          'MapGeoLocationToClassification',
          dto.mapGeoLocationToClassification || null,
        )
        .input('ConsiderPunchDirection', dto.considerPunchDirection)
        .input('DoNotDisplayPunchDirection', dto.doNotDisplayPunchDirection)
        .input('MinimumEarlyInAllowed', dto.minimumEarlyInAllowed || null)
        .input('MaximumLateOutAllowed', dto.maximumLateOutAllowed || null)
        .execute('USP_TimeOffice_Settings_General_Save');

      return {
        success: true,
        message: 'General settings updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating general settings:', error);

      throw new InternalServerErrorException(
        'Unable to update general settings.',
      );
    }
  }

  // =========================================================
  // AUTO PROCESS
  // =========================================================

  // 3. Get Auto Process Settings

  async getAutoProcessSettings() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_TimeOffice_Settings_AutoProcess_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching auto process settings:', error);

      throw new InternalServerErrorException(
        'Unable to fetch auto process settings.',
      );
    }
  }

  // 4. Update Auto Process Settings

  async updateAutoProcessSettings(dto: UpdateAutoProcessDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('IntervalType', dto.intervalType)
        .input('IntervalValue', dto.intervalValue)
        .execute('USP_TimeOffice_Settings_AutoProcess_Save');

      return {
        success: true,
        message: 'Auto process settings updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating auto process settings:', error);

      throw new InternalServerErrorException(
        'Unable to update auto process settings.',
      );
    }
  }

  // =========================================================
  // MAIL SCHEDULER
  // =========================================================

  // 5. Get Mail Scheduler Settings

  async getMailSchedulerSettings() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_TimeOffice_Settings_MailScheduler_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching mail scheduler settings:', error);

      throw new InternalServerErrorException(
        'Unable to fetch mail scheduler settings.',
      );
    }
  }

  // 6. Update Mail Scheduler Settings

  async updateMailSchedulerSettings(dto: UpdateMailSchedulerDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Active', dto.active)
        .input('ScheduleFor', dto.scheduleFor || null)
        .input('ReportingType', dto.reportingType || null)
        .input('ReportingFormat', dto.reportingFormat || null)
        .input('AutoMailTo', dto.autoMailTo || null)
        .input('MailBody', dto.mailBody || null)
        .input('MailSendingType', dto.mailSendingType || null)
        .execute('USP_TimeOffice_Settings_MailScheduler_Save');

      return {
        success: true,
        message: 'Mail scheduler settings updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating mail scheduler settings:', error);

      throw new InternalServerErrorException(
        'Unable to update mail scheduler settings.',
      );
    }
  }

  // =========================================================
  // PUNCH INTEGRATION
  // =========================================================

  // 7. Get Punch Integration Settings

  async getPunchIntegrationSettings() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_TimeOffice_Settings_PunchIntegration_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching punch integration settings:', error);

      throw new InternalServerErrorException(
        'Unable to fetch punch integration settings.',
      );
    }
  }

  // 8. Update Punch Integration Settings

  async updatePunchIntegrationSettings(dto: UpdatePunchIntegrationDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('IntegrationId', dto.integrationId || null)
        .input('LocationId', dto.locationId)
        .input('InputType', dto.inputType)
        .input('Vendor', dto.vendor)
        .input('UserAccessEventApi', dto.userAccessEventApi)
        .input('Url', dto.url || null)
        .input('UserName', dto.userName || null)
        .input('Password', dto.password || null)
        .input('EmployeeIdMappedTo', dto.employeeIdMappedTo || null)
        .input('CustomField', dto.customField || null)
        .input('AutoPunchReadingIntervalType', dto.autoPunchReadingIntervalType)
        .input(
          'AutoPunchReadingIntervalValue',
          dto.autoPunchReadingIntervalValue,
        )
        .execute('USP_TimeOffice_Settings_PunchIntegration_Save');

      return {
        success: true,
        message: 'Punch integration settings updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating punch integration settings:', error);

      throw new InternalServerErrorException(
        'Unable to update punch integration settings.',
      );
    }
  }

  // 9. Read Punch Data

  async readPunchData(dto: ReadPunchDataDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('LocationId', dto.locationId)
        .input('FromDate', dto.fromDate)
        .input('ToDate', dto.toDate)
        .execute('USP_TimeOffice_Settings_PunchIntegration_ReadData');

      return {
        success: true,
        message: 'Punch data read successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error reading punch data:', error);

      throw new InternalServerErrorException('Unable to read punch data.');
    }
  }
}
