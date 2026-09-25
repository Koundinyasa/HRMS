import { Module } from '@nestjs/common';

import { TimeOfficeSettingsController } from './settings.controller';

import { TimeOfficeSettingsService } from './settings.service';

import { DatabaseModule } from '../../../../database/database.module';

@Module({
  imports: [DatabaseModule],

  controllers: [TimeOfficeSettingsController],

  providers: [TimeOfficeSettingsService],
})
export class TimeOfficeSettingsModule {}
