import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { GroupCompanyDashboardController } from './details/dashboard/dashboard.controller';
import { GroupCompanyDashboardService } from './details/dashboard/dashboard.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GroupCompanyDashboardController],
  providers: [GroupCompanyDashboardService],
})
export class GroupOfCompanyModule {}
