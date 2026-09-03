import { Controller, Body, Get, Put, Req, UseGuards, ParseIntPipe, Param, Post } from '@nestjs/common';
import { AdmincenterSettingService } from './admincenter.setting.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UpdatePayrollConfigurationDto } from './dto/update-payroll-configuration.dto';
import { AddReminderDto } from './dto/add-reminder.dto';
import { UpdateReminderStatusDto } from './dto/update-reminder-status.dto';

@Controller('admin/setting')
@UseGuards(JwtAuthGuard)
export class AdmincenterSettingController {
  constructor(
    private readonly admincenterSettingService: AdmincenterSettingService,
  ) {}

  @Get('payroll')
  getPayrollConfiguration(@Req() req) {
    return this.admincenterSettingService.getPayrollConfiguration(
      req.user.companyId,
    );
  }

 @Get('payroll/masters')
  getPayrollMasters() {
    return this.admincenterSettingService.getPayrollMasters();
  }

  @Put('payroll')
  updatePayrollConfiguration(
    @Body() dto: UpdatePayrollConfigurationDto,
    @Req() req: any,
  ) {
    return this.admincenterSettingService.updatePayrollConfiguration(
      dto,
      req.user.companyId,
      req.user.createdBy,
    );
  }

  
  @Get('reminder')
  getReminderEmailConfiguration(@Req() req: any) {
    return this.admincenterSettingService.getReminderEmailConfiguration(
      req.user.companyId,
    );
  }

  @Get('reminder/:reminderTypeId')
  getReminderDetails(
    @Param('reminderTypeId', ParseIntPipe) reminderTypeId: number,
    @Req() req: any,
  ) {
    return this.admincenterSettingService.getReminderDetails(
      req.user.companyId,
      reminderTypeId,
    );
  }

  @Post('reminder')
  addReminder(
    @Body() dto: AddReminderDto,
    @Req() req: any,
  ) {
    return this.admincenterSettingService.addReminder(
      dto,
      req.user.createdBy,
    );
  }


  @Put('reminder/status')
  async updateReminderStatus(
    @Body() dto: UpdateReminderStatusDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.admincenterSettingService.updateReminderStatus(
      dto,
      modifiedBy,
    );
  }

//   1. Email Settings 
// We'll first find the real Email-related SPs, then implement only the operations supported by the screen.

// 2. Tenant Settings 
// After Email, we'll do Tenant Settings, including any configuration such as 
// IP/company-logo functionality if those belong to this screen.

}