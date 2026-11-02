import { Injectable, InternalServerErrorException,BadRequestException, NotFoundException } from '@nestjs/common';

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
import { EmployeeMonthlyAttendanceDetailsDto } from './dto/employee-monthly-attendance-details.dto';

@Injectable()
export class PunchProcessService {
  constructor(private readonly databaseService: DatabaseService) {}

  /** SQL DATE → YYYY-MM-DD in IST (fixes 18:30Z looking like previous day). */
  private toDateOnlyIST(value: unknown): string | null {
    if (value == null || value === '') return null;
    const d = value instanceof Date ? value : new Date(value as string);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  }

  //==========================================================
  // Attendance Dashboard Counts
  //==========================================================

  async getAttendanceDashboardCounts(companyId: number) {
  try {
    const pool = await this.databaseService.connect();

    const todayResult = await pool
      .request()
      .input('CompanyID', companyId)
      .input('Date', null)
      .execute('usp_GetAttendanceDashboardCounts');

    const yesterdayResult = await pool
      .request()
      .input('CompanyID', companyId)
      .input('Date', new Date(Date.now() - 24 * 60 * 60 * 1000))
      .execute('usp_GetAttendanceDashboardCounts');

    const latestPunchResult = await pool
      .request()
      .input('CompanyID', sql.Int, companyId)
      .query(`
        SELECT MAX(RP.PunchTimestamp) AS LatestPunchIntegratedAt
        FROM dbo.RawPunches RP WITH (NOLOCK)
        INNER JOIN dbo.Employee E WITH (NOLOCK)
          ON LTRIM(RTRIM(E.EmployeeID)) = LTRIM(RTRIM(RP.EmployeeID))
        WHERE E.CompanyID = @CompanyID
          AND ISNULL(E.Deleted, 0) = 0
      `);

    const today = todayResult.recordset?.[0] ?? {};
    const yesterday = yesterdayResult.recordset?.[0] ?? {};
    const latestPunchIntegratedAt = latestPunchResult.recordset?.[0]?.LatestPunchIntegratedAt ?? null;
    

    return {
      today: {
        ...today,
        LatestPunchIntegratedAt: latestPunchIntegratedAt,
        SelectedDate:
          this.toDateOnlyIST(today.SelectedDate) ??
          today.SelectedDate,
      },
      yesterday: {
        ...yesterday,
        LatestPunchIntegratedAt: latestPunchIntegratedAt,
        SelectedDate:
          this.toDateOnlyIST(yesterday.SelectedDate) ??
          yesterday.SelectedDate,
      },
    };
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

  async getYesterdayPresentCount(companyId: number, dto: GetYesterdayPresentCountDto) {
  try {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('CompanyID', companyId)
      .input('Date', dto.date ?? null)
      .execute('USP_GetYesterdayPresentEmployees');

    const record = result.recordset?.[0] ?? {};

    return {
      ...record,
      AttendanceDate:
        this.toDateOnlyIST(record.AttendanceDate) ??
        record.AttendanceDate,
    };
  } catch (error) {
    console.error('Error while fetching yesterday present count:', error);

    throw new InternalServerErrorException(
      'Unable to fetch yesterday present count.',
    );
  }
}

async getYesterdayPresentEmployees(companyId: number, dto: GetYesterdayPresentCountDto) {
  try {
    const pool = await this.databaseService.connect();
    const result = await pool
      .request()
      .input('CompanyID', sql.Int, companyId)
      .input('Date', sql.Date, dto.date ? new Date(`${dto.date}T00:00:00`) : null)
      .execute('USP_GetYesterdayPresentEmployees');

    return (result.recordset ?? []).map((record) => ({
      ...record,
      AttendanceDate: this.toDateOnlyIST(record.AttendanceDate) ?? record.AttendanceDate,
    }));
  } catch (error) {
    console.error('Error while fetching yesterday present employees:', error);
    throw new InternalServerErrorException('Unable to fetch yesterday present employees.');
  }
}

  // =====================================================
  // YESTERDAY ABSENT EMPLOYEES
  // =====================================================

  async getYesterdayAbsentEmployees(companyId: number, dto: GetYesterdayAbsentEmployeesDto) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      request.input('CompanyId', sql.Int, companyId);
      request.input('AttendanceDate', sql.Date, dto.attendanceDate || null);

      const result = await request.execute('usp_GetYesterdayAbsentEmployees');

      return {
        success: true,
        message: 'Absent employees retrieved successfully',
        data: result.recordset,
      }; 
    } catch (error) {
      console.error('Error fetching yesterday absent employees:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve yesterday absent employees',
      );
    }
  }

  // =====================================================
  // ON LEAVE EMPLOYEES
  // =====================================================

  async getOnLeaveEmployees(companyId: number, dto: GetOnLeaveEmployeesDto) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      request.input('CompanyId', sql.Int, companyId);
      request.input('FromDate', sql.Date, dto.fromDate || null);

      const result = await request.execute('USP_GetOnLeaveEmployees');

      return {
        success: true,
        message: 'On leave employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching on leave employees:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve on leave employees',
      );
    }
  }

  // =====================================================
  // LATE IN EMPLOYEES
  // =====================================================

  async getLateInEmployees(companyId: number, dto: GetLateInEmployeesDto) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      request.input('CompanyID', sql.Int, companyId);
      request.input(
        'Date',
        sql.Date,
        dto.date ? new Date(`${dto.date}T00:00:00`) : null,
      );

      const result = await request.execute('USP_GetLateInEmployees');
      console.log('LATE IN PARAMS:', dto, 'ROWS:', result.recordset?.length);
      return {
        success: true,
        message: 'Late in employees retrieved successfully',
        data: result.recordset,
      };
      
    } catch (error) {
      console.error('Error fetching late in employees:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve late in employees',
      );
    }
  }

  // =====================================================
  // EARLY IN EMPLOYEES
  // =====================================================

  async getEarlyInEmployees(companyId: number, dto: GetEarlyInEmployeesDto) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      request.input('CompanyID', sql.Int, companyId);
      request.input('Date', sql.Date, dto.date || null);

      const result = await request.execute('usp_GetEarlyInEmployees');

      return {
        success: true,
        message: 'Early in employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching early in employees:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve early in employees',
      );
    }
  }

  // =====================================================
  // EARLY OUT EMPLOYEES
  // =====================================================

  async getEarlyOutEmployees(companyId: number, dto: GetEarlyOutEmployeesDto) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      request.input('CompanyId', sql.Int, companyId);
      request.input(
        'FromDate',
        sql.Date,
        dto.date ? new Date(`${dto.date}T00:00:00`) : null,
      );

      const result = await request.execute('USP_GetEarlyOutEmployees');

      return {
        success: true,
        message: 'Early out employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching early out employees:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve early out employees',
      );
    }
  }

  // =====================================================
  // YET TO LOGIN EMPLOYEES
  // =====================================================

  async getYetToLoginEmployees(

  companyId: number,

  dto: GetYetToLoginEmployeesDto,

) {

  try {

    const pool = await this.databaseService.connect();
 
    const request = pool.request();
 
    request.input('CompanyID', sql.Int, companyId);

    request.input(

      'AttendanceDate',

      sql.Date,

      dto.attendanceDate || null,

    );
 
    const result = await request.execute(

      'USP_GetYetToLoginEmployees',

    );
 
    console.log(

      'Result-set row counts:',

      Array.isArray(result.recordsets)

        ? result.recordsets.map((rs) => rs.length)

        : [],

    );
 
    return {

      success: true,

      message: 'Yet to login employees retrieved successfully',

      data: result.recordset,

    };

  } catch (error) {

    console.error('Error fetching yet to login employees:', error);
 
    throw new InternalServerErrorException(

      'Failed to retrieve yet to login employees',

    );

  }

}
 
  // =====================================================
  // LOGGED IN EMPLOYEES
  // =====================================================

  async getLoggedInEmployees(companyId: number, dto: GetLoggedInEmployeesDto) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      request.input('CompanyID', sql.Int, companyId);
      request.input(
        'AttendanceDate',
        sql.Date,
        dto.attendanceDate
          ? new Date(`${dto.attendanceDate}T00:00:00`)
          : null,
      );

      const result = await request.execute('USP_GetLoggedInEmployees');

      return {
        success: true,
        message: 'Logged in employees retrieved successfully',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching logged in employees:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve logged in employees',
      );
    }
  }

  // =====================================================
  // AVERAGE OT WORK HOURS
  // =====================================================
async getAverageOtWorkHours(companyId: number) {
  try {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('CompanyID', sql.Int, companyId)
      .execute('USP_GetAverageOtWorkHours');

    const workHours = (result.recordsets?.[0] || []).map(
      (row: Record<string, unknown>) => ({
        ...row,
        Date: this.toDateOnlyIST(row.Date) ?? row.Date,
      }),
    );

    const otHours = (result.recordsets?.[1] || []).map(
      (row: Record<string, unknown>) => ({
        ...row,
        Date: this.toDateOnlyIST(row.Date) ?? row.Date,
      }),
    );

    return {
      success: true,
      message: 'Average OT work hours retrieved successfully',
      data: [workHours, otHours],
    };
  } catch (error) {
    console.error('AVERAGE OT WORK HOURS ERROR:', error);

    throw new InternalServerErrorException(
      'Unable to fetch average OT work hours.',
    );
  }
}
  // =====================================================
  // LATE IN / EARLY OUT GRAPH
  // =====================================================

  async getLateInEarlyOutGraph(companyId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('Date', sql.Date, null)
        .execute('USP_GetLateInEarlyOutGraph');

      return {
        success: true,
        message: 'Late in and early out graph retrieved successfully',
        data: {
          lateIn: result.recordsets?.[0] || [],
          earlyOut: result.recordsets?.[1] || [],
        },
      };
    } catch (error) {
      console.error('Error fetching late in and early out graph:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve late in and early out graph',
      );
    }
  }

  // =====================================================
  // MISSED PUNCH EMPLOYEES
  // =====================================================

  async getMissedPunchEmployees(companyId: number, dto: GetMissedPunchEmployeesDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromDate', sql.Date, dto.fromDate)
        .input('ToDate', sql.Date, dto.toDate)
        .input('CompanyId', sql.Int, companyId)
        .execute('usp_GetMissedPunchEmployees');

      return {
  success: true,
  message: 'Missed punch employees retrieved successfully',
  data: (result.recordset || []).map((row: any) => ({
    ...row,
    'Punch Date': this.toDateOnlyIST(row['Punch Date']) ?? row['Punch Date'],
  })),
};
    } catch (error) {
      console.error('Error fetching missed punch employees:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve missed punch employees',
      );
    }
  }

  // =====================================================
  // PROCESS HISTORY
  // =====================================================

   async getProcessHistory(companyId: number, dto: ProcessHistoryDto) {
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

      // The SP returns an error row instead of throwing, so catch it here
      const first = result.recordset?.[0];
      if (first?.StatusCode === 500) {
        throw new InternalServerErrorException(
          first.StatusMessage || 'Failed to fetch process history',
        );
      }

      return (result.recordset ?? []).map((record) => ({
        ...record,
        FromDate: this.toDateOnlyIST(record.FromDate) ?? record.FromDate,
        ToDate: this.toDateOnlyIST(record.ToDate) ?? record.ToDate,
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch process history',
      );
    }
  }
  // =====================================================
  // ATTENDANCE PROCESSING DASHBOARD
  // =====================================================

  async getAttendanceProcessingDashboard(
    companyId: number,
    dto: AttendanceProcessingDashboardDto,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('FromDate', sql.Date, dto.fromDate || null)
        .input('ToDate', sql.Date, dto.toDate || null)
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

  // =====================================================
  // ATTENDANCE DASHBOARD OVERVIEW  (FIXED DATE FORMAT)
  // =====================================================

  async getAttendanceDashboardOverview(companyId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('ToDate', sql.Date, null)
        .execute('USP_GetAttendanceDashboardOverview');

      const attendanceOverview = (result.recordsets?.[0] || []).map(
        (row: Record<string, unknown>) => ({
          ...row,
          Date: this.toDateOnlyIST(row.Date ?? row.date) ?? row.Date,
        }),
      );

      return {
        success: true,
        message: 'Attendance dashboard overview retrieved successfully',
        data: {
          attendanceOverview,
          punchModeDistribution: result.recordsets?.[1] || [],
        },
      };
    } catch (error) {
      console.error('Error fetching attendance dashboard overview:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve attendance dashboard overview',
      );
    }
  }
//===================================
// employeerawpunches 
//===================================

  async getEmployeeRawPunches(
    employeeId: string,
    date?: string,
  ) {
    const pool = await this.databaseService.connect();
 
    const result = await pool
      .request()
      .input(
        'EmployeeID',
        sql.VarChar(25),
        employeeId,
      )
      .input(
        'Date',
        sql.Date,
        date
          ? new Date(date)
          : null,
      )
      .execute('USP_GetEmployeeRawPunches');
 
    return result.recordset;
  }
 
//=============================================
//holiday and week off 
//============================================
async getHolidayWeekOffEmployees(
  companyId: number,
  date?: string,
  type?: number,
) {
  const pool = await this.databaseService.connect();

  const result = await pool
    .request()
    .input('CompanyID', sql.Int, companyId)
    .input('Date', sql.Date, date ?? null)
    .input('Type', sql.Int, type ?? null)
    .execute('USP_GetHolidayWeekOffEmployees');

  const first = result.recordset?.[0];

  if (first?.StatusCode === 400) {
    throw new BadRequestException(
      first.StatusMessage || 'Invalid request',
    );
  }

  if (first?.StatusCode === 500) {
    throw new InternalServerErrorException(
      first.StatusMessage ||
        'Failed to retrieve holiday/week-off details',
    );
  }

  const records = result.recordset ?? [];

  return records.map((row: any) => {
    const attendanceDate = row['Date'];

    if (!attendanceDate) {
      return row;
    }

    let formattedDate: string;

    if (
      typeof attendanceDate === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(attendanceDate)
    ) {
      formattedDate = attendanceDate;
    } else {
      formattedDate = new Date(attendanceDate).toLocaleDateString(
        'en-CA',
        {
          timeZone: 'Asia/Kolkata',
        },
      );
    }

    return {
      ...row,
      Date: formattedDate,
    };
  });
}

//=====================================================
// Employee dashboard
//=====================================================


async getEmployeeDashboardCounts(
  companyId: number,
  fromDate?: string,
  toDate?: string,
) {
  const pool = await this.databaseService.connect();

  const result = await pool
    .request()
    .input('CompanyID', sql.Int, companyId)
    .input(
      'FromDate',
      sql.Date,
      fromDate ? new Date(`${fromDate}T00:00:00`) : null,
    )
    .input(
      'ToDate',
      sql.Date,
      toDate ? new Date(`${toDate}T00:00:00`) : null,
    )
    .execute('USP_GetEmployeeDashboardCounts');

  const first = result.recordset?.[0];

  if (first?.ErrorMessage) {
    throw new InternalServerErrorException(first.ErrorMessage);
  }

  return first ?? {};
}

//=================================================
// Employee dashbaord details
//================================================

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
    .input(
      'FromDate',
      sql.Date,
      fromDate ? new Date(`${fromDate}T00:00:00`) : null,
    )
    .input(
      'ToDate',
      sql.Date,
      toDate ? new Date(`${toDate}T00:00:00`) : null,
    )
    .execute('USP_GetEmployeeDashboardDetails');

  const first = result.recordset?.[0];

  if (first?.StatusCode === 400) {
    throw new BadRequestException(
      first.StatusMessage || 'Invalid insight ID',
    );
  }

  if (first?.StatusCode === 500) {
    throw new InternalServerErrorException(
      first.StatusMessage || 'Failed to retrieve employee dashboard details',
    );
  }

  return result.recordset ?? [];
}

//=================================================
// Attendace overview 
//===============================================
async getEmployeeAttendanceOverview(
  employeeId: string,
  companyId: number,
  year: number,
  month: number,
) {
  try {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', sql.VarChar(50), employeeId)
      .input('CompanyID', sql.Int, companyId)
      .input('Year', sql.Int, year)
      .input('Month', sql.Int, month)
      .execute('dbo.usp_GetEmployeeAttendanceOverview');

    return {
      success: true,
      message: 'Employee attendance overview retrieved successfully',
      data: result.recordset ?? [],
    };
  } catch (error) {
    console.error('Error fetching employee attendance overview:', error);

    throw new InternalServerErrorException(
      'Failed to retrieve employee attendance overview',
    );
  }
}

//==================================================
// Attendance overview Drop down
//================================================
async getEmployeesByCompany(
  companyId: number,
  branchId?: number,
) {
  const pool = await this.databaseService.connect();
 
  const request = pool
    .request()
    .input('CompanyId', sql.Int, companyId)
    .input(
      'BranchId',
      sql.Int,
      branchId ?? null,
    );
 
  const result = await request.execute(
    'dbo.USP_GetEmployeesByCompany',
  );
 
  const firstResultSet = result.recordsets?.[0] ?? [];
  const secondResultSet = result.recordsets?.[1] ?? [];
 
  // The SP returns validation errors in its first result set.
  const status = firstResultSet[0] as
    | { StatusCode?: number; Message?: string }
    | undefined;
 
  if (status?.StatusCode) {
    if (status.StatusCode === 400) {
      throw new BadRequestException(status.Message);
    }
 
    if (status.StatusCode === 404) {
      throw new NotFoundException(status.Message);
    }
 
    throw new InternalServerErrorException(
      status.Message ?? 'Failed to fetch employees.',
    );
  }
 
  return {
    employees: firstResultSet,
    salaryStructures: secondResultSet,
  };
}
//====================================================
//monthly overview
//===================================================
async getEmployeeMonthlyAttendanceDetails(
  companyId: number,
  dto: EmployeeMonthlyAttendanceDetailsDto,
) {
  try {
    const pool = await this.databaseService.connect();
    const request = pool.request();
 
    request.input('EmployeeID', sql.VarChar(25), dto.employeeId);
    request.input('CompanyID', sql.Int, companyId);
    request.input('Month', sql.Int, dto.month ?? null);
    request.input('Year', sql.Int, dto.year ?? null);
    request.input('ClassificationID', sql.Int, null);
 
    const result = await request.execute(
      'dbo.USP_EmployeeMonthlyAttendanceDetails',
    );
 
    return {
      success: true,
      message: 'Employee monthly attendance summary retrieved successfully',
      data: result.recordset ?? [],
    };
  } catch (error) {
    console.error(
      'Error fetching employee monthly attendance summary:',
      error,
    );
 
    throw new InternalServerErrorException(
      'Failed to retrieve employee monthly attendance summary',
    );
  }
}
//=====================================================
// Attendance Policy and Shift Dropdown
//=====================================================
 
async getAttendancePolicyAndShift(companyId: number) {
  try {
    const pool = await this.databaseService.connect();
 
    const result = await pool
      .request()
      .input('CompanyId', sql.Int, companyId)
      .execute('USP_GetAttendancePolicyAndShift');
 
    return {
      success: true,
      message: 'Attendance policies and shifts retrieved successfully',
      data: {
        attendancePolicies: result.recordsets?.[0] ?? [],
        shifts: result.recordsets?.[1] ?? [],
      },
    };
  } catch (error) {
    console.error('Error fetching attendance policies and shifts:', error);
 
    throw new InternalServerErrorException(
      'Failed to retrieve attendance policies and shifts',
    );
  }
}
 
}
