import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { FaceReRegistrationService } from './face-reregistration.service';

// Shared by AttendanceModule (employee requests + enroll gate) and
// ReviewModule (reporting manager approve / reject).
@Module({
  imports: [DatabaseModule],
  providers: [FaceReRegistrationService],
  exports: [FaceReRegistrationService],
})
export class FaceReRegistrationModule {}
