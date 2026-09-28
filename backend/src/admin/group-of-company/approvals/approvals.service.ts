import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class ApprovalsService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // ==========================================
  // All Company Approvals
  // ==========================================

  async getAllCompanyApprovals() {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .execute(
          'USP_GroupCompany_GetAllApprovals',
        ); // Placeholder SP

      return result.recordset || [];
    } catch (error) {
      console.error(
        'Error while fetching company approvals:',
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Unable to fetch company approvals.';

      throw new InternalServerErrorException(
        message,
      );
    }
  }
}