import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';

@Injectable()
export class ForceApprovalService {
  constructor(private readonly databaseService: DatabaseService) {}

  // =====================================================
  // PUNCH
  // =====================================================

  async getPunchApproval() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_ForceApproval_Punch_Get');

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching punch approval records:', error);

      throw new InternalServerErrorException(
        'Unable to fetch punch approval records.',
      );
    }
  }

  // =====================================================
  // FACE TEMPLATE
  // =====================================================

  async getFaceTemplateApproval() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_ForceApproval_FaceTemplate_Get');

      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching face template approval records:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch face template approval records.',
      );
    }
  }
}
