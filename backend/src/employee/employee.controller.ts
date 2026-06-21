import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Param
} from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResetPasswordDto } from '../auth/dto/reset-password.dto';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
  ) {}


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.employeeService.getProfile(
      req.user.employeeId,
    );
  }


  @Get('welcome/:employeeId')
  getWelcome(@Param('employeeId') employeeId: string) {
    return this.employeeService.getWelcomeMessage(employeeId);
  }


  // @Post('verify-company')
  // async verifyCompany(
  //   @Body('tenantCode') tenantCode: string,
  // ) {
  //   return this.employeeService.verifyCompany(
  //     tenantCode,
  //   );
  // }


  // @UseGuards(JwtAuthGuard)
  // @Post('reset-password')
  // async resetPassword(
  //   @Req() req,
  //   @Body() dto: ResetPasswordDto,
  // ) {
  //   return this.employeeService.resetPassword(
  //     req.user.employeeId,
  //     dto,
  //   );
  // }

//   @UseGuards(JwtAuthGuard)
//   @Post('send-temp-password/:employeeId')
//   sendTempPassword(@Param('employeeId') employeeId: string) {
//     return this.employeeService.sendTemporaryPassword(employeeId);
//   }

//   @Get('route-check')
// check() {
//   return 'Employee controller is working';
// }


// @Get('test-mail')
// testMail() {
//   return this.employeeService.testMail();
// }
}