import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { DatabaseModule } from '../database/database.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';
import { AssetModule } from './asset/asset.module';
import { SeparationModule} from './separation/separation.module';
import { HelpdeskModule } from './helpdesk/helpdesk.module';
import { DashboardModule } from './dashboard/employee-dashboard.module';


@Module({
  imports: [DatabaseModule,AttendanceModule, LeaveModule, AssetModule, SeparationModule, HelpdeskModule, DashboardModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, JwtAuthGuard, PermissionGuard],
})
export class EmployeeModule {}