import { Injectable } from '@nestjs/common';

@Injectable()
export class PreEnrollmentService {

  // ================= Dashboard =================

  getDashboard() {
    return {
      success: true,
      spName: 'USP_PreEnrollment_Dashboard',
    };
  }

  // ================= Candidate =================

  getCandidates() {
    return {
      success: true,
      spName: 'USP_PreOnboard_GetCandidates',
    };
  }

  createCandidate(body: any) {
    return {
      success: true,
      spName: 'USP_PreOnboard_CreateCandidate',
      data: body,
    };
  }

  updateCandidate(candidateId: string, body: any) {
    return {
      success: true,
      spName: 'USP_PreOnboard_UpdateCandidate',
      candidateId,
      data: body,
    };
  }

  // ================= Completed Candidate =================

  getCompletedCandidates() {
    return {
      success: true,
      spName: 'USP_PreOnboard_GetCompletedCandidates',
    };
  }

  // ================= Offboard =================

  getOffboardCandidates() {
    return {
      success: true,
      spName: 'USP_PreOnboard_GetOffboardCandidates',
    };
  }

  createOffboard(body: any) {
    return {
      success: true,
      spName: 'USP_PreOnboard_CreateOffboard',
      data: body,
    };
  }

  updateOffboard(candidateId: string, body: any) {
    return {
      success: true,
      spName: 'USP_PreOnboard_UpdateOffboard',
      candidateId,
      data: body,
    };
  }

  // ================= Settings =================

  getSettings() {
    return {
      success: true,
      spName: 'USP_PreOnboard_GetSettings',
    };
  }

  updateSettings(body: any) {
    return {
      success: true,
      spName: 'USP_PreOnboard_UpdateSettings',
      data: body,
    };
  }

  // ================= Import =================

  getImportHistory() {
    return {
      success: true,
      spName: 'USP_PreOnboard_GetImportHistory',
    };
  }

  importCandidates(body: any) {
    return {
      success: true,
      spName: 'USP_PreOnboard_ImportCandidates',
      data: body,
    };
  }
}