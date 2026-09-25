import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';

import { ProcessDto } from './dto/process.dto';

import { PunchDto } from './dto/punch.dto';

import { AttendanceOverviewDto } from './dto/attendance-overview.dto';
import { AttendanceMonthlySummaryDto } from './dto/attendance-monthly-summary.dto';
import { AttendancePunchDetailsDto } from './dto/attendance-punch-details.dto';
import { AttendanceRequestStatusDto } from './dto/attendance-request-status.dto';
import { TaInsightsDto } from './dto/ta-insights.dto';
import { TaInsightsDetailsDto } from './dto/ta-insights-details.dto';
@Injectable()
export class PunchProcessService {
  constructor(private readonly databaseService: DatabaseService) {}

  // =====================================================
  // DASHBOARD
  // =====================================================

  // Dashboard Summary

  async getDashboardSummary() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_PunchProcess_DashboardSummary'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching dashboard summary:', error);

      throw new InternalServerErrorException(
        'Unable to fetch dashboard summary.',
      );
    }
  }

  // =====================================================
  // Employees by Status
  // ON_LEAVE / EARLY_IN / ABSENT / EARLY_OUT
  // =====================================================

  async getDashboardEmployees(status: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Status', status)
        .execute('USP_PunchProcess_DashboardEmployees'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching dashboard employees:', error);

      throw new InternalServerErrorException(
        'Unable to fetch dashboard employees.',
      );
    }
  }

  // =====================================================
  // Attendance Overview Chart
  // =====================================================

  async getAttendanceOverviewChart() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_PunchProcess_AttendanceOverview'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching attendance overview:', error);

      throw new InternalServerErrorException(
        'Unable to fetch attendance overview.',
      );
    }
  }

  // =====================================================
  // Punch Mode Distribution
  // =====================================================

  async getPunchModeDistribution() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_PunchProcess_PunchModeDistribution'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching punch mode distribution:', error);

      throw new InternalServerErrorException(
        'Unable to fetch punch mode distribution.',
      );
    }
  }

  // =====================================================
  // Attendance Irregularities
  // =====================================================

  async getAttendanceIrregularities() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_PunchProcess_Irregularities'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching attendance irregularities:', error);

      throw new InternalServerErrorException(
        'Unable to fetch attendance irregularities.',
      );
    }
  }

  // =====================================================
  // Average Working Hours
  // =====================================================

  async getAverageWorkingHours() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_PunchProcess_AverageWorkingHours'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching average working hours:', error);

      throw new InternalServerErrorException(
        'Unable to fetch average working hours.',
      );
    }
  }

  // =====================================================
  // Average OT Hours
  // =====================================================

  async getAverageOtHours() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_PunchProcess_AverageOTHours'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching average OT hours:', error);

      throw new InternalServerErrorException(
        'Unable to fetch average OT hours.',
      );
    }
  }

  // =====================================================
  // Policies / Shifts
  // =====================================================

  async getDashboardPolicies() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_PunchProcess_Policies'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching policies:', error);

      throw new InternalServerErrorException('Unable to fetch policies.');
    }
  }

  // =====================================================
  // Pending Requests
  // =====================================================

  async getPendingRequests() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_PunchProcess_PendingRequests'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching pending requests:', error);

      throw new InternalServerErrorException(
        'Unable to fetch pending requests.',
      );
    }
  }

  // =====================================================
  // PROCESS
  // =====================================================

  // Process Summary

  async getProcessSummary(dto: ProcessDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromDate', dto.fromDate)
        .input('TillDate', dto.tillDate)
        .execute('USP_PunchProcess_Summary');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching process summary:', error);

      throw new InternalServerErrorException(
        'Unable to fetch process summary.',
      );
    }
  }

  // Process button

  async processAttendance(dto: ProcessDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromDate', dto.fromDate)
        .input('TillDate', dto.tillDate)
        .execute('USP_PunchProcess_Process');

      return result.recordset;
    } catch (error) {
      console.error('Error while processing attendance:', error);

      throw new InternalServerErrorException('Unable to process attendance.');
    }
  }

  // Missed Punch

  async getMissedPunch(dto: ProcessDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromDate', dto.fromDate)
        .input('TillDate', dto.tillDate)
        .execute('USP_PunchProcess_MissedPunch');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching missed punch:', error);

      throw new InternalServerErrorException(
        'Unable to fetch missed punch records.',
      );
    }
  }

  // Shift Unassigned

  async getShiftUnassigned(dto: ProcessDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromDate', dto.fromDate)
        .input('TillDate', dto.tillDate)
        .execute('USP_PunchProcess_ShiftUnassigned');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching unassigned shifts:', error);

      throw new InternalServerErrorException(
        'Unable to fetch unassigned shifts.',
      );
    }
  }

  // Yet To Process

  async getYetToProcess(dto: ProcessDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromDate', dto.fromDate)
        .input('TillDate', dto.tillDate)
        .execute('USP_PunchProcess_YetToProcess');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching yet to process:', error);

      throw new InternalServerErrorException(
        'Unable to fetch yet to process records.',
      );
    }
  }

  // Processed

  async getProcessed(dto: ProcessDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromDate', dto.fromDate)
        .input('TillDate', dto.tillDate)
        .execute('USP_PunchProcess_Processed');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching processed records:', error);

      throw new InternalServerErrorException(
        'Unable to fetch processed records.',
      );
    }
  }

  // Re-Process Effective Date

  async getReprocessEffectiveDate(dto: ProcessDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromDate', dto.fromDate)
        .input('TillDate', dto.tillDate)
        .execute('USP_PunchProcess_ReprocessEffectiveDate');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching re-process effective dates:', error);

      throw new InternalServerErrorException(
        'Unable to fetch re-process effective dates.',
      );
    }
  }

  // All Re-Process

  async getAllReprocess(dto: ProcessDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromDate', dto.fromDate)
        .input('TillDate', dto.tillDate)
        .execute('USP_PunchProcess_AllReprocess');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching all re-process records:', error);

      throw new InternalServerErrorException(
        'Unable to fetch all re-process records.',
      );
    }
  }

  // Punch Requests

  async getPunchRequests() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_PunchProcess_PunchRequests');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching punch requests:', error);

      throw new InternalServerErrorException('Unable to fetch punch requests.');
    }
  }

  // Process History

  async getProcessHistory() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_PunchProcess_History');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching process history:', error);

      throw new InternalServerErrorException(
        'Unable to fetch process history.',
      );
    }
  }

  // =====================================================
  // PUNCH
  // =====================================================

  async getPunchDetails(dto: PunchDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('PunchDate', dto.date)
        .input('Search', dto.search || null)
        .execute('USP_PunchProcess_PunchDetails');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching punch details:', error);

      throw new InternalServerErrorException('Unable to fetch punch details.');
    }
  }

  // =====================================================
  // ATTENDANCE OVERVIEW
  // =====================================================

  // Employee search

  async getAttendanceEmployees(search?: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Search', search || null)
        .execute('USP_PunchProcess_AttendanceEmployees');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching attendance employees:', error);

      throw new InternalServerErrorException(
        'Unable to fetch attendance employees.',
      );
    }
  }

  // Daily Attendance Grid

  async getAttendanceOverview(dto: AttendanceOverviewDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Month', dto.month)
        .input('EmployeeId', dto.employeeId)
        .execute('USP_PunchProcess_AttendanceOverview');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching attendance overview:', error);

      throw new InternalServerErrorException(
        'Unable to fetch attendance overview.',
      );
    }
  }
  // Monthly Attendance Summary

  async getAttendanceMonthlySummary(dto: AttendanceMonthlySummaryDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Month', dto.month)
        .input('EmployeeId', dto.employeeId)
        .execute('USP_PunchProcess_AttendanceMonthlySummary');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching attendance monthly summary:', error);

      throw new InternalServerErrorException(
        'Unable to fetch attendance monthly summary.',
      );
    }
  }
  // Punch Details

  async getAttendancePunchDetails(dto: AttendancePunchDetailsDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('PunchDate', dto.date)
        .input('EmployeeId', dto.employeeId)
        .execute('USP_PunchProcess_AttendancePunchDetails');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching attendance punch details:', error);

      throw new InternalServerErrorException(
        'Unable to fetch attendance punch details.',
      );
    }
  }
  // Request Status

  async getAttendanceRequestStatus(dto: AttendanceRequestStatusDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeId', dto.employeeId)
        .execute('USP_PunchProcess_AttendanceRequestStatus');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching attendance request status:', error);

      throw new InternalServerErrorException(
        'Unable to fetch attendance request status.',
      );
    }
  }
  // =====================================================
  // TA INSIGHTS
  // =====================================================

  async getTaInsights(dto: TaInsightsDto) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      request.input('FromDate', dto.fromDate);
      request.input('ToDate', dto.toDate);
      request.input('Query', dto.query ?? null);
      request.input('TAPolicy', dto.taPolicy ?? null);
      request.input('Pattern', dto.pattern ?? null);
      request.input('TASupervisor', dto.taSupervisor ?? null);
      request.input('Attendance', dto.attendance ?? null);
      request.input('Leave', dto.leave ?? null);

      const result = await request.execute('USP_PunchProcess_TAInsights');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('TA Insights Error:', error);

      throw new InternalServerErrorException('Unable to fetch TA insights.');
    }
  }

  async getTaInsightsDetails(dto: TaInsightsDetailsDto) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      request.input('Type', dto.type);
      request.input('FromDate', dto.fromDate);
      request.input('ToDate', dto.toDate);
      request.input('Query', dto.query ?? null);
      request.input('TAPolicy', dto.taPolicy ?? null);
      request.input('Pattern', dto.pattern ?? null);
      request.input('TASupervisor', dto.taSupervisor ?? null);
      request.input('Attendance', dto.attendance ?? null);
      request.input('Leave', dto.leave ?? null);

      const result = await request.execute(
        'USP_PunchProcess_TAInsights_Details',
      );

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('TA Insights Details Error:', error);

      throw new InternalServerErrorException(
        'Unable to fetch TA insights details.',
      );
    }
  }
  // =====================================================
  // IMPORT
  // =====================================================

  // Upload Punch File

  async uploadPunchFile(file: any) {
    try {
      if (!file) {
        throw new InternalServerErrorException('Punch file is required.');
      }

      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FileName', file.originalname)
        .execute('USP_PunchProcess_UploadPunchFile');

      return result.recordset;
    } catch (error) {
      console.error('Error while uploading punch file:', error);

      throw new InternalServerErrorException('Unable to upload punch file.');
    }
  }
}
