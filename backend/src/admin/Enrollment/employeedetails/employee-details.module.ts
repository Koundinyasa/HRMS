import { Module } from '@nestjs/common';
import { EmployeeDetailsController } from './employee-details.controller';
import { EmployeeDetailsService } from './employee-details.service';
import { DatabaseModule } from '../../../database/database.module';
import { MailModule } from '../../../mail/mail.module';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [EmployeeDetailsController],
  providers: [EmployeeDetailsService],
})
export class EmployeeDetailsModule {}
