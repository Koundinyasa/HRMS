import { GetLeaveApprovalDto } from './dto/get-leave-approval.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../../../../database/database.service';
import { ApproveRejectLeaveDto } from './dto/approve-reject-leave.dto';
import { BulkHierarchicalLeaveActionDto } from './dto/bulk-hierarchical-leave-action.dto';

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

  // ==========================================
  // Bulk Hierarchical Leave Action
  // Bulk and single employee approve (4) or reject (5)
  // ==========================================

  async bulkHierarchicalLeaveAction(
    dto: BulkHierarchicalLeaveActionDto,
    approverEmployeeId: string,
    companyId: number, // see CHECK 1 below
  ) {
    try {
      const pool = await this.databaseService.connect();

      // Table-valued parameter matching dbo.LeaveApprovalType
      const approvalTable = new sql.Table('dbo.LeaveApprovalType');
      approvalTable.columns.add('ApprovalId', sql.Int, { nullable: true });
      // no duplicates in the table
      Array.from(new Set(dto.approvalIds)).forEach((id) =>
        approvalTable.rows.add(id),
      );

      const result = await pool
        .request()
        .input('ApprovalIds', approvalTable)
        .input('ApproverEmployeeId', sql.VarChar(25), approverEmployeeId)
        .input('ActionStatusId', sql.Int, dto.actionStatusId)
        .input('Remarks', sql.NVarChar(500), dto.remarks ?? null)
        // CHECK 1: add only after the TL adds @CompanyId to the procedure.
        // An extra parameter gives "too many arguments" (like the calendar
        // error), so it stays commented until the procedure has it.
        // .input('CompanyId', sql.Int, companyId)
        .execute('USP_BulkHierarchicalLeaveAction');

      const recordsets = result.recordsets as any[][];
      const rows = recordsets.length ? recordsets[recordsets.length - 1] : [];

      // CHECK 2: change these column names to what the procedure really
      // returns for a failed row.
      const failedRows = rows.filter(
        (r) => r?.StatusCode !== undefined && Number(r.StatusCode) >= 400,
      );

      return {
        success: failedRows.length === 0,
        message:
          failedRows.length === 0
            ? 'Leave action completed.'
            : `${rows.length - failedRows.length} done, ${failedRows.length} failed.`,
        succeeded: rows.length - failedRows.length,
        failed: failedRows.length,
        data: rows,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;

      console.error('Error processing bulk hierarchical leave action:', error);

      // A rule the procedure refused (THROW 50000 and above): show the reason.
      if (error instanceof sql.RequestError && Number(error.number) >= 50000) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        'Failed to process bulk hierarchical leave action.',
      );
    }
  }
}
