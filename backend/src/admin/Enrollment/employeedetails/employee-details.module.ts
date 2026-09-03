import { Module } from '@nestjs/common';
import { EmployeeDetailsController } from './employee-details.controller';
import { EmployeeDetailsService } from './employee-details.service';

@Module({
  controllers: [EmployeeDetailsController],
  providers: [EmployeeDetailsService],
})
export class EmployeeDetailsModule {}