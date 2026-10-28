import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminDashboardModule } from './dashboard/admin-dashboard.module';
import { DatabaseModule } from '../database/database.module';
import { AdmincenterModule } from './admincenter/admincenter.module';
import { AdjustmentModule } from './talenthub/leave/adjustment/adjustment.module';
import { TalenthubModule } from './talenthub/talenthub.module';
import { EnrollmentModule } from './Enrollment/enrollment.module';
import { GroupOfCompanyModule } from './group-of-company/group-of-company.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    DatabaseModule,
    AdminDashboardModule,
    AdmincenterModule,
    EnrollmentModule,
    AdjustmentModule,
    TalenthubModule,
    // BlockedUsersModule,
    // TemplateModule,
    // UserManagementModule,
  ],
})
export class AdminModule {}
