import { Module } from '@nestjs/common';

import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';

import { DatabaseModule } from '../../../../database/database.module';
import { AuthModule } from '../../../../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationModule {}
