import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';

import { GetAttendanceDashboardDto } from './dto/get-attendance-dashboard.dto';
import { GetYesterdayPresentCountDto } from './dto/get-yesterday-present-count.dto';
import { GetYesterdayAbsentEmployeesDto } from './dto/get-yesterday-absent-employees.dto';
import { GetOnLeaveEmployeesDto } from './dto/get-on-leave-employees.dto';
import { GetLateInEmployeesDto } from './dto/get-late-in-employees.dto';
import { GetEarlyInEmployeesDto } from './dto/get-early-in-employees.dto';
import { GetEarlyOutEmployeesDto } from './dto/get-early-out-employees.dto';
import { GetYetToLoginEmployeesDto } from './dto/get-yet-to-login-employees.dto';
import { GetLoggedInEmployeesDto } from './dto/get-logged-in-employees.dto';
import { GetAverageOtWorkHoursDto } from './dto/get-average-ot-work-hours.dto';
import { GetAttendanceDashboardOverviewDto } from './dto/get-attendance-dashboard-overview.dto';
import { GetLateInEarlyOutGraphDto } from './dto/get-late-in-early-out-graph.dto';
import { GetMissedPunchEmployeesDto } from './dto/get-missed-punch-employees.dto';
import { ProcessHistoryDto } from './dto/process-history.dto';
import { AttendanceProcessingDashboardDto } from './dto/attendance-processing-dashboard.dto';
import * as sql from 'mssql';
@Injectable()
export class PunchProcessService {
  constructor(private readonly databaseService: DatabaseService) {}


  //==========================================================
  // Starting from here actual Sps
 
  // Attendance Dashboard Counts
 
  async getAttendanceDashboardCounts(
    dto: GetAttendanceDashboardDto,
  ) {
    try {
      const pool =
        await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input(
          'CompanyID',
          dto.companyId,
        )
        .input(
          'Date',
          dto.date ?? null,
        )
        .execute(
          'usp_GetAttendanceDashboardCounts',
        );
 
      return result.recordset?.[0] ?? {};
    } catch (error) {
      console.error(
        'Error while fetching attendance dashboard counts:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to fetch attendance dashboard counts.',
      );
    }
  }
 
 
  // =====================================================
  // YESTERDAY PRESENT COUNT
  // =====================================================
 
  async getYesterdayPresentCount(
    dto: GetYesterdayPresentCountDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', dto.companyId)
        .input('Date', dto.date ?? null)
        .execute('USP_GetYesterdayPresentEmployees');
 
      return result.recordset?.[0] ?? {};
    } catch (error) {
      console.error(
        'Error while fetching yesterday present count:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to fetch yesterday present count.',
      );
    }
  }
 
 
  // =====================================================
  // YESTERDAY ABSENT EMPLOYEES
  // =====================================================
 
  async getYesterdayAbsentEmployees(
    dto: GetYesterdayAbsentEmployeesDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const request = pool.request();
 
      request.input(
        'CompanyId',
        sql.Int,
        dto.companyId,
      );
 
      request.input(
        'AttendanceDate',
        sql.Date,
        dto.attendanceDate || null,
      );
 
      const result = await request.execute(
        'usp_GetYesterdayAbsentEmployees',
      );
 
      return {
        success: true,
        message: 'Absent employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching yesterday absent employees:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve yesterday absent employees',
      );
    }
  }
 
  // =====================================================
  // ON LEAVE EMPLOYEES
  // =====================================================
 
  async getOnLeaveEmployees(
    dto: GetOnLeaveEmployeesDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const request = pool.request();
 
      request.input(
        'CompanyId',
        sql.Int,
        dto.companyId,
      );
 
      request.input(
        'FromDate',
        sql.Date,
        dto.fromDate || null,
      );
 
      const result = await request.execute(
        'USP_GetOnLeaveEmployees',
      );
 
      return {
        success: true,
        message: 'On leave employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching on leave employees:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve on leave employees',
      );
    }
  }
 
 
  // =====================================================
  // LATE IN EMPLOYEES
  // =====================================================
 
  async getLateInEmployees(
    dto: GetLateInEmployeesDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const request = pool.request();
 
      request.input(
        'CompanyID',
        sql.Int,
        dto.companyId,
      );
 
      request.input(
        'Date',
        sql.Date,
        dto.date || null,
      );
 
      const result = await request.execute(
        'USP_GetLateInEmployees',
      );
 
      return {
        success: true,
        message: 'Late in employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching late in employees:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve late in employees',
      );
    }
  }
 
 
  // =====================================================
  // EARLY IN EMPLOYEES
  // =====================================================
 
  async getEarlyInEmployees(
    dto: GetEarlyInEmployeesDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const request = pool.request();
 
      request.input(
        'CompanyID',
        sql.Int,
        dto.companyId,
      );
 
      request.input(
        'Date',
        sql.Date,
        dto.date || null,
      );
 
      const result = await request.execute(
        'usp_GetEarlyInEmployees',
      );
 
      return {
        success: true,
        message: 'Early in employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching early in employees:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve early in employees',
      );
    }
  }
 
 
  // =====================================================
  // EARLY OUT EMPLOYEES
  // =====================================================
 
  async getEarlyOutEmployees(
    dto: GetEarlyOutEmployeesDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const request = pool.request();
 
      request.input(
        'CompanyId',
        sql.Int,
        dto.companyId,
      );
 
      request.input(
        'FromDate',
        sql.Date,
        dto.date || null,
      );
 
      const result = await request.execute(
        'USP_GetEarlyOutEmployees',
      );
 
      return {
        success: true,
        message: 'Early out employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching early out employees:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve early out employees',
      );
    }
  }
 
  // =====================================================
  // YET TO LOGIN EMPLOYEES
  // =====================================================
 
  // =====================================================
  // YET TO LOGIN EMPLOYEES
  // =====================================================
 
  async getYetToLoginEmployees(
    dto: GetYetToLoginEmployeesDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const request = pool.request();
 
      request.input(
        'CompanyID',
        sql.Int,
        dto.companyId,
      );
 
      request.input(
        'AttendanceDate',
        sql.Date,
        dto.attendanceDate || null,
      );
 
      const result = await request.execute(
        'USP_GetYetToLoginEmployees',
      );
 
      return {
        success: true,
        message: 'Yet to login employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching yet to login employees:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve yet to login employees',
      );
    }
  }
 
  // =====================================================
  // LOGGED IN EMPLOYEES
  // =====================================================
 
  async getLoggedInEmployees(
    dto: GetLoggedInEmployeesDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const request = pool.request();
 
      request.input(
        'CompanyID',
        sql.Int,
        dto.companyId,
      );
 
      request.input(
        'AttendanceDate',
        sql.Date,
        dto.attendanceDate || null,
      );
 
      const result = await request.execute(
        'USP_GetLoggedInEmployees',
      );
 
      return {
        success: true,
        message: 'Logged in employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching logged in employees:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve logged in employees',
      );
    }
  }
 
  // =====================================================
  // AVERAGE OT WORK HOURS
  // =====================================================
 
  async getAverageOtWorkHours(
    dto: GetAverageOtWorkHoursDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const request = pool.request();
 
      request.input(
        'CompanyID',
        sql.Int,
        dto.companyId,
      );
 
      request.input(
        'ToDate',
        sql.Date,
        dto.toDate || null,
      );
 
      const result = await request.execute(
        'USP_GetAverageOtWorkHours',
      );
 
      return {
        success: true,
        message: 'Average OT work hours retrieved successfully',
        data: result.recordsets,
      };
    } catch (error) {
      console.error(
        'Error fetching average OT work hours:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve average OT work hours',
      );
    }
  }
 
 
  // =====================================================
  // ATTENDANCE DASHBOARD OVERVIEW
  // =====================================================
 
  async getAttendanceDashboardOverview(
    dto: GetAttendanceDashboardOverviewDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input(
          'CompanyID',
          sql.Int,
          dto.companyId,
        )
        .input(
          'ToDate',
          sql.Date,
          dto.toDate || null,
        )
        .execute(
          'USP_GetAttendanceDashboardOverview',
        );
 
      return {
        success: true,
        message: 'Attendance dashboard overview retrieved successfully',
        data: {
          attendanceOverview: result.recordsets?.[0] || [],
          punchModeDistribution: result.recordsets?.[1] || [],
        },
      };
    } catch (error) {
      console.error(
        'Error fetching attendance dashboard overview:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve attendance dashboard overview',
      );
    }
  }
 
 
  // =====================================================
  // LATE IN / EARLY OUT GRAPH
  // =====================================================
 
  async getLateInEarlyOutGraph(
    dto: GetLateInEarlyOutGraphDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input(
          'CompanyID',
          sql.Int,
          dto.companyId,
        )
        .input(
          'Date',
          sql.Date,
          dto.date || null,
        )
        .execute(
          'USP_GetLateInEarlyOutGraph',
        );
 
      return {
        success: true,
        message: 'Late in and early out graph retrieved successfully',
        data: {
          lateIn: result.recordsets?.[0] || [],
          earlyOut: result.recordsets?.[1] || [],
        },
      };
    } catch (error) {
      console.error(
        'Error fetching late in and early out graph:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve late in and early out graph',
      );
    }
  }
 
 
 
  async getMissedPunchEmployees(
    dto: GetMissedPunchEmployeesDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input(
          'FromDate',
          sql.Date,
          dto.fromDate,
        )
        .input(
          'ToDate',
          sql.Date,
          dto.toDate,
        )
        .input(
          'CompanyId',
          sql.Int,
          dto.companyId,
        )
        .execute(
          'usp_GetMissedPunchEmployees',
        );
 
      return {
        success: true,
        message: 'Missed punch employees retrieved successfully',
        data: result.recordset || [],
      };
    } catch (error) {
      console.error(
        'Error fetching missed punch employees:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to retrieve missed punch employees',
      );
    }
  }
 
  async getProcessHistory(
    companyId: number,
    dto: ProcessHistoryDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input(
          'FromDate',
          sql.Date,
          dto.fromDate ? new Date(dto.fromDate) : null,
        )
        .input(
          'ToDate',
          sql.Date,
          dto.toDate ? new Date(dto.toDate) : null,
        )
        .execute('USP_GetProcessHistory');
 
      return (result.recordset ?? []).map((record) => ({
        ...record,
        FromDate: record.FromDate
          ? record.FromDate.toISOString().split('T')[0]
          : record.FromDate,
        ToDate: record.ToDate
          ? record.ToDate.toISOString().split('T')[0]
          : record.ToDate,
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch process history',
      );
    }
  }
 
 
  async getAttendanceProcessingDashboard(
    companyId: number,
    dto: AttendanceProcessingDashboardDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input(
          'FromDate',
          sql.Date,
          dto.fromDate || null,
        )
        .input(
          'ToDate',
          sql.Date,
          dto.toDate || null,
        )
        .execute('USP_GetAttendanceProcessingDashboard');
 
      return result.recordset ?? [];
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch attendance processing dashboard',
      );
    }
  }
}
