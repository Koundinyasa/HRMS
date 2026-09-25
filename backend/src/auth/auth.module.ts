import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CaptchaService } from './captcha/captcha.service';

import { DatabaseModule } from '../database/database.module';
import { MailModule } from '../mail/mail.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { ChatbotModule } from '../chatbot/chatbot.module';

@Module({
  imports: [DatabaseModule, MailModule, forwardRef(() => ChatbotModule)],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, CaptchaService, PermissionGuard],
  exports: [AuthService],
})
export class AuthModule {}
