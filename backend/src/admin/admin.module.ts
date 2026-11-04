import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminDashboardModule } from './dashboard/admin-dashboard.module';
import { DatabaseModule } from '../database/database.module';
import { AdmincenterModule } from './admincenter/admincenter.module';
import { TalenthubModule } from './talenthub/talenthub.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    DatabaseModule,
    AdminDashboardModule,
    AdmincenterModule,
    TalenthubModule,
  ],
})
export class AdminModule {}
