import { BadRequestException, Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../../../database/database.service';
import { UpdatePayrollConfigurationDto } from './dto/update-payroll-configuration.dto';
import { AddReminderDto } from './dto/add-reminder.dto';
import { UpdateReminderStatusDto } from './dto/update-reminder-status.dto';

@Injectable()
export class AdmincenterSettingService {
  constructor(private readonly dbService: DatabaseService) {}
  //Payroll configuration
  async getPayrollConfiguration(companyId: number) {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .execute('USP_GetPayrollConfiguration');

      return result.recordsets[0][0];
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch payroll configuration.');
    }
  }

  //Payroll Masters (Dropdowns)
  async getPayrollMasters() {
    try {
      const pool = await this.dbService.connect();

      const result = await pool.request().execute('USP_GetPayrollMasters');

      return {
        holidaysDefinedOn: result.recordsets[0],
        weeklyHolidayDefinedOn: result.recordsets[1],
        netSalaryRoundOff: result.recordsets[2],
      };
    } catch (error) {
      console.error('USP_GetPayrollMasters ERROR:', error);

      throw new BadRequestException('Failed to fetch payroll masters.');
    }
  }

  // Update Payroll Configuration
  async updatePayrollConfiguration(
    dto: UpdatePayrollConfigurationDto,
    companyId: number,
    modifiedBy: number,
  ) {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('id', sql.Int, dto.id)
        .input('CompanyID', sql.Int, companyId)
        .input('EffectiveFrom', sql.Date, new Date(dto.effectiveFrom))
        .input('PayCycleStartDate', sql.Int, dto.payCycleStartDate)
        .input('CompanyWiseRoleCreation', sql.Bit, dto.companyWiseRoleCreation)
        .input('EnableTimeAndAttendance', sql.Bit, dto.enableTimeAndAttendance)
        .input('EnableAdvance', sql.Bit, dto.enableAdvance)
        .input('EnableReimbursement', sql.Bit, dto.enableReimbursement)
        .input('EnableAdditionalSalary', sql.Bit, dto.enableAdditionalSalary)
        .input(
          'EnableAttendanceIntegration',
          sql.Bit,
          dto.enableAttendanceIntegration,
        )
        .input('EnableLoan', sql.Bit, dto.enableLoan)
        .input('EnableArrear', sql.Bit, dto.enableArrear)
        .input('EnableDisbursement', sql.Bit, dto.enableDisbursement)
        .input('EnableInsurance', sql.Bit, dto.enableInsurance)
        .input('EnableBonus', sql.Bit, dto.enableBonus)
        .input('EnableCostCenter', sql.Bit, dto.enableCostCenter)
        .input('HolidaysDefinedOn', sql.Int, dto.holidaysDefinedOn)
        .input('WeeklyHolidayDefinedOn', sql.Int, dto.weeklyHolidayDefinedOn)
        .input('NetSalaryRoundOff', sql.Int, dto.netSalaryRoundOff)
        .input('RetirementAge', sql.Int, dto.retirementAge ?? null)
        .input('CustomLanguagePayslip', sql.Bit, dto.customLanguagePayslip)
        .input('ModifiedBy', sql.Int, modifiedBy)
        .execute('USP_UpdatePayrollConfiguration');

      const response = result.recordset?.[0];

      if (!response) {
        throw new BadRequestException(
          'No response received from payroll update procedure.',
        );
      }

      if (response.Status === 0) {
        throw new BadRequestException(response.Message);
      }

      return {
        success: true,
        message: response.Message,
      };
    } catch (error) {
      console.error('USP_UpdatePayrollConfiguration ERROR:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to update payroll configuration.');
    }
  }

  // Reminder Email Configuration
  async getReminderEmailConfiguration(companyId: number) {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .execute('USP_GetReminderEmailConfiguration');

      return result.recordset;
    } catch (error) {
      console.error('USP_GetReminderEmailConfiguration ERROR:', error);

      throw new BadRequestException(
        'Failed to fetch reminder email configuration.',
      );
    }
  }

  // Remainder Details
  async getReminderDetails(companyId: number, reminderTypeId: number) {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('ReminderTypeID', sql.Int, reminderTypeId)
        .execute('USP_GetReminderDetails');

      return result.recordset?.[0] ?? null;
    } catch (error) {
      console.error('USP_GetReminderDetails ERROR:', error);

      throw new BadRequestException('Failed to fetch reminder details.');
    }
  }

  // Add Reminder
  async addReminder(dto: AddReminderDto, createdBy: number) {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('Code', sql.VarChar(100), dto.code)
        .input('DisplayName', sql.VarChar(100), dto.displayName)
        .input('ShortLabel', sql.VarChar(20), dto.shortLabel)
        .input('SortOrder', sql.Int, dto.sortOrder)
        .input('TemplateName', sql.VarChar(100), dto.templateName ?? null)
        .input('Subject', sql.NVarChar(250), dto.subject)
        .input('Body', sql.NVarChar(sql.MAX), dto.body)
        .input('CreatedBy', sql.Int, createdBy)
        .execute('USP_InsertReminder');

      const response = result.recordset?.[0];

      if (!response) {
        throw new BadRequestException('Failed to add reminder.');
      }

      if (response.StatusCode !== 1) {
        throw new BadRequestException(response.Message);
      }

      return {
        success: true,
        message: response.Message,
        reminderTypeId: response.ReminderTypeID,
      };
    } catch (error) {
      console.error('USP_InsertReminder ERROR:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to add reminder.');
    }
  }

  // Update Reminder Active / Inactive Status
  async updateReminderStatus(dto: UpdateReminderStatusDto, modifiedBy: number) {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('ReminderTypeID', sql.Int, dto.reminderTypeId)
        .input('IsActive', sql.Bit, dto.isActive)
        .input('ModifiedBy', sql.Int, modifiedBy)
        .execute('USP_UpdateReminderStatus');

      const response = result.recordset?.[0];

      if (!response) {
        throw new BadRequestException(
          'No response received from reminder status update procedure.',
        );
      }

      if (response.StatusCode === 0) {
        throw new BadRequestException(response.Message);
      }

      return {
        success: true,
        message: response.Message,
      };
    } catch (error) {
      console.error('USP_UpdateReminderStatus ERROR:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to update reminder status.');
    }
  }
}
