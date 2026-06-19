// 




import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotResetPasswordDto } from './dto/forgot-reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // login(@Body() body: any) {
  //   return this.authService.login(body.userId, body.password);
  // }

  //Cookies 
  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(
      body.userId,
      body.password,
    );

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 5 * 60 * 1000,
    });

    return {
      success: true,
      message: result.message,
      isFirstLogin: result.isFirstLogin,
      data: result.data,
    };
  }

  @Post('verify-company')
  verifyCompany(@Body('tenantCode') tenantCode: string) {
    return this.authService.verifyCompany(tenantCode);
  }

  
  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  resetPassword(@Req() req, @Body() dto: ResetPasswordDto) {
    console.log(req.user);
    return this.authService.resetPassword(
      req.user.userId,
      dto,
    );
}

  @Post('send-temp-password/:employeeId')
  sendTempPassword(@Param('employeeId') employeeId: string) {
    return this.authService.sendTemporaryPassword(employeeId);
  }

  @Post('forgot-password')
  forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(
      dto.userId,
    );
  }

@Post('verify-otp')
verifyOtp(
  @Body() dto: VerifyOtpDto,
) {
  return this.authService.verifyOtp(
    dto.employeeId,
    dto.otp,
  );
}

@Post('forgot-password/reset')
resetForgotPassword(
  @Body() dto: ForgotResetPasswordDto,
) {
  return this.authService.resetForgotPassword(
    dto,
  );
}

@Post('test-mail')
testMail() {
  return this.authService.testMail();
}

}