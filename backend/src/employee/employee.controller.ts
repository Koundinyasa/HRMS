import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
 
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
 
@Controller('employee')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
  ) {}
 
  @Get('profile/info')
  async getEmployeeInfo(@Req() req: any) {
    return await this.employeeService.getEmployeeInfo(
      req.user.employeeId,
    );
  }
}
 