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

  it('loads all submitted feedback waiting for final approval from its stored procedure', async () => {
    const execute = jest.fn().mockResolvedValue({
      recordset: [
        {
          ApplicationID: 101,
          CandidateID: 'CAND-101',
          CandidateName: 'Test candidate',
          Email: 'candidate@example.com',
          JobTitle: 'Engineer',
          InterviewScheduledID: 7,
          InterviewID: 8,
          ScheduledDate: new Date('2026-10-27T16:07:00'),
          InterviewType: 'Technical 1',
          InterviewerName: 'Test interviewer',
          Rating: 8.2,
          Feedback: 'Strong fundamentals.',
        },
      ],
    });
    const request = { execute };
    database.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(
      service.getCandidatesWaitingForFinalApproval(),
    ).resolves.toMatchObject([
      {
        id: 8,
        scheduleId: 7,
        applicationId: 101,
        candidateCode: 'CAND-101',
        candidateName: 'Test candidate',
        candidateEmail: 'candidate@example.com',
        position: 'Engineer',
        interviewerName: 'Test interviewer',
        interviewType: 'Technical 1',
        roundName: 'Round 1',
        feedbackSubmitted: true,
        feedbackRating: 8.2,
        feedbackText: 'Strong fundamentals.',
        isLatestInterview: true,
        alreadyMovedToNextStage: false,
      },
    ]);
    expect(execute).toHaveBeenCalledWith(
      'USP_GetCandidatesWaitingForFinalApproval',
    );
  });

  it('does not require a separate schedule ID when the procedure omits it', async () => {
    const request = {
      execute: jest.fn().mockResolvedValue({
        recordset: [
          {
            ApplicationID: 101,
            CandidateID: 'CAND-101',
            CandidateName: 'Test candidate',
            ScheduledDate: new Date('2026-10-27T16:07:00'),
            InterviewID: 8,
          },
        ],
      }),
    };
    database.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(
      service.getCandidatesWaitingForFinalApproval(),
    ).resolves.toMatchObject([{ id: 8, scheduleId: 8, applicationId: 101 }]);
  });

  it('uses the selected filter and paginates scheduled interviews', async () => {
    recruitment.getScheduledCandidateInterviews.mockResolvedValue([]);
    const query = jest.fn().mockResolvedValue({
      recordset: [
        {
          id: 8,
          scheduleId: 7,
          applicationId: 101,
          applicationCode: 'APP-101',
          candidateCode: 'CAND-101',
          candidateName: 'Test candidate',
          candidateEmail: 'candidate@example.com',
          position: 'Engineer',
          scheduledDate: '2026-10-15',
          scheduledTime: '10:30:00',
          scheduledAt: new Date('2026-10-15T10:30:00'),
          interviewerName: 'Test interviewer',
          interviewType: 'Technical 1',
          roundName: 'Round 1',
          feedbackSubmitted: true,
          feedbackRating: 8,
          feedbackText: 'Strong fundamentals.',
          status: 'completed',
          totalCount: 1,
        },
      ],
    });
    database.connect.mockResolvedValue({
      request: jest.fn(() => ({
        input: jest.fn().mockReturnThis(),
        query,
      })),
    });

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
          id: 8,
          applicationId: 101,
          scheduledAt: new Date('2026-10-15T10:30:00'),
          candidateName: 'Test candidate',
          interviewerName: 'Test interviewer',
          interviewType: 'Technical 1',
          roundName: 'Round 1',
          feedbackSubmitted: true,
          feedbackRating: 8,
          feedbackText: 'Strong fundamentals.',
        },
      ],
      meta: { total: 1, page: 1, limit: 1, totalPages: 1 },
    });
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('COUNT(*) OVER() AS totalCount'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('LatestSchedule.ScheduleStatus IN (11, 21)'),
    );
  });

  it('returns the candidate running average across submitted interview feedback', async () => {
    const interviewExecute = jest.fn().mockResolvedValue({
      recordset: [
        {
          InterviewID: 55,
          ApplicationID: 101,
          CandidateID: 'CAND-101',
          CandidateName: 'Test candidate',
          JobTitle: 'Engineer',
          ScheduledDate: new Date('2026-10-27T00:00:00'),
          ScheduledTime: '10:30 AM',
          Rating: null,
          Feedback: null,
        },
      ],
    });
    const interviewRequest = {
      input: jest.fn().mockReturnThis(),
      execute: interviewExecute,
    };
    const categoryRequest = {
      query: jest.fn().mockResolvedValue({ recordset: [] }),
    };
    const aggregateRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({
        recordset: [
          { applicationId: 101, averageRating: 8, feedbackCount: 2 },
        ],
      }),
    };
    const requestMock = jest
      .fn()
      .mockReturnValueOnce(interviewRequest)
      .mockReturnValueOnce(categoryRequest)
      .mockReturnValueOnce(aggregateRequest);
    database.connect.mockResolvedValue({ request: requestMock });

    await expect(
      service.getInterviewerFeedbackWorklist('294676'),
    ).resolves.toMatchObject({
      interviews: [
        {
          id: 55,
          applicationId: 101,
          candidateAverageRating: 8,
          candidateFeedbackCount: 2,
        },
      ],
    });
    expect(aggregateRequest.query).toHaveBeenCalledWith(
      expect.stringContaining('AVG(CAST(I.Rating AS DECIMAL(5, 2)))'),
    );
    expect(aggregateRequest.input).toHaveBeenCalledWith(
      'ApplicationID0',
      expect.anything(),
      101,
    );
  });

  it('moves an application to the next stage using the HR stored procedure', async () => {
    const execute = jest.fn().mockResolvedValue({
      recordset: [
        {
          StatusCode: 200,
          Message: 'Candidate moved to Final Interview Approval successfully.',
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
      service.moveCandidateToNextStage(101, '294676'),
    ).resolves.toEqual({
      success: true,
      message: 'Candidate moved to Final Interview Approval successfully.',
      applicationId: 101,
    });
    expect(request.input).toHaveBeenNthCalledWith(
      1,
      'ApplicationID',
      sql.Int,
      101,
    );
    expect(request.input).toHaveBeenNthCalledWith(
      2,
      'ActionBy',
      sql.VarChar(25),
      '294676',
    );
    expect(execute).toHaveBeenCalledWith('USP_MoveCandidateToNextStage');
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
          JobTitle: 'Engineer',
          Round: 1,
          InterviewType: 'Technical',
          ScheduledDate: pastDate,
          ScheduledTime: '10:30 AM',
          InterviewerEmployeeID: '294676',
          InterviewStatus: 'Scheduled',
          Rating: null,
          Feedback: null,
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
        {
          InterviewID: 59,
          CandidateID: 'CAND-105',
          CandidateName: 'Structured feedback candidate',
          JobTitle: 'Engineer',
          ScheduledDate: pastDate,
          ScheduledTime: '10:30 AM',
          Rating: 8,
          Feedback: 'Complete feedback',
          FeedbackCategory: 'Technical Knowledge',
          CategoryRating: 8,
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
          status: 'completed',
          interviewerName: '294676',
          feedbackSubmitted: true,
          canSubmitFeedback: false,
          feedbackRating: null,
          feedbackText: null,
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
        {
          id: 59,
          candidateCode: 'CAND-105',
          feedbackSubmitted: true,
          canSubmitFeedback: false,
          feedbackDetails: [
            {
              categoryName: 'Technical Knowledge',
              rating: 8,
              comments: null,
            },
          ],
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

  it('allows recruitment users to schedule Technical 2 after Technical 1 feedback', async () => {
    const technicalOneRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({
        recordset: [
          {
            applicationId: 101,
            interviewType: 'Technical 1',
            roundName: 'Round 1',
            feedbackSubmitted: true,
          },
        ],
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
      .mockReturnValueOnce(technicalOneRequest)
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
        '294690',
      ),
    ).resolves.toEqual({
      success: true,
      message: 'Technical 2 interview scheduled successfully.',
      interviewScheduleId: 88,
    });
    expect(technicalOneRequest.query).toHaveBeenCalledWith(
      expect.stringContaining('I.FeedbackSubmitted AS feedbackSubmitted'),
    );
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

  it('requires submitted Technical 1 feedback before scheduling Technical 2', async () => {
    const technicalOneRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({
        recordset: [
          {
            applicationId: 101,
            interviewType: 'Technical 1',
            roundName: 'Round 1',
            feedbackSubmitted: false,
          },
        ],
      }),
    };
    const request = jest.fn().mockReturnValue(technicalOneRequest);
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
        '294690',
      ),
    ).rejects.toThrow(
      'Submit Technical 1 feedback before scheduling the next round.',
    );
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('schedules Technical 2 when the optional round progress table is missing', async () => {
    const technicalOneRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({
        recordset: [
          {
            applicationId: 101,
            interviewType: 'Technical 1',
            roundName: 'Round 1',
            feedbackSubmitted: true,
          },
        ],
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
      .mockReturnValueOnce(technicalOneRequest)
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
    expect(request).toHaveBeenCalledTimes(5);
  });

  it('submits category feedback using the stored procedure table-valued parameter', async () => {
    const assignedExecute = jest.fn().mockResolvedValue({
      recordset: [
        {
          InterviewID: 55,
          Rating: null,
          Feedback: null,
        },
      ],
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
    };
    const assignedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: assignedExecute,
    };
    const request = jest
      .fn()
      .mockReturnValueOnce(assignedRequest)
      .mockReturnValueOnce(submitRequest);
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
    expect(assignedExecute).toHaveBeenCalledWith('USP_GetMyInterviews');
  });

  it('rejects feedback submission when feedback already exists', async () => {
    const assignedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        recordset: [
          {
            InterviewID: 55,
            Rating: 4,
            Feedback: 'Candidate performed well.',
          },
        ],
      }),
    };
    const submitRequest = {
      input: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    };
    const request = jest
      .fn()
      .mockReturnValueOnce(assignedRequest)
      .mockReturnValueOnce(submitRequest);
    database.connect.mockResolvedValue({ request });

    await expect(
      service.submitCompetencyFeedback(
        55,
        {
          feedbackDetails: [{ categoryId: 2, rating: 8 }],
          overallFeedback: 'Already submitted.',
        },
        '294676',
      ),
    ).rejects.toThrow('Feedback has already been submitted for this interview.');
    expect(submitRequest.execute).not.toHaveBeenCalled();
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

  it('uses the same scheduling procedure for a completed interview round', async () => {
    recruitment.getInterviewEligibleCandidates.mockResolvedValue([]);
    const execute = jest.fn().mockResolvedValue({
      recordset: [
        {
          StatusCode: 1,
          Message: 'Candidate interview scheduled successfully.',
          InterviewScheduleID: 56,
        },
      ],
    });
    const request = {
      input: jest.fn().mockReturnThis(),
      execute,
      query: jest.fn().mockResolvedValue({
        recordset: [{ hasCompletedInterview: true }],
      }),
    };
    database.connect.mockResolvedValue({
      request: jest.fn(() => request),
    });

    await expect(
      service.schedule(
        101,
        {
          interviewTypeId: 3,
          interviewModeId: 20,
          date: '2099-10-15',
          time: '10:30',
          interviewerEmployeeId: '294676',
        },
        '294676',
      ),
    ).resolves.toMatchObject({
      success: true,
      interviewScheduleId: 56,
    });
    expect(request.query).toHaveBeenCalledWith(
      expect.stringContaining('I.FeedbackSubmitted = 1'),
    );
    expect(execute).toHaveBeenCalledWith('USP_ScheduleCandidateInterview');
  });
});
