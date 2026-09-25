import { Injectable } from '@nestjs/common';

@Injectable()
export class SeparationService {
  // ================= Dashboard =================

  getDashboard() {
    return {
      success: true,
      spName: 'USP_Separation_GetDashboard',
    };
  }

  // ================= Exit Module =================

  getEmployees() {
    return {
      success: true,
      spName: 'USP_Separation_GetEmployees',
    };
  }

  addEmployee(body: any) {
    return {
      success: true,
      spName: 'USP_Separation_AddEmployee',
      data: body,
    };
  }

  updateEmployee(employeeId: string, body: any) {
    return {
      success: true,
      spName: 'USP_Separation_UpdateEmployee',
      employeeId,
      data: body,
    };
  }

  getOffboardedEmployees() {
    return {
      success: true,
      spName: 'USP_Separation_GetOffboardedEmployees',
    };
  }

  getSettings() {
    return {
      success: true,
      spName: 'USP_Separation_GetSettings',
    };
  }

  createPolicy(body: any) {
    return {
      success: true,
      spName: 'USP_Separation_CreatePolicy',
      data: body,
    };
  }

  updatePolicy(policyId: string, body: any) {
    return {
      success: true,
      spName: 'USP_Separation_UpdatePolicy',
      policyId,
      data: body,
    };
  }

  getInterviewSummary() {
    return {
      success: true,
      spName: 'USP_Separation_GetInterviewSummary',
    };
  }

  // ================= Full Final Settlement =================

  getPendingFFS() {
    return {
      success: true,
      spName: 'USP_Separation_GetPendingFFS',
    };
  }

  savePendingFFS(body: any) {
    return {
      success: true,
      spName: 'USP_Separation_SavePendingFFS',
      data: body,
    };
  }

  getFFSSummary() {
    return {
      success: true,
      spName: 'USP_Separation_GetFFSSummary',
    };
  }

  getImportData() {
    return {
      success: true,
      spName: 'USP_Separation_GetImportData',
    };
  }

  importData(body: any) {
    return {
      success: true,
      spName: 'USP_Separation_ImportData',
      data: body,
    };
  }

  getReport() {
    return {
      success: true,
      spName: 'USP_Separation_GetReport',
    };
  }
}
