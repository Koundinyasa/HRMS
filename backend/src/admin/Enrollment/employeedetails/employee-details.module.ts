import { Module } from '@nestjs/common';
import { EmployeeDetailsController } from './employee-details.controller';
import { EmployeeDetailsService } from './employee-details.service';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeeDetailsController],
  providers: [EmployeeDetailsService],
})
export class EmployeeDetailsModule {}