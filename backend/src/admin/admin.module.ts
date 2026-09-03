import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminDashboardModule } from './dashboard/admin-dashboard.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [AdminDashboardModule]
})
export class AdminModule {}
