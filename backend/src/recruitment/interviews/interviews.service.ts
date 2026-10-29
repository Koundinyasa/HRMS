import {
  BadRequestException,
  ForbiddenException,
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
  TechnicalRoundTwoScheduleDto,
  UpdateInterviewDto,
} from './interviews.dto';

type InterviewScheduleFilter = 'Today' | 'Upcoming' | 'Past';

type InterviewProcessQueryRow = {
  id: number;
  scheduleId: number;
  applicationId: number;
  applicationCode: string;
  candidateCode: string;
  candidateName: string;
  candidateEmail: string | null;
  position: string;
  scheduledDate: string;
  scheduledTime: string;
  scheduledAt: Date;
  interviewerName: string;
  interviewType: string;
  roundName: string;
  feedbackSubmitted: boolean;
  feedbackRating: number | null;
  feedbackText: string | null;
  status: 'scheduled' | 'completed';
  isLatestInterview: boolean;
  alreadyMovedToNextStage: boolean;
  totalCount: number;
};

export interface InterviewerFeedbackWorklistRow {
  id: number;
  code: string;
  applicationId?: number;
  applicationCode?: string;
  candidateCode: string;
  candidateName: string;
  candidateEmail?: string;
  position: string;
  interviewType: string;
  roundName: string;
  scheduledAt: Date;
  status: 'scheduled' | 'completed';
  interviewerName: string;
  feedbackSubmitted: boolean;
  canSubmitFeedback: boolean;
  feedbackRating: number | null;
  candidateAverageRating?: number | null;
  candidateFeedbackCount?: number;
  feedbackText: string | null;
  feedbackDetails: Array<{
    categoryName: string;
    rating: number | null;
    comments: string | null;
  }>;
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
    let pool: sql.ConnectionPool | undefined;
    if (!candidate) {
      pool = await this.database.connect();
      const completedInterview = await pool
        .request()
        .input('ApplicationID', sql.Int, applicationId).query<{
          hasCompletedInterview: boolean;
        }>(`
          SELECT CAST(CASE WHEN EXISTS (
            SELECT 1
            FROM dbo.InterviewSchedules S
            INNER JOIN dbo.Interviews I
              ON I.InterviewScheduleID = S.ID
            WHERE S.ApplicationID = @ApplicationID
              AND I.FeedbackSubmitted = 1
          ) THEN 1 ELSE 0 END AS BIT) AS hasCompletedInterview;
        `);
      if (
        Number(completedInterview.recordset[0]?.hasCompletedInterview) !== 1
      ) {
        throw new BadRequestException(
          'Select a candidate who is eligible for interview scheduling or has completed interview feedback.',
        );
      }
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

    if (!pool) {
      pool = await this.database.connect();
    }
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
    await this.recruitment.getScheduledCandidateInterviews(
      hrEmployeeId,
      filter,
    );
    const pool = await this.database.connect();
    const result = await pool
      .request()
      .input('Period', sql.VarChar(20), filter)
      .input('Search', sql.NVarChar(200), query.search?.trim() || null)
      .input('Offset', sql.Int, offset)
      .input('Limit', sql.Int, limit).query<InterviewProcessQueryRow>(`
        WITH InterviewRows AS (
          SELECT
            I.ID AS id,
            S.ID AS scheduleId,
            S.ApplicationID AS applicationId,
            CONCAT('APP-', S.ApplicationID) AS applicationCode,
            C.CandidateID AS candidateCode,
            C.FullName AS candidateName,
            C.Email AS candidateEmail,
            JR.JobTitle AS position,
            CONVERT(CHAR(10), S.ScheduledDate, 23) AS scheduledDate,
            CONVERT(CHAR(8), S.ScheduledDate, 108) AS scheduledTime,
            S.ScheduledDate AS scheduledAt,
            E.FullName AS interviewerName,
            IT.Name AS interviewType,
            CASE
              WHEN LOWER(REPLACE(LTRIM(RTRIM(IT.Name)), ' ', '')) IN ('technical1', 'technical')
                THEN 'Round 1'
              WHEN LOWER(REPLACE(LTRIM(RTRIM(IT.Name)), ' ', '')) = 'technical2'
                THEN 'Round 2'
              ELSE 'Interview'
            END AS roundName,
            I.FeedbackSubmitted AS feedbackSubmitted,
            I.Rating AS feedbackRating,
            I.Feedback AS feedbackText,
            CASE
              WHEN S.ID = (
                SELECT MAX(LatestSchedule.ID)
                FROM dbo.InterviewSchedules LatestSchedule
                WHERE LatestSchedule.ApplicationID = S.ApplicationID
                  AND LatestSchedule.ScheduleStatus IN (11, 21)
              ) THEN CAST(1 AS BIT)
              ELSE CAST(0 AS BIT)
            END AS isLatestInterview,
            CAST(CASE WHEN EXISTS (
              SELECT 1
              FROM dbo.FinalInterviewApprovals FinalApproval
              WHERE FinalApproval.ApplicationID = S.ApplicationID
            ) THEN 1 ELSE 0 END AS BIT) AS alreadyMovedToNextStage,
            CASE
              WHEN S.ScheduleStatus = 21 OR I.FeedbackSubmitted = 1
                THEN 'completed'
              ELSE 'scheduled'
            END AS status,
            COUNT(*) OVER() AS totalCount
          FROM dbo.InterviewSchedules S
          INNER JOIN dbo.CandidateApplications CA
            ON CA.ID = S.ApplicationID
          INNER JOIN dbo.Candidates C
            ON C.ID = CA.CandidateID
          INNER JOIN dbo.JobOpenings JO
            ON JO.ID = CA.JobOpeningID
          INNER JOIN dbo.JobRequisitions JR
            ON JR.ID = JO.RequisitionID
          INNER JOIN dbo.Interviews I
            ON I.InterviewScheduleID = S.ID
          INNER JOIN dbo.Employee E
            ON E.EmployeeID = I.InterviewerID
          LEFT JOIN dbo.Mst_InterviewType IT
            ON IT.ID = I.InterviewType
          WHERE S.ScheduleStatus IN (11, 21)
            AND (
              (@Period = 'Today'
                AND S.ScheduledDate >= CAST(GETDATE() AS DATE)
                AND S.ScheduledDate < DATEADD(DAY, 1, CAST(GETDATE() AS DATE)))
              OR (@Period = 'Upcoming'
                AND S.ScheduledDate >= DATEADD(DAY, 1, CAST(GETDATE() AS DATE)))
              OR (@Period = 'Past'
                AND S.ScheduledDate < CAST(GETDATE() AS DATE))
            )
            AND (
              @Search IS NULL
              OR C.FullName LIKE '%' + @Search + '%'
              OR C.CandidateID LIKE '%' + @Search + '%'
              OR JR.JobTitle LIKE '%' + @Search + '%'
              OR IT.Name LIKE '%' + @Search + '%'
            )
        )
        SELECT *
        FROM InterviewRows
        ORDER BY scheduledAt DESC, id DESC
        OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;
      `);
    const total = Number(result.recordset[0]?.totalCount ?? 0);
    const data = result.recordset.map((row) => {
      const { totalCount, ...interview } = row;
      void totalCount;
      return {
        ...interview,
        feedbackRating:
          interview.feedbackRating == null
            ? null
            : Number(interview.feedbackRating),
      };
    });
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getCandidatesWaitingForFinalApproval() {
    const pool = await this.database.connect();
    const result = await pool
      .request()
      .execute<
        Record<string, unknown>
      >('USP_GetCandidatesWaitingForFinalApproval');

    return result.recordset.map((row) => {
      const interviewId = Number(readRowValue(row, 'InterviewID', 'id'));
      const scheduleId = Number(
        readRowValue(
          row,
          'InterviewScheduledID',
          'InterviewScheduleID',
          'scheduleId',
        ),
      ) || interviewId;
      const applicationId = Number(
        readRowValue(row, 'ApplicationID', 'applicationId'),
      );
      const candidateCode = readRowText(row, 'CandidateID', 'candidateCode');
      const candidateName = readRowText(row, 'CandidateName', 'candidateName');
      const scheduledDate = readRowValue(
        row,
        'ScheduledDate',
        'ScheduledAt',
        'scheduledAt',
      );
      const scheduledAt =
        scheduledDate instanceof Date
          ? scheduledDate.toISOString()
          : (readRowText(
              row,
              'ScheduledDate',
              'ScheduledAt',
              'scheduledAt',
            ) ?? '');

      const missingFields = [
        !Number.isInteger(interviewId) || interviewId <= 0
          ? 'InterviewID'
          : null,
        !Number.isInteger(applicationId) || applicationId <= 0
          ? 'ApplicationID'
          : null,
        !candidateCode ? 'CandidateID' : null,
        !candidateName ? 'CandidateName' : null,
        !scheduledAt ? 'ScheduledDate' : null,
      ].filter((field): field is string => field !== null);
      if (missingFields.length > 0) {
        throw new InternalServerErrorException(
          `The final-approval feedback procedure is missing required columns: ${missingFields.join(', ')}.`,
        );
      }

      const interviewType =
        readRowText(row, 'InterviewType', 'InterviewTypeName') ?? '';
      const normalizedType = interviewType
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      const rating = readRowValue(
        row,
        'Rating',
        'OverallRating',
        'FeedbackRating',
        'InterviewRating',
      );
      const rawFeedbackSubmitted = readRowValue(
        row,
        'FeedbackSubmitted',
        'IsFeedbackSubmitted',
      );
      const rawIsLatestInterview = readRowValue(
        row,
        'IsLatestInterview',
        'LatestInterview',
      );
      const rawAlreadyMoved = readRowValue(
        row,
        'AlreadyMovedToNextStage',
        'IsMovedToNextStage',
      );
      const roundName =
        readRowText(row, 'RoundName', 'Round') ??
        (normalizedType === 'technical2'
          ? 'Round 2'
          : normalizedType === 'technical' || normalizedType === 'technical1'
            ? 'Round 1'
            : 'Interview');

      return {
        id: interviewId,
        scheduleId,
        applicationId,
        applicationCode:
          readRowText(row, 'ApplicationCode', 'applicationCode') ??
          `APP-${applicationId}`,
        candidateCode,
        candidateName,
        candidateEmail: readRowText(row, 'Email', 'CandidateEmail') ?? null,
        position: readRowText(row, 'JobTitle', 'Position') ?? '',
        scheduledDate: scheduledAt.slice(0, 10),
        scheduledTime:
          readRowText(row, 'ScheduledTime') ?? scheduledAt.slice(11, 19),
        scheduledAt,
        interviewerName:
          readRowText(row, 'InterviewerName', 'Interviewer') ?? '',
        interviewType,
        roundName,
        feedbackSubmitted:
          rawFeedbackSubmitted === undefined
            ? true
            : Boolean(Number(rawFeedbackSubmitted)),
        feedbackRating:
          rating === null || rating === undefined || rating === ''
            ? null
            : Number(rating),
        feedbackText:
          readRowText(row, 'Feedback', 'OverallFeedback', 'FeedbackText') ??
          null,
        status: 'completed' as const,
        isLatestInterview:
          rawIsLatestInterview === undefined
            ? true
            : Boolean(Number(rawIsLatestInterview)),
        alreadyMovedToNextStage:
          rawAlreadyMoved === undefined
            ? false
            : Boolean(Number(rawAlreadyMoved)),
      };
    });
  }

  async moveCandidateToNextStage(applicationId: number, employeeId: string) {
    const pool = await this.database.connect();
    const result = await pool
      .request()
      .input('ApplicationID', sql.Int, applicationId)
      .input('ActionBy', sql.VarChar(25), employeeId)
      .execute('USP_MoveCandidateToNextStage');
    const response = result.recordset?.[0] as
      | Record<string, unknown>
      | undefined;
    const statusCode = Number(readRowValue(response ?? {}, 'StatusCode'));
    const message =
      readRowText(response ?? {}, 'Message') ??
      'Unable to move the candidate to the next stage.';
    if (statusCode !== 200) {
      if (statusCode === 400 || statusCode === 409) {
        throw new BadRequestException(message);
      }
      if (statusCode === 401 || statusCode === 403) {
        throw new ForbiddenException(message);
      }
      if (statusCode === 404) {
        throw new NotFoundException(message);
      }
      throw new InternalServerErrorException(message);
    }

    return { success: true, message, applicationId };
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
    const interviewsById = new Map<number, InterviewerFeedbackWorklistRow>();
    for (const row of interviewsResult.recordset) {
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
        continue;
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
      const interviewStatus = readRowText(
        row,
        'InterviewStatus',
        'Status',
      )?.toLowerCase();
      const status =
        interviewStatus === 'scheduled' || interviewStatus === 'completed'
          ? interviewStatus
          : isFuture
            ? 'scheduled'
            : 'completed';
      const applicationIdValue = readRowValue(row, 'ApplicationID');
      const applicationId =
        applicationIdValue == null ? undefined : Number(applicationIdValue);
      const interviewerEmployeeId = readRowText(row, 'InterviewerEmployeeID');
      const candidateEmail = readRowText(row, 'Email', 'CandidateEmail');
      const round = readRowText(row, 'Round');
      const interviewType = readRowText(row, 'InterviewType');
      const feedbackCategory = readRowText(
        row,
        'FeedbackCategory',
        'CategoryName',
      );
      const categoryRatingValue = readRowValue(row, 'CategoryRating');
      const categoryRating =
        categoryRatingValue == null || categoryRatingValue === ''
          ? null
          : Number.isFinite(Number(categoryRatingValue))
            ? Number(categoryRatingValue)
            : null;
      const categoryComments =
        readRowText(row, 'CategoryComments')?.trim() || null;
      let interview = interviewsById.get(interviewId);
      if (!interview) {
        interview = {
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
          ...(candidateEmail !== undefined ? { candidateEmail } : {}),
          position: readRowText(row, 'JobTitle') ?? '—',
          interviewType: interviewType ?? 'Interview',
          roundName: interviewType ?? round ?? 'Interview',
          scheduledAt,
          status,
          interviewerName: interviewerEmployeeId ?? '',
          feedbackSubmitted,
          canSubmitFeedback: !isFuture && !feedbackSubmitted,
          feedbackRating,
          feedbackText: feedback?.trim() || null,
          feedbackDetails: [],
        };
        interviewsById.set(interviewId, interview);
      }

      interview.feedbackSubmitted =
        interview.feedbackSubmitted ||
        feedbackSubmitted ||
        categoryRating !== null;
      if (
        feedbackCategory &&
        !interview.feedbackDetails.some(
          (detail) => detail.categoryName === feedbackCategory,
        )
      ) {
        interview.feedbackDetails.push({
          categoryName: feedbackCategory,
          rating: categoryRating,
          comments: categoryComments,
        });
      }
    }

    const interviews = Array.from(interviewsById.values()).map((interview) => ({
      ...interview,
      canSubmitFeedback:
        interview.scheduledAt.getTime() <= Date.now() &&
        !interview.feedbackSubmitted,
    }));
    const applicationIds = Array.from(
      new Set(
        interviews
          .map((interview) => interview.applicationId)
          .filter((id): id is number => id !== undefined),
      ),
    );
    const feedbackAverages = new Map<
      number,
      { averageRating: number; feedbackCount: number }
    >();
    if (applicationIds.length > 0) {
      const aggregateRequest = pool.request();
      const applicationParameters = applicationIds.map((id, index) => {
        const parameter = `ApplicationID${index}`;
        aggregateRequest.input(parameter, sql.Int, id);
        return `@${parameter}`;
      });
      const aggregateResult = await aggregateRequest.query<{
        applicationId: number;
        averageRating: number;
        feedbackCount: number;
      }>(`
        SELECT
          S.ApplicationID AS applicationId,
          AVG(CAST(I.Rating AS DECIMAL(5, 2))) AS averageRating,
          COUNT(*) AS feedbackCount
        FROM dbo.Interviews I
        INNER JOIN dbo.InterviewSchedules S
          ON S.ID = I.InterviewScheduleID
        WHERE S.ApplicationID IN (${applicationParameters.join(', ')})
          AND I.FeedbackSubmitted = 1
          AND I.Rating IS NOT NULL
        GROUP BY S.ApplicationID;
      `);
      for (const row of aggregateResult.recordset) {
        const applicationId = Number(row.applicationId);
        const averageRating = Number(row.averageRating);
        const feedbackCount = Number(row.feedbackCount);
        if (
          Number.isInteger(applicationId) &&
          Number.isFinite(averageRating) &&
          Number.isInteger(feedbackCount) &&
          feedbackCount > 0
        ) {
          feedbackAverages.set(applicationId, {
            averageRating,
            feedbackCount,
          });
        }
      }
    }

    return {
      interviews: interviews.map((interview) => {
        const aggregate =
          interview.applicationId === undefined
            ? undefined
            : feedbackAverages.get(interview.applicationId);
        return {
          ...interview,
          candidateAverageRating: aggregate?.averageRating ?? null,
          candidateFeedbackCount: aggregate?.feedbackCount ?? 0,
        };
      }),
      categories: categoriesResult.recordset,
    };
  }

  async setTechnicalRoundDecision(
    interviewId: number,
    needsTechnical2: boolean,
    employeeId: string,
  ) {
    if (needsTechnical2) {
      throw new BadRequestException(
        'Use the Technical 2 scheduling action to request the next round.',
      );
    }

    const { pool, applicationId } = await this.getTechnicalOneApplication(
      interviewId,
      employeeId,
    );
    const hasProgressTable = await this.hasTechnicalRoundProgressTable(pool);
    if (hasProgressTable) {
      const existingDecision = await pool
        .request()
        .input('ApplicationID', sql.Int, applicationId).query<{
        Technical2Required: boolean;
      }>(`
          SELECT Technical2Required
          FROM dbo.RecruitmentTechnicalRoundProgress
          WHERE ApplicationID = @ApplicationID;
        `);
      if (existingDecision.recordset[0]?.Technical2Required === true) {
        throw new BadRequestException(
          'Technical 2 has already been selected for this candidate.',
        );
      }
    }

    const existingTechnicalTwo = await pool
      .request()
      .input('ApplicationID', sql.Int, applicationId).query<{ ID: number }>(`
        SELECT TOP (1) S.ID
        FROM dbo.InterviewSchedules S
        INNER JOIN dbo.Interviews I
          ON I.InterviewScheduleID = S.ID
        INNER JOIN dbo.Mst_InterviewType IT
          ON IT.ID = I.InterviewType
        WHERE S.ApplicationID = @ApplicationID
          AND LOWER(REPLACE(LTRIM(RTRIM(IT.Name)), ' ', '')) = 'technical2';
      `);
    if (existingTechnicalTwo.recordset.length > 0) {
      throw new BadRequestException(
        'A Technical 2 interview has already been scheduled for this candidate.',
      );
    }

    await this.saveTechnicalRoundDecision(
      pool,
      applicationId,
      false,
      employeeId,
      hasProgressTable,
    );
    return {
      success: true,
      message: 'Candidate moved to Final Interview Approval.',
    };
  }

  async scheduleTechnicalRoundTwo(
    interviewId: number,
    dto: TechnicalRoundTwoScheduleDto,
    employeeId: string,
  ) {
    const { pool, applicationId } =
      await this.getTechnicalOneApplicationForScheduling(interviewId);
    const scheduledAt = this.parseFutureSchedule(dto.date, dto.time);
    const interviewTypeResult = await pool.request().query<{
      id: number;
      name: string;
    }>(`
      SELECT TOP (1) ID AS id, Name AS name
      FROM dbo.Mst_InterviewType
      WHERE LOWER(REPLACE(LTRIM(RTRIM(Name)), ' ', '')) = 'technical2'
      ORDER BY ID;
    `);
    const technicalTwoType = interviewTypeResult.recordset[0];
    if (!technicalTwoType) {
      throw new ServiceUnavailableException(
        'The Technical 2 interview type is not configured.',
      );
    }

    const existingRound = await pool
      .request()
      .input('ApplicationID', sql.Int, applicationId).query<{ ID: number }>(`
        SELECT TOP (1) S.ID
        FROM dbo.InterviewSchedules S
        INNER JOIN dbo.Interviews I
          ON I.InterviewScheduleID = S.ID
        INNER JOIN dbo.Mst_InterviewType IT
          ON IT.ID = I.InterviewType
        WHERE S.ApplicationID = @ApplicationID
          AND LOWER(REPLACE(LTRIM(RTRIM(IT.Name)), ' ', '')) = 'technical2';
      `);
    if (existingRound.recordset.length > 0) {
      throw new BadRequestException(
        'A Technical 2 interview has already been scheduled for this candidate.',
      );
    }

    const hasProgressTable = await this.hasTechnicalRoundProgressTable(pool);
    const result = await pool
      .request()
      .input('ApplicationID', sql.Int, applicationId)
      .input('InterviewTypeID', sql.Int, technicalTwoType.id)
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
    const message = readRowText(response ?? {}, 'Message');
    if (statusCode !== 1) {
      throw new BadRequestException(
        message ?? 'Unable to schedule the Technical 2 interview.',
      );
    }

    await this.saveTechnicalRoundDecision(
      pool,
      applicationId,
      true,
      employeeId,
      hasProgressTable,
    );

    return {
      success: true,
      message: message ?? 'Technical 2 interview scheduled successfully.',
      interviewScheduleId: Number(
        readRowValue(response ?? {}, 'InterviewScheduleID'),
      ),
    };
  }

  private async getTechnicalOneApplication(
    interviewId: number,
    employeeId: string,
  ) {
    const pool = await this.database.connect();
    const assignedResult = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId)
      .execute<Record<string, unknown>>('USP_GetMyInterviews');
    const assignedInterview = assignedResult.recordset.find(
      (row) => Number(readRowValue(row, 'InterviewID')) === interviewId,
    );
    if (!assignedInterview) {
      throw new ForbiddenException(
        'Only the assigned interviewer can advance this interview.',
      );
    }
    if (!this.isTechnicalOne(assignedInterview)) {
      throw new BadRequestException(
        'The Technical 2 decision is only available after Technical 1.',
      );
    }
    const feedbackRating = readRowValue(
      assignedInterview,
      'OverallRating',
      'Rating',
    );
    const feedbackText = readRowText(
      assignedInterview,
      'OverallFeedback',
      'Feedback',
    );
    if (
      (feedbackRating === null || feedbackRating === undefined) &&
      !feedbackText?.trim()
    ) {
      throw new BadRequestException(
        'Submit Technical 1 feedback before choosing the next round.',
      );
    }

    const applicationResult = await pool
      .request()
      .input('InterviewID', sql.Int, interviewId).query<{
      applicationId: number;
    }>(`
        SELECT TOP (1) S.ApplicationID AS applicationId
        FROM dbo.Interviews I
        INNER JOIN dbo.InterviewSchedules S
          ON S.ID = I.InterviewScheduleID
        WHERE I.ID = @InterviewID
          AND I.FeedbackSubmitted = 1;
      `);
    const applicationId = Number(applicationResult.recordset[0]?.applicationId);
    if (!Number.isInteger(applicationId) || applicationId < 1) {
      throw new BadRequestException(
        'The completed Technical 1 interview is not linked to a candidate application.',
      );
    }
    return { pool, applicationId };
  }

  private async getTechnicalOneApplicationForScheduling(interviewId: number) {
    const pool = await this.database.connect();
    const result = await pool
      .request()
      .input('InterviewID', sql.Int, interviewId)
      .query<Record<string, unknown>>(`
        SELECT TOP (1)
          S.ApplicationID AS applicationId,
          IT.Name AS interviewType,
          CASE
            WHEN LOWER(REPLACE(LTRIM(RTRIM(IT.Name)), ' ', '')) IN ('technical1', 'technical')
              THEN 'Round 1'
            WHEN LOWER(REPLACE(LTRIM(RTRIM(IT.Name)), ' ', '')) = 'technical2'
              THEN 'Round 2'
            ELSE 'Interview'
          END AS roundName,
          I.FeedbackSubmitted AS feedbackSubmitted
        FROM dbo.Interviews I
        INNER JOIN dbo.InterviewSchedules S
          ON S.ID = I.InterviewScheduleID
        LEFT JOIN dbo.Mst_InterviewType IT
          ON IT.ID = I.InterviewType
        WHERE I.ID = @InterviewID;
      `);
    const interview = result.recordset[0];
    if (!interview) {
      throw new NotFoundException('The Technical 1 interview was not found.');
    }
    if (!this.isTechnicalOne(interview)) {
      throw new BadRequestException(
        'The Technical 2 interview can only be scheduled after Technical 1.',
      );
    }
    if (!Boolean(Number(readRowValue(interview, 'FeedbackSubmitted')))) {
      throw new BadRequestException(
        'Submit Technical 1 feedback before scheduling the next round.',
      );
    }

    const applicationId = Number(readRowValue(interview, 'applicationId'));
    if (!Number.isInteger(applicationId) || applicationId < 1) {
      throw new BadRequestException(
        'The completed Technical 1 interview is not linked to a candidate application.',
      );
    }
    return { pool, applicationId };
  }

  private isTechnicalOne(row: Record<string, unknown>) {
    const interviewType = readRowText(row, 'InterviewType', 'InterviewTypeName')
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const round = readRowText(row, 'Round', 'RoundName')?.toLowerCase();
    return (
      interviewType === 'technical1' ||
      (interviewType === 'technical' && /^1(?:\D|$)/.test(round ?? ''))
    );
  }

  private parseFutureSchedule(date: string, time: string) {
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
    return scheduledAt;
  }

  private async saveTechnicalRoundDecision(
    pool: sql.ConnectionPool,
    applicationId: number,
    needsTechnical2: boolean,
    employeeId: string,
    hasProgressTable: boolean,
  ) {
    if (!hasProgressTable) return;

    await pool
      .request()
      .input('ApplicationID', sql.Int, applicationId)
      .input('Technical2Required', sql.Bit, needsTechnical2)
      .input('DecisionBy', sql.VarChar(25), employeeId).query(`
        MERGE dbo.RecruitmentTechnicalRoundProgress AS target
        USING (SELECT @ApplicationID AS ApplicationID) AS source
          ON target.ApplicationID = source.ApplicationID
        WHEN MATCHED THEN UPDATE SET
          Technical2Required = @Technical2Required,
          DecisionBy = @DecisionBy,
          DecidedAt = SYSDATETIME()
        WHEN NOT MATCHED THEN INSERT
          (ApplicationID, Technical2Required, DecisionBy)
          VALUES
          (@ApplicationID, @Technical2Required, @DecisionBy);
      `);
  }

  private async hasTechnicalRoundProgressTable(
    pool: sql.ConnectionPool,
  ): Promise<boolean> {
    const result = await pool.request().query<{ tableExists: number }>(`
      SELECT CASE
        WHEN OBJECT_ID('dbo.RecruitmentTechnicalRoundProgress', 'U') IS NULL
        THEN 0
        ELSE 1
      END AS tableExists;
    `);
    return Number(result.recordset[0]?.tableExists) === 1;
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

    const assignedInterviews = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId)
      .execute<Record<string, unknown>>('USP_GetMyInterviews');
    const assignedInterviewRows = assignedInterviews.recordset.filter(
      (row) => Number(readRowValue(row, 'InterviewID')) === interviewId,
    );
    if (assignedInterviewRows.length === 0) {
      throw new ForbiddenException(
        'Only the assigned interviewer can submit feedback.',
      );
    }

    const hasExistingFeedback = assignedInterviewRows.some((row) => {
      const existingRating = readRowValue(
        row,
        'OverallRating',
        'Rating',
        'CategoryRating',
      );
      const existingFeedback = readRowText(
        row,
        'OverallFeedback',
        'Feedback',
      );
      return (
        (existingRating !== null &&
          existingRating !== undefined &&
          existingRating !== '') ||
        Boolean(existingFeedback?.trim())
      );
    });
    if (hasExistingFeedback) {
      throw new BadRequestException(
        'Feedback has already been submitted for this interview.',
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
