import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../database/database.service';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { CreateCandidateApplicationDto } from './dto/create-candidate-application.dto';
import { FinalInterviewApprovalDto } from './dto/final-interview-approval.dto';
import { SubmitInterviewFeedbackDto } from './dto/submit-interview-feedback.dto';
import { CreateCandidateOfferDto } from './dto/create-candidate-offer.dto';
import { UploadCandidateDocumentDto } from './dto/upload-candidate-document.dto';
import { BgvCandidateDto } from './dto/bgv-candidate.dto';
import { ApproveCandidateJoiningDto } from './dto/approve-candidate-joining.dto';
import { FinalApprovalDecisionDto } from './dto/final-approval-decision.dto';
import { extname } from 'path';

function recruitmentValue(
  row: Record<string, unknown>,
  ...keys: string[]
): unknown {
  const entries = Object.entries(row);
  for (const key of keys) {
    const normalizedKey = key.replace(/[^a-z\d]/gi, '').toLowerCase();
    const entry = entries.find(
      ([name]) =>
        name.replace(/[^a-z\d]/gi, '').toLowerCase() === normalizedKey,
    );
    if (
      entry &&
      entry[1] !== null &&
      entry[1] !== undefined &&
      entry[1] !== ''
    ) {
      return entry[1];
    }
  }
  return undefined;
}

@Injectable()
export class RecruitmentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getPendingRequisitions(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .execute('USP_GetPendingRequisition');

      const rows = result.recordset ?? [];
      const statusRow = rows.find(
        (row) => row?.StatusCode !== undefined && Number(row.StatusCode) <= 0,
      );
      if (statusRow) {
        const message =
          statusRow.Message ?? 'Unable to retrieve pending requisitions.';
        if (String(message).toLowerCase().includes('hiring manager')) {
          throw new ForbiddenException(message);
        }
        throw new BadRequestException(message);
      }

      return rows;
    } catch (error) {
      console.error('Error in getPendingRequisitions:', error);
      throw error;
    }
  }

  async requisitionAction(
    requisitionId: number,
    action: 'APPROVE' | 'REJECT',
    employeeId: string,
    companyId: number,
    reviewRemarks?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();
      const pendingRequisitions = await this.getPendingRequisitions(employeeId);
      const isAssignedHiringManager = pendingRequisitions.some((row) => {
        if (!row || typeof row !== 'object') return false;
        const rowId = recruitmentValue(
          row as Record<string, unknown>,
          'RequisitionID',
          'ID',
        );
        return Number(rowId) === requisitionId;
      });
      if (!isAssignedHiringManager) {
        throw new ForbiddenException(
          'Only the assigned active hiring manager can approve or reject this requisition.',
        );
      }

      const result = await pool
        .request()
        .input('Action', sql.VarChar(20), action)
        .input('RequisitionID', sql.Int, requisitionId)
        .input('CompanyID', sql.Int, companyId)
        .input('ActionBy', sql.VarChar(25), employeeId)
        .input('ReviewRemarks', sql.VarChar(500), reviewRemarks ?? null)
        .execute<{ StatusCode?: number; Message?: string }>(
          'USP_JobRequisition',
        );

      const statusRows = result.recordsets
        .flat()
        .filter((row) => row?.StatusCode !== undefined);
      const statusRow = statusRows[statusRows.length - 1];
      if (statusRow && Number(statusRow.StatusCode) <= 0) {
        throw new BadRequestException(
          statusRow.Message ?? `Unable to ${action.toLowerCase()} requisition.`,
        );
      }

      return result.recordset;
    } catch (error) {
      console.error('Error in requisitionAction:', error);
      throw error;
    }
  }

  async createJobOpening(requisitionId: number, employeeId: string) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('RequisitionID', sql.Int, requisitionId)
      .input('ActionBy', sql.VarChar(25), employeeId)
      .execute('USP_CreateJobOpening');

    return result.recordset;
  }

  async publishJobOpening(
    jobOpeningId: number,
    closingDate: string,
    employeeId: string,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('JobOpeningID', sql.Int, jobOpeningId)
      .input('ClosingDate', sql.Date, closingDate)
      .input('ActionBy', sql.VarChar(25), employeeId)
      .execute('USP_PublishJobOpening');

    return result.recordset;
  }
  async createRequisition(dto: CreateRequisitionDto, employeeId: string) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('Action', sql.VarChar(20), 'CREATE')
      .input('RequisitionID', sql.Int, null)
      .input('CompanyID', sql.Int, dto.companyId)
      .input('BranchID', sql.Int, dto.branchId)
      .input('DesignationID', sql.Int, dto.designationId)
      .input('JobTitle', sql.NVarChar(100), dto.jobTitle)
      .input('JobDescription', sql.NVarChar(4000), dto.jobDescription)
      .input('Vacancies', sql.Int, dto.vacancies)
      .input('SalaryRangeMin', sql.Decimal(12, 2), dto.salaryRangeMin ?? null)
      .input('SalaryRangeMax', sql.Decimal(12, 2), dto.salaryRangeMax ?? null)
      .input(
        'ExperienceRequired',
        sql.VarChar(50),
        dto.experienceRequired ?? null,
      )
      .input('Priority', sql.Int, dto.priority ?? null)
      .input('ActionBy', sql.VarChar(25), employeeId)
      .input('ReviewRemarks', sql.VarChar(500), null)
      .execute('USP_JobRequisition');

    return result.recordset;
  }

  // async createCandidateApplication(dto: CreateCandidateApplicationDto) {
  //   const pool = await this.databaseService.connect();

  //   const result = await pool
  //     .request()
  //     .input('JobOpeningID', sql.Int, dto.jobOpeningId)
  //     .input('FullName', sql.VarChar(200), dto.fullName)
  //     .input('Email', sql.VarChar(150), dto.email)
  //     .input('Phone', sql.VarChar(20), dto.phone)
  //     .input('Address', sql.VarChar(500), dto.address ?? null)
  //     .input('ResumeURL', sql.VarChar(500), dto.resumeUrl ?? null)
  //     .input('Source', sql.VarChar(100), dto.source ?? null)
  //     .execute('USP_CreateCandidateApplication');

  //   return result.recordset;
  // }

  /* async getCandidatesForScreening(jobOpeningId: number, employeeId: string) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('JobOpeningID', sql.Int, jobOpeningId)
      .input('ActionBy', sql.VarChar(25), employeeId)
      .execute('USP_GetCandidatesForScreening');

    return result.recordset;
  } */

  async getCandidateApplications(
    companyId: number,
    applicationStatusId?: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('ApplicationStatusID', sql.Int, applicationStatusId ?? null)
        .execute('USP_GetCandidateApplication');

      return result.recordset;
    } catch (error) {
      console.error('Error in getCandidateApplications:', error);

      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve candidate applications.',
      );
    }
  }

  async resumeScreening(
    applicationId: number,
    action: 'APPROVE' | 'REJECT',
    employeeId: string,
    reviewRemarks?: string,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('ApplicationID', sql.Int, applicationId)
      .input('Action', sql.VarChar(20), action)
      .input('ActionBy', sql.VarChar(25), employeeId)
      .input('ReviewRemarks', sql.VarChar(500), reviewRemarks ?? null)
      .execute('USP_ResumeScreening');

    return result.recordset;
  }

  async getCandidatesForAssessmentScheduling() {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .execute('USP_GetCandidatesForAssessmentScheduling');

    return result.recordset;
  }

  async getInterviewEligibleCandidates() {
    const pool = await this.databaseService.connect();
    const result = await pool
      .request()
      .execute('USP_GetCandidatesEligibleForInterview');
    const rows = (result.recordset ?? []) as Record<string, unknown>[];
    const failure = rows.find(
      (row) => recruitmentValue(row, 'StatusCode', 'statusCode') !== undefined,
    );
    if (failure) {
      const statusCode = Number(
        recruitmentValue(failure, 'StatusCode', 'statusCode'),
      );
      if (statusCode <= 0) {
        throw new InternalServerErrorException(
          recruitmentValue(failure, 'Message', 'message') ??
            'Unable to load candidates eligible for interview.',
        );
      }
    }

    return rows
      .filter(
        (row) =>
          recruitmentValue(row, 'ApplicationID', 'ApplicationId') !==
          undefined,
      )
      .map((row) => {
        const applicationId = Number(
          recruitmentValue(row, 'ApplicationID', 'ApplicationId'),
        );
        const candidateId = recruitmentValue(
          row,
          'CandidateID',
          'CandidateCode',
        );
        const candidateName = recruitmentValue(
          row,
          'CandidateName',
          'FullName',
        );
        const email = recruitmentValue(row, 'Email', 'CandidateEmail');
        const jobTitle = recruitmentValue(row, 'JobTitle', 'Position');
        if (
          !Number.isInteger(applicationId) ||
          applicationId <= 0 ||
          candidateId == null ||
          candidateName == null ||
          email == null ||
          jobTitle == null
        ) {
          throw new InternalServerErrorException(
            'Interview-eligible candidate data is missing an application ID, candidate ID, name, email, or job title.',
          );
        }
        return {
          ApplicationID: applicationId,
          CandidateID: String(candidateId),
          CandidateName: String(candidateName),
          Email: String(email),
          JobTitle: String(jobTitle),
        };
      });
  }

  async getScheduledCandidateInterviews(
    hrEmployeeId: string,
    filter: 'Today' | 'Upcoming' | 'Past',
  ): Promise<Record<string, unknown>[]> {
    const pool = await this.databaseService.connect();
    const result = await pool
      .request()
      .input('HREmployeeID', sql.VarChar(25), hrEmployeeId)
      .input('Filter', sql.VarChar(20), filter)
      .execute('USP_GetScheduledCandidateInterviews');
    const rows = (result.recordset ?? []) as Record<string, unknown>[];
    const statusRow = rows.find(
      (row) => recruitmentValue(row, 'StatusCode', 'statusCode') !== undefined,
    );
    const statusCode = statusRow
      ? Number(recruitmentValue(statusRow, 'StatusCode', 'statusCode'))
      : undefined;
    if (statusCode !== undefined && statusCode !== 200) {
      const message =
        recruitmentValue(statusRow!, 'Message', 'message') ??
        'Unable to retrieve scheduled interviews.';
      if (statusCode === 400) throw new BadRequestException(message);
      if (statusCode === 403) throw new ForbiddenException(message);
      throw new InternalServerErrorException(message);
    }
    return rows.filter(
      (row) =>
        recruitmentValue(row, 'ScheduledDate') !== undefined &&
        recruitmentValue(row, 'CandidateName') !== undefined,
    );
  }

  async getCandidatesForScreening(
    companyId: number,
    jobOpeningId: number | undefined,
    actionBy: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('JobOpeningID', sql.Int, jobOpeningId ?? null)
        .input('ActionBy', sql.VarChar(25), actionBy)
        .execute('USP_GetCandidatesForScreening');

      return result.recordset;
    } catch (error) {
      console.error('Get candidates for screening error:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve candidates for resume screening.',
      );
    }
  }

  async getFinalApprovals(query: {
    decision: 'pending' | 'selected' | 'rejected' | 'all';
    search?: string;
    page?: string;
    limit?: string;
  }) {
    const page = query.page === undefined ? 1 : Number(query.page);
    const limit = query.limit === undefined ? 20 : Number(query.limit);
    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('Page must be a positive integer.');
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100.');
    }

    const pool = await this.databaseService.connect();
    const result = await pool
      .request()
      .input('Decision', sql.VarChar(20), query.decision)
      .input('Search', sql.NVarChar(200), query.search?.trim() || null)
      .input('Offset', sql.Int, (page - 1) * limit)
      .input('Limit', sql.Int, limit).query(`
        WITH ApprovalRows AS (
          SELECT
            CA.ID AS id,
            CA.ID AS applicationId,
            CONCAT('APP-', CA.ID) AS applicationCode,
            C.CandidateID AS candidateCode,
            C.FullName AS candidateName,
            C.Email AS candidateEmail,
            JR.JobTitle AS position,
            CASE
              WHEN FIA.ID IS NULL THEN 'pending'
              WHEN FinalStatus.Name IS NOT NULL THEN LOWER(FinalStatus.Name)
              ELSE 'pending'
            END AS decision,
            FIA.Remarks AS remarks,
            InterviewStats.feedbackCount,
            InterviewStats.avgRating,
            LatestInterview.ID AS latestInterviewId,
            CA.ApplicationDate AS applicationDate,
            COUNT(*) OVER() AS totalCount
          FROM dbo.CandidateApplications CA
          INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
          INNER JOIN dbo.JobOpenings JO ON JO.ID = CA.JobOpeningID
          INNER JOIN dbo.JobRequisitions JR ON JR.ID = JO.RequisitionID
          LEFT JOIN dbo.FinalInterviewApprovals FIA
            ON FIA.ApplicationID = CA.ID
          LEFT JOIN dbo.Mst_ApplicationStatus FinalStatus
            ON FinalStatus.ID = FIA.FinalStatus
          CROSS APPLY (
            SELECT
              COUNT(*) AS feedbackCount,
              AVG(CAST(I.Rating AS DECIMAL(5, 2))) AS avgRating
            FROM dbo.Interviews I
            INNER JOIN dbo.InterviewSchedules S
              ON S.ID = I.InterviewScheduleID
            WHERE S.ApplicationID = CA.ID
              AND I.FeedbackSubmitted = 1
          ) InterviewStats
          OUTER APPLY (
            SELECT TOP (1) I.ID
            FROM dbo.Interviews I
            INNER JOIN dbo.InterviewSchedules S
              ON S.ID = I.InterviewScheduleID
            WHERE S.ApplicationID = CA.ID
              AND I.FeedbackSubmitted = 1
            ORDER BY I.InterviewDate DESC, I.ID DESC
          ) LatestInterview
          WHERE InterviewStats.feedbackCount > 0
            AND (
              @Decision = 'all'
              OR (@Decision = 'pending' AND FIA.ID IS NULL)
              OR (
                @Decision IN ('selected', 'rejected')
                AND LOWER(FinalStatus.Name) = @Decision
              )
            )
            AND (
              @Search IS NULL
              OR C.FullName LIKE '%' + @Search + '%'
              OR C.CandidateID LIKE '%' + @Search + '%'
              OR CONVERT(VARCHAR(20), CA.ID) LIKE '%' + @Search + '%'
              OR JR.JobTitle LIKE '%' + @Search + '%'
            )
        )
        SELECT *
        FROM ApprovalRows
        ORDER BY applicationDate DESC, applicationId DESC
        OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;
      `);
    const total = Number(result.recordset[0]?.totalCount ?? 0);
    const data = result.recordset.map((row) => {
      const { totalCount, ...record } = row;
      void totalCount;
      return {
        ...record,
        latestInterviewCode:
          row.latestInterviewId == null ? null : `INT-${row.latestInterviewId}`,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFinalApproval(applicationId: number) {
    const pool = await this.databaseService.connect();
    const result = await pool
      .request()
      .input('ApplicationID', sql.Int, applicationId)
      .execute('USP_GetFinalInterviewFeedbackDetails');
    const recordsets = Array.isArray(result.recordsets)
      ? result.recordsets
      : Object.values(result.recordsets);
    const rows = recordsets.flat() as Record<string, unknown>[];
    const approval = rows.find((row) =>
      recruitmentValue(
        row,
        'ApplicationID',
        'ApplicationId',
        'CandidateName',
        'FullName',
      ),
    ) ?? rows[0];
    if (!approval) {
      throw new NotFoundException(
        'Final interview approval was not found for this application.',
      );
    }

    const feedbackRows = rows.filter((row) =>
      recruitmentValue(
        row,
        'InterviewID',
        'InterviewId',
        'InterviewCode',
        'InterviewTypeName',
        'RoundName',
        'FeedbackID',
        'InterviewerName',
        'InterviewerFullName',
        'InterviewerEmployeeName',
        'EmployeeName',
        'Rating',
        'InterviewRating',
        'Feedback',
        'FeedbackComments',
        'InterviewFeedback',
      ),
    );
    const interviews = new Map<
      string,
      {
        id: unknown;
        code: string;
        roundName: unknown;
        scheduledAt: unknown;
        status: unknown;
        feedback: Record<string, unknown>[];
      }
    >();

    feedbackRows.forEach((row, index) => {
      const id = recruitmentValue(row, 'InterviewID', 'InterviewId');
      const idText =
        typeof id === 'string' || typeof id === 'number' ? String(id) : '';
      const interviewCode = recruitmentValue(row, 'InterviewCode');
      const roundName = recruitmentValue(
        row,
        'RoundName',
        'InterviewTypeName',
        'InterviewType',
        'InterviewName',
        'InterviewRound',
      );
      const groupValue = interviewCode ?? roundName;
      const groupKey =
        typeof groupValue === 'string' || typeof groupValue === 'number'
          ? String(groupValue)
          : `feedback-${index}`;
      const key =
        idText || groupKey;
      let interview = interviews.get(key);
      if (!interview) {
        interview = {
          id: id ?? interviewCode ?? key,
          code:
            (typeof interviewCode === 'string' ||
            typeof interviewCode === 'number'
              ? String(interviewCode)
              : '') || (idText ? `INT-${idText}` : `Interview ${index + 1}`),
          roundName,
          scheduledAt: recruitmentValue(
            row,
            'ScheduledAt',
            'ScheduledDate',
            'InterviewDate',
          ),
          status: recruitmentValue(row, 'InterviewStatus', 'Status'),
          feedback: [],
        };
        interviews.set(key, interview);
      }

      interview.feedback.push({
        id: recruitmentValue(row, 'FeedbackID') ?? id ?? key,
        categoryId: recruitmentValue(row, 'CategoryID', 'CategoryId'),
        categoryName: recruitmentValue(
          row,
          'CategoryName',
          'FeedbackCategoryName',
          'RatingCategory',
        ),
        interviewerId: recruitmentValue(
          row,
          'InterviewerID',
          'InterviewerEmployeeID',
          'EmployeeID',
        ),
        interviewerName: recruitmentValue(
          row,
          'InterviewerName',
          'InterviewerFullName',
          'InterviewerEmployeeName',
          'EmployeeName',
          'Interviewer',
        ),
        rating: recruitmentValue(
          row,
          'Rating',
          'FeedbackRating',
          'InterviewRating',
        ),
        recommendation: recruitmentValue(
          row,
          'Recommendation',
          'RecommendationName',
        ),
        feedback: recruitmentValue(
          row,
          'Feedback',
          'FeedbackComments',
          'FeedbackText',
          'FeedbackDescription',
          'InterviewFeedback',
          'Comments',
        ),
        strengths: recruitmentValue(row, 'Strengths'),
        concerns: recruitmentValue(row, 'Concerns'),
        submittedAt: recruitmentValue(
          row,
          'SubmittedAt',
          'FeedbackSubmittedAt',
          'InterviewDate',
        ),
      });
    });

    const approvalId = recruitmentValue(
      approval,
      'ApplicationID',
      'ApplicationId',
      'ID',
    );
    const averageRating = recruitmentValue(
      approval,
      'AvgRating',
      'AverageRating',
    );
    const feedbackCount =
      recruitmentValue(
        approval,
        'InterviewsWithFeedback',
        'FeedbackCount',
      ) ?? feedbackRows.length;

    return {
      ...approval,
      id: recruitmentValue(approval, 'ID', 'ApplicationID', 'ApplicationId'),
      applicationId: approvalId,
      applicationCode:
        recruitmentValue(approval, 'ApplicationCode') ??
        (approvalId === undefined ? undefined : `APP-${approvalId}`),
      candidateCode: recruitmentValue(
        approval,
        'CandidateCode',
        'CandidateID',
        'CandidateId',
      ),
      candidateName: recruitmentValue(
        approval,
        'CandidateName',
        'CandidateFullName',
        'FullName',
      ),
      candidateEmail: recruitmentValue(
        approval,
        'CandidateEmail',
        'Email',
      ),
      position: recruitmentValue(
        approval,
        'Position',
        'JobTitle',
        'Role',
      ),
      decision:
        recruitmentValue(
          approval,
          'Decision',
          'DecisionName',
          'FinalDecision',
          'FinalStatusName',
        ) ?? 'pending',
      avgRating: averageRating,
      feedbackCount,
      interviewsWithFeedback: feedbackCount,
      totalInterviewsConducted: recruitmentValue(
        approval,
        'TotalInterviewsConducted',
      ),
      interviews: [...interviews.values()].map((interview) => ({
        ...interview,
        status: interview.status ?? 'completed',
      })),
    };
  }

  async decideFinalApproval(
    applicationId: number,
    decision: FinalApprovalDecisionDto,
    actionBy: string,
  ) {
    await this.updateFinalInterviewApproval(
      {
        applicationId,
        isSelected: decision.decision === 'selected',
        remarks: decision.remarks,
      },
      actionBy,
    );
    return this.getFinalApproval(applicationId);
  }

  async updateFinalInterviewApproval(
    dto: FinalInterviewApprovalDto,
    actionBy: string,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('ApplicationID', sql.Int, dto.applicationId)
      .input('FinalStatus', sql.Int, dto.isSelected ? 5 : 3)
      .input('Remarks', sql.VarChar(500), dto.remarks ?? null)
      .input('ActionBy', sql.VarChar(25), actionBy)
      .execute('USP_UpdateFinalInterviewApproval');

    const status = result.recordset?.[0];
    if (status && Number(status.StatusCode) <= 0) {
      throw new BadRequestException(
        status.Message ?? 'Unable to submit the final interview decision.',
      );
    }

    if (dto.isSelected) {
      const selectedStatusResult = await pool
        .request()
        .input('Name', sql.VarChar(50), 'Selected')
        .query(
          'SELECT TOP (1) ID FROM dbo.Mst_ApplicationStatus WHERE Name = @Name',
        );
      const selectedStatusId = selectedStatusResult.recordset[0]?.ID;
      if (selectedStatusId == null) {
        throw new InternalServerErrorException(
          'Application status "Selected" is not configured.',
        );
      }

      const updateResult = await pool
        .request()
        .input('ApplicationID', sql.Int, dto.applicationId)
        .input('ApplicationStatus', sql.Int, Number(selectedStatusId))
        .query(`
          UPDATE dbo.CandidateApplications
          SET ApplicationStatus = @ApplicationStatus
          WHERE ID = @ApplicationID;
          SELECT @@ROWCOUNT AS affectedRows;
        `);
      if (Number(updateResult.recordset[0]?.affectedRows ?? 0) !== 1) {
        throw new NotFoundException(
          'Candidate application was not found after final approval.',
        );
      }
    }

    return result.recordset;
  }

  async submitInterviewFeedback(
    dto: SubmitInterviewFeedbackDto,
    actionBy: string,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('InterviewID', sql.Int, dto.interviewId)
      .input('Rating', sql.Decimal(3, 1), dto.rating)
      .input('Feedback', sql.VarChar(1000), dto.feedback)
      .input('ActionBy', sql.VarChar(25), actionBy)
      .execute('USP_SubmitInterviewFeedback');

    return result.recordset;
  }

  async createCandidateOffer(dto: CreateCandidateOfferDto, actionBy: string) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('ApplicationID', sql.Int, dto.applicationId)
      .input('OfferedSalary', sql.Decimal(18, 2), dto.offeredSalary)
      .input(
        'NegotiatedSalary',
        sql.Decimal(18, 2),
        dto.negotiatedSalary ?? null,
      )
      .input('ActionBy', sql.VarChar(25), actionBy)
      .execute('USP_CreateCandidateOffer');

    return result.recordset;
  }

  async getCandidatesForVerification(hrManagerEmployeeId: string) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('HRManagerEmployeeID', sql.VarChar(25), hrManagerEmployeeId)
      .execute('USP_GetCandidatesForVerification');

    return result.recordset;
  }

  async getPendingBgvDocuments(
    hrManagerEmployeeId: string,
    applicationId?: number,
    flag = 1,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('HRManagerEmployeeID', sql.VarChar(25), hrManagerEmployeeId)
        .input('ApplicationID', sql.Int, applicationId ?? null)
        .input('Flag', sql.Int, flag)
        .execute('USP_GetPendingBGVDocuments');

      let rows = result.recordset ?? [];
      const firstRow = rows[0] as
        | { StatusCode?: number; StatusMessage?: string }
        | undefined;

      if (firstRow?.StatusCode === 400) {
        throw new BadRequestException(
          firstRow.StatusMessage || 'Invalid BGV document request.',
        );
      }

      if (firstRow?.StatusCode === 403) {
        throw new ForbiddenException(
          firstRow.StatusMessage ||
            'Only an active HR Manager can view pending BGV documents.',
        );
      }

      if (firstRow?.StatusCode === 404) {
        throw new NotFoundException(
          firstRow.StatusMessage || 'Candidate application not found.',
        );
      }

      if (firstRow?.StatusCode === 500) {
        throw new InternalServerErrorException(
          firstRow.StatusMessage ||
            'Failed to retrieve pending BGV documents.',
        );
      }

      if (flag === 2 && applicationId !== undefined) {
        const documentsResult = await pool
          .request()
          .input('ApplicationID', sql.Int, applicationId).query(`
            SELECT
              CD.ID AS DocumentID,
              CD.ApplicationID AS ApplicationID,
              CD.DocumentType AS DocumentType,
              DT.DocumentName AS DocumentName,
              CD.DocumentURL AS DocumentURL,
              CD.ActualFileName AS ActualFileName,
              CD.FileName AS FileName,
              CD.FileExtension AS FileExtension,
              CD.UploadedDate AS UploadedDate,
              CD.VerificationStatus AS VerificationStatus,
              CD.VerificationRemarks AS VerificationRemarks,
              CD.VerifiedBy AS VerifiedBy,
              CD.VerifiedDate AS VerifiedDate
            FROM dbo.CandidateDocuments CD
            LEFT JOIN dbo.Mst_DocumentType DT ON DT.ID = CD.DocumentType
            WHERE CD.ApplicationID = @ApplicationID
            ORDER BY CD.UploadedDate, CD.ID;
          `);
        rows = documentsResult.recordset ?? [];
      }

      return {
        success: true,
        statusCode: 200,
        message: flag === 1
          ? 'Pending BGV candidate list retrieved successfully.'
          : 'BGV document details retrieved successfully.',
        data: rows,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      console.error('Get pending BGV documents error:', error);

      throw new InternalServerErrorException(
        'Failed to retrieve pending BGV documents.',
      );
    }
  }

  async getAllVerificationCandidates(hrManagerEmployeeId: string) {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('HRManagerEmployeeID', sql.VarChar(25), hrManagerEmployeeId)
        .execute('USP_GetAllVerificationCandidates');

      const rows = result.recordset ?? [];
      const firstRow = rows[0] as
        | { StatusCode?: number; StatusMessage?: string }
        | undefined;

      if (firstRow?.StatusCode === 403) {
        throw new ForbiddenException(
          firstRow.StatusMessage ||
            'Only an active HR Manager can view verification candidates.',
        );
      }

      if (firstRow?.StatusCode === 500) {
        throw new InternalServerErrorException(
          firstRow.StatusMessage ||
            'Failed to retrieve verification candidates.',
        );
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Verification candidates retrieved successfully.',
        data: rows,
      };
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      console.error('Get all verification candidates error:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve verification candidates.',
      );
    }
  }

  async uploadCandidateDocument(dto: UploadCandidateDocumentDto) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('ApplicationID', sql.Int, dto.applicationId)
      .input('DocumentType', sql.Int, dto.documentType)
      .input('DocumentURL', sql.VarChar(300), dto.documentUrl)
      .execute('USP_UploadCandidateDocument');

    return result.recordset;
  }

  async performBgvCandidate(dto: BgvCandidateDto, hrManagerEmployeeId: string) {
    try {
      const pool = await this.databaseService.connect();
      const documentsTable = new sql.Table('dbo.BGVDocumentVerificationType');

      documentsTable.columns.add('DocumentID', sql.Int, {
        nullable: false,
      });
      documentsTable.columns.add('VerificationStatus', sql.VarChar(20), {
        nullable: false,
      });
      documentsTable.columns.add('Remarks', sql.VarChar(500), {
        nullable: true,
      });

      for (const document of dto.documents) {
        documentsTable.rows.add(
          document.documentId,
          document.verificationStatus,
          document.remarks?.trim() || null,
        );
      }

      const result = await pool
        .request()
        .input('Documents', documentsTable)
        .input('HRManagerEmployeeID', sql.VarChar(25), hrManagerEmployeeId)
        .execute('dbo.USP_BGV_Candidate');

      const rows = result.recordset ?? [];
      const firstRow = rows[0] as
        | { StatusCode?: number; Message?: string }
        | undefined;

      if (firstRow?.StatusCode === 400) {
        throw new BadRequestException(firstRow.Message);
      }
      if (firstRow?.StatusCode === 403) {
        throw new ForbiddenException(firstRow.Message);
      }
      if (firstRow?.StatusCode === 404) {
        throw new NotFoundException(firstRow.Message);
      }
      if (firstRow?.StatusCode === 500) {
        throw new InternalServerErrorException(firstRow.Message);
      }

      return {
        success: true,
        message: 'BGV document verification completed successfully.',
        data: rows,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      console.error('Perform BGV Candidate Error:', error);
      throw new InternalServerErrorException(
        'Failed to perform candidate background verification.',
      );
    }
  }

  async getCandidatesForJoining(hrManagerEmployeeId: string) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('HRManagerEmployeeID', sql.VarChar(25), hrManagerEmployeeId)
      .execute('USP_GetCandidatesForJoining');

    return result.recordset;
  }
  async approveCandidateJoining(
    dto: ApproveCandidateJoiningDto,
    approvedBy: string,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('ApplicationID', dto.applicationId)
      .input('JoiningDate', sql.Date, dto.joiningDate)
      .input('ApprovedBy', sql.VarChar(25), approvedBy)
      .execute('USP_ApproveCandidateJoining');

    return result.recordsets;
  }

  async skipCandidateAssessment(
    applicationId: number,
    employeeId: string,
    remarks?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ApplicationID', sql.Int, applicationId)
        .input('ActionBy', sql.VarChar(25), employeeId)
        .input('Remarks', sql.VarChar(500), remarks ?? null)
        .execute('USP_SkipCandidateAssessment');

      return result.recordset;
    } catch (error) {
      console.error('Error in skipCandidateAssessment:', error);
      throw error;
    }
  }
  async getRequisitionMaster(companyId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('IncludeInactive', sql.Bit, 0)
        .input('AsJson', sql.Bit, 0)
        .execute('USP_GetCompanyMasterData_N');

      return {
        success: true,
        data: {
          companies: result.recordsets[0] || [],
          branches: result.recordsets[1] || [],
          departments: result.recordsets[2] || [],
          designations: result.recordsets[3] || [],
        },
      };
    } catch (error) {
      console.error('Error in getRequisitionMaster:', error);
      throw error;
    }
  }
  async getRecruitmentDashboard(stage: string = 'ALL') {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Stage', sql.VarChar(30), stage)
        .execute('USP_GetRecruitmentDashboard');

      return {
        success: true,
        data: {
          applications: result.recordsets[0] || [],
          summary: result.recordsets[1]?.[0] || {},
        },
        message:
          result.recordsets[2]?.[0]?.Message ||
          'Recruitment pipeline data retrieved successfully.',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve recruitment dashboard.',
      );
    }
  }
  async createCandidateApplication(
    dto: CreateCandidateApplicationDto,
    resume: Express.Multer.File,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const resumeUrl = resume
        ? `/uploads/recruitment/resumes/${resume.filename}`
        : null;

      const actualFileName = resume ? resume.originalname : null;

      const fileName = resume ? resume.filename : null;

      const fileExtension = resume ? extname(resume.originalname) : null;

      const fileSizeKB = resume
        ? Number((resume.size / 1024).toFixed(2))
        : null;

      const result = await pool
        .request()
        .input('JobOpeningID', sql.Int, dto.jobOpeningId)
        .input('FullName', sql.VarChar(200), dto.fullName)
        .input('Email', sql.VarChar(150), dto.email)
        .input('Phone', sql.VarChar(20), dto.phone)
        .input('Address', sql.VarChar(500), dto.address ?? null)
        .input('ResumeURL', sql.VarChar(500), resumeUrl)
        .input('ActualFileName', sql.VarChar(255), actualFileName)
        .input('FileName', sql.VarChar(255), fileName)
        .input('FileExtension', sql.VarChar(20), fileExtension)
        .input('FileSizeKB', sql.Decimal(18, 2), fileSizeKB)
        .input('Source', sql.VarChar(100), dto.source ?? null)
        .input('ReferredBy', sql.VarChar(100), dto.referredBy ?? null)
        .execute('USP_CreateCandidateApplication');

      return result.recordset;
    } catch (error) {
      console.error('Create candidate application error:', error);

      throw new InternalServerErrorException(
        'Failed to create candidate application.',
      );
    }
  }
  async getActiveJobOpenings(companyId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('Flag', sql.Int, 3)
        .execute('USP_GetRecruitmentPriority');
      return {
        success: true,
        data: result.recordset || [],
        message: 'Active job openings retrieved successfully.',
      };
    } catch (error) {
      console.error('Get active job openings error:', error);
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve active job openings.',
      );
    }
  }

  async getRecruitmentSources() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, 0)
        .input('Flag', sql.Int, 4)
        .execute('USP_GetRecruitmentPriority');
      return {
        success: true,
        data: result.recordset || [],
        message: 'Recruitment sources retrieved successfully.',
      };
    } catch (error) {
      console.error('Get recruitment sources error:', error);
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve recruitment sources.',
      );
    }
  }
  async getAllRequisitionsForHR(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), String(employeeId))
        .execute('dbo.USP_GetAllRequisitionsForHR');

      const rows = result.recordset;

      if (rows?.[0]?.StatusCode === 0) {
        throw new BadRequestException(rows[0].Message);
      }

      return {
        success: true,
        message: 'Requisitions retrieved successfully',
        data: rows,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve requisitions');
    }
  }
  // scheduled candidate assessment start from here
  async scheduleCandidateAssessment(
    applicationId: number,
    assessmentTypeId: number,
    scheduledDate: string,
    employeeId: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ApplicationID', sql.Int, applicationId)
        .input('AssessmentTypeID', sql.Int, assessmentTypeId)
        .input('ScheduledDate', sql.DateTime, new Date(scheduledDate))
        .input('AssignedBy', sql.VarChar(25), employeeId)
        .execute('USP_ScheduleCandidateAssessment');

      return result.recordset;
    } catch (error) {
      console.error('Schedule Candidate Assessment Error:', error);

      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to schedule candidate assessment',
      );
    }
  }
  // scheduled candidate assessment dropdowns
  async getAssessmentScheduleDropdowns(companyId: number) {
    try {
      const pool = await this.databaseService.connect();

      const candidatesResult = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('Flag', sql.Int, 9)
        .execute('USP_GetRecruitmentPriority');

      const assessmentTypesResult = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('Flag', sql.Int, 8)
        .execute('USP_GetRecruitmentPriority');

      return {
        candidates: candidatesResult.recordset,
        assessmentTypes: assessmentTypesResult.recordset,
      };
    } catch (error) {
      console.error('Assessment Schedule Dropdown Error:', error);

      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve assessment schedule dropdowns',
      );
    }
  }
  async updateCandidateAssessmentResult(
    assessmentId: number,
    score: number,
    isQualified: boolean,
    remarks: string | undefined,
    reviewedBy: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('AssessmentID', sql.Int, assessmentId)
        .input('Score', sql.Decimal(5, 2), score)
        .input('IsQualified', sql.Bit, isQualified)
        .input('Remarks', sql.VarChar(500), remarks ?? null)
        .input('ReviewedBy', sql.VarChar(25), reviewedBy)
        .execute('USP_UpdateCandidateAssessmentResult');

      const status = result.recordset?.find(
        (row) => row?.StatusCode !== undefined,
      );
      if (status && Number(status.StatusCode) <= 0) {
        throw new BadRequestException(
          status.Message ?? 'Unable to update candidate assessment result.',
        );
      }

      return result.recordset;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Update Candidate Assessment Result Error:', error);

      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to update candidate assessment result',
      );
    }
  }
  async getJobRequisitionDetails(requisitionId: number) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('RequisitionID', sql.Int, requisitionId)
        .execute('USP_GetJobRequisitionDetails');
 
      const data = result.recordset?.[0];
 
      if (!data || data.StatusCode === 0) {
        throw new BadRequestException(
          data?.Message || 'Job requisition not found.',
        );
      }
 
      return {
        success: true,
        message: 'Job requisition details retrieved successfully.',
        data,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
 
      throw new InternalServerErrorException(
        'Failed to retrieve job requisition details.',
      );
    }
  }
   async getJobOpenings() {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool.request().execute('USP_GetJobOpenings');
 
      return {
        success: true,
        data: result.recordset || [],
        message: 'Job openings retrieved successfully.',
      };
    } catch (error) {
      console.error('Error in getJobOpenings:', error);
 
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve job openings.',
      );
    }
  }
 
}
