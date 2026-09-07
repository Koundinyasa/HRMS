


import { Module } from '@nestjs/common';
 
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminDashboardModule } from './dashboard/admin-dashboard.module';
import { DatabaseModule } from '../database/database.module';
import { AdmincenterModule } from './admincenter/admincenter.module';
// import { TalentHubModule } from './talenthub/talenthub.module';
import { EnrollmentModule } from './Enrollment/enrollment.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    DatabaseModule,
    AdminDashboardModule,
    AdmincenterModule,
    EnrollmentModule,
    // TalentHubModule,
    // BlockedUsersModule,
    // TemplateModule,
    // UserManagementModule,
  ],
})
export class AdminModule {}
