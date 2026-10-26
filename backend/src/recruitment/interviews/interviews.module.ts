import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RecruitmentModule } from '../recruitment.module';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';

@Module({
  imports: [DatabaseModule, RecruitmentModule],
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
