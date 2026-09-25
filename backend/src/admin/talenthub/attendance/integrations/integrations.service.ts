import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { AttendanceIntegrationDto } from './dto/attendance-integration.dto';
import { ReconcileLeaveUpdateDto } from './dto/reconcile-leave-update.dto';
@Injectable()
export class IntegrationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ==========================================
  // Settings
  // ==========================================
  //descriptions

  async getDescriptions() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_GetAttendanceIntegrationDescriptions'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching descriptions:', error);

      throw new InternalServerErrorException('Unable to fetch descriptions.');
    }
  }

  // Attendance Integration Types

  async getIntegrationTypes() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_GetAttendanceIntegrationTypes'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching attendance integration types:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch attendance integration types.',
      );
    }
  }

  // Applicable Attendance

  async getApplicableAttendance() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_GetApplicableAttendance'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching applicable attendance:', error);

      throw new InternalServerErrorException(
        'Unable to fetch applicable attendance.',
      );
    }
  }

  // Leave Abbreviations

  async getLeaveAbbreviations() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetLeaveAbbreviations'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching leave abbreviations:', error);

      throw new InternalServerErrorException(
        'Unable to fetch leave abbreviations.',
      );
    }
  }
  // Calculate OT

  async getCalculateOT() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetCalculateOT'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching Calculate OT options:', error);

      throw new InternalServerErrorException(
        'Unable to fetch Calculate OT options.',
      );
    }
  }

  // Save Attendance Integration

  async saveAttendanceIntegration(dto: AttendanceIntegrationDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()

        .input('Description', dto.description)
        .input('IntegrationTypeId', dto.integrationTypeId)
        .input('Url', dto.url)
        .input('UserName', dto.userName)
        .input('Password', dto.password)
        .input('ApplicableAttendanceId', dto.applicableAttendanceId)
        .input('Present', dto.present)
        .input('Absent', dto.absent)
        .input('WeeklyOff', dto.weeklyOff)
        .input('Holiday', dto.holiday)
        .input('SkipHolidays', dto.skipHolidays)
        .input('AutoIntegrationHours', dto.autoIntegrationHours)
        .input('CalculateOTId', dto.calculateOTId)
        .input('RefNo', dto.refNo)
        .input('ProcessDate', dto.processDate)
        .input('FirstHalf', dto.firstHalf)
        .input('SecondHalf', dto.secondHalf)
        .input('OTUnits', dto.otUnits)

        .execute('USP_SaveAttendanceIntegration'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while saving attendance integration:', error);

      throw new InternalServerErrorException(
        'Unable to save attendance integration.',
      );
    }
  }
  // ==========================================
  // Attendance Integration
  // ==========================================
  //- Descriptions
  async getAttendanceIntegrationDescriptions() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_GetAttendanceIntegrationDescriptions'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching attendance integration descriptions:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch attendance integration descriptions.',
      );
    }
  }
  // ==========================================
  // Reconcile Leave
  // ==========================================
  //- Leave Types
  async getReconcileLeaveTypes() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetReconcileLeaveTypes'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching reconcile leave types:', error);

      throw new InternalServerErrorException(
        'Unable to fetch reconcile leave types.',
      );
    }
  }
  // - Update
  async updateReconcileLeave(dto: ReconcileLeaveUpdateDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('LeaveTypeId', dto.leaveTypeId)
        .input('Employees', JSON.stringify(dto.employees))
        .execute('USP_UpdateReconcileLeave'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while updating reconcile leave:', error);

      throw new InternalServerErrorException(
        'Unable to update reconcile leave.',
      );
    }
  }
}
