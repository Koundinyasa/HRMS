import { Module } from '@nestjs/common';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { DatabaseModule } from '../../database/database.module';
import { JwtConfigModule } from '../../common/jwt/jwt-config.module';

@Module({
  imports: [DatabaseModule, JwtConfigModule],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class AdminDashboardModule {}
