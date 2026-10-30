import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

import { RegularizationService } from './regularization.service';

import { AddPunchDto } from './dto/add-punch.dto';
import { UpdatePunchDto } from './dto/update-punch.dto';
import { RegularizePunchDto } from './dto/regularize-punch.dto';
import { CorrectStatusDto } from './dto/correct-status.dto';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES, Role } from '../../../../common/constants/roles';
import { EmployeeScopeService } from '../../../../common/scope/employee-scope.service';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('admin/timeattendance/timeoffice/regularization')
@UseGuards(JwtAuthGuard)
export class RegularizationController {
  constructor(
    private readonly regularizationService: RegularizationService,
    private readonly scope: EmployeeScopeService,
  ) {}

  // =========================================================
  // PUNCH TAB
  // =========================================================

  // 1. Get Punch Details
  @Get('punch')
  async getPunchDetails(
    @Query('date') date: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.regularizationService.getPunchDetails(date, employeeId);
  }

  // 2. Add Punch
  @Post('punch')
  async addPunch(@Body() dto: AddPunchDto) {
    return this.regularizationService.addPunch(dto);
  }

  // 3. Update Punch
  @Put('punch/:punchId')
  async updatePunch(
    @Param('punchId') punchId: string,
    @Body() dto: UpdatePunchDto,
  ) {
    return this.regularizationService.updatePunch(punchId, dto);
  }

  // =========================================================
  // MISSED PUNCH TAB
  // =========================================================

  // 4. Get Missed Punch List
  @Get('missedpunch')
  async getMissedPunch(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.regularizationService.getMissedPunch(fromDate, toDate);
  }

  // 5. Get Missed Punch Regularization Details
  @Get('missedpunch/:employeeId/:punchDate')
  async getMissedPunchDetails(
    @Param('employeeId') employeeId: string,
    @Param('punchDate') punchDate: string,
  ) {
    return this.regularizationService.getMissedPunchDetails(
      employeeId,
      punchDate,
    );
  }

  // 6. Save Missed Punch Regularization
  @Post('missedpunch/regularize')
  async regularizeMissedPunch(
    @Query('employeeId') employeeId: string,
    @Query('punchDate') punchDate: string,
    @Body() dto: RegularizePunchDto,
  ) {
    return this.regularizationService.regularizeMissedPunch(
      employeeId,
      punchDate,
      dto,
    );
  }

  // =========================================================
  // ATTENDANCE TAB
  // =========================================================

  // 7. Get Attendance Matrix
  @Get('attendance')
  async getAttendance(
    @Query('month') month: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.regularizationService.getAttendance(month, employeeId);
  }

  // 8. Get Daily Log
  @Get('attendance/dailylog')
  async getDailyLog(
    @Query('employeeId') employeeId: string,
    @Query('date') date: string,
  ) {
    return this.regularizationService.getDailyLog(employeeId, date);
  }

  // 9. Correct Status
  @Put('attendance/dailylog/status')
  async correctStatus(
    @Query('employeeId') employeeId: string,
    @Query('date') date: string,
    @Body() dto: CorrectStatusDto,
  ) {
    return this.regularizationService.correctStatus(employeeId, date, dto);
  }

  // 10. Apply Leave
  @Post('attendance/dailylog/leave')
  async applyLeave(
    @Query('employeeId') employeeId: string,
    @Query('date') date: string,
    @Body() dto: ApplyLeaveDto,
  ) {
    return this.regularizationService.applyLeave(employeeId, date, dto);
  }

  // 11. Add Punch from Attendance Daily Log
  // EMPLOYEE PORTAL: also used by reporting managers (Review > Time Office > Punch).
  // The target must be the caller, a direct report, or (HR Admin) anyone in
  // the caller's company.
  @Roles(Role.Admin, Role.HR, Role.Employee)
  @Post('attendance/dailylog/punch')
  async addAttendancePunch(
    @Req() req: any,
    @Query('employeeId') employeeId: string,
    @Body() dto: AddPunchDto,
  ) {
    await this.scope.assertCanAccess(req.user, employeeId);
    return this.regularizationService.addAttendancePunch(
      String(employeeId).trim(),
      dto,
    );
  }

  // 12. Edit Punch from Attendance Daily Log
  @Put('attendance/dailylog/punch/:punchId')
  async updateAttendancePunch(
    @Param('punchId') punchId: string,
    @Body() dto: UpdatePunchDto,
  ) {
    return this.regularizationService.updateAttendancePunch(punchId, dto);
  }

  // =========================================================
  // TA INSIGHTS TAB
  // =========================================================

  // 13. Get TA Insights Summary
  @Get('tainsights')
  async getTaInsights(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.regularizationService.getTaInsights(fromDate, toDate);
  }

  // 14. Get TA Insights Details
  @Get('tainsights/details')
  async getTaInsightsDetails(
    @Query('type') type: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.regularizationService.getTaInsightsDetails(
      type,
      fromDate,
      toDate,
    );
  }
}
