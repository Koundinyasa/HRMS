import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CaptchaService } from './captcha/captcha.service';

import { DatabaseModule } from '../database/database.module';
import { MailModule } from '../mail/mail.module';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  imports: [
    DatabaseModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'HRMS_SECRET_KEY',
      signOptions: {
        expiresIn: '5m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard,CaptchaService],
  exports: [JwtAuthGuard, JwtModule, AuthService],
})
export class AuthModule {}