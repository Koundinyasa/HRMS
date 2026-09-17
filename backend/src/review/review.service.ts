import { Injectable ,BadRequestException} from '@nestjs/common';
import * as sql from 'mssql';
 
import { DatabaseService } from '../database/database.service';
import { MonthlyLeaveCalendarDto } from "./dto/monthly-leave-calendar.dto"
import { GetEmployeeAttendanceCountDto} from './dto/get-employee-attendance-count.dto';
@Injectable()
export class ReviewService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}
 
  async getMonthlyLeaveCalendar(
    dto: MonthlyLeaveCalendarDto,
  ) {
    const pool = await this.databaseService.connect();
 
    const result = await pool
      .request()
      .input(
        'Year',
        sql.Int,
        dto.year ?? null,
      )
      .input(
        'Month',
        sql.Int,
        dto.month ?? null,
      )
      .input(
        'CompanyId',
        sql.Int,
        dto.companyId,
      )
      .input(
        'BranchId',
        sql.Int,
        dto.branchId ?? null,
      )
      .execute('usp_GetMonthlyLeaveCalendar');
 
    return result.recordset;
  }


  async getEmployeeAttendanceCount(
  companyId: number,
  dto: GetEmployeeAttendanceCountDto,
) {
  try {
    const pool = await this.databaseService.connect();
 
    const result = await pool
      .request()
      .input('CompanyID', sql.Int, companyId)
      .input('EmployeeID', sql.Int, dto.employeeId ?? null)
      .input('Month', sql.Int, dto.month ?? null)
      .input('Year', sql.Int, dto.year ?? null)
      .execute('USP_GetEmployeeAttendanceCount');
 
    return {
      success: true,
      message: 'Employee attendance count fetched successfully.',
      data: result.recordset,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch employee attendance count.';
 
    throw new BadRequestException(message);
  }
}
}