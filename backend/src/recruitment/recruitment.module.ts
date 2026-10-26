import { Module } from '@nestjs/common';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentService } from './recruitment.service';
import { DatabaseModule } from '../database/database.module';
import { RecruitmentResumeStorageService } from './recruitment-resume-storage.service';
import { RecruitmentCandidateDocumentStorageService } from './recruitment-candidate-document-storage.service';
import { MailModule } from '../mail/mail.module';
import { FinalApprovalsController } from './final-approvals.controller';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { BgvController } from './bgv.controller';
import { BgvService } from './bgv.service';
import { JoiningsController } from './joinings.controller';
import { JoiningsService } from './joinings.service';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [
    RecruitmentController,
    FinalApprovalsController,
    OffersController,
    BgvController,
    JoiningsController,
  ],
  providers: [
    RecruitmentService,
    OffersService,
    BgvService,
    JoiningsService,
    RecruitmentResumeStorageService,
    RecruitmentCandidateDocumentStorageService,
  ],
  exports: [RecruitmentService],
})
export class RecruitmentModule {}
