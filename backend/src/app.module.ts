import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { EmployeeModule } from './employee/employee.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { HolidayModule } from './holiday/holiday.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    EmployeeModule,
    MailModule,
    AuthModule,
    HolidayModule,
  ],
  controllers: [AppController],
})
export class AppModule {}