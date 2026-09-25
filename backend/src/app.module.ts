import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { AppController } from './app.controller';

import { JwtConfigModule } from './common/jwt/jwt-config.module';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';

import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AdminModule } from './admin/admin.module';
import { ChatbotModule } from './chatbot/chatbot.module';
// import { LogsModule } from './logs/logs.module';
import { LoggerModule } from './common/logger/logger.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validationSchema,
    }),

    JwtConfigModule,

    DatabaseModule,
    MailModule,

    AuthModule,
    EmployeeModule,
    AdminModule,
    ChatbotModule,

    // Review Module
    ReviewModule,

    LoggerModule,
    ReviewModule,
    // LogsModule,
  ],

  controllers: [AppController],
})
export class AppModule {}
