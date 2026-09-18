// import {
//   Controller,
//   Get,
//   Query,
//   Req,
// } from '@nestjs/common';
 
// import { ReviewService } from './review.service';
// import { MonthlyLeaveCalendarDto } from './dto/monthly-leave-calendar.dto';
// import { GetEmployeeAttendanceCountDto} from './dto/get-employee-attendance-count.dto';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
 
// @Controller('review')
// export class ReviewController {
//   constructor(
//     private readonly reviewService: ReviewService,
//   ) {}
//   @UseGuards(JwtAuthGuard)
//   @Get('monthlyleavecalendar')
//   async getMonthlyLeaveCalendar(
//     @Query() dto: MonthlyLeaveCalendarDto,
//   ) {
//     return this.reviewService.getMonthlyLeaveCalendar(dto);
//   }


//    @Get('employee-attendance-count')
//   async getEmployeeAttendanceCount(
//   @Query() dto: GetEmployeeAttendanceCountDto,
//     @Req() req: any,
//   ) {
//     return this.reviewService.getEmployeeAttendanceCount(
//       req.user.companyId,
//       dto,
//     );
//   }
// }



import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ReviewService } from './review.service';
import { MonthlyLeaveCalendarDto } from './dto/monthly-leave-calendar.dto';
import { GetEmployeeAttendanceCountDto } from './dto/get-employee-attendance-count.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('monthlyleavecalendar')
  async getMonthlyLeaveCalendar(
    @Query() dto: MonthlyLeaveCalendarDto,
  ) {
    return this.reviewService.getMonthlyLeaveCalendar(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('employee-attendance-count')
  async getEmployeeAttendanceCount(
    @Query() dto: GetEmployeeAttendanceCountDto,
    @Req() req: any,
  ) {
    return this.reviewService.getEmployeeAttendanceCount(
      req.user.companyId,
      dto,
    );
  }
}