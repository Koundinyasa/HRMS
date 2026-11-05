import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '../../database/database.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { FaceReRegistrationModule } from './face-reregistration/face-reregistration.module';

@Module({
  imports: [HttpModule, DatabaseModule, FaceReRegistrationModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
