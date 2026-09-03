import { Module } from '@nestjs/common';
import { AdmincenterSettingService } from './admincenter.setting.service';
import { AdmincenterSettingController } from './admincenter.setting.controller';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AdmincenterSettingService],
  controllers: [AdmincenterSettingController]
})
export class AdmincenterSettingModule {}
