import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';
import { CreateAttendanceConfigurationDto } from './dto/create-attendance-configuration.dto';

@Injectable()
export class ConfigurationService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // ==========================================
  // Attendance Configuration
  // ==========================================

  async getAttendanceConfiguration() {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .execute(
          'USP_GetAttendanceConfiguration',
        ); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching attendance configuration:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch attendance configuration.',
      );
    }
  }
  // ==========================================
// Salary Calendar Days
// ==========================================

async getSalaryCalendarDays() {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .execute(
        'USP_GetSalaryCalendarDays',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching salary calendar days:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch salary calendar days.',
    );
  }
}

// ==========================================
// Attendance Types
// ==========================================

async getAttendanceTypes() {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .execute(
        'USP_GetAttendanceTypes',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching attendance types:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch attendance types.',
    );
  }
}

// ==========================================
// Create Attendance Configuration
// ==========================================

async createAttendanceConfiguration(
  employeeId: string,
  dto: CreateAttendanceConfigurationDto,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .input(
        'AttendanceName',
        dto.attendanceName,
      )
      .input(
        'ShortName',
        dto.shortName,
      )
      .input(
        'SalaryCalendarDayId',
        dto.salaryCalendarDayId,
      )
      .input(
        'AttendanceTypeId',
        dto.attendanceTypeId,
      )
      .input(
        'Independent',
        dto.independent,
      )
      .input(
        'OT2Enable',
        dto.ot2Enable,
      )
      .input(
        'Overtime',
        dto.overtime,
      )
      .input(
        'LateInEarlyOut',
        dto.lateInEarlyOut,
      )
      .execute(
        'USP_CreateAttendanceConfiguration',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while creating attendance configuration:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to create attendance configuration.',
    );
  }
}

}