import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class BackgroundVerificationService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // ==========================================
  // Dashboard
  // ==========================================

  async getDashboard(
    month?: number,
    year?: number,
    companyId?: number,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Action', 'GET_DASHBOARD')
        .input('Month', month || null)
        .input('Year', year || null)
        .input('CompanyID', companyId)
        .execute('USP_ManageBackgroundVerification');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching BGV dashboard:',
        error,
      );

      return {
        success: false,
        message: 'Failed to fetch BGV dashboard.',
      };
    }
  }

  // ==========================================
  // Initiate List
  // ==========================================

  async getInitiateList(
    searchText?: string,
    designationId?: number,
    companyId?: number,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Action', 'GET_INITIATE_LIST')
        .input('SearchText', searchText || null)
        .input(
          'DesignationID',
          designationId || null,
        )
        .input('CompanyID', companyId)
        .execute('USP_ManageBackgroundVerification');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching BGV initiate list:',
        error,
      );

      return {
        success: false,
        message:
          'Failed to fetch BGV initiate list.',
      };
    }
  }

  // ==========================================
  // Initiate BGV
  // ==========================================

  async initiateBGV(
    applicationIds: string,
    verifiedBy?: number,
    remarks?: string,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Action', 'INITIATE_BGV')
        .input(
          'ApplicationIDs',
          applicationIds,
        )
        .input(
          'VerifiedBy',
          verifiedBy || null,
        )
        .input(
          'Remarks',
          remarks || null,
        )
        .execute('USP_ManageBackgroundVerification');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error initiating BGV:',
        error,
      );

      return {
        success: false,
        message: 'Failed to initiate BGV.',
      };
    }
  }

  // ==========================================
  // Ongoing BGV List
  // ==========================================

  async getOngoingList(
    searchText?: string,
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
          'Action',
          'GET_ONGOING_LIST',
        )
        .input(
          'SearchText',
          searchText || null,
        )
        .input(
          'Month',
          month || null,
        )
        .input(
          'Year',
          year || null,
        )
        .input(
          'CompanyID',
          companyId,
        )
        .execute('USP_ManageBackgroundVerification');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching ongoing BGV list:',
        error,
      );

      return {
        success: false,
        message:
          'Failed to fetch ongoing BGV list.',
      };
    }
  }

  // ==========================================
  // Verification Checklist
  // ==========================================

  async getVerificationChecklist(
    bgvId: number,
    companyId?: number,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'Action',
          'GET_VERIFICATION_CHECKLIST',
        )
        .input('BGVId', bgvId)
        .input('CompanyID', companyId)
        .execute('USP_ManageBackgroundVerification');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching BGV verification checklist:',
        error,
      );

      return {
        success: false,
        message:
          'Failed to fetch BGV verification checklist.',
      };
    }
  }

  // ==========================================
  // Completed BGV List
  // ==========================================

  async getCompletedList(
    searchText?: string,
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
          'Action',
          'GET_COMPLETED_LIST',
        )
        .input(
          'SearchText',
          searchText || null,
        )
        .input(
          'Month',
          month || null,
        )
        .input(
          'Year',
          year || null,
        )
        .input(
          'CompanyID',
          companyId,
        )
        .execute('USP_ManageBackgroundVerification');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching completed BGV list:',
        error,
      );

      return {
        success: false,
        message:
          'Failed to fetch completed BGV list.',
      };
    }
  }

  // ==========================================
  // Get Settings
  // ==========================================

  async getSettings(
    companyId?: number,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'Action',
          'GET_SETTINGS',
        )
        .input(
          'CompanyID',
          companyId,
        )
        .execute('USP_ManageBackgroundVerification');

      return {
        success: true,
        data: result.recordsets,
      };
    } catch (error) {
      console.error(
        'Error fetching BGV settings:',
        error,
      );

      return {
        success: false,
        message:
          'Failed to fetch BGV settings.',
      };
    }
  }

  // ==========================================
  // Save Settings
  // ==========================================
async saveSettings(
  companyId: number,
  configKey?: string,
  configValue?: string,
  requireExternalVerifier?: boolean,
  modifiedBy?: number,
) {
  try {
    console.log('BGV SAVE SETTINGS PARAMETERS:', {
      Action: 'SAVE_SETTINGS',
      CompanyID: companyId,
      CompanyIDType: typeof companyId,
      ConfigKey: configKey,
      ConfigKeyType: typeof configKey,
      ConfigValue: configValue,
      ConfigValueType: typeof configValue,
      RequireExternalVerifier: requireExternalVerifier,
      RequireExternalVerifierType:
        typeof requireExternalVerifier,
      ModifiedBy: modifiedBy,
      ModifiedByType: typeof modifiedBy,
    });

    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('Action', 'SAVE_SETTINGS')
      .input('CompanyID', companyId)
      .input('ConfigKey', configKey || null)
      .input('ConfigValue', configValue || null)
      .input(
        'RequireExternalVerifier',
        requireExternalVerifier ?? null,
      )
      .input('ModifiedBy', modifiedBy ?? null)
      .execute('USP_ManageBackgroundVerification');

    return {
      success: true,
      data: result.recordset,
    };
  } catch (error: any) {
    console.error('BGV SAVE SETTINGS ERROR:', error);

    return {
      success: false,
      message:
        error?.message ||
        'Failed to save BGV settings.',
    };
  }
}

  // ==========================================
  // Audit Logs
  // ==========================================

  async getAuditLogs(
    searchText?: string,
    userId?: number,
    employeeName?: string,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'Action',
          'GET_AUDIT_LOGS',
        )
        .input(
          'SearchText',
          searchText || null,
        )
        .input(
          'UserID',
          userId || null,
        )
        .input(
          'EmployeeName',
          employeeName || null,
        )
        .execute('USP_ManageBackgroundVerification');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching BGV audit logs:',
        error,
      );

      return {
        success: false,
        message:
          'Failed to fetch BGV audit logs.',
      };
    }
  }
}