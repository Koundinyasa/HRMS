import { Module } from '@nestjs/common';

import { RegularizationController } from './regularization.controller';
import { RegularizationService } from './regularization.service';

import { DatabaseModule } from '../../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RegularizationController],
  providers: [RegularizationService],
})
export class RegularizationModule {}
