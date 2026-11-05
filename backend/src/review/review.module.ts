import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { DatabaseModule } from '../database/database.module';
import { FaceReRegistrationModule } from '../employee/attendance/face-reregistration/face-reregistration.module';

@Module({
  imports: [DatabaseModule, FaceReRegistrationModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
