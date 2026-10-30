import { Controller, Post, Get, Body, Param, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CaptchaService } from './captcha/captcha.service';
import { AuthCookieService, ACCESS_COOKIE, REFRESH_COOKIE } from './auth-cookie.service';
import type { SessionMeta } from './session/auth-session.service';
import { Public } from '../common/decorators/public.decorator';
import { AllowWhilePasswordChangeRequired } from '../common/decorators/allow-password-change.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetForgotPasswordDto } from './dto/reset-forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendWishDto } from './dto/SendWish.dto';

// Short-lived proof that the caller just passed OTP verification.
// Scoped to /api/auth so it is only sent to the auth routes.
const RESET_COOKIE = 'pwd_reset_token';
const RESET_COOKIE_PATH = '/api/auth';
const RESET_COOKIE_MAX_AGE_MS = 10 * 60 * 1000;

// Per-IP limits (10-minute window) for the endpoints an attacker would hammer.
// Captcha and login are set generously (60) because many staff can share one
// office IP; each login also needs a captcha, and locked accounts are refused.
const TEN_MIN = 10 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
    private readonly configService: ConfigService,
    private readonly cookies: AuthCookieService,
  ) { }

  private meta(req: any): SessionMeta {
    return { ip: req.ip, userAgent: req.headers?.['user-agent'] };
  }

  private get isProd(): boolean {
    return this.configService.get<string>('environment') === 'production';
  }

  // ── Captcha ──────────────────────────────────────────────────────────────
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: TEN_MIN } })
  @Get('captcha')
  getCaptcha() {
    return this.captchaService.generate();
  }

  // ── Auth flow ─────────────────────────────────────────────────────────────
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: TEN_MIN } })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, ...result } =
      await this.authService.login(dto, this.meta(req));

    this.cookies.setAccess(res, accessToken);
    this.cookies.setRefresh(res, refreshToken);

    // Both tokens live only in their httpOnly cookies; the response body
    // never carries them, so page scripts can never read or store a token.
    return result;
  }

  // Called by the browser when the access token has expired. Public because
  // the access token is exactly what is missing; the refresh cookie (sent only
  // to /api/auth) is the credential. Rate limit is generous: it is automatic.
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 600, ttl: TEN_MIN } })
  @Post('refresh')
  async refresh(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.refresh(
        req.cookies?.[REFRESH_COOKIE],
        this.meta(req),
      );

      this.cookies.setAccess(res, result.accessToken);
      this.cookies.setRefresh(res, result.refreshToken);

      return { success: true, data: result.user };
    } catch (error) {
      // The session is over: drop both cookies so the browser stops sending them.
      // (409 retry and 503 outage keep the cookies.)
      if (error instanceof UnauthorizedException) {
        this.cookies.clear(res);
      }
      throw error;
    }
  }

  // Who am I? Lets the frontend learn the current user without keeping a
  // token in JavaScript. Goes through the global guard like every other route.
  @AllowWhilePasswordChangeRequired()
  @Get('me')
  me(@Req() req: any) {
    return this.authService.getSessionUser(req.user);
  }

  @Public()
  @Post('verify-company')
  verifyCompany(@Body('tenantCode') tenantCode: string) {
    return this.authService.verifyCompany(tenantCode);
  }

  // ── First-login password reset (requires auth) ───────────────────────────
  @AllowWhilePasswordChangeRequired()
  @Post('reset-password')
  async resetPassword(
    @Req() req,
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.resetPassword(req.user.userId, dto);

    // Every login of this user has ended, this one too: the user signs in
    // again with the new password.
    this.cookies.clear(res);

    return result;
  }

  // ── Admin / HR: email a temporary password to an employee ────────────────
  @Roles(Role.Admin, Role.HR)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: TEN_MIN } })
  @Post('send-temp-password/:employeeId')
  sendTempPassword(@Param('employeeId') employeeId: string) {
    return this.authService.sendTemporaryPassword(employeeId);
  }

  // ── Forgot password flow (3 steps, all public) ───────────────────────────
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: TEN_MIN } })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.userId);
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: TEN_MIN } })
  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { resetToken, ...result } = await this.authService.verifyOtp(
      dto.userId,
      dto.otp,
    );

    // OTP was correct: hand the browser a short-lived reset token.
    // The reset step will not run without it. It stays in the httpOnly cookie.
    res.cookie(RESET_COOKIE, resetToken, {
      httpOnly: true,
      secure: this.isProd,
      sameSite: 'lax',
      path: RESET_COOKIE_PATH,
      maxAge: RESET_COOKIE_MAX_AGE_MS,
    });

    return result;
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: TEN_MIN } })
  @Post('forgot-password/reset')
  async resetForgotPassword(
    @Req() req: any,
    @Body() dto: ResetForgotPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.resetForgotPassword(
      dto,
      req.cookies?.[RESET_COOKIE],
    );

    // Token is single-use; remove it from the browser too.
    res.clearCookie(RESET_COOKIE, {
      httpOnly: true,
      secure: this.isProd,
      sameSite: 'lax',
      path: RESET_COOKIE_PATH,
    });

    return result;
  }

  // Public so logging out still works when the access token has already
  // expired; the session is identified from the cookies (signature checked).
  @Public()
  @Post('logout')
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const who = this.authService.identifyForLogout(
      req.cookies?.[ACCESS_COOKIE],
      req.cookies?.[REFRESH_COOKIE],
    );

    await this.authService.logout(who);

    this.cookies.clear(res);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @AllowWhilePasswordChangeRequired()
  @Post('change-password')
  async changePassword(
    @Req() req: any,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { newAccessToken, ...result } = await this.authService.changePassword(
      req.user.userId,
      dto,
      { sid: req.user.sid, mustChange: req.user.mcp === true },
    );

    // The login was restricted until now; give it a token without the restriction.
    if (newAccessToken) this.cookies.setAccess(res, newAccessToken);

    return result;
  }

  @Post('send-wish')
  async sendWish(
    @Req() req: any,
    @Body() dto: SendWishDto,
  ) {
    return this.authService.sendWish(
      req.user.employeeId,
      dto,
    );
  }
}
