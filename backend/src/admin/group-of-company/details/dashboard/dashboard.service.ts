import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../../../../database/database.service';
import { EmployeeDashboardDto } from './employee-dashboard.dto';

@Injectable()
export class GroupCompanyDashboardService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getEmployeeDashboard(companyId: number, dto: EmployeeDashboardDto) {
    try {
      const pool = await this.databaseService.connect();
      const request = pool.request();

      request.input('CompanyID', sql.Int, companyId);
      request.input('BranchID', sql.Int, dto.branchId ?? null);
      request.input('Month', sql.Int, dto.month ?? null);
      request.input('Year', sql.Int, dto.year ?? null);

      const result = await request.execute('USP_GetEmployeeDashboard');

      return {
        success: true,
        message: 'Employee dashboard fetched successfully.',
        data: result.recordset?.[0] ?? null,
      };
    } catch (error) {
      console.error('Error fetching employee dashboard:', error);
      throw new InternalServerErrorException(
        'Failed to fetch employee dashboard.',
      );
    }
  }
}
