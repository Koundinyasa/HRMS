// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import configuration from './config/configuration';
// import { validationSchema } from './config/validation.schema';
// import { AppController } from './app.controller';

// import { JwtConfigModule } from './common/jwt/jwt-config.module';
// import { DatabaseModule } from './database/database.module';
// import { MailModule } from './mail/mail.module';

// import { AuthModule } from './auth/auth.module';
// import { EmployeeModule } from './employee/employee.module';
// import { AdminModule } from './admin/admin.module';
// import { ChatbotModule } from './chatbot/chatbot.module';
// // import { LogsModule } from './logs/logs.module';
// import { LoggerModule } from './common/logger/logger.module';
// import { ReviewModule } from './review/review.module';
// import { RecruitmentModule } from './recruitment/recruitment.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '.env',
//       load: [configuration],
//       validationSchema,
//     }),
//     ServeStaticModule.forRoot({
//       rootPath: join(process.cwd(), 'uploads'),
//       serveRoot: '/uploads',
//     }),

//     JwtConfigModule,

//     DatabaseModule,
//     MailModule,

//     AuthModule,
//     EmployeeModule,
//     AdminModule,
//     ChatbotModule,

//     // Review Module
//     ReviewModule,
//     RecruitmentModule,

//     LoggerModule,
//     ReviewModule,
//     // LogsModule,
//   ],

//   controllers: [AppController],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
    MailModule,

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
})


export class AppModule {}
