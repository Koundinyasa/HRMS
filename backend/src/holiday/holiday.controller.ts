import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('holiday')
export class HolidayController {
  constructor(
    private readonly holidayService: HolidayService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getHolidayList(@Req() req) {
    return this.holidayService.getHolidayList(
        req.user.employeeId,
    );
  }
}