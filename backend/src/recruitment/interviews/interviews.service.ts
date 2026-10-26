import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../../database/database.service';
import { RecruitmentService } from '../recruitment.service';
import {
  InterviewFeedbackDto,
  InterviewerCompetencyFeedbackDto,
  InterviewListQueryDto,
  InterviewScheduleDto,
  InterviewStatusDto,
  UpdateInterviewDto,
} from './interviews.dto';

type InterviewScheduleFilter = 'Today' | 'Upcoming' | 'Past';

export interface InterviewerFeedbackWorklistRow {
  id: number;
  code: string;
  applicationId?: number;
  applicationCode?: string;
  candidateCode: string;
  candidateName: string;
  candidateEmail?: string;
  position: string;
  roundName: string;
  scheduledAt: Date;
  status: 'scheduled' | 'completed';
  interviewerName: string;
  feedbackSubmitted: boolean;
  canSubmitFeedback: boolean;
  feedbackRating: number | null;
  feedbackText: string | null;
}

export interface InterviewFeedbackCategoryRow {
  categoryId: number;
  categoryName: string;
}

function readRowValue(row: Record<string, unknown>, ...aliases: string[]) {
  const keys = new Set(aliases.map((alias) => alias.toLowerCase()));
  const entry = Object.entries(row).find(([key]) =>
    keys.has(key.toLowerCase()),
  );
  return entry?.[1];
}

function readRowText(
  row: Record<string, unknown>,
  ...aliases: string[]
): string | undefined {
  const value = readRowValue(row, ...aliases);
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value);
  }
  if (value instanceof Date) return value.toISOString();
  return undefined;
}

@Injectable()
export class InterviewsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly recruitment: RecruitmentService,
  ) {}

  async getInterviewers() {
    const pool = await this.database.connect();
    const result = await pool.request().query(`
      SELECT DISTINCT
        E.EmployeeID AS id,
        COALESCE(NULLIF(E.Code, ''), E.EmployeeID) AS name
      FROM dbo.Employee E
      INNER JOIN dbo.Mst_Users MU
        ON MU.EmployeeID = E.EmployeeID
       AND MU.IsActive = 1
      WHERE E.EmployeeID IS NOT NULL
      ORDER BY name;
    `);
    return result.recordset;
  }

  async getScheduleOptions() {
    const pool = await this.database.connect();
    const [interviewTypes, interviewModes] = await Promise.all([
      pool.request().query(`
        SELECT ID AS id, Name AS name
        FROM dbo.Mst_InterviewType
        ORDER BY ID;
      `),
      pool.request().query(`
        SELECT ID AS id, Name AS name
        FROM dbo.Mst_ApplicationStatus
        WHERE ID IN (19, 20)
          AND IsActive = 1
        ORDER BY ID;
      `),
    ]);
    return {
      interviewTypes: interviewTypes.recordset,
      interviewModes: interviewModes.recordset,
    };
  }

  async pendingSchedule(search?: string) {
    const candidates = await this.recruitment.getInterviewEligibleCandidates();
    const normalizedSearch = search?.trim().toLowerCase();

    return candidates
      .filter(
        (candidate) =>
          !normalizedSearch ||
          [
            candidate.CandidateID,
            candidate.CandidateName,
            candidate.JobTitle,
          ].some((value) => value.toLowerCase().includes(normalizedSearch)),
      )
      .map((candidate) => ({
        applicationId: candidate.ApplicationID,
        applicationCode: `APP-${candidate.ApplicationID}`,
        candidateCode: candidate.CandidateID,
        candidateName: candidate.CandidateName,
        candidateEmail: candidate.Email,
        position: candidate.JobTitle,
      }));
  }

  async schedule(
    applicationId: number,
    dto: InterviewScheduleDto,
    employeeId: string,
  ) {
    const eligibleCandidates =
      await this.recruitment.getInterviewEligibleCandidates();
    const candidate = eligibleCandidates.find(
      (record) => record.ApplicationID === applicationId,
    );
    if (!candidate) {
      throw new BadRequestException(
        'Select a candidate who is eligible for interview scheduling.',
      );
    }

    const [year, month, day] = dto.date.split('-').map(Number);
    const [hours, minutes] = dto.time.split(':').map(Number);
    const scheduledAt = new Date(year, month - 1, day, hours, minutes);
    if (
      scheduledAt.getFullYear() !== year ||
      scheduledAt.getMonth() !== month - 1 ||
      scheduledAt.getDate() !== day ||
      scheduledAt.getHours() !== hours ||
      scheduledAt.getMinutes() !== minutes ||
      scheduledAt <= new Date()
    ) {
      throw new BadRequestException('Pick a future interview date and time.');
    }

    const pool = await this.database.connect();
    const result = await pool
      .request()
      .input('ApplicationID', sql.Int, applicationId)
      .input('InterviewTypeID', sql.Int, dto.interviewTypeId)
      .input('InterviewModeID', sql.Int, dto.interviewModeId)
      .input('ScheduledDate', sql.DateTime, scheduledAt)
      .input(
        'InterviewerEmployeeID',
        sql.VarChar(25),
        dto.interviewerEmployeeId,
      )
      .input('ActionBy', sql.VarChar(25), employeeId)
      .execute('USP_ScheduleCandidateInterview');
    const response = result.recordset?.[0] as
      | Record<string, unknown>
      | undefined;
    const statusCode = Number(readRowValue(response ?? {}, 'StatusCode'));
    const message = String(
      readRowValue(response ?? {}, 'Message') ??
        'Unable to schedule the candidate interview.',
    );
    if (statusCode !== 1) {
      throw new BadRequestException(message);
    }
    return {
      success: true,
      message,
      interviewScheduleId: Number(
        readRowValue(response ?? {}, 'InterviewScheduleID'),
      ),
    };
  }

  async updateInterview(interviewId: number, dto: UpdateInterviewDto) {
    const pool = await this.database.connect();
    await this.requireInterviewSchema(pool);
    const transaction = new sql.Transaction(pool);
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    try {
      const currentResult = await new sql.Request(transaction).input(
        'InterviewID',
        sql.BigInt,
        interviewId,
      ).query(`
          SELECT ID, ApplicationID, ScheduledAt, DurationMinutes, Status
          FROM dbo.RecruitmentInterviewRounds WITH (UPDLOCK, HOLDLOCK)
          WHERE ID = @InterviewID;
        `);
      const current = currentResult.recordset[0];
      if (!current) throw new NotFoundException('Interview was not found.');
      if (current.Status !== 'scheduled') {
        throw new BadRequestException(
          'Only scheduled interviews can be changed.',
        );
      }

      const currentDate = new Date(current.ScheduledAt);
      const date =
        dto.date ??
        [
          currentDate.getFullYear(),
          String(currentDate.getMonth() + 1).padStart(2, '0'),
          String(currentDate.getDate()).padStart(2, '0'),
        ].join('-');
      const time =
        dto.time ??
        [
          String(currentDate.getHours()).padStart(2, '0'),
          String(currentDate.getMinutes()).padStart(2, '0'),
        ].join(':');
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledAt = new Date(year, month - 1, day, hours, minutes);
      if (
        scheduledAt.getFullYear() !== year ||
        scheduledAt.getMonth() !== month - 1 ||
        scheduledAt.getDate() !== day ||
        scheduledAt.getHours() !== hours ||
        scheduledAt.getMinutes() !== minutes ||
        scheduledAt <= new Date()
      ) {
        throw new BadRequestException('Pick a future interview date and time.');
      }

      const panelRequest = new sql.Request(transaction).input(
        'InterviewID',
        sql.BigInt,
        interviewId,
      );
      const currentPanel = await panelRequest.query(`
        SELECT EmployeeID
        FROM dbo.RecruitmentInterviewPanel
        WHERE InterviewID = @InterviewID;
      `);
      const interviewerIds =
        dto.interviewerIds ??
        currentPanel.recordset.map((row) => String(row.EmployeeID));
      if (interviewerIds.length === 0) {
        throw new BadRequestException(
          'An interview must have at least one interviewer.',
        );
      }

      const interviewerRequest = new sql.Request(transaction);
      const interviewerParams = interviewerIds.map((id, index) => {
        const name = `EmployeeID${index}`;
        interviewerRequest.input(name, sql.VarChar(25), id);
        return `@${name}`;
      });
      const interviewerResult = await interviewerRequest.query(`
        SELECT E.EmployeeID
        FROM dbo.Employee E WITH (UPDLOCK, HOLDLOCK)
        INNER JOIN dbo.Mst_Users MU
          ON MU.EmployeeID = E.EmployeeID
         AND MU.IsActive = 1
        WHERE E.EmployeeID IN (${interviewerParams.join(', ')});
      `);
      if (interviewerResult.recordset.length !== interviewerIds.length) {
        throw new BadRequestException(
          'Choose active employees as interviewers.',
        );
      }

      const duration = dto.durationMinutes ?? current.DurationMinutes;
      const clashRequest = new sql.Request(transaction)
        .input('InterviewID', sql.BigInt, interviewId)
        .input('ApplicationID', sql.Int, current.ApplicationID)
        .input('ScheduledAt', sql.DateTime2(0), scheduledAt)
        .input('DurationMinutes', sql.Int, duration);
      const panelParams = interviewerIds.map((id, index) => {
        const name = `PanelEmployeeID${index}`;
        clashRequest.input(name, sql.VarChar(25), id);
        return `@${name}`;
      });
      const clashResult = await clashRequest.query(`
        SELECT TOP (1) R.ID
        FROM dbo.RecruitmentInterviewRounds R WITH (UPDLOCK, HOLDLOCK)
        LEFT JOIN dbo.RecruitmentInterviewPanel P
          ON P.InterviewID = R.ID
        WHERE R.ID <> @InterviewID
          AND R.Status = 'scheduled'
          AND (
            R.ApplicationID = @ApplicationID
            OR P.EmployeeID IN (${panelParams.join(', ')})
          )
          AND R.ScheduledAt < DATEADD(MINUTE, @DurationMinutes, @ScheduledAt)
          AND DATEADD(MINUTE, R.DurationMinutes, R.ScheduledAt) > @ScheduledAt;
      `);
      if (clashResult.recordset.length) {
        throw new BadRequestException(
          'The candidate or an interviewer already has an interview during this time.',
        );
      }

      await new sql.Request(transaction)
        .input('InterviewID', sql.BigInt, interviewId)
        .input('RoundName', sql.NVarChar(80), dto.roundName?.trim() || null)
        .input('ScheduledAt', sql.DateTime2(0), scheduledAt)
        .input('DurationMinutes', sql.SmallInt, duration)
        .input('Mode', sql.VarChar(20), dto.mode ?? null)
        .input(
          'LocationOrLink',
          sql.NVarChar(300),
          dto.locationOrLink?.trim() || null,
        ).query(`
          UPDATE dbo.RecruitmentInterviewRounds
          SET RoundName = COALESCE(@RoundName, RoundName),
              ScheduledAt = @ScheduledAt,
              DurationMinutes = @DurationMinutes,
              Mode = COALESCE(@Mode, Mode),
              LocationOrLink = COALESCE(@LocationOrLink, LocationOrLink)
          WHERE ID = @InterviewID;
        `);

      if (dto.interviewerIds) {
        await new sql.Request(transaction)
          .input('InterviewID', sql.BigInt, interviewId)
          .query(
            'DELETE FROM dbo.RecruitmentInterviewPanel WHERE InterviewID = @InterviewID;',
          );
        for (const interviewerId of interviewerIds) {
          await new sql.Request(transaction)
            .input('InterviewID', sql.BigInt, interviewId)
            .input('EmployeeID', sql.VarChar(25), interviewerId).query(`
              INSERT INTO dbo.RecruitmentInterviewPanel (InterviewID, EmployeeID)
              VALUES (@InterviewID, @EmployeeID);
            `);
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    return this.getInterview(interviewId);
  }

  async cancelInterview(interviewId: number, reason: string) {
    const pool = await this.database.connect();
    await this.requireInterviewSchema(pool);
    const result = await pool
      .request()
      .input('InterviewID', sql.BigInt, interviewId)
      .input('Reason', sql.NVarChar(500), reason.trim()).query(`
        UPDATE dbo.RecruitmentInterviewRounds
        SET Status = 'cancelled',
            StatusNote = @Reason
        WHERE ID = @InterviewID
          AND Status = 'scheduled';
        SELECT @@ROWCOUNT AS affected;
      `);
    if (Number(result.recordset[0]?.affected) !== 1) {
      const exists = await pool
        .request()
        .input('InterviewID', sql.BigInt, interviewId)
        .query(
          'SELECT ID FROM dbo.RecruitmentInterviewRounds WHERE ID = @InterviewID;',
        );
      if (!exists.recordset.length) {
        throw new NotFoundException('Interview was not found.');
      }
      throw new BadRequestException(
        'Only scheduled interviews can be cancelled.',
      );
    }
    return this.getInterview(interviewId);
  }

  getTodayInterviews(hrEmployeeId: string, query: InterviewListQueryDto) {
    return this.list(hrEmployeeId, { ...query, period: 'today' });
  }

  async list(hrEmployeeId: string, query: InterviewListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;
    const period = query.period ?? 'upcoming';
    const filter: InterviewScheduleFilter =
      period === 'today' ? 'Today' : period === 'past' ? 'Past' : 'Upcoming';
    const rows = await this.recruitment.getScheduledCandidateInterviews(
      hrEmployeeId,
      filter,
    );
    const normalizedSearch = query.search?.trim().toLowerCase();
    const interviews = rows
      .map((row) => {
        const scheduledDate = readRowValue(row, 'ScheduledDate');
        const scheduledTime = readRowValue(row, 'ScheduledTime');
        const candidateName = readRowValue(row, 'CandidateName');
        const interviewerName = readRowValue(row, 'InterviewerName');
        const interviewType = readRowValue(row, 'InterviewType');
        if (
          scheduledDate == null ||
          scheduledTime == null ||
          candidateName == null ||
          interviewerName == null ||
          interviewType == null
        ) {
          throw new InternalServerErrorException(
            'Scheduled interview data is missing a date, time, candidate, interviewer, or interview type.',
          );
        }
        const scheduledDateText = String(scheduledDate);
        const scheduledTimeText = String(scheduledTime);
        const candidateNameText = String(candidateName);
        const interviewerNameText = String(interviewerName);
        const interviewTypeText = String(interviewType);
        return {
          id: [
            scheduledDateText,
            scheduledTimeText,
            candidateNameText,
            interviewerNameText,
            interviewTypeText,
          ].join('|'),
          scheduledDate: scheduledDateText,
          scheduledTime: scheduledTimeText,
          scheduledAt: `${scheduledDateText}T${scheduledTimeText}`,
          candidateName: candidateNameText,
          interviewerName: interviewerNameText,
          interviewType: interviewTypeText,
        };
      })
      .filter(
        (interview) =>
          !normalizedSearch ||
          [
            interview.candidateName,
            interview.interviewerName,
            interview.interviewType,
          ].some((value) => value.toLowerCase().includes(normalizedSearch)),
      );
    const total = interviews.length;
    const data = interviews.slice(offset, offset + limit);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getInterview(interviewId: number) {
    const pool = await this.database.connect();
    await this.requireInterviewSchema(pool);
    const result = await pool
      .request()
      .input('InterviewID', sql.BigInt, interviewId).query(`
        SELECT
          R.ID AS id,
          CONCAT('INT-', R.ID) AS code,
          R.ApplicationID AS applicationId,
          CONCAT('APP-', R.ApplicationID) AS applicationCode,
          C.CandidateID AS candidateCode,
          C.FullName AS candidateName,
          C.Email AS candidateEmail,
          JR.JobTitle AS position,
          R.RoundName AS roundName,
          R.ScheduledAt AS scheduledAt,
          R.DurationMinutes AS durationMinutes,
          R.Mode AS mode,
          R.LocationOrLink AS locationOrLink,
          R.Status AS status,
          R.StatusNote AS statusNote,
          STUFF((
            SELECT ', ' + COALESCE(NULLIF(E.Code, ''), P.EmployeeID)
            FROM dbo.RecruitmentInterviewPanel P
            LEFT JOIN dbo.Employee E ON E.EmployeeID = P.EmployeeID
            WHERE P.InterviewID = R.ID
            ORDER BY P.EmployeeID
            FOR XML PATH(''), TYPE
          ).value('.', 'nvarchar(max)'), 1, 2, '') AS panel
        FROM dbo.RecruitmentInterviewRounds R
        INNER JOIN dbo.CandidateApplications CA ON CA.ID = R.ApplicationID
        INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
        INNER JOIN dbo.JobOpenings JO ON JO.ID = CA.JobOpeningID
        INNER JOIN dbo.JobRequisitions JR ON JR.ID = JO.RequisitionID
        WHERE R.ID = @InterviewID;
      `);
    const interview = result.recordset[0];
    if (!interview) throw new NotFoundException('Interview was not found.');
    const feedbackResult = await pool
      .request()
      .input('InterviewID', sql.BigInt, interviewId).query(`
        SELECT
          F.EmployeeID AS employeeId,
          F.SubmittedAt AS submittedAt,
          F.Rating AS rating,
          F.Recommendation AS recommendation,
          F.Feedback AS feedback,
          F.Strengths AS strengths,
          F.Concerns AS concerns
        FROM dbo.RecruitmentInterviewFeedback F
        WHERE F.InterviewID = @InterviewID
        ORDER BY F.SubmittedAt DESC;
      `);
    return { ...interview, feedbackRecords: feedbackResult.recordset };
  }

  async getInterviewFeedback(interviewId: number) {
    await this.getInterview(interviewId);
    const pool = await this.database.connect();
    const result = await pool
      .request()
      .input('InterviewID', sql.BigInt, interviewId).query(`
        SELECT
          F.EmployeeID AS employeeId,
          F.SubmittedAt AS submittedAt,
          F.Rating AS rating,
          F.Recommendation AS recommendation,
          F.Feedback AS feedback,
          F.Strengths AS strengths,
          F.Concerns AS concerns
        FROM dbo.RecruitmentInterviewFeedback F
        WHERE F.InterviewID = @InterviewID
        ORDER BY F.SubmittedAt DESC;
      `);
    return result.recordset;
  }

  async getInterviewerFeedbackWorklist(employeeId: string) {
    const pool = await this.database.connect();
    const [interviewsResult, categoriesResult] = await Promise.all([
      pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .execute<Record<string, unknown>>('USP_GetMyInterviews'),
      pool.request().query<InterviewFeedbackCategoryRow>(`
        SELECT CategoryID AS categoryId, CategoryName AS categoryName
        FROM dbo.Mst_InterviewFeedbackCategories
        WHERE IsActive = 1
        ORDER BY CategoryID;
      `),
    ]);
    const interviews = interviewsResult.recordset.flatMap((row) => {
      const interviewId = Number(readRowValue(row, 'InterviewID'));
      const candidateCode = readRowText(row, 'CandidateID');
      const candidateName = readRowText(row, 'CandidateName');
      const scheduledDate = readRowValue(row, 'ScheduledDate');
      const scheduledTime = readRowText(row, 'ScheduledTime');
      const scheduledDateText =
        scheduledDate instanceof Date
          ? [
              scheduledDate.getFullYear(),
              String(scheduledDate.getMonth() + 1).padStart(2, '0'),
              String(scheduledDate.getDate()).padStart(2, '0'),
            ].join('-')
          : (readRowText(row, 'ScheduledDate') ?? '');
      const scheduledAt = new Date(
        `${scheduledDateText} ${scheduledTime ?? ''}`,
      );
      if (
        !Number.isInteger(interviewId) ||
        interviewId <= 0 ||
        candidateCode == null ||
        candidateName == null ||
        !Number.isFinite(scheduledAt.getTime())
      ) {
        return [];
      }

      const rating = readRowValue(row, 'Rating', 'OverallRating');
      const feedback = readRowText(row, 'Feedback', 'OverallFeedback');
      const hasRating =
        rating !== null && rating !== undefined && rating !== '';
      const feedbackRating =
        hasRating && Number.isFinite(Number(rating)) ? Number(rating) : null;
      const feedbackSubmitted =
        hasRating || (feedback !== undefined && feedback.trim() !== '');
      const isFuture = scheduledAt.getTime() > Date.now();
      const applicationIdValue = readRowValue(row, 'ApplicationID');
      const applicationId =
        applicationIdValue == null ? undefined : Number(applicationIdValue);
      const interviewerEmployeeId = readRowText(row, 'InterviewerEmployeeID');
      const round = readRowText(row, 'Round');
      const interviewType = readRowText(row, 'InterviewType');

      return [
        {
          id: interviewId,
          code: `INT-${interviewId}`,
          ...(applicationId !== undefined && Number.isFinite(applicationId)
            ? {
                applicationId,
                applicationCode: `APP-${applicationId}`,
              }
            : {}),
          candidateCode,
          candidateName,
          position: readRowText(row, 'JobTitle') ?? '—',
          roundName:
            [round, interviewType]
              .filter((value) => value !== undefined && value !== '')
              .join(' · ') || 'Interview',
          scheduledAt,
          status: isFuture ? ('scheduled' as const) : ('completed' as const),
          interviewerName: interviewerEmployeeId ?? '',
          feedbackSubmitted,
          canSubmitFeedback: !isFuture && !feedbackSubmitted,
          feedbackRating,
          feedbackText: feedback?.trim() || null,
        },
      ];
    });

    return {
      interviews,
      categories: categoriesResult.recordset,
    };
  }

  async submitCompetencyFeedback(
    interviewId: number,
    dto: InterviewerCompetencyFeedbackDto,
    employeeId: string,
  ) {
    const pool = await this.database.connect();
    const interviewerId = Number(employeeId);
    if (!Number.isInteger(interviewerId) || interviewerId < 1) {
      throw new BadRequestException(
        'The signed-in employee ID must be numeric to submit interviewer feedback.',
      );
    }

    const feedbackDetails = new sql.Table('dbo.InterviewFeedbackType');
    feedbackDetails.columns.add('CategoryID', sql.Int, { nullable: true });
    feedbackDetails.columns.add('Rating', sql.Int, { nullable: true });
    feedbackDetails.columns.add('Comments', sql.VarChar(500), {
      nullable: true,
    });
    for (const detail of dto.feedbackDetails) {
      feedbackDetails.rows.add(
        detail.categoryId,
        detail.rating,
        detail.comments?.trim() || null,
      );
    }
    const overallRating =
      dto.feedbackDetails.reduce((sum, detail) => sum + detail.rating, 0) /
      dto.feedbackDetails.length;
    const result = await pool
      .request()
      .input('InterviewID', sql.Int, interviewId)
      .input('InterviewerID', sql.Int, interviewerId)
      .input('OverallRating', sql.Decimal(3, 1), overallRating)
      .input(
        'OverallFeedback',
        sql.VarChar(sql.MAX),
        dto.overallFeedback.trim(),
      )
      .input('CreatedBy', sql.VarChar(35), employeeId)
      .input('FeedbackDetails', feedbackDetails)
      .execute('USP_SubmitFeedbackByInterviewer');
    const procedureResult = result.recordset?.[0] as
      | Record<string, unknown>
      | undefined;
    const statusCode = Number(
      readRowValue(procedureResult ?? {}, 'StatusCode'),
    );
    const procedureMessage = readRowValue(procedureResult ?? {}, 'Message');
    const message =
      typeof procedureMessage === 'string'
        ? procedureMessage
        : 'The feedback procedure returned no message.';
    if (statusCode !== 200) {
      if (statusCode === 404) {
        throw new NotFoundException(message);
      }
      if (statusCode === 400) {
        throw new BadRequestException(message);
      }
      throw new InternalServerErrorException(message);
    }

    return {
      success: true,
      message,
    };
  }

  async submitFeedback(
    interviewId: number,
    dto: InterviewFeedbackDto,
    employeeId: string,
  ) {
    const pool = await this.database.connect();
    await this.requireInterviewSchema(pool);
    const interview = await pool
      .request()
      .input('InterviewID', sql.BigInt, interviewId)
      .input('EmployeeID', sql.VarChar(25), employeeId).query(`
        SELECT R.ID, R.Status, P.EmployeeID
        FROM dbo.RecruitmentInterviewRounds R
        LEFT JOIN dbo.RecruitmentInterviewPanel P
          ON P.InterviewID = R.ID
         AND P.EmployeeID = @EmployeeID
        WHERE R.ID = @InterviewID;
      `);
    const record = interview.recordset[0];
    if (!record) throw new NotFoundException('Interview was not found.');
    if (!record.EmployeeID) {
      throw new BadRequestException(
        'Only an interviewer assigned to this interview can submit feedback.',
      );
    }
    if (!['scheduled', 'completed'].includes(record.Status)) {
      throw new BadRequestException(
        `Feedback cannot be submitted for a ${record.Status} interview.`,
      );
    }

    await pool
      .request()
      .input('InterviewID', sql.BigInt, interviewId)
      .input('EmployeeID', sql.VarChar(25), employeeId)
      .input('Rating', sql.Decimal(3, 1), dto.rating)
      .input('Recommendation', sql.VarChar(20), dto.recommendation)
      .input('Feedback', sql.NVarChar(4000), dto.feedback.trim())
      .input('Strengths', sql.NVarChar(2000), dto.strengths?.trim() || null)
      .input('Concerns', sql.NVarChar(2000), dto.concerns?.trim() || null)
      .query(`
        MERGE dbo.RecruitmentInterviewFeedback AS target
        USING (SELECT @InterviewID AS InterviewID, @EmployeeID AS EmployeeID) AS source
          ON target.InterviewID = source.InterviewID
         AND target.EmployeeID = source.EmployeeID
        WHEN MATCHED THEN UPDATE SET
          Rating = @Rating,
          Recommendation = @Recommendation,
          Feedback = @Feedback,
          Strengths = @Strengths,
          Concerns = @Concerns,
          SubmittedAt = SYSDATETIME()
        WHEN NOT MATCHED THEN INSERT
          (InterviewID, EmployeeID, Rating, Recommendation, Feedback, Strengths, Concerns)
          VALUES
          (@InterviewID, @EmployeeID, @Rating, @Recommendation, @Feedback, @Strengths, @Concerns);
      `);
    return { success: true, message: 'Interview feedback saved.' };
  }

  async setStatus(interviewId: number, dto: InterviewStatusDto) {
    const pool = await this.database.connect();
    await this.requireInterviewSchema(pool);
    const result = await pool
      .request()
      .input('InterviewID', sql.BigInt, interviewId)
      .input('Status', sql.VarChar(20), dto.status)
      .input('Note', sql.NVarChar(500), dto.note?.trim() || null).query(`
        UPDATE dbo.RecruitmentInterviewRounds
        SET Status = @Status,
            StatusNote = @Note,
            CompletedAt = CASE WHEN @Status = 'completed' THEN SYSDATETIME() ELSE NULL END
        WHERE ID = @InterviewID
          AND Status = 'scheduled';
        SELECT @@ROWCOUNT AS affected;
      `);
    if (Number(result.recordset[0]?.affected) !== 1) {
      const exists = await pool
        .request()
        .input('InterviewID', sql.BigInt, interviewId)
        .query(
          'SELECT ID FROM dbo.RecruitmentInterviewRounds WHERE ID = @InterviewID;',
        );
      if (!exists.recordset.length) {
        throw new NotFoundException('Interview was not found.');
      }
      throw new BadRequestException(
        'Only scheduled interviews can be marked completed or no-show.',
      );
    }
    return this.getInterview(interviewId);
  }

  private async requireInterviewSchema(
    executor: sql.ConnectionPool | sql.Transaction,
  ) {
    const result = await executor.request().query<{
      supportsInterviewWorkflow: number;
    }>(`
      SELECT CASE
        WHEN OBJECT_ID('dbo.RecruitmentInterviewRounds', 'U') IS NOT NULL
          AND OBJECT_ID('dbo.RecruitmentInterviewPanel', 'U') IS NOT NULL
          AND OBJECT_ID('dbo.RecruitmentInterviewFeedback', 'U') IS NOT NULL
        THEN 1 ELSE 0
      END AS supportsInterviewWorkflow;
    `);

    if (Number(result.recordset[0]?.supportsInterviewWorkflow) !== 1) {
      throw new ServiceUnavailableException(
        'Interview scheduling is not configured in the database. Ask a database administrator to apply the recruitment interview workflow migration.',
      );
    }
  }
}
