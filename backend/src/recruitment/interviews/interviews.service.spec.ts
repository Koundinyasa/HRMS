import { InterviewsService } from './interviews.service';
import { DatabaseService } from '../../database/database.service';
import { RecruitmentService } from '../recruitment.service';
import * as sql from 'mssql';

describe('InterviewsService', () => {
  let service: InterviewsService;
  let database: { connect: jest.Mock };
  let recruitment: {
    getInterviewEligibleCandidates: jest.Mock;
    getScheduledCandidateInterviews: jest.Mock;
  };

  beforeEach(() => {
    database = { connect: jest.fn() };
    recruitment = {
      getInterviewEligibleCandidates: jest.fn(),
      getScheduledCandidateInterviews: jest.fn(),
    };
    service = new InterviewsService(
      database as unknown as DatabaseService,
      recruitment as unknown as RecruitmentService,
    );
  });

  it('returns only eligible candidates to the scheduling screen', async () => {
    recruitment.getInterviewEligibleCandidates.mockResolvedValue([
      {
        ApplicationID: 101,
        CandidateID: 'CAND-101',
        CandidateName: 'Test candidate',
        Email: 'candidate@example.com',
        JobTitle: 'Engineer',
      },
    ]);

    await expect(service.pendingSchedule()).resolves.toEqual([
      {
        applicationId: 101,
        applicationCode: 'APP-101',
        candidateCode: 'CAND-101',
        candidateName: 'Test candidate',
        candidateEmail: 'candidate@example.com',
        position: 'Engineer',
      },
    ]);
    expect(recruitment.getInterviewEligibleCandidates).toHaveBeenCalledTimes(1);
  });

  it('uses the selected filter and paginates scheduled interviews', async () => {
    recruitment.getScheduledCandidateInterviews.mockResolvedValue([
      {
        ScheduledDate: '2026-10-15',
        ScheduledTime: '10:30:00',
        CandidateName: 'Test candidate',
        InterviewerName: 'Test interviewer',
        InterviewType: 'Technical',
      },
      {
        ScheduledDate: '2026-10-15',
        ScheduledTime: '11:30:00',
        CandidateName: 'Other candidate',
        InterviewerName: 'Other interviewer',
        InterviewType: 'HR',
      },
    ]);

    const result = await service.list('294676', {
      period: 'today',
      search: 'technical',
      page: 1,
      limit: 1,
    });

    expect(recruitment.getScheduledCandidateInterviews).toHaveBeenCalledWith(
      '294676',
      'Today',
    );
    expect(result).toMatchObject({
      data: [
        {
          scheduledAt: '2026-10-15T10:30:00',
          candidateName: 'Test candidate',
          interviewerName: 'Test interviewer',
          interviewType: 'Technical',
        },
      ],
      meta: { total: 1, page: 1, limit: 1, totalPages: 1 },
    });
  });

  it('gets the interviewer feedback worklist from USP_GetMyInterviews', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    pastDate.setHours(0, 0, 0, 0);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const interviewExecute = jest.fn().mockResolvedValue({
      recordset: [
        {
          InterviewID: 55,
          CandidateID: 'CAND-101',
          CandidateName: 'Test candidate',
          Email: 'candidate@example.com',
          JobTitle: 'Engineer',
          Round: 1,
          InterviewType: 'Technical',
          ScheduledDate: pastDate,
          ScheduledTime: '10:30 AM',
          InterviewerEmployeeID: '294676',
          InterviewStatus: 'Scheduled',
          Rating: null,
          Feedback: null,
          FeedbackCategory: 'Technical Knowledge',
          CategoryRating: 9,
          CategoryComments: 'Strong technical fundamentals.',
        },
        {
          InterviewID: 55,
          CandidateID: 'CAND-101',
          CandidateName: 'Test candidate',
          Email: 'candidate@example.com',
          JobTitle: 'Engineer',
          Round: 1,
          InterviewType: 'Technical',
          ScheduledDate: pastDate,
          ScheduledTime: '10:30 AM',
          InterviewerEmployeeID: '294676',
          InterviewStatus: 'Scheduled',
          Rating: null,
          Feedback: null,
          FeedbackCategory: 'Problem Solving',
          CategoryRating: 8,
          CategoryComments: 'Good approach.',
        },
        {
          InterviewID: 56,
          CandidateID: 'CAND-102',
          CandidateName: 'Future candidate',
          JobTitle: 'Engineer',
          ScheduledDate: futureDate,
          ScheduledTime: '10:30 AM',
          Rating: null,
          Feedback: null,
        },
        {
          InterviewID: 57,
          CandidateID: 'CAND-103',
          CandidateName: 'Rated candidate',
          JobTitle: 'Engineer',
          ScheduledDate: pastDate,
          ScheduledTime: '10:30 AM',
          Rating: 8,
          Feedback: null,
        },
        {
          InterviewID: 58,
          CandidateID: 'CAND-104',
          CandidateName: 'Submitted candidate',
          JobTitle: 'Engineer',
          ScheduledDate: pastDate,
          ScheduledTime: '10:30 AM',
          Rating: null,
          Feedback: 'Already submitted',
        },
      ],
    });
    const categoryQuery = jest.fn().mockResolvedValue({
      recordset: [{ categoryId: 1, categoryName: 'Technical Knowledge' }],
    });
    const interviewRequest = {
      input: jest.fn().mockReturnThis(),
      execute: interviewExecute,
    };
    const categoryRequest = { query: categoryQuery };
    const requestMock = jest
      .fn()
      .mockReturnValueOnce(interviewRequest)
      .mockReturnValueOnce(categoryRequest);
    database.connect.mockResolvedValue({
      request: requestMock,
    });

    await expect(
      service.getInterviewerFeedbackWorklist('294676'),
    ).resolves.toMatchObject({
      interviews: [
        {
          id: 55,
          candidateCode: 'CAND-101',
          candidateName: 'Test candidate',
          position: 'Engineer',
          roundName: '1 · Technical',
          status: 'scheduled',
          interviewerName: '294676',
          feedbackSubmitted: false,
          canSubmitFeedback: true,
          feedbackRating: null,
          feedbackText: null,
          candidateEmail: 'candidate@example.com',
          feedbackDetails: [
            {
              categoryName: 'Technical Knowledge',
              rating: 9,
              comments: 'Strong technical fundamentals.',
            },
            {
              categoryName: 'Problem Solving',
              rating: 8,
              comments: 'Good approach.',
            },
          ],
        },
        {
          id: 56,
          candidateCode: 'CAND-102',
          candidateName: 'Future candidate',
          status: 'scheduled',
          feedbackSubmitted: false,
          canSubmitFeedback: false,
        },
        {
          id: 57,
          candidateCode: 'CAND-103',
          candidateName: 'Rated candidate',
          status: 'completed',
          feedbackSubmitted: true,
          canSubmitFeedback: false,
          feedbackRating: 8,
          feedbackText: null,
        },
        {
          id: 58,
          candidateCode: 'CAND-104',
          candidateName: 'Submitted candidate',
          status: 'completed',
          feedbackSubmitted: true,
          canSubmitFeedback: false,
          feedbackRating: null,
          feedbackText: 'Already submitted',
        },
      ],
      categories: [{ categoryId: 1, categoryName: 'Technical Knowledge' }],
    });
    expect(interviewRequest.input).toHaveBeenCalledWith(
      'EmployeeID',
      expect.anything(),
      '294676',
    );
    expect(interviewExecute).toHaveBeenCalledWith('USP_GetMyInterviews');
    expect(categoryQuery).toHaveBeenCalledWith(
      expect.stringContaining('FROM dbo.Mst_InterviewFeedbackCategories'),
    );
  });

  it('schedules Technical 2 after assigned Technical 1 feedback', async () => {
    const assignedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        recordset: [
          {
            InterviewID: 55,
            InterviewType: 'Technical',
            Round: 1,
            Rating: 8,
            Feedback: 'Strong fundamentals.',
          },
        ],
      }),
    };
    const applicationRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({
        recordset: [{ applicationId: 101 }],
      }),
    };
    const typeRequest = {
      query: jest.fn().mockResolvedValue({
        recordset: [{ id: 2, name: 'Technical 2' }],
      }),
    };
    const existingRoundRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [] }),
    };
    const progressTableRequest = {
      query: jest.fn().mockResolvedValue({ recordset: [{ tableExists: 1 }] }),
    };
    const decisionRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [] }),
    };
    const scheduleExecute = jest.fn().mockResolvedValue({
      recordset: [
        {
          StatusCode: 1,
          Message: 'Technical 2 interview scheduled successfully.',
          InterviewScheduleID: 88,
        },
      ],
    });
    const scheduleRequest = {
      input: jest.fn().mockReturnThis(),
      execute: scheduleExecute,
    };
    const request = jest
      .fn()
      .mockReturnValueOnce(assignedRequest)
      .mockReturnValueOnce(applicationRequest)
      .mockReturnValueOnce(typeRequest)
      .mockReturnValueOnce(existingRoundRequest)
      .mockReturnValueOnce(progressTableRequest)
      .mockReturnValueOnce(scheduleRequest)
      .mockReturnValueOnce(decisionRequest);
    database.connect.mockResolvedValue({ request });

    await expect(
      service.scheduleTechnicalRoundTwo(
        55,
        {
          date: '2099-10-15',
          time: '10:30',
          interviewModeId: 20,
          interviewerEmployeeId: '294676',
        },
        '294676',
      ),
    ).resolves.toEqual({
      success: true,
      message: 'Technical 2 interview scheduled successfully.',
      interviewScheduleId: 88,
    });
    expect(scheduleExecute).toHaveBeenCalledWith(
      'USP_ScheduleCandidateInterview',
    );
    expect(scheduleRequest.input).toHaveBeenCalledWith(
      'InterviewTypeID',
      sql.Int,
      2,
    );
    expect(decisionRequest.query).toHaveBeenCalledWith(
      expect.stringContaining('Technical2Required = @Technical2Required'),
    );
  });

  it('schedules Technical 2 when the optional round progress table is missing', async () => {
    const assignedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        recordset: [
          {
            InterviewID: 55,
            InterviewType: 'Technical',
            Round: 1,
            Rating: 8,
            Feedback: 'Strong fundamentals.',
          },
        ],
      }),
    };
    const applicationRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({
        recordset: [{ applicationId: 101 }],
      }),
    };
    const typeRequest = {
      query: jest.fn().mockResolvedValue({
        recordset: [{ id: 2, name: 'Technical 2' }],
      }),
    };
    const existingRoundRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [] }),
    };
    const progressTableRequest = {
      query: jest.fn().mockResolvedValue({ recordset: [{ tableExists: 0 }] }),
    };
    const scheduleExecute = jest.fn().mockResolvedValue({
      recordset: [
        {
          StatusCode: 1,
          Message: 'Technical 2 interview scheduled successfully.',
          InterviewScheduleID: 88,
        },
      ],
    });
    const scheduleRequest = {
      input: jest.fn().mockReturnThis(),
      execute: scheduleExecute,
    };
    const request = jest
      .fn()
      .mockReturnValueOnce(assignedRequest)
      .mockReturnValueOnce(applicationRequest)
      .mockReturnValueOnce(typeRequest)
      .mockReturnValueOnce(existingRoundRequest)
      .mockReturnValueOnce(progressTableRequest)
      .mockReturnValueOnce(scheduleRequest);
    database.connect.mockResolvedValue({ request });

    await expect(
      service.scheduleTechnicalRoundTwo(
        55,
        {
          date: '2099-10-15',
          time: '10:30',
          interviewModeId: 20,
          interviewerEmployeeId: '294676',
        },
        '294676',
      ),
    ).resolves.toMatchObject({
      success: true,
      interviewScheduleId: 88,
    });
    expect(scheduleExecute).toHaveBeenCalledWith(
      'USP_ScheduleCandidateInterview',
    );
    expect(request).toHaveBeenCalledTimes(6);
  });

  it('submits category feedback using the stored procedure table-valued parameter', async () => {
    const assignedQuery = jest.fn().mockResolvedValue({
      recordset: [{ ID: 55 }],
    });
    const execute = jest.fn().mockResolvedValue({
      recordset: [
        {
          StatusCode: 200,
          Message: 'Interview feedback submitted successfully.',
        },
      ],
    });
    const submitRequest = {
      input: jest.fn().mockReturnThis(),
      execute,
      query: assignedQuery,
    };
    const request = jest.fn(() => submitRequest);
    database.connect.mockResolvedValue({ request });

    await expect(
      service.submitCompetencyFeedback(
        55,
        {
          feedbackDetails: [
            { categoryId: 2, rating: 8, comments: 'Clear reasoning.' },
          ],
          overallFeedback: 'Strong candidate with good problem-solving skills.',
        },
        '294676',
      ),
    ).resolves.toEqual({
      success: true,
      message: 'Interview feedback submitted successfully.',
    });
    expect(submitRequest.input).toHaveBeenCalledWith(
      'InterviewerID',
      sql.Int,
      294676,
    );
    expect(submitRequest.input).toHaveBeenCalledWith(
      'OverallRating',
      sql.Decimal(3, 1),
      8,
    );
    expect(submitRequest.input).toHaveBeenCalledWith(
      'OverallFeedback',
      sql.VarChar(sql.MAX),
      'Strong candidate with good problem-solving skills.',
    );
    expect(submitRequest.input).toHaveBeenCalledWith(
      'CreatedBy',
      sql.VarChar(35),
      '294676',
    );
    expect(submitRequest.input).toHaveBeenCalledWith(
      'FeedbackDetails',
      expect.objectContaining({
        rows: [[2, 8, 'Clear reasoning.']],
      }),
    );
    expect(execute).toHaveBeenCalledWith('USP_SubmitFeedbackByInterviewer');
  });

  it('schedules an eligible candidate with the existing procedure', async () => {
    recruitment.getInterviewEligibleCandidates.mockResolvedValue([
      {
        ApplicationID: 101,
        CandidateID: 'CAND-101',
        CandidateName: 'Test candidate',
        Email: 'candidate@example.com',
        JobTitle: 'Engineer',
      },
    ]);
    const execute = jest.fn().mockResolvedValue({
      recordset: [
        {
          StatusCode: 1,
          Message: 'Candidate interview scheduled successfully.',
          InterviewScheduleID: 55,
        },
      ],
    });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
    };
    database.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(
      service.schedule(
        101,
        {
          interviewTypeId: 1,
          interviewModeId: 20,
          date: '2099-10-15',
          time: '10:30',
          interviewerEmployeeId: '294676',
        },
        '294676',
      ),
    ).resolves.toEqual({
      success: true,
      message: 'Candidate interview scheduled successfully.',
      interviewScheduleId: 55,
    });
    expect(execute).toHaveBeenCalledWith('USP_ScheduleCandidateInterview');
  });
});
