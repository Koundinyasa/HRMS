import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { SaveLeaveFormDto } from './dto/save-leave-form.dto';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { ReprocessDto } from './dto/reprocess.dto';
import { ImportDailyDto } from './dto/import-daily.dto';
import { GetMonthlyLeaveCalendarDto } from './dto/get-monthly-leave-calendar.dto';

@Injectable()
export class DailyService {
  constructor(private readonly databaseService: DatabaseService) {}
  //===============================================
  //Apply leave
  //=============================================

  // Policies

  async getPolicies() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetDailyLeavePolicies');

      return result.recordset;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Unable to fetch policies.');
    }
  }

  // Months

  async getMonths() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetDailyMonths');

      return result.recordset;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Unable to fetch months.');
    }
  }
  // Leave Types

  async getLeaveTypes() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetDailyLeaveTypes');

      return result.recordset;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Unable to fetch leave types.');
    }
  }

  // Day Types

  async getDayTypes() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetDailyDayTypes');

      return result.recordset;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Unable to fetch day types.');
    }
  }
  // Employee Grid

  async getEmployees(policyId: number, month: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('PolicyId', policyId)
        .input('Month', month)
        .execute('USP_GetDailyEmployees'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching employee grid:', error);

      throw new InternalServerErrorException('Unable to fetch employee grid.');
    }
  }
  // Leave Form

  async getLeaveForm(employeeId: number, date: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeId', employeeId)
        .input('Date', date)
        .execute('USP_GetDailyLeaveForm'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching leave form:', error);

      throw new InternalServerErrorException('Unable to fetch leave form.');
    }
  }
  // Save Leave Form

  async saveLeaveForm(dto: SaveLeaveFormDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeId', dto.employeeId)
        .input('Date', dto.date)
        .input('FirstHalf', dto.firstHalf)
        .input('SecondHalf', dto.secondHalf)
        .input('Remarks', dto.remarks)
        .execute('USP_SaveDailyLeaveForm'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while saving leave form:', error);

      throw new InternalServerErrorException('Unable to save leave form.');
    }
  }
  //Apply Leave

  async applyLeave(dto: ApplyLeaveDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeId', JSON.stringify(dto.employeeId))
        .input('Dates', JSON.stringify(dto.dates))
        .input('LeaveType', dto.leaveType)
        .execute('USP_ApplyDailyLeave'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while applying leave:', error);

      throw new InternalServerErrorException('Unable to apply leave.');
    }
  }
  // Reprocess
  async reprocess(dto: ReprocessDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('PolicyId', dto.policyId)
        .input('Month', dto.month)
        .execute('USP_ReprocessDailyLeave'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while reprocessing daily leave:', error);

      throw new InternalServerErrorException(
        'Unable to reprocess daily leave.',
      );
    }
  }
  // ==========================================
  // Import Daily Leave
  // ==========================================

  async importDailyLeave(file: any, dto: ImportDailyDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('TemplateType', dto.templateType)
        .input('PolicyId', dto.policyId)
        .input('Month', dto.month)
        .input('FileName', file.originalname)
        .execute('USP_ImportDailyLeave'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while importing daily leave:', error);

      throw new InternalServerErrorException('Unable to import daily leave.');
    }
  }

  // Starting from here actual SPs
  // ==========================================
  // Monthly Leave Calendar
  // ==========================================

  async getMonthlyLeaveCalendar(
    dto: GetMonthlyLeaveCalendarDto,
    companyId: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Year', dto.year)
        .input('Month', dto.month)
        .input('CompanyId', companyId)
        .input('BranchId', dto.branchId)
        .execute('usp_GetMonthlyLeaveCalendar');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching monthly leave calendar:', error);

      throw new InternalServerErrorException(
        'Unable to fetch monthly leave calendar.',
      );
    }
  }
}
