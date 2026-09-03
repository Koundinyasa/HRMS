// import { Module } from '@nestjs/common';
// import { AdminController } from './admin.controller';
// import { AdminService } from './admin.service';
// import { AdminDashboardModule } from './dashboard/admin-dashboard.module';
// import { AdmincenterModule } from './admincenter/admincenter.module';
// import { AdmincenterSettingsController } from './settings/admincenter.settings.controller';
// import { AdmincenterSettingsService } from './settings/admincenter.settings.service';
// import { AdmincenterSettingsModule } from './settings/admincenter.settings.module';

// @Module({
//   controllers: [AdminController, AdmincenterSettingsController],
//   providers: [AdminService, AdmincenterSettingsService],
//   imports: [AdminDashboardModule,AdmincenterModule, AdmincenterSettingsModule]
// })
// export class AdminModule {}


import { Module } from '@nestjs/common';
 
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminDashboardModule } from './dashboard/admin-dashboard.module';
import { DatabaseModule } from '../database/database.module';
import { AdmincenterModule } from './admincenter/admincenter.module';
// import { TalentHubModule } from './talenthub/talenthub.module';
import { EnrollmentModule } from './Enrollment/enrollment.module';
// import { BlockedUsersModule } from './blocked-users/blocked-users.module';
// import { TemplateModule } from './master/template/template.module';
// import { UserManagementModule } from './user-management/user-management.module';
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