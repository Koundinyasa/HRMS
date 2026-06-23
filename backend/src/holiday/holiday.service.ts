import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HolidayService {
  constructor(
    private readonly dbService: DatabaseService,
  ) {}

  async getHolidayList(employeeId: string) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_GetUserInfo');

    console.log(result.recordsets);

    return {
      success: true,
      data: result.recordsets[2],
    };
  }
}