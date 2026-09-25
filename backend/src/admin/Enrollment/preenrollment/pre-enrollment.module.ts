import { Module } from '@nestjs/common';
import { PreEnrollmentController } from './pre-enrollment.controller';
import { PreEnrollmentService } from './pre-enrollment.service';

@Module({
  controllers: [PreEnrollmentController],
  providers: [PreEnrollmentService],
})
export class PreEnrollmentModule {}
