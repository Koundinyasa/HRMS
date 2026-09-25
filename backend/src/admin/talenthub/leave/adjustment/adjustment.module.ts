import { Module } from '@nestjs/common';
import { AdjustmentController } from './adjustment.controller';
import { AdjustmentService } from './adjustment.service';
import { DatabaseModule } from '../../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AdjustmentController],
  providers: [AdjustmentService],
})
export class AdjustmentModule {}
