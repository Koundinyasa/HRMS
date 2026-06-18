// import { Controller, Get } from '@nestjs/common';

// @Controller('employee')
// export class EmployeeController {

//   @Get()
//   getAll() {
//     return {
//       message: 'Employee List'
//     };
//   }
// }

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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
  ) {}

  // @Post('login')
  // async login(@Body() body: any) {
  //   return this.employeeService.login(
  //     body.userId,
  //     body.password,
  //   );
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.employeeService.getProfile(
      req.user.employeeId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('menus')
  getMenus(@Req() req) {
    return this.employeeService.getRoleMenus(req.user.employeeId);
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