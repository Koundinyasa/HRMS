import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('admin/ta/leave/holidaysettings')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

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
  async getHolidayList(@Param('monthId') monthId: number) {
    return this.holidayService.getHolidayList(monthId);
  }

  // Add Holiday

  @Post()
  async createHoliday(@Body() dto: CreateHolidayDto) {
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
  async uploadHolidayFile(@UploadedFile() file: any) {
    return this.holidayService.uploadHolidayFile(file);
  }
}
