import { Module } from '@nestjs/common';
import { DashboardController } from './employee-dashboard.controller';
import { DashboardService } from './employee-dashboard.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule], 
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}