import { BadRequestException, Injectable } from '@nestjs/common';

import * as sql from 'mssql';
import * as bcrypt from 'bcrypt';

import { DatabaseService } from '../../../../database/database.service';

import { GetEmployeesDto } from './dto/get-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly dbService: DatabaseService) {}

  // ============================================================
  // GET EMPLOYEE LIST
  // ============================================================
  async getEmployees(dto: GetEmployeesDto) {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('Action', sql.VarChar(50), 'GET_LIST')
        .input('EmployeeId', sql.VarChar(50), null)
        .input('UserId', sql.Int, null)
        .input('RoleId', sql.Int, dto.roleId ?? null)
        .input('Username', sql.NVarChar(100), null)
        .input('PasswordHash', sql.NVarChar(500), null)
        .input('StatusFilter', sql.VarChar(50), dto.statusFilter ?? null)
        .input('SecurityAction', sql.VarChar(20), null)
        .input('SearchTerm', sql.VarChar(100), dto.search ?? null)
        .input('UpdatedBy', sql.VarChar(100), null)
        .execute('USP_EmployeeUserManager');

      const records = result.recordset ?? [];

      return {
        success: true,
        statusCode: 200,
        message: 'Employees fetched successfully.',
        data: {
          items: records,
          total: records.length,
          page: dto.page ?? 1,
          limit: dto.limit ?? records.length,
          totalPages:
            dto.limit && dto.limit > 0
              ? Math.ceil(records.length / dto.limit)
              : 1,
        },
      };
    } catch (error) {
      console.error('getEmployees failed:', error);

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch employees.',
      );
    }
  }

  // ============================================================
  // GET SINGLE EMPLOYEE DETAILS
  // ============================================================
  async getEmployeeDetails(employeeId: string) {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('Action', sql.VarChar(50), 'GET_DETAILS')
        .input('EmployeeId', sql.VarChar(50), employeeId)
        .input('UserId', sql.Int, null)
        .input('RoleId', sql.Int, null)
        .input('Username', sql.NVarChar(100), null)
        .input('PasswordHash', sql.NVarChar(500), null)
        .input('StatusFilter', sql.VarChar(50), null)
        .input('SecurityAction', sql.VarChar(20), null)
        .input('SearchTerm', sql.VarChar(100), null)
        .input('UpdatedBy', sql.VarChar(100), null)
        .execute('USP_EmployeeUserManager');

      return {
        success: true,
        statusCode: 200,
        message: 'Employee details fetched successfully.',
        data: result.recordset?.[0] ?? null,
      };
    } catch (error) {
      console.error('getEmployeeDetails failed:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch employee details.',
      );
    }
  }

  // ============================================================
  // GET LOOKUPS
  // ============================================================
  async getLookups() {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('Action', sql.VarChar(50), 'GET_LOOKUPS')
        .input('EmployeeId', sql.VarChar(50), null)
        .input('UserId', sql.Int, null)
        .input('RoleId', sql.Int, null)
        .input('Username', sql.NVarChar(100), null)
        .input('PasswordHash', sql.NVarChar(500), null)
        .input('StatusFilter', sql.VarChar(50), null)
        .input('SecurityAction', sql.VarChar(20), null)
        .input('SearchTerm', sql.VarChar(100), null)
        .input('UpdatedBy', sql.VarChar(100), null)
        .execute('USP_EmployeeUserManager');

      return {
        success: true,
        statusCode: 200,
        message: 'Employee lookups fetched successfully.',
        data: {
          roles: result.recordsets?.[0] ?? [],
          departments: result.recordsets?.[1] ?? [],
          designations: result.recordsets?.[2] ?? [],
        },
      };
    } catch (error) {
      console.error('getLookups failed:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch employee lookups.',
      );
    }
  }

  // ============================================================
  // CREATE / UPDATE USER
  // ============================================================
  async updateEmployee(dto: UpdateEmployeeDto, modifiedBy: number) {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('Action', sql.VarChar(50), 'UPSERT_USER')
        .input('EmployeeId', sql.VarChar(50), dto.employeeId)
        .input('UserId', sql.Int, null)
        .input('RoleId', sql.Int, dto.roleId)
        .input('Username', sql.NVarChar(100), dto.username)
        .input('PasswordHash', sql.NVarChar(500), dto.passwordHash ?? null)
        .input('StatusFilter', sql.VarChar(50), null)
        .input('SecurityAction', sql.VarChar(20), null)
        .input('SearchTerm', sql.VarChar(100), null)
        .input('UpdatedBy', sql.VarChar(100), String(modifiedBy))
        .execute('USP_EmployeeUserManager');

      return {
        success: true,
        statusCode: 200,
        message: 'Employee user account saved successfully.',
        data: result.recordset?.[0] ?? null,
      };
    } catch (error) {
      console.error('updateEmployee failed:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to save employee user account.',
      );
    }
  }

  // ============================================================
  // LOCK / UNLOCK / RESET PASSWORD
  // ============================================================
  async manageSecurity(dto: UpdateEmployeeStatusDto, modifiedBy: number) {
    try {
      const pool = await this.dbService.connect();

      let passwordHash: string | null = null;

      if (dto.securityAction === 'RESET_PASSWORD') {
        if (!dto.passwordHash) {
          throw new BadRequestException(
            'Password is required for password reset.',
          );
        }

        passwordHash = await bcrypt.hash(dto.passwordHash, 10);
      }

      const result = await pool
        .request()
        .input('Action', sql.VarChar(50), 'MANAGE_SECURITY')
        .input('EmployeeId', sql.VarChar(50), null)
        .input('UserId', sql.Int, dto.userId)
        .input('RoleId', sql.Int, null)
        .input('Username', sql.NVarChar(100), null)
        .input('PasswordHash', sql.NVarChar(500), passwordHash)
        .input('StatusFilter', sql.VarChar(50), null)
        .input('SecurityAction', sql.VarChar(20), dto.securityAction)
        .input('SearchTerm', sql.VarChar(100), null)
        .input('UpdatedBy', sql.VarChar(100), String(modifiedBy))
        .execute('USP_EmployeeUserManager');

      return {
        success: true,
        statusCode: 200,
        message: 'User security updated successfully.',
        data: result.recordset?.[0] ?? null,
      };
    } catch (error) {
      console.error('manageSecurity failed:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to update user security.',
      );
    }
  }
}
