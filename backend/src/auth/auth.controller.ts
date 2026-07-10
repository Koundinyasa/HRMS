import { Controller, Post, Get, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CaptchaService } from './captcha/captcha.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetForgotPasswordDto } from './dto/reset-forgot-password.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
    private readonly configService: ConfigService,
  ) { }

  // ── Captcha ──────────────────────────────────────────────────────────────
  @Get('captcha')
  getCaptcha() {
    return this.captchaService.generate();
  }

  // ── Auth flow ─────────────────────────────────────────────────────────────
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    const isProd = this.configService.get<string>('environment') === 'production';

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: false,           // HTTPS only in production
      // sameSite: isProd ? 'strict' : 'lax',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,  // matches JWT_EXPIRES_IN (24h)
    });

    return result;
  }

  @Post('verify-company')
  verifyCompany(@Body('tenantCode') tenantCode: string) {
    return this.authService.verifyCompany(tenantCode);
  }

  // ── First-login password reset (requires auth) ───────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  resetPassword(@Req() req, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(req.user.userId, dto);
  }

  // ── Forgot password flow (3 steps) ───────────────────────────────────────
  @Post('send-temp-password/:employeeId')
  sendTempPassword(@Param('employeeId') employeeId: string) {
    return this.authService.sendTemporaryPassword(employeeId);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.userId);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.employeeId, dto.otp);
  }

  @Post('forgot-password/reset')
  resetForgotPassword(@Body() dto: ResetForgotPasswordDto) {
    return this.authService.resetForgotPassword(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.employeeId);

    const isProd =
      this.configService.get<string>('environment') === 'production';

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}