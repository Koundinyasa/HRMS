import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import * as sql from 'mssql';

@Injectable()
export class ConsolidatedSalaryService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // ==========================================
  // Consolidated Salary
  // ==========================================

  async getConsolidatedSalary(
    month?: number,
    year?: number,
    companyId?: number,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'Month',
          sql.Int,
          month ?? null,
        )
        .input(
          'Year',
          sql.Int,
          year ?? null,
        )
        .input(
          'CompanyID',
          sql.Int,
          companyId ?? null,
        )
        .execute(
          'USP_GroupCompany_ConsolidatedSalary',
        ); // Placeholder SP

      return result.recordset || [];
    } catch (error) {
      console.error(
        'Error while fetching consolidated salary:',
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Unable to fetch consolidated salary.';

      throw new InternalServerErrorException(
        message,
      );
    }
  }
}