import { Module } from '@nestjs/common';
import { AdmincentercompanyModule } from './company/admincenter.company.module';
import { EmployeeDetailsModule } from './employee-details/employee-details.module';

@Module({
  imports: [AdmincentercompanyModule, EmployeeDetailsModule],
})
export class AdmincenterModule {}
