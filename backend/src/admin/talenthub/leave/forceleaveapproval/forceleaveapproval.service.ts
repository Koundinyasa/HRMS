import { Injectable } from '@nestjs/common';
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

  async getLeaveApproval(
    companyId: number,
    approverId?: string,
    fromDate?: string,
    toDate?: string,
    isCurrentMonth: boolean = true,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', companyId)
        .input('ApproverID', approverId ?? null)
        .input('FromDate', fromDate ?? null)
        .input('ToDate', toDate ?? null)
        .input('IsCurrentMonth', isCurrentMonth ? 1 : 0)
        .execute('USP_Get_LeaveApproval');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching leave approval records:', error);

      return {
        success: false,
        message: 'Failed to fetch leave approval records.',
      };
    }
  }
}
