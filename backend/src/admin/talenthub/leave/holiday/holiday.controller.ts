import {
  Controller,
  Get,
  Param,
  UseGuards,
  Body,
  Post,  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin/ta/leave/holidaysettings')
@UseGuards(JwtAuthGuard)
export class HolidayController {
  constructor(
    private readonly holidayService: HolidayService,
  ) {}

  // ==========================================
  // Holiday 
  // ==========================================
   // -Months

  @Get('months')
  async getHolidayMonths() {
    return this.holidayService.getHolidayMonths();
  }
  // Holiday List

  @Get('months/:monthId')
  async getHolidayList(
    @Param('monthId') monthId: number,
  ) {
    return this.holidayService.getHolidayList(
      monthId,
    );
  }

// Add Holiday

@Post()
async createHoliday(
  @Body() dto: CreateHolidayDto,
) {
  return this.holidayService.createHoliday(dto);
}
// ==========================================
// Weekly Off 
// ==========================================
// List

@Get('weeklyoff')
async getWeeklyOffList() {
  return this.holidayService.getWeeklyOffList();
}

// Upload Holiday File
@Post('import')
@UseInterceptors(FileInterceptor('file'))
async uploadHolidayFile(
  @UploadedFile() file: any,
) {
  return this.holidayService.uploadHolidayFile(
    file,
  );
}
}