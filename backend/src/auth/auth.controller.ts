// 




import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.userId, body.password);
  }

  @Post('verify-company')
  verifyCompany(@Body('tenantCode') tenantCode: string) {
    return this.authService.verifyCompany(tenantCode);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  resetPassword(@Req() req, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(
      req.user.employeeId,
      dto,
    );
  }

  @Post('send-temp-password/:employeeId')
  sendTempPassword(@Param('employeeId') employeeId: string) {
    return this.authService.sendTemporaryPassword(employeeId);
  }
}