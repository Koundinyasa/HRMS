import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CaptchaService } from './captcha/captcha.service';
import { AuthCookieService } from './auth-cookie.service';
import { SessionBoundaryEvents } from './session-boundary.events';

import { DatabaseModule } from '../database/database.module';
import { MailModule } from '../mail/mail.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  imports: [
    DatabaseModule,
    MailModule,
    // Only routes that opt in with @UseGuards(ThrottlerGuard) are limited;
    // this default applies to them unless they set their own @Throttle().
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 60 }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthCookieService, SessionBoundaryEvents, JwtAuthGuard, CaptchaService],
  // SessionBoundaryEvents lets other modules react to login/logout without
  // AuthModule depending on them.
  exports: [AuthService, SessionBoundaryEvents],
})
export class AuthModule {}
