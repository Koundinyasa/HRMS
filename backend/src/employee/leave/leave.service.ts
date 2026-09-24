import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { HrLeaveRequestDto } from './dto/hr-leave-request.dto';
import * as XLSX from 'xlsx';
import * as sql from 'mssql';
@Injectable()
export class LeaveService {
  constructor(private readonly databaseService: DatabaseService) {}
  // Leave Types
  async getLeaveTypes(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(100), employeeId)
        .execute('USP_LeaveMasterData');
 
      return result.recordsets[0];
    } catch (error) {
      console.error('Error in getLeaveTypes:', error);
      throw error;
    }
  }
 
  // Holiday List
  async getHolidayList() {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request().execute('USP_LeaveMasterData');
      return result.recordsets[1];
    } catch (error) {
      console.error('Error in getHolidayList:', error);
      throw error;
    }
  }
  // Employee Leave Balance
  // Employee Leave Balance
  async getEmployeeLeaveBalance(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeId', employeeId)
        .execute('USP_EmployeeLeaveBalance');
      const records = result.recordset.map((item) => ({
        fields: [
          {
            label: 'Leave Type',
            value: item.LeaveType,
          },
          {
            label: 'Opening Balance',
            value: item.OpeningBalance,
          },
          {
            label: 'Accrued',
            value: item.Accrued,
          },
          {
            label: 'Availed',
            value: item.Availed,
          },
          {
            label: 'Encashed',
            value: item.Encashed,
          },
          {
            label: 'Closing Balance',
            value: item.ClosingBalance,
          },
          {
            label: 'Leave Year',
            value: item.LeaveYear,
          },
          {
            label: 'Last Updated',
            value: item.ModifiedDateTime,
          },
        ],
      }));
      return {
        sections: [
          {
            title: 'Leave Balance',
            records,
          },
        ],
      };
    } catch (error) {
      console.error('Error in getEmployeeLeaveBalance:', error);
      throw error;
    }
  }
  // Upload Holiday Excel
  async uploadHolidayFile(file: Express.Multer.File) {
    try {
      const workbook = XLSX.read(file.buffer, {
        type: 'buffer',
      });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const holidays: any[] = XLSX.utils.sheet_to_json(sheet);
      const pool = await this.databaseService.connect();
      let insertedCount = 0;
      for (const holiday of holidays) {
        await pool
          .request()
          .input('HolidayDate', holiday.HolidayDate)
          .input('HolidayName', holiday.HolidayName)
          .input('HolidayType', holiday.HolidayType)
          .input('StateCode', holiday.StateCode)
          .input('LocationId', holiday.LocationId)
          .input('HolidayYear', holiday.HolidayYear)
          .input('IsOptional', holiday.IsOptional)
          .input('IsActive', holiday.IsActive).query(`
            INSERT INTO HolidayMaster
            (
              HolidayDate,
              HolidayName,
              HolidayType,
              StateCode,
              LocationId,
              HolidayYear,
              IsOptional,
              IsActive
            )
            VALUES
            (
              @HolidayDate,
              @HolidayName,
              @HolidayType,
              @StateCode,
              @LocationId,
              @HolidayYear,
              @IsOptional,
              @IsActive
            )
          `);
        insertedCount++;
      }
      return {
        success: true,
        message: 'Holiday Upload Successful',
        recordsInserted: insertedCount,
      };
    } catch (error) {
      console.error('Error in uploadHolidayFile:', error);
      throw error;
    }
  }
  // Leave History
  async getLeaveHistory(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeId', employeeId)
        .execute('USP_GetLeaveHistory');
      const records = result.recordset.map((item) => ({
        fields: [
          {
            label: 'Leave Id',
            value: item.LeaveId,
          },
          {
            label: 'Leave Type',
            value: item.LeaveTypeName,
          },
          {
            label: 'From Date',
            value: item.FromDate,
          },
          {
            label: 'To Date',
            value: item.ToDate,
          },
          {
            label: 'Days',
            value: item.NoOfDays,
          },
          {
            label: 'Applied Date',
            value: item.AppliedDate,
          },
          {
            label: 'Reason',
            value: item.Reason,
          },
          {
            label: 'Status',
            value: item.Status,
          },
          {
            label: 'Approved By',
            value: item.ActionBy,
          },
          {
            label: 'Action',
            value: item.Action,
          },
        ],
      }));
      return {
        sections: [
          {
            title: 'Leave History',
            records,
          },
        ],
      };
    } catch (error) {
      console.error('Error in getLeaveHistory:', error);
      throw error;
    }
  }
  // Leave Status
  async getLeaveStatus(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('EmployeeId', sql.VarChar(25), employeeId)
        .execute('USP_GetLeaveStatus');
 
      console.log('🔥 Leave Status Recordset:', result.recordset);
      console.log('🔥 Leave Status Recordsets:', result.recordsets);
 
      // SQL FOR JSON result
      const row = result.recordset?.[0];
 
      if (!row) {
        return {
          LeaveApplications: [],
        };
      }
 
      // Find the JSON column dynamically
      const jsonColumn = Object.keys(row)[0];
      const jsonValue = row[jsonColumn];
 
      if (typeof jsonValue === 'string') {
        return JSON.parse(jsonValue);
      }
 
      return jsonValue;
    } catch (error) {
      console.error('Error in getLeaveStatus:', error);
      throw error;
    }
  }
 
  // Apply Leave
  async applyLeave(
    employeeId: string,
    createdBy: number,
    leaveTypeId: number,
    fromDate: string,
    toDate: string,
    sessionFrom?: string,
    sessionTo?: string,
    isHalfDay?: boolean,
    reason?: string,
    documentPath?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();
      console.log('========== APPLY LEAVE ==========');
      console.log({
        employeeId,
        createdBy,
        leaveTypeId,
        fromDate,
        toDate,
        sessionFrom,
        sessionTo,
        isHalfDay,
        reason,
        documentPath,
      });
      console.log('================================');
      const result = await pool
        .request()
        .input('EmployeeId', sql.VarChar(25), employeeId)
        .input('LeaveTypeId', sql.Int, Number(leaveTypeId))
        .input('FromDate', sql.Date, fromDate)
        .input('ToDate', sql.Date, toDate)
        .input('SessionFrom', sql.VarChar(20), sessionFrom || null)
        .input('SessionTo', sql.VarChar(20), sessionTo || null)
        .input('IsHalfDay', sql.Bit, isHalfDay ?? false)
        .input('Reason', sql.NVarChar(500), reason || null)
        .input('DocumentPath', sql.NVarChar(500), documentPath || null)
        .input('CreatedBy', sql.Int, createdBy)
        .execute('USP_LeaveRequestSubmission');
      // USP_LeaveRequestSubmission fires notification EXEC calls (each
      // returning their own result set) BEFORE its real final SELECT
      // {StatusCode, Message, LeaveApplicationId}. "First result set" is no
      // longer reliably the real answer — the real SELECT is always the
      // LAST thing the procedure runs, regardless of how many
      // notifications fired along the way.
      const allResultSets = result.recordsets as unknown as any[][];
      return allResultSets[allResultSets.length - 1];
    } catch (error) {
      console.error('Error in applyLeave:', error);
      throw error;
    }
  }
  // HR Apply Leave
  // async hrApplyLeave(
  //   employeeId: string,
  //   createdBy: number,
  //   leaveTypeId: number,
  //   fromDate: string,
  //   toDate: string,
  //   sessionFrom?: string,
  //   sessionTo?: string,
  //   isHalfDay?: boolean,
  //   reason?: string,
  //   documentPath?: string,
  //   isHRForceApply?: boolean,
  // ) {
  //   try {
  //     const pool =
  //       await this.databaseService.connect();
  //     console.log('========== HR APPLY LEAVE ==========');
  //     console.log({
  //       employeeId,
  //       createdBy,
  //       leaveTypeId,
  //       fromDate,
  //       toDate,
  //       sessionFrom,
  //       sessionTo,
  //       isHalfDay,
  //       reason,
  //       documentPath,
  //       isHRForceApply,
  //     });
  //     console.log('====================================');
  //     const result =
  //       await pool
  //         .request()
  //         .input(
  //           'EmployeeId',
  //           sql.VarChar(100),
  //           employeeId,
  //         )
  //         .input(
  //           'CreatedBy',
  //           sql.VarChar(25),
  //           String(createdBy),
  //         )
  //         .input(
  //           'LeaveTypeId',
  //           sql.Int,
  //           Number(leaveTypeId),
  //         )
  //         .input(
  //           'FromDate',
  //           sql.Date,
  //           fromDate,
  //         )
  //         .input(
  //           'ToDate',
  //           sql.Date,
  //           toDate,
  //         )
  //         .input(
  //           'SessionFrom',
  //           sql.VarChar(20),
  //           sessionFrom || null,
  //         )
  //         .input(
  //           'SessionTo',
  //           sql.VarChar(20),
  //           sessionTo || null,
  //         )
  //         .input(
  //           'IsHalfDay',
  //           sql.Bit,
  //           isHalfDay ?? false,
  //         )
  //         .input(
  //           'Reason',
  //           sql.NVarChar(500),
  //           reason || null,
  //         )
  //         .input(
  //           'DocumentPath',
  //           sql.VarChar(500),
  //           documentPath || null,
  //         )
  //         .input(
  //           'IsHRForceApply',
  //           sql.Bit,
  //           isHRForceApply ?? false,
  //         )
  //         .execute(
  //           'USP_LeaveRequestSubmission',
  //         );
  //     return result.recordset;
  //   } catch (error) {
  //     console.error(
  //       'HR Apply Leave Error:',
  //       error,
  //     );
  //     throw error;
  //   }
  // }
  // HR Apply Leave
  async hrApplyLeave(
    dto: HrLeaveRequestDto,
    createdBy: number,
    documentPath?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const isHRForceApply = dto.isHRForceApply ?? false;
      const isHalfDay = dto.isHalfDay ?? false;
 
      console.log('========== HR APPLY LEAVE ==========');
      console.log({
        employeeId: dto.employeeId,
        createdBy,
        leaveTypeId: dto.leaveTypeId,
        fromDate: dto.fromDate,
        toDate: dto.toDate,
        sessionFrom: dto.sessionFrom,
        sessionTo: dto.sessionTo,
        isHalfDay,
        reason: dto.reason,
        documentPath,
        isHRForceApply,
      });
      console.log('====================================');
 
      const result = await pool
        .request()
        .input('EmployeeId', sql.VarChar(100), dto.employeeId.trim())
        .input('LeaveTypeId', sql.Int, Number(dto.leaveTypeId))
        .input('FromDate', sql.Date, dto.fromDate.trim())
        .input('ToDate', sql.Date, dto.toDate.trim())
        .input('SessionFrom', sql.VarChar(20), dto.sessionFrom?.trim() || null)
        .input('SessionTo', sql.VarChar(20), dto.sessionTo?.trim() || null)
        .input('IsHalfDay', sql.Bit, isHalfDay)
        .input('Reason', sql.NVarChar(500), dto.reason?.trim() || null)
        .input('DocumentPath', sql.VarChar(500), documentPath || null)
        .input('CreatedBy', sql.Int, Number(createdBy))
        .input('IsHRForceApply', sql.Bit, isHRForceApply)
        .execute('USP_LeaveRequestSubmission');
 
      /*
       * IMPORTANT:
       * The stored procedure can generate additional result sets
       * (for example NotificationId) before its final response.
       *
       * The FINAL result set contains:
       * StatusCode
       * Message
       * LeaveApplicationId
       */
 
      console.log('🔥 ALL SP RECORDSETS:', result.recordsets);
 
      const allResultSets = result.recordsets as unknown as any[][];
 
      const response =
        allResultSets.length > 0
          ? allResultSets[allResultSets.length - 1]?.[0]
          : undefined;
 
      console.log('🔥 FINAL SP RESPONSE:', response);
 
      if (!response) {
        throw new BadRequestException(
          'No response received from leave submission procedure.',
        );
      }
 
      if (Number(response.StatusCode) !== 200) {
        throw new BadRequestException(
          response.Message || 'Leave application failed.',
        );
      }
 
      return {
        statusCode: Number(response.StatusCode),
        message: response.Message,
        leaveApplicationId: response.LeaveApplicationId,
      };
    } catch (error) {
      console.error('HR Apply Leave Error:', error);
 
      if (error instanceof BadRequestException) {
        throw error;
      }
 
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to apply leave.',
      );
    }
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
  // Withdraw / Cancel Leave
  async withdrawCancelLeave(
    employeeId: string,
    userId: number,
    leaveApplicationId: number,
    actionId: number,
    reason?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();
      console.log('========== WITHDRAW / CANCEL LEAVE ==========');
      console.log({
        employeeId,
        leaveApplicationId,
        actionId,
        reason,
      });
      console.log('=============================================');
      const result = await pool
        .request()
        .input('EmployeeId', sql.VarChar(100), employeeId)
        .input('LeaveApplicationId', sql.BigInt, leaveApplicationId)
        .input('ActionId', sql.Int, actionId)
        .input('Reason', sql.NVarChar(500), reason ?? null)
        .execute('USP_LeaveWithdrawCancel');
      return result.recordset;
    } catch (error) {
      console.error('Error in withdrawCancelLeave:', error);
      throw error;
    }
  }
  // Pending Leave Requests
  async getPendingLeaveRequests(approverId: string) {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('ApproverId', sql.VarChar(50), approverId)
        .execute('USP_GetPendingLeaveRequests');
      return result.recordset;
    } catch (error) {
      console.error('Error in getPendingLeaveRequests:', error);
      throw error;
    }
  }
 
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
  async getEmployeeLeaveDetails(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .execute('USP_GetEmployeeLeaveDetails');
 
      return {
        employeeDetails: result.recordsets[0] ?? [],
        employeeLeaveBalance: result.recordsets[1] ?? [],
        employeeLeaveHistory: result.recordsets[2] ?? [],
      };
    } catch (error) {
      console.error('Error in getEmployeeLeaveDetails:', error);
 
      throw error;
    }
  }
}