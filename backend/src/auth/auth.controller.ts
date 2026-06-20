import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CaptchaService } from './captcha/captcha.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
  ) { }

  @Get('captcha')
  getCaptcha() {
    return this.captchaService.generate();
  }

  @Get('captcha-debug')
  getCaptchaDebug() {
    return this.captchaService.debugStore();
  }
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
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