import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';

import { DatabaseService } from '../database/database.service';
import { MonthlyLeaveCalendarDto } from './dto/monthly-leave-calendar.dto';
import { MissedPunchEmployeesDto } from './dto/missed-punch-employees.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1. Monthly Leave Calendar
  async getMonthlyLeaveCalendar(
    dto: MonthlyLeaveCalendarDto,
    companyId: number,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('Year', sql.Int, dto.year ?? null)
      .input('Month', sql.Int, dto.month ?? null)
      .input('CompanyId', sql.Int, companyId)
      .input('BranchId', sql.Int, dto.branchId ?? null)
      .execute('usp_GetMonthlyLeaveCalendar');

    return result.recordset;
  }

  // 2. Pending Leave Requests
  async getPendingLeaveRequests(approverId: string) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('ApproverId', sql.VarChar(50), approverId)
      .execute('USP_GetPendingLeaveRequests');

    return result.recordset;
  }

  // 3. Missed Punch Employees
  async getMissedPunchEmployees(
    dto: MissedPunchEmployeesDto,
    companyId: number,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('FromDate', sql.Date, dto.fromDate ?? null)
      .input('ToDate', sql.Date, dto.toDate ?? null)
      .input('CompanyId', sql.Int, companyId)
      .execute('usp_GetMissedPunchEmployees');

    return result.recordset;
  }

  // 4. Employee Punch Dashboard
  async getEmployeePunchDashboard(
    employeeId: string,
    selectedDate?: string,
    viewType?: string,
  ) {
    const pool = await this.databaseService.connect();

    const request = pool.request();

    request.input('EmployeeID', sql.VarChar(25), employeeId);

    request.input(
      'SelectedDate',
      sql.Date,
      selectedDate ? new Date(selectedDate) : null,
    );

    request.input('ViewType', sql.VarChar(20), viewType || 'CustomMonth');

    const result = await request.execute('USP_GetEmployeePunchDashboard');

    return {
      employeeProfile: result.recordsets[0] || [],

      attendanceSummary: result.recordsets[1] || [],

      punchRecords: result.recordsets[2] || [],
    };
  }

  // 5. Employee Raw Punches
  async getEmployeeRawPunches(employeeId: string, date?: string) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId)
      .input('Date', sql.Date, date ? new Date(date) : null)
      .execute('USP_GetEmployeeRawPunches');

    return result.recordset;
  }

  // 6. Employee Dashboard Counts
  async getEmployeeDashboardCounts(
    companyId: number,
    fromDate?: string,
    toDate?: string,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('CompanyID', sql.Int, companyId)
      .input('FromDate', sql.Date, fromDate ? new Date(fromDate) : null)
      .input('ToDate', sql.Date, toDate ? new Date(toDate) : null)
      .execute('USP_GetEmployeeDashboardCounts');

    return result.recordset;
  }

  // 7. Employee Monthly Attendance Details
  async getEmployeeMonthlyAttendanceDetails(
    employeeId: number,
    companyId: number,
    month: number | undefined,
    year: number | undefined,
    classificationId: number | undefined,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', sql.Int, employeeId)
      .input('CompanyID', sql.Int, companyId)
      .input('Month', sql.Int, month ?? null)
      .input('Year', sql.Int, year ?? null)
      .input('ClassificationID', sql.Int, classificationId ?? null)
      .execute('USP_EmployeeMonthlyAttendanceDetails');

    return result.recordset;
  }

  // 8. Employee Attendance Overview
  async getEmployeeAttendanceOverview(
    employeeId: string,
    companyId: number,
    year: number,
    month: number,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', sql.VarChar(50), employeeId)
      .input('CompanyID', sql.Int, companyId)
      .input('Year', sql.Int, year)
      .input('Month', sql.Int, month)
      .execute('usp_GetEmployeeAttendanceOverview');

    return result.recordsets[0] || [];
  }

  // 9. Employee Dashboard Details
  async getEmployeeDashboardDetails(
    insightId: number,
    companyId: number,
    fromDate?: string,
    toDate?: string,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('InsightID', sql.Int, insightId)
      .input('CompanyID', sql.Int, companyId)
      .input('FromDate', sql.Date, fromDate ? new Date(fromDate) : null)
      .input('ToDate', sql.Date, toDate ? new Date(toDate) : null)
      .execute('USP_GetEmployeeDashboardDetails');

    return result.recordset;
  }

  // 10.Reporting Manager Employee List
  async getReportingManagerEmployeeList(userId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('UserID', sql.Int, userId)
        .execute('USP_GetReportingManagerEmployeeList');

      return result.recordset;
    } catch (error) {
      console.error('Error in getReportingManagerEmployeeList:', error);

      throw error;
    }
  }
}
