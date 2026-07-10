import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { DatabaseModule } from '../database/database.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { DashboardModule } from './dashboard/employee-dashboard.module';



@Module({
  imports: [DatabaseModule, DashboardModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, JwtAuthGuard, PermissionGuard],
})
export class EmployeeModule {}