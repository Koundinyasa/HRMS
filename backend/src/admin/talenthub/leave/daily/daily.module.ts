import { Module } from '@nestjs/common';
import { DailyController } from './daily.controller';
import { DailyService } from './daily.service';
import { DatabaseModule } from '../../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DailyController],
  providers: [DailyService],
})
export class DailyModule {}
