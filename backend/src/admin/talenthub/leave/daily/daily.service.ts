import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { SaveLeaveFormDto } from './dto/save-leave-form.dto';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { ReprocessDto } from './dto/reprocess.dto';
import { ImportDailyDto } from './dto/import-daily.dto';
import { GetMonthlyLeaveCalendarDto } from './dto/get-monthly-leave-calendar.dto';
import * as sql from 'mssql';
import { BulkLeaveRequestDto } from './dto/bulk-leave-request.dto';
import * as ExcelJS from 'exceljs';


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
      .input('Year', sql.Int, dto.year ?? null)
      .input('Month', sql.Int, dto.month ?? null)
      .input('CompanyId', sql.Int, companyId)
      .input('BranchId', sql.Int, dto.branchId ?? null)
      .input('EmploymentStatusId', sql.Int, dto.employmentStatusId ?? null)
      .input('DesignationId', sql.Int, dto.designationId ?? null)
      .input('PolicyId', sql.Int, dto.policyId ?? null)
      .input('LeaveTypeId', sql.Int, dto.leaveTypeId ?? null)
      .input('StructureId', sql.Int, dto.structureId ?? null)
      .input('AttendanceStatusId', sql.Int, dto.attendanceStatusId ?? null)
      .execute('usp_GetMonthlyLeaveCalendar');
 
    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching monthly leave calendar:',
      error,
    );
 
    throw new InternalServerErrorException(
      'Unable to fetch monthly leave calendar.',
    );
  }
  // Approval / Rejection
  async hierarchicalLeaveAction(
    approvalId: number,
    approverEmployeeId: string,
    actionStatusId: number,
    remarks?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('ApprovalId', approvalId)
        .input('ApproverEmployeeId', approverEmployeeId)
        .input('ActionStatusId', actionStatusId)
        .input('Remarks', remarks ?? null)
        .execute('USP_HierarchicalLeaveAction');

      return result.recordset;
    } catch (error) {
      console.error('Error in hierarchicalLeaveAction:', error);
      throw error;
    }
  }
}
  //Employee leave balance
  //Actual Sp is used here
 
  async employeeLeaveBalance(employeeId: string) {
  try {
    const pool = await this.databaseService.connect();
 
    const result = await pool
      .request()
      .input('EmployeeId', sql.VarChar(25), employeeId)
      .execute('USP_EmployeeLeaveBalance');
 
    return {
      success: true,
      message: 'Employee leave balance retrieved successfully.',
      data: result.recordset,
    };
  } catch (error) {
    console.error('Employee leave balance error:', error);
    throw new InternalServerErrorException(
      'Failed to retrieve employee leave balance.',
    );
  }
}
 
// Dropdowns
// Actual sp is used here
 
async getCompanyDropdownData(companyId: number) {

  try {

    const pool = await this.databaseService.connect();
 
    const result = await pool

      .request()

      .input('CompanyID', sql.Int, companyId)

      .execute('USP_GetCompanyDropdownData');
 
    const sets = result.recordsets as Record<string, any>[][];
 
    // The SP returns 10 result sets. Mapping is positional, so fail loudly

    // if the DB team changes the number of SELECTs.

    if (sets.length !== 10) {

      throw new Error(

        `USP_GetCompanyDropdownData returned ${sets.length} result sets, expected 10.`,

      );

    }
 
    return {

      success: true,

      message: 'Company dropdown data retrieved successfully.',

      data: {

        branches: sets[0],

        salaryStructures: sets[1],

        leaveTypes: sets[2],

        leaveTypeCodes: sets[3],

        presentStatus: sets[4],

        attendanceStatuses: sets[5],

        designations: sets[6],

        employeeStatuses: sets[7],

        activeLeavePolicies: sets[8],

        monthYear: sets[9],

      },

    };

  } catch (error) {

    console.error('Company dropdown data error:', error);
 
    throw new InternalServerErrorException(

      'Failed to retrieve company dropdown data.',

    );

  }

}
 


 
async bulkLeaveRequestSubmission(
  dto: BulkLeaveRequestDto,
  createdBy: number,
) {
  const pool = await this.databaseService.connect();
  const start = Date.now();
 
  const employeeIds = [
    ...new Set(
      (dto.employeeList ?? [])
        .map((id) => String(id).trim())
        .filter(Boolean),
    ),
  ];
 
  // Table-valued parameter: dbo.UT_EmployeeList
  const employeeList = new sql.Table('dbo.UT_EmployeeList');
  employeeList.columns.add('EmployeeID', sql.VarChar(25), {
    nullable: false,
  });
 
  employeeIds.forEach((id) => employeeList.rows.add(id));
 
  try {
    const r = await pool
      .request()
      .input('EmployeeList', employeeList)
      .input('LeaveTypeId', sql.Int, dto.leaveTypeId)
      .input('FromDate', sql.Date, dto.fromDate)
      .input('ToDate', sql.Date, dto.toDate)
      .input('SessionFrom', sql.VarChar(20), dto.sessionFrom ?? null)
      .input('SessionTo', sql.VarChar(20), dto.sessionTo ?? null)
      .input('IsHalfDay', sql.Bit, dto.isHalfDay ?? false)
      .input('Reason', sql.NVarChar(500), dto.reason ?? null)
      .input('DocumentPath', sql.VarChar(500), dto.documentPath ?? null)
      .input('CreatedBy', sql.Int, createdBy)
      .input('IsHRForceApply', sql.Bit, dto.isHRForceApply ?? true)
      .input(
        'IsAttendanceMarking',
        sql.Bit,
        dto.isAttendanceMarking ?? false,
      )
      .input('HalfDayType', sql.TinyInt, dto.halfDayType ?? 1)
      .execute('USP_BulkLeaveRequestSubmission');
 
    const sets = (r.recordsets ?? []) as Record<string, any>[][];
 
    // The SP's own result sets are always the LAST two: [logs, summary].
    // Anything returned before them (e.g. from child SPs or triggers) is ignored.
    // Early SP validation error returns a single set: [{ StatusCode, Message }].
    const summary = sets.length > 0 ? sets[sets.length - 1] ?? [] : [];
    const logs = sets.length > 1 ? sets[sets.length - 2] ?? [] : [];
 
    console.log(
      `[BulkLeave] ${employeeIds.length} employees took ${Date.now() - start} ms`,
    );
 
    return {
      logs: this.normalize(logs),
      summary: this.normalize(summary),
    };
  } catch (err: any) {
    console.error('Bulk leave submit failed', err);
    throw err;
  }
}
 
async bulkLeaveRequestExcel(
  dto: BulkLeaveRequestDto,
  createdBy: number,
): Promise<Buffer> {
  const { summary } = await this.bulkLeaveRequestSubmission(dto, createdBy);
 
  const workbook = new ExcelJS.Workbook();
 
  // Only the database summary result; nothing merged from the DTO, no audit sheet.
  this.addSheet(workbook, 'Bulk Leave Result', summary);
 
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer as ArrayBuffer);
}
 
private formatDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
 
  const date = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  const time = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
 
  // Pure dates show as dates; timestamps retain their time.
  return time === '00:00:00' ? date : `${date} ${time}`;
}
private normalize(rows: Record<string, any>[]) {
  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        value instanceof Date ? this.formatDate(value) : value,
      ]),
    ),
  );
}
 
private addSheet(
  workbook: ExcelJS.Workbook,
  name: string,
  rows: Record<string, any>[],
) {
  // Read column names and values directly from the database result.
  const data = rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        value instanceof Date ? this.formatDate(value) : value,
      ]),
    ),
  );
 
  // Dynamically determine columns from the returned DB fields.
  const keys = [...new Set(data.flatMap((row) => Object.keys(row)))];
 
  const sheet = workbook.addWorksheet(name);
 
  sheet.columns = keys.map((key) => ({
    header: key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (c) => c.toUpperCase()),
    key,
    width: Math.min(
      60,
      Math.max(
        12,
        key.length,
        ...data.map((row) => String(row[key] ?? '').length),
      ),
    ),
  }));
 
  sheet.getRow(1).font = { bold: true };
  sheet.addRows(data);
}





//===================================================================
  //Actual Sp is used here
  //===============================================================
      // Reprocess
  async reprocess(dto: ReprocessDto) {
  const pool = await this.databaseService.connect();
 
  const results: {
    employeeId: string;
    date: string;
    success: boolean;
    message: string | null;
  }[] = [];
 
  for (const item of dto.items) {
    try {
      await pool
        .request()
        .input('AttendanceDate', sql.Date, item.date)
        .input('CompanyID', sql.Int, null)
        .input('EmployeeID', sql.VarChar(50), item.employeeId)
        .execute('dbo.USP_ProcessDailyAttendance');
 
      results.push({
        employeeId: item.employeeId,
        date: item.date,
        success: true,
        message: 'Attendance recalculation procedure executed.',
      });
    } catch (err: any) {
      results.push({
        employeeId: item.employeeId,
        date: item.date,
        success: false,
        message: err?.message ?? 'Attendance recalculation failed.',
      });
    }
  }
 
  return { results };
}



   // leave dropdown
// DailyService
async getLeaveMasterData(companyId: number, employeeId: string) {
  try {
    const pool = await this.databaseService.connect();
 
    const result = await pool
      .request()
      .input('CompanyID', companyId)
      .input('EmployeeID', employeeId)
      .execute('USP_LeaveMasterData');
 
    return {
      success: true,
      message: 'Leave types fetched successfully',
      data: result.recordsets[0] ?? [],
    };
  } catch (error) {
    console.error('Error while fetching leave types:', error);
    throw error;
  }
}
  


  
}
