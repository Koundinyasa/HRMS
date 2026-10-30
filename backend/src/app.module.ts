import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtConfigModule } from './common/jwt/jwt-config.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ModuleGateGuard } from './common/guards/module-gate.guard';
import { MenuAccessModule } from './common/menu/menu-access.module';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { EmployeeScopeModule } from './common/scope/employee-scope.module';

import { AuthModule } from './auth/auth.module';
import { AuthSessionModule } from './auth/session/auth-session.module';
import { EmployeeModule } from './employee/employee.module';
import { AdminModule } from './admin/admin.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { LoggerModule } from './common/logger/logger.module';
import { ReviewModule } from './review/review.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { InterviewsModule } from './recruitment/interviews/interviews.module';


@Module({

  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validationSchema,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
 
 
    JwtConfigModule,
 
    DatabaseModule,
    EmployeeScopeModule,
    MenuAccessModule,
    MailModule,

    AuthSessionModule,
    AuthModule,
    EmployeeModule,
    AdminModule,
    ChatbotModule,

    // Review Module
    ReviewModule,
    RecruitmentModule,
    InterviewsModule,

    LoggerModule,
    ReviewModule,
    // LogsModule,
  ],

  controllers: [AppController],

  providers: [
    // Order matters: authenticate, then check roles, then the Phase 1 module gate.
    // Every route requires a login unless it is marked @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ModuleGateGuard },
  ],
})


export class AppModule {}
