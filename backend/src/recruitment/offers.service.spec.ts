import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { MailService } from '../mail/mail.service';
import { OffersService } from './offers.service';

describe('OffersService', () => {
  let service: OffersService;
  let databaseService: { connect: jest.Mock };

  beforeEach(async () => {
    databaseService = { connect: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        { provide: DatabaseService, useValue: databaseService },
        { provide: MailService, useValue: {} },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
  });

  it('returns selected candidates from USP_GetCompletedInterviews', async () => {
    const applicationDate = new Date('2026-10-28T00:00:00.000Z');
    const execute = jest.fn().mockResolvedValue({
      recordset: [
        {
          ApplicationID: 3037,
          CandidateID: 'IT26102858309303',
          CandidateName: 'Revanth',
          Email: 'revanth@gmail.com',
          JobTitle: 'ui/ux',
          ApplicationDate: applicationDate,
          ApplicationStatus: 'Selected',
        },
      ],
    });
    const request = { execute };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(service.getCompletedInterviewCandidates()).resolves.toEqual([
      {
        applicationId: 3037,
        candidateId: 'IT26102858309303',
        candidateName: 'Revanth',
        email: 'revanth@gmail.com',
        jobTitle: 'ui/ux',
        applicationDate,
        applicationStatus: 'Selected',
      },
    ]);
    expect(execute).toHaveBeenCalledWith('USP_GetCompletedInterviews');
  });
});
