import { Test, TestingModule } from '@nestjs/testing';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentResumeStorageService } from './recruitment-resume-storage.service';
import { RecruitmentCandidateDocumentStorageService } from './recruitment-candidate-document-storage.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MailService } from '../mail/mail.service';

describe('RecruitmentController', () => {
  let controller: RecruitmentController;
  const createJobOpening = jest.fn();

  beforeEach(async () => {
    createJobOpening.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruitmentController],
      providers: [
        {
          provide: RecruitmentService,
          useValue: { createJobOpening },
        },
        {
          provide: RecruitmentResumeStorageService,
          useValue: {},
        },
        {
          provide: RecruitmentCandidateDocumentStorageService,
          useValue: {},
        },
        {
          provide: MailService,
          useValue: {
            sendWelcomeEmail: jest.fn(),
            sendJoiningEmail: jest.fn(),
            sendInterviewInvitation: jest.fn(),
            sendTeamAssignmentEmail: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RecruitmentController>(RecruitmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a job opening using the authenticated employee ID', async () => {
    const response = [{ StatusCode: 200, JobOpeningID: 101 }];
    createJobOpening.mockResolvedValue(response);

    await expect(
      controller.createJobOpening(
        { requisitionId: 3042 },
        { user: { employeeId: '294676' } },
      ),
    ).resolves.toBe(response);

    expect(createJobOpening).toHaveBeenCalledWith(3042, '294676');
  });
});
