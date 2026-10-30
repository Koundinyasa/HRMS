import { Controller, Get, Post, Body } from '@nestjs/common';
import { EmployeeForceApprovalService } from './employee-force-approval.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('employee-force-approval')
export class EmployeeForceApprovalController {
  constructor(
    private readonly employeeForceApprovalService: EmployeeForceApprovalService,
  ) {}

  @Get()
  getAll() {
    return this.employeeForceApprovalService.getAll();
  }

  @Get('pending')
  getPending() {
    return this.employeeForceApprovalService.getPending();
  }

  @Post('approve')
  approve(@Body() body: any) {
    return this.employeeForceApprovalService.approve(body);
  }

  @Post('reject')
  reject(@Body() body: any) {
    return this.employeeForceApprovalService.reject(body);
  }

  @Get('history')
  getHistory() {
    return this.employeeForceApprovalService.getHistory();
  }
}
