import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeDetailsService {
  // ================= Employee =================

  async getEmployee(employeeId: number) {
    return {
      success: true,
      spName: 'USP_Employee_GetDetails',
      employeeId,
    };
  }

  async saveEmployee(employeeId: number, body: any) {
    return {
      success: true,
      spName: 'USP_Employee_SaveDetails',
      employeeId,
      data: body,
    };
  }

  // ================= Profile =================

  async getProfile(employeeId: number) {
    return {
      success: true,
      spName: 'USP_Profile_Get',
      employeeId,
    };
  }

  async updateProfile(employeeId: number, body: any) {
    return {
      success: true,
      spName: 'USP_Profile_Save',
      employeeId,
      data: body,
    };
  }

  // ================= Classification =================

  getClassification(employeeId: number) {
    return {
      success: true,
      spName: 'USP_Employee_GetClassification',
      employeeId,
    };
  }

  saveClassification(employeeId: number, body: any) {
    return {
      success: true,
      spName: 'USP_Employee_SaveClassification',
      employeeId,
      data: body,
    };
  }

  // ================= Documents =================

  getDocuments(employeeId: number) {
    return {
      success: true,
      spName: 'USP_Employee_GetDocuments',
      employeeId,
    };
  }

  uploadDocument(employeeId: number, body: any) {
    return {
      success: true,
      spName: 'USP_Employee_UploadDocument',
      employeeId,
      data: body,
    };
  }

  deleteDocument(documentId: string) {
    return {
      success: true,
      spName: 'USP_Employee_DeleteDocument',
      documentId,
    };
  }

  // ================= Employee Group =================

  getGroup(employeeId: number) {
    return {
      success: true,
      spName: 'USP_Employee_GetGroup',
      employeeId,
    };
  }

  saveGroup(employeeId: number, body: any) {
    return {
      success: true,
      spName: 'USP_Employee_SaveGroup',
      employeeId,
      data: body,
    };
  }

  // ================= Organization Chart =================

  getOrganizationChart() {
    return {
      success: true,
      spName: 'USP_Employee_GetOrganizationChart',
      data: [],
    };
  }
}