import { Test, TestingModule } from '@nestjs/testing';
import { RecruitmentService } from './recruitment.service';
import { DatabaseService } from '../database/database.service';

describe('RecruitmentService', () => {
  let service: RecruitmentService;
  let databaseService: { connect: jest.Mock };

  beforeEach(async () => {
    databaseService = { connect: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecruitmentService,
        {
          provide: DatabaseService,
          useValue: databaseService,
        },
      ],
    }).compile();

    service = module.get<RecruitmentService>(RecruitmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('uses the interview type stored on Interviews when listing final approvals', async () => {
    const query = jest
      .fn()
      .mockResolvedValueOnce({ recordset: [{ tableExists: 0 }] })
      .mockResolvedValueOnce({ recordset: [] });
    const request = {
      input: jest.fn().mockReturnThis(),
      query,
    };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await service.getFinalApprovals({ decision: 'all' });

    const [queryText] = query.mock.calls[1];
    expect(queryText).toContain('ON IT.ID = I.InterviewType');
    expect(queryText).not.toContain('RecruitmentTechnicalRoundProgress');
    expect(queryText).toContain('TechnicalTwo.FeedbackSubmitted = 0');
  });

  it('uses the round progress table when it exists', async () => {
    const query = jest
      .fn()
      .mockResolvedValueOnce({ recordset: [{ tableExists: 1 }] })
      .mockResolvedValueOnce({ recordset: [] });
    const request = {
      input: jest.fn().mockReturnThis(),
      query,
    };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await service.getFinalApprovals({ decision: 'all' });

    const [queryText] = query.mock.calls[1];
    expect(queryText).toContain('RecruitmentTechnicalRoundProgress Progress');
    expect(queryText).toContain('Progress.Technical2Required = 1');
  });

  it('gets the hiring manager requisitions using their employee ID', async () => {
    const recordset = [{ RequisitionID: 41, JobTitle: 'Engineer' }];
    const execute = jest.fn().mockResolvedValue({ recordset });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    const pool = { request: jest.fn(() => request) };
    databaseService.connect.mockResolvedValue(pool);

    await expect(service.getPendingRequisitions('294123')).resolves.toEqual(
      recordset,
    );
    expect(request.input).toHaveBeenCalledWith(
      'EmployeeID',
      expect.anything(),
      '294123',
    );
    expect(execute).toHaveBeenCalledWith('USP_GetPendingRequisition');
  });

  it('gets job opening requisitions with recruitment priority flag 10', async () => {
    const recordset = [{ RequisitionID: 41, JobTitle: 'Engineer' }];
    const execute = jest.fn().mockResolvedValue({ recordset });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(service.getJobOpeningRequisitions(7)).resolves.toEqual({
      success: true,
      data: recordset,
      message: 'Job opening requisitions retrieved successfully.',
    });
    expect(request.input).toHaveBeenNthCalledWith(
      1,
      'CompanyID',
      expect.anything(),
      7,
    );
    expect(request.input).toHaveBeenNthCalledWith(
      2,
      'Flag',
      expect.anything(),
      10,
    );
    expect(execute).toHaveBeenCalledWith('USP_GetRecruitmentPriority');
  });

  it('surfaces the stored procedure hiring manager eligibility error', async () => {
    const execute = jest.fn().mockResolvedValue({
      recordset: [
        { StatusCode: 0, Message: 'Employee is not an active Hiring Manager.' },
      ],
    });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(service.getPendingRequisitions('294123')).rejects.toMatchObject({
      status: 403,
      response: {
        message: 'Employee is not an active Hiring Manager.',
      },
    });
  });

  it('passes the job description to the requisition procedure', async () => {
    const execute = jest.fn().mockResolvedValue({
      recordset: [{ StatusCode: 1, Message: 'Created.' }],
    });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await service.createRequisition(
      {
        companyId: 8,
        branchId: 3,
        designationId: 5,
        jobTitle: 'Engineer',
        jobDescription: 'Build and maintain recruitment software.',
        vacancies: 2,
      },
      '294123',
    );

    expect(request.input).toHaveBeenCalledWith(
      'JobDescription',
      expect.anything(),
      'Build and maintain recruitment software.',
    );
    expect(execute).toHaveBeenCalledWith('USP_JobRequisition');
  });

  it('allows an assigned hiring manager to approve a pending requisition', async () => {
    const execute = jest
      .fn()
      .mockResolvedValueOnce({
        recordset: [{ RequisitionID: 41 }],
      })
      .mockResolvedValueOnce({
        recordset: [{ StatusCode: 1, Message: 'Approved.' }],
        recordsets: [[{ StatusCode: 1, Message: 'Approved.' }]],
      });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(
      service.requisitionAction(41, 'APPROVE', '294123', 8),
    ).resolves.toEqual([{ StatusCode: 1, Message: 'Approved.' }]);
    expect(execute).toHaveBeenNthCalledWith(1, 'USP_GetPendingRequisition');
    expect(execute).toHaveBeenNthCalledWith(2, 'USP_JobRequisition');
  });

  it('prevents a hiring manager from acting on another manager requisition', async () => {
    const execute = jest.fn().mockResolvedValue({
      recordset: [{ RequisitionID: 42 }],
    });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(
      service.requisitionAction(41, 'APPROVE', '294123', 8),
    ).rejects.toMatchObject({
      status: 403,
    });
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('gets HR requisitions using the authenticated HR employee ID', async () => {
    const recordset = [{ RequisitionID: 41, JobTitle: 'Engineer' }];
    const execute = jest.fn().mockResolvedValue({ recordset });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    const pool = { request: jest.fn(() => request) };
    databaseService.connect.mockResolvedValue(pool);

    await expect(service.getAllRequisitionsForHR('294676')).resolves.toEqual({
      success: true,
      message: 'Requisitions retrieved successfully',
      data: recordset,
    });
    expect(request.input).toHaveBeenCalledWith(
      'EmployeeID',
      expect.anything(),
      '294676',
    );
    expect(execute).toHaveBeenCalledWith('dbo.USP_GetAllRequisitionsForHR');
  });

  it('gets requisition details using the selected requisition ID', async () => {
    const detail = { RequisitionID: 41, JobTitle: 'Engineer' };
    const execute = jest.fn().mockResolvedValue({ recordset: [detail] });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    const pool = { request: jest.fn(() => request) };
    databaseService.connect.mockResolvedValue(pool);

    await expect(service.getJobRequisitionDetails(41)).resolves.toEqual({
      success: true,
      message: 'Job requisition details retrieved successfully.',
      data: detail,
    });
    expect(request.input).toHaveBeenCalledWith(
      'RequisitionID',
      expect.anything(),
      41,
    );
    expect(execute).toHaveBeenCalledWith('USP_GetJobRequisitionDetails');
  });

  it('returns all verification candidates from the stored procedure', async () => {
    const recordset = [
      {
        ApplicationID: 3030,
        FullName: 'Test candidate',
        Email: 'candidate@example.com',
        Position: 'Software Engineer',
        Noofdocumentsuploded: 5,
        BGVStatus: 'Verification Completed',
        actionDate: '22-10-2026',
      },
    ];
    const execute = jest.fn().mockResolvedValue({ recordset });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    const pool = { request: jest.fn(() => request) };
    databaseService.connect.mockResolvedValue(pool);

    await expect(service.getAllVerificationCandidates('294676')).resolves
      .toEqual({
        success: true,
        statusCode: 200,
        message: 'Verification candidates retrieved successfully.',
        data: recordset,
      });
    expect(request.input).toHaveBeenCalledWith(
      'HRManagerEmployeeID',
      expect.anything(),
      '294676',
    );
    expect(execute).toHaveBeenCalledWith('USP_GetAllVerificationCandidates');
  });

  it('passes document decisions as a table-valued parameter to the BGV procedure', async () => {
    const execute = jest.fn().mockResolvedValue({
      recordset: [{ StatusCode: 200, Message: 'Documents verified.' }],
    });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    const pool = { request: jest.fn(() => request) };
    databaseService.connect.mockResolvedValue(pool);

    await expect(
      service.performBgvCandidate(
        {
          documents: [
            {
              documentId: 14,
              verificationStatus: 'Rejected',
              remarks: 'Name does not match.',
            },
          ],
        },
        '294676',
      ),
    ).resolves.toEqual({
      success: true,
      message: 'BGV document verification completed successfully.',
      data: [{ StatusCode: 200, Message: 'Documents verified.' }],
    });

    expect(request.input).toHaveBeenCalledWith(
      'HRManagerEmployeeID',
      expect.anything(),
      '294676',
    );
    const documentsParameter = request.input.mock.calls.find(
      ([name]) => name === 'Documents',
    )?.[1] as { rows: unknown[][] } | undefined;
    expect(documentsParameter?.rows).toEqual([
      [14, 'Rejected', 'Name does not match.'],
    ]);
    expect(execute).toHaveBeenCalledWith('dbo.USP_BGV_Candidate');
  });

  it('returns interview-eligible candidates in the API response shape', async () => {
    const execute = jest
      .fn()
      .mockResolvedValue({
        recordset: [
          {
            ApplicationID: 3029,
            CandidateID: 'IT26101237183023',
            CandidateName: 'Test candidate',
            Email: 'candidate@example.com',
            JobTitle: 'Senior Data Analyst',
          },
        ],
      });
    const pool = {
      request: jest.fn(() => ({
        input: jest.fn().mockReturnThis(),
        execute,
      })),
    };
    databaseService.connect.mockResolvedValue(pool);

    await expect(service.getInterviewEligibleCandidates()).resolves.toEqual([
      {
        ApplicationID: 3029,
        CandidateID: 'IT26101237183023',
        CandidateName: 'Test candidate',
        Email: 'candidate@example.com',
        JobTitle: 'Senior Data Analyst',
      },
    ]);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(
      'USP_GetCandidatesEligibleForInterview',
    );
  });

  it('passes the selected date filter and HR employee ID to scheduled-interview procedure', async () => {
    const execute = jest.fn().mockResolvedValue({
      recordset: [
        {
          StatusCode: 200,
          ScheduledDate: '2026-10-15',
          ScheduledTime: '10:30:00',
          CandidateName: 'Test candidate',
          InterviewerName: 'Test interviewer',
          InterviewType: 'Technical',
        },
      ],
    });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    const pool = { request: jest.fn(() => request) };
    databaseService.connect.mockResolvedValue(pool);

    await expect(
      service.getScheduledCandidateInterviews('294676', 'Today'),
    ).resolves.toEqual([
      {
        StatusCode: 200,
        ScheduledDate: '2026-10-15',
        ScheduledTime: '10:30:00',
        CandidateName: 'Test candidate',
        InterviewerName: 'Test interviewer',
        InterviewType: 'Technical',
      },
    ]);
    expect(request.input).toHaveBeenNthCalledWith(
      1,
      'HREmployeeID',
      expect.anything(),
      '294676',
    );
    expect(request.input).toHaveBeenNthCalledWith(
      2,
      'Filter',
      expect.anything(),
      'Today',
    );
    expect(execute).toHaveBeenCalledWith(
      'USP_GetScheduledCandidateInterviews',
    );
  });

  it('loads pending BGV documents for the HR employee and optional application', async () => {
    const procedureRows = [
      {
        StatusCode: 200,
        ApplicationID: 6,
        CandidateID: 2,
      },
    ];
    const documents = [
      {
        DocumentID: 3,
        ApplicationID: 7,
        DocumentType: 3,
        DocumentName: 'Passport',
        DocumentURL: '/Verification/7/PASSPORT.pdf',
        ActualFileName: null,
        FileName: null,
        FileExtension: null,
        UploadedDate: new Date('2026-08-14T10:00:28.420Z'),
        VerificationStatus: 'Pending',
        VerificationRemarks: null,
        VerifiedBy: null,
        VerifiedDate: null,
      },
    ];
    const execute = jest
      .fn()
      .mockResolvedValue({ recordset: procedureRows });
    const query = jest.fn().mockResolvedValue({ recordset: documents });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
      query,
    };
    const pool = {
      request: jest.fn(() => request),
    };
    databaseService.connect.mockResolvedValue(pool);

    await expect(
      service.getPendingBgvDocuments('294676', 7, 2),
    ).resolves.toEqual({
      success: true,
      statusCode: 200,
      message: 'BGV document details retrieved successfully.',
      data: documents,
    });
    expect(pool.request).toHaveBeenCalledTimes(2);
    expect(request.input).toHaveBeenCalledWith(
      'HRManagerEmployeeID',
      expect.anything(),
      '294676',
    );
    expect(request.input).toHaveBeenCalledWith(
      'ApplicationID',
      expect.anything(),
      7,
    );
    expect(request.input).toHaveBeenCalledWith('Flag', expect.anything(), 2);
    expect(execute).toHaveBeenCalledWith(
      'USP_GetPendingBGVDocuments',
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('CD.ID AS DocumentID'),
    );
  });

  it('loads the pending candidate list with flag 1 by default', async () => {
    const execute = jest.fn().mockResolvedValue({ recordset: [] });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(service.getPendingBgvDocuments('294676')).resolves.toEqual({
      success: true,
      statusCode: 200,
      message: 'Pending BGV candidate list retrieved successfully.',
      data: [],
    });
    expect(request.input).toHaveBeenCalledWith(
      'ApplicationID',
      expect.anything(),
      null,
    );
    expect(request.input).toHaveBeenCalledWith('Flag', expect.anything(), 1);
  });

  it('maps a bad-request pending-BGV procedure result to a bad-request exception', async () => {
    const execute = jest.fn().mockResolvedValue({
      recordset: [{ StatusCode: 400, StatusMessage: 'Invalid flag.' }],
    });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(service.getPendingBgvDocuments('294676')).rejects.toMatchObject(
      {
        status: 400,
        response: { message: 'Invalid flag.' },
      },
    );
  });

  it('maps a forbidden pending-BGV procedure result to a forbidden exception', async () => {
    const execute = jest.fn().mockResolvedValue({
      recordset: [
        {
          StatusCode: 403,
          StatusMessage: 'Only an active HR Manager can view pending BGV documents.',
        },
      ],
    });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    databaseService.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(service.getPendingBgvDocuments('294676')).rejects.toMatchObject(
      {
        status: 403,
        response: {
          message: 'Only an active HR Manager can view pending BGV documents.',
        },
      },
    );
  });
});
