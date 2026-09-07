import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';

import { AddPunchDto } from './dto/add-punch.dto';
import { UpdatePunchDto } from './dto/update-punch.dto';
import { RegularizePunchDto } from './dto/regularize-punch.dto';
import { CorrectStatusDto } from './dto/correct-status.dto';
import { ApplyLeaveDto } from './dto/apply-leave.dto';

@Injectable()
export class RegularizationService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // =========================================================
  // PUNCH TAB
  // =========================================================

  // 1. Get Punch Details

  async getPunchDetails(
    date: string,
    employeeId?: string,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Date', date)
        .input(
          'EmployeeId',
          employeeId || null,
        )
        .execute(
          'USP_Regularization_Punch_Get',
        );

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching punch details:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch punch details.',
      );
    }
  }

  // 2. Add Punch

  async addPunch(
    dto: AddPunchDto,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'Date',
          dto.date,
        )
        .input(
          'PunchType',
          dto.punchType,
        )
        .input(
          'Time',
          dto.time,
        )
        .input(
          'Remarks',
          dto.remarks || null,
        )
        .execute(
          'USP_Regularization_Punch_Add',
        );

      return {
        success: true,
        message: 'Punch added successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error adding punch:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to add punch.',
      );
    }
  }

  // 3. Update Punch

  async updatePunch(
    punchId: string,
    dto: UpdatePunchDto,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'PunchId',
          punchId,
        )
        .input(
          'PunchType',
          dto.punchType,
        )
        .input(
          'Time',
          dto.time,
        )
        .input(
          'Remarks',
          dto.remarks || null,
        )
        .execute(
          'USP_Regularization_Punch_Update',
        );

      return {
        success: true,
        message: 'Punch updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error updating punch:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to update punch.',
      );
    }
  }

  // =========================================================
  // MISSED PUNCH TAB
  // =========================================================

  // 4. Get Missed Punch List

  async getMissedPunch(
    fromDate: string,
    toDate: string,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'FromDate',
          fromDate,
        )
        .input(
          'ToDate',
          toDate,
        )
        .execute(
          'USP_Regularization_MissedPunch_Get',
        );

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching missed punches:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch missed punches.',
      );
    }
  }

  // 5. Get Missed Punch Details

  async getMissedPunchDetails(
    employeeId: string,
    punchDate: string,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'EmployeeId',
          employeeId,
        )
        .input(
          'PunchDate',
          punchDate,
        )
        .execute(
          'USP_Regularization_MissedPunch_Details',
        );

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching missed punch details:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch missed punch details.',
      );
    }
  }

  // 6. Regularize Missed Punch

  async regularizeMissedPunch(
    employeeId: string,
    punchDate: string,
    dto: RegularizePunchDto,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'EmployeeId',
          employeeId,
        )
        .input(
          'PunchDate',
          punchDate,
        )
        .input(
          'PunchType',
          dto.punchType,
        )
        .input(
          'Time',
          dto.time,
        )
        .input(
          'Remarks',
          dto.remarks || null,
        )
        .execute(
          'USP_Regularization_MissedPunch_Save',
        );

      return {
        success: true,
        message:
          'Missed punch regularized successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error regularizing missed punch:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to regularize missed punch.',
      );
    }
  }

  // =========================================================
  // ATTENDANCE TAB
  // =========================================================

  // 7. Get Attendance

  async getAttendance(
    month: string,
    employeeId?: string,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'Month',
          month,
        )
        .input(
          'EmployeeId',
          employeeId || null,
        )
        .execute(
          'USP_Regularization_Attendance_Get',
        );

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching attendance:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch attendance.',
      );
    }
  }

  // 8. Get Daily Log

  async getDailyLog(
    employeeId: string,
    date: string,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'EmployeeId',
          employeeId,
        )
        .input(
          'Date',
          date,
        )
        .execute(
          'USP_Regularization_Attendance_DailyLog_Get',
        );

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching daily log:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch daily log.',
      );
    }
  }

  // 9. Correct Status

  async correctStatus(
    employeeId: string,
    date: string,
    dto: CorrectStatusDto,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'EmployeeId',
          employeeId,
        )
        .input(
          'Date',
          date,
        )
        .input(
          'Status',
          dto.status,
        )
        .input(
          'Remarks',
          dto.remarks || null,
        )
        .execute(
          'USP_Regularization_Attendance_CorrectStatus',
        );

      return {
        success: true,
        message:
          'Attendance status corrected successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error correcting status:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to correct attendance status.',
      );
    }
  }

  // 10. Apply Leave

  async applyLeave(
    employeeId: string,
    date: string,
    dto: ApplyLeaveDto,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'EmployeeId',
          employeeId,
        )
        .input(
          'Date',
          date,
        )
        .input(
          'LeaveTypeId',
          dto.leaveTypeId,
        )
        .input(
          'Remarks',
          dto.remarks || null,
        )
        .execute(
          'USP_Regularization_Attendance_ApplyLeave',
        );

      return {
        success: true,
        message:
          'Leave applied successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error applying leave:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to apply leave.',
      );
    }
  }

  // 11. Add Attendance Punch

  async addAttendancePunch(
    employeeId: string,
    dto: AddPunchDto,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'EmployeeId',
          employeeId,
        )
        .input(
          'Date',
          dto.date,
        )
        .input(
          'PunchType',
          dto.punchType,
        )
        .input(
          'Time',
          dto.time,
        )
        .input(
          'Remarks',
          dto.remarks || null,
        )
        .execute(
          'USP_Regularization_Attendance_Punch_Add',
        );

      return {
        success: true,
        message:
          'Attendance punch added successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error adding attendance punch:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to add attendance punch.',
      );
    }
  }

  // 12. Update Attendance Punch

  async updateAttendancePunch(
    punchId: string,
    dto: UpdatePunchDto,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'PunchId',
          punchId,
        )
        .input(
          'PunchType',
          dto.punchType,
        )
        .input(
          'Time',
          dto.time,
        )
        .input(
          'Remarks',
          dto.remarks || null,
        )
        .execute(
          'USP_Regularization_Attendance_Punch_Update',
        );

      return {
        success: true,
        message:
          'Attendance punch updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error updating attendance punch:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to update attendance punch.',
      );
    }
  }

  // =========================================================
  // TA INSIGHTS TAB
  // =========================================================

  // 13. Get TA Insights

  async getTaInsights(
    fromDate: string,
    toDate: string,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'FromDate',
          fromDate,
        )
        .input(
          'ToDate',
          toDate,
        )
        .execute(
          'USP_Regularization_TAInsights_Get',
        );

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching TA insights:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch TA insights.',
      );
    }
  }

  // 14. Get TA Insights Details

  async getTaInsightsDetails(
    type: string,
    fromDate: string,
    toDate: string,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'Type',
          type,
        )
        .input(
          'FromDate',
          fromDate,
        )
        .input(
          'ToDate',
          toDate,
        )
        .execute(
          'USP_Regularization_TAInsights_Details',
        );

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error(
        'Error fetching TA insights details:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch TA insights details.',
      );
    }
  }
}