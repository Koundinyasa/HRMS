import { Module } from '@nestjs/common';

import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

import { DatabaseModule } from '../../../../database/database.module';
import { AuthModule } from '../../../../auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
})
export class IntegrationsModule {}