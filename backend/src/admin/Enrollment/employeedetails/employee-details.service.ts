import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DatabaseService } from '../../../database/database.service';

import { GetEmployeesDto } from './dto/get-employees.dto';
import { CreateEmployeeGroupDto } from './dto/create-employee-group.dto';
import { UpdatePendingCandidateDto } from './dto/update-pending-candidate.dto';
import { UpdateGeneralDto } from './dto/update-general.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { UpdateStatutoryDto } from './dto/update-statutory.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateHrCategoryDto } from './dto/update-hrcategory.dto';
import { UpdateDocumentsDto } from './dto/update-documents.dto';
import { UpdateSalaryRateDto } from './dto/update-salary-rate.dto';
import { UnblockUserDto } from './dto/unblock-user.dto';
import { ImportEmployeeDto } from './dto/import-employee.dto';

@Injectable()
export class EmployeeDetailsService {
  constructor(private readonly databaseService: DatabaseService) {}
  // =========================================================
  // 3. Employee List
  // =========================================================

  async getEmployees(dto: GetEmployeesDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Search', dto.search ?? null)
        .input('Branch', dto.branch ?? null)
        .input('SalaryStructure', dto.salaryStructure ?? null)
        .input('Leave', dto.leave ?? null)
        .input('Attendance', dto.attendance ?? null)
        .input('Designation', dto.designation ?? null)
        .input('EmployeeStatus', dto.employeeStatus ?? null)
        .input('Page', dto.page ?? 1)
        .input('Limit', dto.limit ?? 10)
        .execute('USP_GetEmployeeList');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching employee list:', error);

      throw new InternalServerErrorException('Unable to fetch employee list.');
    }
  }

  // ==========================================
  // Employee Details
  // ==========================================

  // async getEmployeeDetails(employeeId: string) {
  //   try {
  //     const pool = await this.databaseService.connect();

  //     const result = await pool
  //       .request()
  //       .input('EmployeeID', employeeId)
  //       .execute('USP_GetEmployeeDetails');

  //     const firstRecordset = result.recordsets[0];

  //     if (
  //       firstRecordset &&
  //       firstRecordset.length > 0 &&
  //       firstRecordset[0].StatusCode
  //     ) {
  //       return {
  //         success: false,
  //         statusCode: firstRecordset[0].StatusCode,
  //         message: firstRecordset[0].Message,
  //       };
  //     }

  //     return {
  //       success: true,
  //       data: {
  //         general: result.recordsets[0] ?? [],
  //         classification: result.recordsets[1] ?? [],
  //         statutory: result.recordsets[2] ?? [],
  //         address: result.recordsets[3] ?? [],
  //         documents: result.recordsets[4] ?? [],
  //         separation: result.recordsets[5] ?? [],
  //         workflowDetails: result.recordsets[6] ?? [],
  //       },
  //     };
  //   } catch (error) {
  //     console.error('Error while fetching employee details:', error);

  //     throw new InternalServerErrorException(
  //       'Unable to fetch employee details.',
  //     );
  //   }
  // }

  // ==========================================
  // Employees
  // ==========================================

  // async getEmployeesByCompanyId(companyId: number) {
  //   try {
  //     const pool = await this.databaseService.connect();

  //     const result = await pool
  //       .request()
  //       .input('CompanyId', companyId)
  //       .execute('USP_GetEmployeesByCompanyId');

  //     return result.recordset;
  //   } catch (error) {
  //     console.error('Error while fetching employees by company:', error);

  //     throw new InternalServerErrorException('Unable to fetch employees.');
  //   }
  // }
  // =========================================================
  // 4. Employee Groups
  // =========================================================

  async getEmployeeGroups() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetEmployeeGroups');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching employee groups:', error);

      throw new InternalServerErrorException(
        'Unable to fetch employee groups.',
      );
    }
  }

  // =========================================================
  // 5. Employees For Group Selection
  // =========================================================

  async getEmployeeGroupEmployees() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_GetEmployeeGroupEmployees');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching employees for group:', error);

      throw new InternalServerErrorException(
        'Unable to fetch employees for group.',
      );
    }
  }

  // =========================================================
  // 6. Create Employee Group
  // =========================================================

  async createEmployeeGroup(dto: CreateEmployeeGroupDto, createdBy: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('GroupName', dto.groupName)
        .input('Employees', JSON.stringify(dto.employees))
        .input('CreatedBy', createdBy)
        .execute('USP_CreateEmployeeGroup');

      return result.recordset;
    } catch (error) {
      console.error('Error while creating employee group:', error);

      throw new InternalServerErrorException(
        'Unable to create employee group.',
      );
    }
  }

  // =========================================================
  // 7. Pending Candidates
  // =========================================================

  async getPendingCandidates() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetPendingCandidates');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching pending candidates:', error);

      throw new InternalServerErrorException(
        'Unable to fetch pending candidates.',
      );
    }
  }

  // =========================================================
  // 8. Pending Candidate Details
  // =========================================================

  async getPendingCandidateDetails(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .execute('USP_GetPendingCandidateDetails');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching pending candidate details:', error);

      throw new InternalServerErrorException(
        'Unable to fetch pending candidate details.',
      );
    }
  }

  // =========================================================
  // 9. Update Pending Candidate
  // =========================================================

  async updatePendingCandidate(
    employeeId: string,
    dto: UpdatePendingCandidateDto,
    modifiedBy: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .input('CandidateData', JSON.stringify(dto))
        .input('ModifiedBy', modifiedBy)
        .execute('USP_UpdatePendingCandidate');

      return result.recordset;
    } catch (error) {
      console.error('Error while updating pending candidate:', error);

      throw new InternalServerErrorException(
        'Unable to update pending candidate.',
      );
    }
  }

  // =========================================================
  // 10. General
  // =========================================================

  async updateGeneral(
    employeeId: string,
    dto: UpdateGeneralDto,
    modifiedBy: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .input('GeneralData', JSON.stringify(dto))
        .input('ModifiedBy', modifiedBy)
        .execute('USP_UpdateEmployeeGeneral');

      return result.recordset;
    } catch (error) {
      console.error('Error while updating general details:', error);

      throw new InternalServerErrorException(
        'Unable to update general details.',
      );
    }
  }

  // =========================================================
  // 11. Classification
  // =========================================================

  async updateClassification(
    employeeId: string,
    dto: UpdateClassificationDto,
    modifiedBy: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .input('ClassificationData', JSON.stringify(dto))
        .input('ModifiedBy', modifiedBy)
        .execute('USP_UpdateEmployeeClassification');

      return result.recordset;
    } catch (error) {
      console.error('Error while updating classification:', error);

      throw new InternalServerErrorException(
        'Unable to update classification.',
      );
    }
  }

  // =========================================================
  // 12. Statutory
  // =========================================================

  async updateStatutory(
    employeeId: string,
    dto: UpdateStatutoryDto,
    modifiedBy: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .input('StatutoryData', JSON.stringify(dto))
        .input('ModifiedBy', modifiedBy)
        .execute('USP_UpdateEmployeeStatutory');

      return result.recordset;
    } catch (error) {
      console.error('Error while updating statutory details:', error);

      throw new InternalServerErrorException(
        'Unable to update statutory details.',
      );
    }
  }

  // =========================================================
  // 13. Address
  // =========================================================

  async updateAddress(
    employeeId: string,
    dto: UpdateAddressDto,
    modifiedBy: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .input('AddressData', JSON.stringify(dto))
        .input('ModifiedBy', modifiedBy)
        .execute('USP_UpdateEmployeeAddress');

      return result.recordset;
    } catch (error) {
      console.error('Error while updating address:', error);

      throw new InternalServerErrorException('Unable to update address.');
    }
  }

  // =========================================================
  // 14. HR Category
  // =========================================================

  async updateHrCategory(
    employeeId: string,
    dto: UpdateHrCategoryDto,
    modifiedBy: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .input('HrCategoryData', JSON.stringify(dto))
        .input('ModifiedBy', modifiedBy)
        .execute('USP_UpdateEmployeeHrCategory');

      return result.recordset;
    } catch (error) {
      console.error('Error while updating HR category:', error);

      throw new InternalServerErrorException('Unable to update HR category.');
    }
  }

  // =========================================================
  // 15. Documents
  // =========================================================

  async updateDocuments(
    employeeId: string,
    file: any,
    dto: UpdateDocumentsDto,
    modifiedBy: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .input('DocumentTypeId', dto.documentTypeId ?? null)
        .input('DocumentName', dto.documentName ?? null)
        .input('FileName', file?.originalname ?? null)
        .input('ModifiedBy', modifiedBy)
        .execute('USP_UpdateEmployeeDocuments');

      return result.recordset;
    } catch (error) {
      console.error('Error while updating employee documents:', error);

      throw new InternalServerErrorException(
        'Unable to update employee documents.',
      );
    }
  }

  // =========================================================
  // 16. Salary Rate
  // =========================================================

  async updateSalaryRate(
    employeeId: string,
    dto: UpdateSalaryRateDto,
    modifiedBy: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .input('SalaryRateData', JSON.stringify(dto))
        .input('ModifiedBy', modifiedBy)
        .execute('USP_UpdateEmployeeSalaryRate');

      return result.recordset;
    } catch (error) {
      console.error('Error while updating salary rate:', error);

      throw new InternalServerErrorException('Unable to update salary rate.');
    }
  }

  // =========================================================
  // 17. Organization Chart
  // =========================================================

  async getOrganizationChart(
    employeeId?: string,
    view?: string,
    branchId?: string,
    departmentId?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId ?? null)
        .input('View', view ?? null)
        .input('BranchID', branchId ?? null)
        .input('DepartmentID', departmentId ?? null)
        .execute('USP_GetOrganizationChart');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching organization chart:', error);

      throw new InternalServerErrorException(
        'Unable to fetch organization chart.',
      );
    }
  }

  // =========================================================
  // 18. Organization Chart Download
  // =========================================================

  async downloadOrganizationChart(
    employeeId?: string,
    view?: string,
    branchId?: string,
    departmentId?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId ?? null)
        .input('View', view ?? null)
        .input('BranchID', branchId ?? null)
        .input('DepartmentID', departmentId ?? null)
        .execute('USP_ExportOrganizationChart');

      return result.recordset;
    } catch (error) {
      console.error('Error while downloading organization chart:', error);

      throw new InternalServerErrorException(
        'Unable to download organization chart.',
      );
    }
  }

  // =========================================================
  // 19. Reset Blocked Users
  // =========================================================

  async getResetBlockedUsers() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetResetBlockedUsers');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching blocked users:', error);

      throw new InternalServerErrorException('Unable to fetch blocked users.');
    }
  }

  // =========================================================
  // 20. Unblock User
  // =========================================================

  async unblockUser(dto: UnblockUserDto, modifiedBy: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('UserId', dto.userId)
        .input('ModifiedBy', modifiedBy)
        .execute('USP_UnblockUser');

      return result.recordset;
    } catch (error) {
      console.error('Error while unblocking user:', error);

      throw new InternalServerErrorException('Unable to unblock user.');
    }
  }

  // =========================================================
  // 21. Audit Log
  // =========================================================

  async getAuditLog(
    search?: string,
    userId?: string,
    employeeId?: string,
    action?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Search', search ?? null)
        .input('UserID', userId ?? null)
        .input('EmployeeID', employeeId ?? null)
        .input('Action', action ?? null)
        .execute('USP_GetEmployeeAuditLog');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching audit log:', error);

      throw new InternalServerErrorException('Unable to fetch audit log.');
    }
  }

  // =========================================================
  // 22. Import Template Types
  // =========================================================

  async getImportTemplateTypes() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_GetEmployeeImportTemplateTypes');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching import template types:', error);

      throw new InternalServerErrorException(
        'Unable to fetch import template types.',
      );
    }
  }

  // =========================================================
  // 23. Import Template
  // =========================================================

  async getImportTemplate(templateTypeId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('TemplateTypeId', templateTypeId)
        .execute('USP_GetEmployeeImportTemplate');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching import template:', error);

      throw new InternalServerErrorException(
        'Unable to fetch import template.',
      );
    }
  }

  // =========================================================
  // 24. Import Employee
  // =========================================================

  async importEmployee(file: any, dto: ImportEmployeeDto, createdBy: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('TemplateTypeId', dto.templateTypeId)
        .input('FileName', file?.originalname ?? null)
        .input('CreatedBy', createdBy)
        .execute('USP_ImportEmployees');

      return result.recordset;
    } catch (error) {
      console.error('Error while importing employees:', error);

      throw new InternalServerErrorException('Unable to import employees.');
    }
  }

  // ==========================================
  // Employees — list (dashboard drill-through)
  // ==========================================

  async getEmployeesByCompanyId(
    companyId: number,
    flag: number,
    month?: number,
    year?: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyId', companyId)
        .input('Flag', flag)
        .input('Month', month ?? null)
        .input('Year', year ?? null)
        .execute('USP_GetEmployeesByCompanyId');

      const recordset = result.recordset;

      if (recordset && recordset.length > 0 && recordset[0].StatusCode) {
        return {
          success: false,
          statusCode: recordset[0].StatusCode,
          message: recordset[0].StatusMessage,
        };
      }

      return { success: true, data: recordset };
    } catch (error) {
      console.error('Error while fetching employees by company:', error);
      throw new InternalServerErrorException('Unable to fetch employees.');
    }
  }

  // ==========================================
  // Employee Details — single employee, 7 recordsets
  // ==========================================

  async getEmployeeDetails(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .execute('USP_GetEmployeeDetails');

      const firstRecordset = result.recordsets[0];

      if (
        firstRecordset &&
        firstRecordset.length > 0 &&
        firstRecordset[0].StatusCode
      ) {
        return {
          success: false,
          statusCode: firstRecordset[0].StatusCode,
          message: firstRecordset[0].Message,
        };
      }

      return {
        success: true,
        data: {
          general: result.recordsets[0] ?? [],
          classification: result.recordsets[1] ?? [],
          statutory: result.recordsets[2] ?? [],
          address: result.recordsets[3] ?? [],
          documents: result.recordsets[4] ?? [],
          separation: result.recordsets[5] ?? [],
          workflowDetails: result.recordsets[6] ?? [],
        },
      };
    } catch (error) {
      console.error('Error while fetching employee details:', error);
      throw new InternalServerErrorException(
        'Unable to fetch employee details.',
      );
    }
  }
}
