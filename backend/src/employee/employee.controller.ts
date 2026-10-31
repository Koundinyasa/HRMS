import { Controller, Get, Req } from '@nestjs/common';

import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('profile/info')
  async getEmployeeInfo(@Req() req: any) {
    return await this.employeeService.getEmployeeInfo(req.user.employeeId);
  }
}
