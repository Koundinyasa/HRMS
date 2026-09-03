import { Module } from '@nestjs/common';

import { BackgroundVerificationController } from './background-verification.controller';
import { BackgroundVerificationService } from './background-verification.service';

import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],

  controllers: [BackgroundVerificationController],

  providers: [BackgroundVerificationService],
})
export class BackgroundVerificationModule {}