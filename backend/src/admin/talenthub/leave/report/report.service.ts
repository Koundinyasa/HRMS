import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';

@Injectable()
export class ReportService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ==========================================
  // Pay Months
  // ==========================================

  async getMonths() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetReportMonths');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching report months:', error);

      return {
        success: false,
        message: 'Failed to fetch report months.',
      };
    }
  }

  // ==========================================
  // Attendance Independent Report
  // ==========================================

  async getAttendanceIndependentReport(month: string, groupBy?: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Month', month)
        .input('GroupBy', groupBy || null)
        .execute('USP_GetAttendanceIndependentReport');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching attendance independent report:', error);

      return {
        success: false,
        message: 'Failed to fetch attendance independent report.',
      };
    }
  }

  // ==========================================
  // Top Attendance Report
  // ==========================================

  async getTopAttendanceReport(fromMonth: string, toMonth: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromMonth', fromMonth)
        .input('ToMonth', toMonth)
        .execute('USP_GetTopAttendanceReport');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching top attendance report:', error);

      return {
        success: false,
        message: 'Failed to fetch top attendance report.',
      };
    }
  }

  // ==========================================
  // Top Leave Taken Report
  // ==========================================

  async getTopLeaveTakenReport(fromMonth: string, toMonth: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FromMonth', fromMonth)
        .input('ToMonth', toMonth)
        .execute('USP_GetTopLeaveTakenReport');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching top leave taken report:', error);

      return {
        success: false,
        message: 'Failed to fetch top leave taken report.',
      };
    }
  }
  // ==========================================
  // Availed Leave Report
  // ==========================================

  async getAvailedReport(
    companyId: number,
    fromMonth?: string,
    toMonth?: string,
    leavePolicyId?: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', companyId)
        .input('FromMonth', fromMonth || null)
        .input('ToMonth', toMonth || null)
        .input('LeavePolicyId', leavePolicyId || null)
        .execute('USP_GetAvailedReport');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching availed leave report:', error);

      return {
        success: false,
        message: 'Failed to fetch availed leave report.',
      };
    }
  }

  // ==========================================
  // Attendance Report
  // ==========================================

  async getAttendanceReport(
    companyId: number,
    fromMonth?: string,
    toMonth?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', companyId)
        .input('FromMonth', fromMonth || null)
        .input('ToMonth', toMonth || null)
        .execute('USP_GetAttendanceReport');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching attendance report:', error);

      return {
        success: false,
        message: 'Failed to fetch attendance report.',
      };
    }
  }

  // ==========================================
  // Leave Taken Report
  // ==========================================

  async getLeaveTakenReport(
    companyId: number,
    fromMonth?: string,
    toMonth?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', companyId)
        .input('FromMonth', fromMonth || null)
        .input('ToMonth', toMonth || null)
        .execute('USP_GetLeaveTakenReport');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching leave taken report:', error);

      return {
        success: false,
        message: 'Failed to fetch leave taken report.',
      };
    }
  }

  // ==========================================
  // Leave Allotment Report
  // ==========================================

  async getLeaveAllotmentReport(
    companyId: number,
    fromMonth?: string,
    toMonth?: string,
    leavePolicyId?: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyId', companyId)
        .input('FromMonth', fromMonth || null)
        .input('ToMonth', toMonth || null)
        .input('LeavePolicyId', leavePolicyId || null)
        .execute('USP_GetLeaveAllotmentReport');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching leave allotment report:', error);

      return {
        success: false,
        message: 'Failed to fetch leave allotment report.',
      };
    }
  }

  // ==========================================
  // Leave Summary Detailed Report
  // ==========================================

  async getLeaveSummaryDetailed(
    companyId: number,
    fromMonth?: string,
    toMonth?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyId', companyId)
        .input('FromMonth', fromMonth || null)
        .input('ToMonth', toMonth || null)
        .execute('USP_GetLeaveSummaryDetailed');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching leave summary detailed report:', error);

      return {
        success: false,
        message: 'Failed to fetch leave summary detailed report.',
      };
    }
  }

  // ==========================================
  // Leave History Date-Wise Report
  // ==========================================

  async getLeaveHistoryDateWiseReport(
    companyId: number,
    fromDate?: string,
    toDate?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', companyId)
        .input('FromDate', fromDate || null)
        .input('ToDate', toDate || null)
        .execute('USP_GetLeaveHistoryDateWiseReport');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching leave history date-wise report:', error);

      return {
        success: false,
        message: 'Failed to fetch leave history date-wise report.',
      };
    }
  }

  // ==========================================
  // Leave History Month-Wise Report
  // ==========================================

  async getLeaveHistoryMonthWiseReport(
    companyId: number,
    fromMonth?: string,
    toMonth?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', companyId)
        .input('FromMonth', fromMonth || null)
        .input('ToMonth', toMonth || null)
        .execute('USP_GetLeaveHistoryMonthWiseReport');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching leave history month-wise report:', error);

      return {
        success: false,
        message: 'Failed to fetch leave history month-wise report.',
      };
    }
  }

  // ==========================================
  // Generic Report Export Data
  // ==========================================

  async getReportExportData(report: string, companyId: number, body: any) {
    try {
      const pool = await this.databaseService.connect();

      const request = pool.request();

      let procedure: string;
      let fileName: string;

      switch (report) {
        case 'attendance':
          procedure = 'USP_GetAttendanceReport';
          fileName = 'attendance-report';

          request
            .input('CompanyID', companyId)
            .input('FromMonth', body.FromMonth || null)
            .input('ToMonth', body.ToMonth || null);
          break;

        case 'availed':
          procedure = 'USP_GetAvailedReport';
          fileName = 'availed-leave-report';

          request
            .input('CompanyID', companyId)
            .input('FromMonth', body.FromMonth || null)
            .input('ToMonth', body.ToMonth || null)
            .input(
              'LeavePolicyId',
              body.LeavePolicyId ? Number(body.LeavePolicyId) : null,
            );
          break;

        case 'leave-taken':
          procedure = 'USP_GetLeaveTakenReport';

          fileName = 'leave-taken-report';

          request
            .input('CompanyID', companyId)
            .input('FromMonth', body.FromMonth || null)
            .input('ToMonth', body.ToMonth || null);
          break;

        case 'allotment':
          procedure = 'USP_GetLeaveAllotmentReport';

          fileName = 'leave-allotment-report';

          request
            .input('CompanyId', companyId)
            .input('FromMonth', body.FromMonth || null)
            .input('ToMonth', body.ToMonth || null)
            .input(
              'LeavePolicyId',
              body.LeavePolicyId ? Number(body.LeavePolicyId) : null,
            );
          break;

        case 'summary-detailed':
          procedure = 'USP_GetLeaveSummaryDetailed';

          fileName = 'leave-summary-detailed-report';

          request
            .input('CompanyId', companyId)
            .input('FromMonth', body.FromMonth || null)
            .input('ToMonth', body.ToMonth || null);
          break;

        case 'history-date-wise':
          procedure = 'USP_GetLeaveHistoryDateWiseReport';

          fileName = 'leave-history-date-wise-report';

          request
            .input('CompanyID', companyId)
            .input('FromDate', body.FromDate || null)
            .input('ToDate', body.ToDate || null);
          break;

        case 'history-month-wise':
          procedure = 'USP_GetLeaveHistoryMonthWiseReport';

          fileName = 'leave-history-month-wise-report';

          request
            .input('CompanyID', companyId)
            .input('FromMonth', body.FromMonth || null)
            .input('ToMonth', body.ToMonth || null);
          break;

        default:
          throw new Error(`Invalid report: ${report}`);
      }

      const result = await request.execute(procedure);

      return {
        data: result.recordset,
        fileName,
      };
    } catch (error) {
      console.error(`Error fetching export data for ${report}:`, error);

      throw error;
    }
  }
}
