import { Module } from '@nestjs/common';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
  ],
  controllers: [HolidayController],
  providers: [HolidayService],
})
export class HolidayModule {}