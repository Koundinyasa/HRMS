import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { DatabaseModule } from '../database/database.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { LeaveModule } from './leave/leave.module';       
import { AssetModule } from './asset/asset.module';
import { SeparationModule } from './separation/separation.module';
import { MyprofileModule } from './myprofile/myprofile.module';
import { DashboardModule } from './dashboard/employee-dashboard.module';


@Module({
  imports: [DatabaseModule,DashboardModule, LeaveModule, AssetModule, SeparationModule, MyprofileModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, JwtAuthGuard, PermissionGuard],
})
export class EmployeeModule {}