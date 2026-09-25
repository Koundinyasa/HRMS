import { Injectable } from '@nestjs/common';

@Injectable()
export class BulkUpdateService {
  getRoles() {
    return {
      success: true,
      spName: 'USP_BulkUpdate_GetRoles',
    };
  }

  updateRoles(body: any) {
    return {
      success: true,
      spName: 'USP_BulkUpdate_UpdateRoles',
      data: body,
    };
  }

  getPanVerification() {
    return {
      success: true,
      spName: 'USP_BulkUpdate_GetPanVerification',
    };
  }

  verifyPan(body: any) {
    return {
      success: true,
      spName: 'USP_BulkUpdate_VerifyPan',
      data: body,
    };
  }

  getPanStatus() {
    return {
      success: true,
      spName: 'USP_BulkUpdate_GetPanStatus',
    };
  }

  getStatutory() {
    return {
      success: true,
      spName: 'USP_BulkUpdate_GetStatutory',
    };
  }

  updateStatutory(body: any) {
    return {
      success: true,
      spName: 'USP_BulkUpdate_UpdateStatutory',
      data: body,
    };
  }

  getClassification() {
    return {
      success: true,
      spName: 'USP_BulkUpdate_GetClassification',
    };
  }

  updateClassification(body: any) {
    return {
      success: true,
      spName: 'USP_BulkUpdate_UpdateClassification',
      data: body,
    };
  }

  getAuthority() {
    return {
      success: true,
      spName: 'USP_BulkUpdate_GetAuthority',
    };
  }

  updateAuthority(body: any) {
    return {
      success: true,
      spName: 'USP_BulkUpdate_UpdateAuthority',
      data: body,
    };
  }
}
