import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
 
 
 
import { DatabaseService } from '../../../database/database.service';
 
 
import { MailService } from '../../../mail/mail.service';
import { OrganizationChartDto } from './dto/organization-chart.dto';
import { UpdateEmployeeGeneralDetailsDto } from './dto/update-employee-general-details.dto';
import * as sql from 'mssql';
 
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
 
 
@Injectable()
export class EmployeeDetailsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) { }
 
 
 
private generateTempPassword(length = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
 
    const bytes = randomBytes(length);
 
    return Array.from(bytes)
      .map((byte) => chars[byte % chars.length])
      .join('');
  }
 
 
  //Actual sps here
  // ==========================================
  // Employee Details
  // ==========================================
 
  async getEmployeeDetails(
    employeeId: string,
  ) {
    try {
      const pool =
        await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input(
          'EmployeeID',
          employeeId,
        )
        .execute(
          'USP_GetEmployeeDetails',
        );
 
      const firstRecordset =
        result.recordsets[0];
 
      if (
        firstRecordset &&
        firstRecordset.length > 0 &&
        firstRecordset[0].StatusCode
      ) {
        return {
          success: false,
          statusCode:
            firstRecordset[0].StatusCode,
          message:
            firstRecordset[0].Message,
        };
      }
 
      return {
        success: true,
        data: {
          general:
            result.recordsets[0] ?? [],
          classification:
            result.recordsets[1] ?? [],
          statutory:
            result.recordsets[2] ?? [],
          address:
            result.recordsets[3] ?? [],
          documents:
            result.recordsets[4] ?? [],
          separation:
            result.recordsets[5] ?? [],
          workflowDetails:
            result.recordsets[6] ?? [],
        },
      };
    } catch (error) {
      console.error(
        'Error while fetching employee details:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to fetch employee details.',
      );
    }
  }
 
  // ==========================================
  // Employees
  // ==========================================
 
  async getEmployeesByCompanyId(
    companyId: number,
  ) {
    try {
      const pool =
        await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('CompanyId', sql.Int, companyId)
        .input('Flag', sql.Int, 1)
        .execute('USP_GetEmployeesByCompanyId');
      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching employees by company:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to fetch employees.',
      );
    }
  }
 
  async getOrganizationChart(
    dto: OrganizationChartDto,
    companyId: number,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input(
          'RootEmployeeId',
          sql.VarChar(25),
          dto.rootEmployeeId ?? null,
        )
        .input('CompanyId', sql.Int, companyId)
        .input(
          'BranchId',
          sql.Int,
          dto.branchId ?? null,
        )
        .input(
          'DepartmentId',
          sql.Int,
          dto.departmentId ?? null,
        )
        .execute('USP_GetOrganizationChart');
 
      return result.recordset ?? [];
    } catch (error) {
      console.error('Error fetching organization chart:', error);
 
      throw new InternalServerErrorException(
        'Failed to fetch organization chart',
      );
    }
  }
 
  async updateEmployeeGeneralDetails(
    dto: UpdateEmployeeGeneralDetailsDto,
    modifiedBy: number,
  ) {
    try {
      if (!modifiedBy || modifiedBy <= 0) {
        throw new BadRequestException('Invalid logged-in user.');
      }
 
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('EmployeeID', dto.employeeId)
        .input('FirstName', dto.firstName ?? null)
        .input('LastName', dto.lastName ?? null)
        .input('GenderID', dto.genderId ?? null)
        .input('MaritalStatusID', dto.maritalStatusId ?? null)
        .input('DOB', dto.dob ?? null)
        .input('DOJ', dto.doj ?? null)
        .input('DOL', dto.dol ?? null)
        .input('Grade', dto.grade ?? null)
        .input('ProfilePhoto', dto.profilePhoto ?? null)
        .input(
          'ReportingManagerID',
          dto.reportingManagerId ?? null,
        )
        .input('FatherName', dto.fatherName ?? null)
        .input('SpouseName', dto.spouseName ?? null)
        .input('Modifiedby', modifiedBy)
        .execute('USP_UpdateEmployeeGeneralDetails');
 
      const response = result.recordset?.[0];
 
      if (!response) {
        throw new InternalServerErrorException(
          'No response received from stored procedure.',
        );
      }
 
      if (response.StatusCode !== 200) {
        throw new BadRequestException(response.Message);
      }
 
      return {
        success: true,
        statusCode: response.StatusCode,
        message: response.Message,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
 
      console.error(
        'Update Employee General Details Error:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Failed to update employee general details.',
      );
    }
  }
 
 
  async getCompanyMasterData(companyId: number) {
    try {
      if (!companyId || isNaN(companyId)) {
        throw new BadRequestException('CompanyID is required');
      }
 
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', companyId)
        .input('IncludeInactive', 0)
        .input('AsJson', 0)
        .execute('USP_GetCompanyMasterData_N');
 
      const recordsets = result.recordsets;
 
      return {
        statusCode: 1,
        message: 'Company master data fetched successfully',
 
        companies: recordsets[0] || [],
        branches: recordsets[1] || [],
        departments: recordsets[2] || [],
        designations: recordsets[3] || [],
        roles: recordsets[4] || [],
        genders: recordsets[5] || [],
        employmentTypes: recordsets[6] || [],
        employmentStatuses: recordsets[7] || [],
        maritalStatuses: recordsets[8] || [],
        grades: recordsets[9] || [],
        managers: recordsets[10] || [],
      };
    } catch (error) {
      console.error('Error fetching company master data:', error);
 
      if (error instanceof BadRequestException) {
        throw error;
      }
 
      throw new InternalServerErrorException(
        'Failed to fetch company master data',
      );
    }
  }
 
 
 
  async validateEmployeeId(
    employeeId: string,
    companyId: number,
  ) {
    try {
      if (!employeeId?.trim()) {
        throw new BadRequestException(
          'EmployeeID is required',
        );
      }
 
      if (!companyId || isNaN(companyId)) {
        throw new BadRequestException(
          'CompanyID is required',
        );
      }
 
      const pool =
        await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input(
          'EmployeeID',
          employeeId.trim(),
        )
        .input(
          'CompanyID',
          companyId,
        )
        .execute(
          'USP_ValidateNewEmployee',
        );
 
      const response =
        result.recordset?.[0];
 
      if (!response) {
        throw new InternalServerErrorException(
          'No response received from employee ID validation',
        );
      }
 
      return {
        statusCode: response.StatusCode,
        message: response.Message,
      };
    } catch (error) {
      console.error(
        'Employee ID validation error:',
        error,
      );
 
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
 
      throw new InternalServerErrorException(
        'Failed to validate Employee ID',
      );
    }
  }
 
 
async createEmployee(
    dto: any,
    user: any,
  ) {
    try {
      // =====================================================
      // COMPANY ID FROM JWT
      // =====================================================
      const companyId = Number(user?.companyId);
 
      if (!companyId || isNaN(companyId)) {
        throw new BadRequestException(
          'CompanyID not found in authentication token',
        );
      }
 
      // =====================================================
      // CREATED BY FROM JWT
      // =====================================================
      const createdBy = String(user?.employeeId || '');
 
      if (!createdBy) {
        throw new BadRequestException(
          'CreatedBy not found in authentication token',
        );
      }
 
      // =====================================================
      // EMAIL VALIDATION
      // =====================================================
      if (!dto?.email?.trim()) {
        throw new BadRequestException(
          'Employee email is required.',
        );
      }
 
      // =====================================================
      // GENERATE TEMPORARY PASSWORD
      // =====================================================
      const temporaryPassword =
        this.generateTempPassword();
 
      // =====================================================
      // HASH PASSWORD
      // =====================================================
      const passwordHash =
        await bcrypt.hash(
          temporaryPassword,
          10,
        );
 
      // =====================================================
      // DATABASE
      // =====================================================
      const pool =
        await this.databaseService.connect();
 
      // =====================================================
      // CREATE EMPLOYEE
      // =====================================================
      const result = await pool
        .request()
        .input('EmployeeID', dto.employeeId)
        .input('Code', dto.code ?? null)
        .input('FirstName', dto.firstName)
        .input('LastName', dto.lastName ?? null)
        .input('FullName', dto.fullName ?? null)
        .input('CompanyID', companyId)
        .input('BranchID', dto.branchId)
        .input('DeptID', dto.deptId ?? null)
        .input('RoleID', dto.roleId)
        .input('DesignationID', dto.designationId ?? null)
        .input(
          'ReportingManagerID',
          dto.reportingManagerId ?? null,
        )
        .input('DOB', dto.dob ?? null)
        .input('DOJ', dto.doj)
        .input('DOL', dto.dol ?? null)
        .input('GenderID', dto.genderId ?? null)
        .input(
          'EmploymentTypeID',
          dto.employmentTypeId ?? null,
        )
        .input(
          'EmploymentStatusID',
          dto.employmentStatusId ?? null,
        )
        .input(
          'MaritalStatusID',
          dto.maritalStatusId ?? null,
        )
        .input('Grade', dto.grade ?? null)
        .input(
          'ProfilePhoto',
          dto.profilePhoto ?? null,
        )
        .input(
          'UserID',
          dto.userId ?? null,
        )
        .input(
          'PasswordHash',
          passwordHash,
        )
        .input(
          'Email',
          dto.email.trim(),
        )
        .input(
          'Mobileno',
          dto.mobileno ?? null,
        )
        .input(
          'AltMobileNo',
          dto.altMobileNo ?? null,
        )
        .input(
          'EmergencyNo',
          dto.emergencyNo ?? null,
        )
        .input(
          'AlternateEmailId',
          dto.alternateEmailId ?? null,
        )
        .input(
          'AadhaarNumber',
          dto.aadhaarNumber ?? null,
        )
        .input(
          'PANNumber',
          dto.panNumber ?? null,
        )
        .input(
          'UANNumber',
          dto.uanNumber ?? null,
        )
        .input(
          'PFNumber',
          dto.pfNumber ?? null,
        )
        .input(
          'CreatedBy',
          createdBy,
        )
        .execute('USP_EmployeeCreation');
 
      // =====================================================
      // DATABASE RESPONSE VALIDATION
      // =====================================================
      const response =
        result.recordset?.[0];
 
      if (!response) {
        throw new InternalServerErrorException(
          'No response received from employee creation procedure',
        );
      }
 
      // =====================================================
      // EMPLOYEE CREATION FAILED
      // =====================================================
      if (response.StatusCode !== 1) {
        throw new BadRequestException(
          response.Message ||
          'Employee creation failed',
        );
      }
 
      // =====================================================
      // EMPLOYEE CREATED SUCCESSFULLY
      // =====================================================
 
      let emailSent = false;
      let emailError: string | null = null;
 
      // =====================================================
      // EMAIL VALIDATION
      // =====================================================
      if (!response.ApplicationURL) {
        emailError =
          'Application URL was not returned from database.';
      } else {
        try {
          await this.mailService.sendTempPassword(
            dto.email.trim(),
            temporaryPassword,
            response.ApplicationURL,
          );
 
          emailSent = true;
        } catch (mailError) {
          console.error(
            'Employee created successfully, but email sending failed:',
            mailError,
          );
 
          emailError =
            mailError instanceof Error
              ? mailError.message
              : 'Failed to send employee credentials email.';
        }
      }
 
      // =====================================================
      // EMAIL SENT SUCCESSFULLY
      // =====================================================
      if (emailSent) {
        return {
          statusCode: 1,
          message:
            'Employee created successfully and login credentials were sent to the employee email.',
          employeeId:
            response.EmployeeID,
          fullName:
            response.FullName,
          userId:
            response.UserID,
          applicationUrl:
            response.ApplicationURL,
          emailSent: true,
        };
      }
 
      // =====================================================
      // EMPLOYEE CREATED BUT EMAIL FAILED
      // =====================================================
      return {
        statusCode: 1,
        message:
          'Employee created successfully, but the login credentials email could not be sent.',
        employeeId:
          response.EmployeeID,
        fullName:
          response.FullName,
        userId:
          response.UserID,
        applicationUrl:
          response.ApplicationURL,
        emailSent: false,
        emailError,
      };
    } catch (error) {
      console.error(
        'Employee creation error:',
        error,
      );
 
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
 
      throw new InternalServerErrorException(
        'Failed to create employee',
      );
    }
  }
}