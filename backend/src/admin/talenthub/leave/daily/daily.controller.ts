import {
  Controller,
  Get,
  Query,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  Res, StreamableFile,
} from '@nestjs/common';

import type { Response } from 'express';
import { DailyService } from './daily.service';
import { SaveLeaveFormDto } from './dto/save-leave-form.dto';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { ReprocessDto } from './dto/reprocess.dto';
import { UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportDailyDto } from './dto/import-daily.dto';
import { GetMonthlyLeaveCalendarDto } from './dto/get-monthly-leave-calendar.dto';
import { BulkLeaveRequestDto } from './dto/bulk-leave-request.dto';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';
import { RequiresMenu } from '../../../../common/decorators/module-gate.decorator';
import { MenuCode } from '../../../../common/constants/menu-codes';


@Roles(...ADMIN_PORTAL_ROLES)
@RequiresMenu(MenuCode.LeaveDaily)
@Controller('admin/ta/leave/daily')
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}
  //===============================
  //Apply leave
  //================================
  // Leave Policies

  @Get('policies')
  async getPolicies() {
    return this.dailyService.getPolicies();
  }

  // Pay Months

  @Get('months')
  async getMonths() {
    return this.dailyService.getMonths();
  }

  // Leave Types

  @Get('leavetypes')
  async getLeaveTypes() {
    return this.dailyService.getLeaveTypes();
  }
  // Employee Grid

  @Get('employees')
  async getEmployees(
    @Query('policyId') policyId: number,
    @Query('month') month: string,
  ) {
    return this.dailyService.getEmployees(policyId, month);
  }
  // Leave Form

  @Get('leaveform')
  async getLeaveForm(
    @Query('employeeId') employeeId: number,
    @Query('date') date: string,
  ) {
    return this.dailyService.getLeaveForm(employeeId, date);
  }
  // Save Leave Form

  @Post('leaveform')
  async saveLeaveForm(@Body() dto: SaveLeaveFormDto) {
    return this.dailyService.saveLeaveForm(dto);
  }

  // Apply Leave

  @Post('apply')
  async applyLeave(@Body() dto: ApplyLeaveDto) {
    return this.dailyService.applyLeave(dto);
  }
  // Reprocess


  //============================================
  //Import
  //=========================================

  // we can reuse the policies and months apis here because they return same data
  //- Template Types
  //operation is not known

  // ==========================================
  // Import Daily Leave
  // ==========================================

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importDailyLeave(
    @UploadedFile() file: any,
    @Body() dto: ImportDailyDto,
  ) {
    return this.dailyService.importDailyLeave(file, dto);
  }










  //Employee monthly leave calender
// Actual Sp is used here
 
@Post('monthly-leave-calendar')
async getMonthlyLeaveCalendar(
  @Req() req: any,
  @Body() dto: GetMonthlyLeaveCalendarDto,
) {
  return this.dailyService.getMonthlyLeaveCalendar(
    dto,
    req.user.companyId,
  );
}



  // Employee leave balance
//Actual sp is used here
  @Get('employee-leave-balance')
async employeeLeaveBalance(@Query('employeeId') employeeId: string) {
  return this.dailyService.employeeLeaveBalance(employeeId);
}
 

// Dropdowns
//Actual sp is used here
@Get('company-dropdown-data')
async getCompanyDropdownData(@Req() req: any) {
  return this.dailyService.getCompanyDropdownData(req.user.companyId);
}





// Employee leave request bulk
// Actual Sp is used here
// Popup: one employee, one day. Returns the SP rows as JSON, no file.
@Post('bulk-leave-request')
async bulkLeaveRequest(@Body() dto: BulkLeaveRequestDto, @Req() req: any) {
  // { logs, summary } straight from USP_BulkLeaveRequestSubmission
  return this.dailyService.bulkLeaveRequestSubmission(
    dto,
    Number(req.user?.createdBy),
  );
}
 
// Multi-select: employees and dates. Returns the Excel.
@Post('bulk-leave-request/download')
async bulkLeaveRequestDownload(
  @Body() dto: BulkLeaveRequestDto,
  @Req() req: any,
  @Res({ passthrough: true }) res: Response,
) {
  const buffer = await this.dailyService.bulkLeaveRequestExcel(
    dto,
    Number(req.user?.createdBy),
  );
 
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
 
  res.set({
    'Content-Type':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename="bulk-leave-result-${stamp}.xlsx"`,
    'Access-Control-Expose-Headers': 'Content-Disposition',
  });
 
  return new StreamableFile(buffer);
}


//=====================================================
  //Actual SP is used here
  //===================================================
    // Reprocess
  @Post('reprocess')
  async reprocess(@Body() dto: ReprocessDto) {
    return this.dailyService.reprocess(dto);
  }









    // leave dropdown for single employee
// Actual SP is used here (USP_LeaveMasterData)
@Get('leave-master-data')
getLeaveMasterData(
  @Req() req,
  @Query('employeeId') employeeId: string,
) {
  return this.dailyService.getLeaveMasterData(req.user.companyId, employeeId);
}

  
}
