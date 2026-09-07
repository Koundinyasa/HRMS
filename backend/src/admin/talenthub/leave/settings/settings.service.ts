import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { UpdateLeavePolicySettingsDto } from './dto/update-leave-policy-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}
//======================================
// Policies
//======================================
  
  // Leave Policies

  async getLeavePolicies() {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_GetLeavePolicies'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching leave policies:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch leave policies.',
      );
    }
  }

// Policy Leaves

async getPolicyLeaves(
  policyId: number,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('PolicyId', policyId)
      .execute(
        'USP_GetPolicyLeaves',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching policy leaves:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch policy leaves.',
    );
  }
}
// ==========================================
// Leave Policy Settings
// ==========================================

async getLeavePolicySettings(
  policyId: number,
  leaveId: number,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('PolicyId', policyId)
      .input('LeaveId', leaveId)
      .execute(
        'USP_GetLeavePolicySettings',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching leave policy settings:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch leave policy settings.',
    );
  }
}
// ==========================================
// Save Leave Policy Settings
// ==========================================

async updateLeavePolicySettings(
  policyId: number,
  leaveId: number,
  dto: UpdateLeavePolicySettingsDto,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('PolicyId', policyId)
      .input('LeaveId', leaveId)
      .input(
        'EffectiveFrom',
        dto.effectiveFrom,
      )
      .input('Active', dto.active)
      .input(
        'HideInESS',
        dto.hideInESS,
      )
      .execute(
        'USP_UpdateLeavePolicySettings',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while updating leave policy settings:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to update leave policy settings.',
    );
  }
}
}