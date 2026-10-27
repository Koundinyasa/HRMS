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

  it('builds the interviewer feedback worklist from existing scheduled interview data', async () => {
    const interviewQuery = jest.fn().mockResolvedValue({
      recordset: [
        {
          id: 55,
          code: 'INT-55',
          applicationId: 101,
          applicationCode: 'APP-101',
          candidateCode: 'CAND-101',
          candidateName: 'Test candidate',
          candidateEmail: 'candidate@example.com',
          position: 'Engineer',
          roundName: 'Technical',
          scheduledAt: new Date('2026-10-16T10:30:00'),
          status: 'scheduled',
          interviewerName: 'Test interviewer',
        },
      ],
    });
    const categoryQuery = jest.fn().mockResolvedValue({
      recordset: [{ categoryId: 1, categoryName: 'Technical Knowledge' }],
    });
    const interviewRequest = {
      input: jest.fn().mockReturnThis(),
      query: interviewQuery,
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
          applicationId: 101,
          candidateName: 'Test candidate',
          interviewerName: 'Test interviewer',
        },
      ],
      categories: [{ categoryId: 1, categoryName: 'Technical Knowledge' }],
    });
    expect(interviewRequest.input).toHaveBeenCalledWith(
      'InterviewerID',
      expect.anything(),
      '294676',
    );
    expect(interviewQuery).toHaveBeenCalledWith(
      expect.stringContaining('FROM dbo.Interviews I'),
    );
    expect(categoryQuery).toHaveBeenCalledWith(
      expect.stringContaining('FROM dbo.Mst_InterviewFeedbackCategories'),
    );
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
