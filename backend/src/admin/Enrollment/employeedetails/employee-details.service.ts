import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { DatabaseService } from '../../../database/database.service';
import { OrganizationChartDto } from './dto/organization-chart.dto';
import { UpdateEmployeeGeneralDetailsDto } from './dto/update-employee-general-details.dto';
import * as sql from 'mssql';

@Injectable()
export class EmployeeDetailsService {
  constructor(private readonly databaseService: DatabaseService) {}
  //Actual sps here
  // ==========================================
  // Employee Details
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

  // ==========================================
  // Employees
  // ==========================================

  async getEmployeesByCompanyId(companyId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyId', sql.Int, companyId)
        .input('Flag', sql.Int, 1)
        .execute('USP_GetEmployeesByCompanyId');
      return result.recordset;
    } catch (error) {
      console.error('Error while fetching employees by company:', error);

      throw new InternalServerErrorException('Unable to fetch employees.');
    }
  }

  async getOrganizationChart(dto: OrganizationChartDto, companyId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('RootEmployeeId', sql.VarChar(25), dto.rootEmployeeId ?? null)
        .input('CompanyId', sql.Int, companyId)
        .input('BranchId', sql.Int, dto.branchId ?? null)
        .input('DepartmentId', sql.Int, dto.departmentId ?? null)
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
        .input('ReportingManagerID', dto.reportingManagerId ?? null)
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

      console.error('Update Employee General Details Error:', error);

      throw new InternalServerErrorException(
        'Failed to update employee general details.',
      );
    }
  }
}
