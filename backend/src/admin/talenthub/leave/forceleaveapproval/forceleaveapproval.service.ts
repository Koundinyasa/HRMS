import { GetLeaveApprovalDto } from './dto/get-leave-approval.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../../../../database/database.service';
import { ApproveRejectLeaveDto } from './dto/approve-reject-leave.dto';

@Injectable()
export class ForceLeaveApprovalService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ==========================================
  // Approve Leave
  // ==========================================

  async approveLeave(dto: ApproveRejectLeaveDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('LeaveIds', JSON.stringify(dto.leaveIds))
        .execute('USP_ForceLeaveApproval_Approve');

      return {
        success: true,
        message: 'Leave approved successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error approving leave:', error);

      return {
        success: false,
        message: 'Failed to approve leave.',
      };
    }
  }

  // ==========================================
  // Reject Leave
  // ==========================================

  async rejectLeave(dto: ApproveRejectLeaveDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('LeaveIds', JSON.stringify(dto.leaveIds))
        .execute('USP_ForceLeaveApproval_Reject');

      return {
        success: true,
        message: 'Leave rejected successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error rejecting leave:', error);

      return {
        success: false,
        message: 'Failed to reject leave.',
      };
    }
  }

  //Starting from here actual SPs
  // ==========================================
  // Get Leave Approval Records
  // ==========================================

  // async getLeaveApproval(
  //   companyId: number,
  //   approverId?: string,
  //   fromDate?: string,
  //   toDate?: string,
  //   isCurrentMonth: boolean = true,
  // ) {
  //   try {
  //     const pool = await this.databaseService.connect();

  //     const result = await pool
  //       .request()
  //       .input('CompanyID', companyId)
  //       .input('ApproverID', approverId ?? null)
  //       .input('FromDate', fromDate ?? null)
  //       .input('ToDate', toDate ?? null)
  //       .input('IsCurrentMonth', isCurrentMonth ? 1 : 0)
  //       .execute('USP_Get_LeaveApproval');

  //     return {
  //       success: true,
  //       data: result.recordset,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching leave approval records:', error);

  //     return {
  //       success: false,
  //       message: 'Failed to fetch leave approval records.',
  //     };
  //   }
  // }

  //Starting from here actual SPs
  // ==========================================
  // Get Leave Approval Records
  // ==========================================
 
  async getLeaveApproval(dto: GetLeaveApprovalDto, companyId: number) {
  try {
    const pool = await this.databaseService.connect();

    if (dto.branchIds?.length) {
      const branchResults = await Promise.all(dto.branchIds.map((branchId) =>
        pool.request()
          .input('CompanyID', sql.Int, companyId)
          .input('ApproverID', sql.VarChar(100), dto.approverId ?? null)
          .input('FromDate', sql.Date, dto.fromDate ?? null)
          .input('ToDate', sql.Date, dto.toDate ?? null)
          .input('IsCurrentMonth', sql.Bit, dto.isCurrentMonth ?? true)
          .input('BranchId', sql.Int, branchId)
          .input('EmploymentStatusId', sql.Int, dto.employmentStatusId ?? null)
          .input('DesignationId', sql.Int, dto.designationId ?? null)
          .input('LeaveTypeId', sql.Int, dto.leaveTypeId ?? null)
          .input('StructureId', sql.Int, dto.structureId ?? null)
          .input('AttendanceStatusId', sql.Int, dto.attendanceStatusId ?? null)
          .execute('USP_Get_LeaveApproval'),
      ));
      const uniqueRows = new Map<unknown, Record<string, unknown>>();
      for (const result of branchResults) {
        for (const row of result.recordset as Record<string, unknown>[]) {
          const approvalId = Object.entries(row).find(([key]) => key.replace(/[^a-z0-9]/gi, '').toLowerCase() === 'approvalid')?.[1];
          uniqueRows.set(approvalId ?? Symbol(), row);
        }
      }
      return [...uniqueRows.values()];
    }
 
    const result = await pool
      .request()
      .input('CompanyID', sql.Int, companyId)
      .input('ApproverID', sql.VarChar(100), dto.approverId ?? null)
      .input('FromDate', sql.Date, dto.fromDate ?? null)
      .input('ToDate', sql.Date, dto.toDate ?? null)
      .input('IsCurrentMonth', sql.Bit, dto.isCurrentMonth ?? true)
      .input('BranchId', sql.Int, dto.branchId ?? null)
      .input('EmploymentStatusId', sql.Int, dto.employmentStatusId ?? null)
      .input('DesignationId', sql.Int, dto.designationId ?? null)
      .input('LeaveTypeId', sql.Int, dto.leaveTypeId ?? null)
      .input('StructureId', sql.Int, dto.structureId ?? null)
      .input('AttendanceStatusId', sql.Int, dto.attendanceStatusId ?? null)
      .execute('USP_Get_LeaveApproval');
 
    return result.recordset;
  } catch (error) {
    console.error('Error while fetching leave approval records:', error);
    throw new InternalServerErrorException('Unable to fetch leave approval records.');
  }
}
  //====================================================
//Actual SP is used here
//==============================================
// dropdown filters
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
 
    // Only the sets needed by the filter bar are returned.
    // Unused sets: 4 presentStatus, 8 activeLeavePolicies, 9 monthYear
    return {
      success: true,
      message: 'Company dropdown data retrieved successfully.',
      data: {
        branches: sets[0],
        salaryStructures: sets[1],
        leaveTypes: sets[2],
        leaveTypeCodes: sets[3],
        attendanceStatuses: sets[5],
        designations: sets[6],
        employeeStatuses: sets[7],
      },
    };
  } catch (error) {
    console.error('Company dropdown data error:', error);
 
    throw new InternalServerErrorException(
      'Failed to retrieve company dropdown data.',
    );
  }
}
}
