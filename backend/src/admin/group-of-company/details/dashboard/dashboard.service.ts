
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';
import * as sql from 'mssql';

import { AttendanceOverviewDto } from './dto/attendance-overview.dto';
import { EmployeeDashboardDto } from './dto/employee-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) { }

  // ==========================================
  // Employee Dashboard
  // ==========================================


  async getEmployeeDashboard(
    companyId: number,
    dto: EmployeeDashboardDto,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      // CompanyID comes from JWT
      request.input(
        'CompanyID',
        sql.Int,
        companyId,
      );

      request.input(
        'BranchID',
        sql.Int,
        dto.branchId ?? null,
      );

      request.input(
        'Month',
        sql.Int,
        dto.month ?? null,
      );

      request.input(
        'Year',
        sql.Int,
        dto.year ?? null,
      );

      const result = await request.execute(
        'USP_GetEmployeeDashboard',
      );

      return {
        success: true,
        message: 'Employee dashboard fetched successfully.',
        data: result.recordset?.[0] ?? null,
      };
    } catch (error) {
      console.error(
        'Error fetching employee dashboard:',
        error,
      );

      throw new InternalServerErrorException(
        'Failed to fetch employee dashboard.',
      );
    }
  }


}
