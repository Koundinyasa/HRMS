import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '../../database/database.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
 
@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}