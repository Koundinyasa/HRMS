import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';
import * as sql from 'mssql';

import { ComplianceOverviewDto } from './dto/company-compliance-overview.dto';

@Injectable()
export class ComplianceOverviewService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async getComplianceOverview(
    companyId: number,
    dto: ComplianceOverviewDto,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      request.input(
        'CompanyID',
        sql.Int,
        companyId,
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
        'USP_GetCompanyComplianceOverview',
      );

      return {
        success: true,
        message: 'Company compliance overview fetched successfully.',
        data: result.recordset?.[0] ?? null,
      };
    } catch (error) {
      console.error(
        'Error fetching company compliance overview:',
        error,
      );

      throw new InternalServerErrorException(
        'Failed to fetch company compliance overview.',
      );
    }
  }
}