import { Module } from '@nestjs/common';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentService } from './recruitment.service';
import { DatabaseModule } from '../database/database.module';
import { RecruitmentResumeStorageService } from './recruitment-resume-storage.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RecruitmentController],
  providers: [RecruitmentService, RecruitmentResumeStorageService],
})
export class RecruitmentModule {}