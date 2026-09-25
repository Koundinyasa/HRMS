import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeForceApprovalService {
  getAll() {
    return {
      success: true,
      spName: 'USP_ForceApproval_GetAll',
    };
  }

  getPending() {
    return {
      success: true,
      spName: 'USP_ForceApproval_GetPending',
    };
  }

  approve(body: any) {
    return {
      success: true,
      spName: 'USP_ForceApproval_Approve',
      data: body,
    };
  }

  reject(body: any) {
    return {
      success: true,
      spName: 'USP_ForceApproval_Reject',
      data: body,
    };
  }

  getHistory() {
    return {
      success: true,
      spName: 'USP_ForceApproval_GetHistory',
    };
  }
}
