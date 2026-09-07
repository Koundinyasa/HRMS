import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';

@Injectable()
export class HolidayService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // ==========================================
  // Holiday Months
  // ==========================================

  async getHolidayMonths() {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .execute(
          'USP_GetHolidayMonths',
        ); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching holiday months:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch holiday months.',
      );
    }
  }

  // ==========================================
  // Holiday List
  // ==========================================

  async getHolidayList(
    monthId: number,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input('MonthId', monthId)
        .execute(
          'USP_GetHolidayList',
        ); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching holiday list:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch holiday list.',
      );
    }
  }
  // ==========================================
// Add Holiday
// ==========================================

async createHoliday(
  dto: CreateHolidayDto,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('HolidayName', dto.holidayName)
      .input('HolidayDate', dto.holidayDate)
      .input(
        'NationalHoliday',
        dto.nationalHoliday,
      )
      .input(
        'RestrictedHoliday',
        dto.restrictedHoliday,
      )
      .execute(
        'USP_CreateHoliday',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while creating holiday:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to create holiday.',
    );
  }
}
// ==========================================
// Weekly Off List
// ==========================================

async getWeeklyOffList() {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .execute(
        'USP_GetWeeklyOffList',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching weekly off list:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch weekly off list.',
    );
  }
}

// ==========================================
// Upload Holiday File
// ==========================================

async uploadHolidayFile(
  file: any,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('FileName', file.originalname)
      .execute(
        'USP_UploadHolidayFile',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while uploading holiday file:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to upload holiday file.',
    );
  }
}
}