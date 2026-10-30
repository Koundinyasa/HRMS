import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as sql from 'mssql';
import { DatabaseService } from '../database/database.service';
import { MailService } from '../mail/mail.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

type OfferStatus = 'all' | 'draft' | 'extended' | 'accepted' | 'rejected';

export interface OfferRecord {
  id: number;
  applicationId: number;
  offerReferenceNo: string;
  candidateCode: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  offeredSalary: number;
  negotiatedSalary: number | null;
  status: string;
  response: string | null;
  approvalDate: Date | null;
  offerLetterGeneratedDate: Date | null;
  responseDate: Date | null;
  createdDate: Date;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
}

export interface CompletedInterviewCandidate {
  applicationId: number;
  candidateId: string;
  candidateName: string;
  email: string;
  jobTitle: string;
  applicationDate: Date | string | null;
  applicationStatus: string;
}

type CompletedInterviewCandidateRow = {
  ApplicationID: number;
  CandidateID: string;
  CandidateName: string;
  Email: string;
  JobTitle: string;
  ApplicationDate: Date | string | null;
  ApplicationStatus: string;
};

@Injectable()
export class OffersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  async getCompletedInterviewCandidates(): Promise<
    CompletedInterviewCandidate[]
  > {
    const pool = await this.databaseService.connect();
    const result = await pool
      .request()
      .execute<CompletedInterviewCandidateRow>(
        'USP_GetCompletedInterviews',
      );

    return result.recordset.map((row) => ({
      applicationId: row.ApplicationID,
      candidateId: row.CandidateID,
      candidateName: row.CandidateName,
      email: row.Email,
      jobTitle: row.JobTitle,
      applicationDate: row.ApplicationDate,
      applicationStatus: row.ApplicationStatus,
    }));
  }

  async getOffers(query: {
    search?: string;
    status: OfferStatus;
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
    const request = pool
      .request()
      .input('Search', sql.NVarChar(200), query.search?.trim() || null)
      .input('Status', sql.VarChar(20), query.status)
      .input('Offset', sql.Int, (page - 1) * limit)
      .input('Limit', sql.Int, limit);
    const result = await request.query(`
      WITH OfferRows AS (
        SELECT
          O.ID AS id,
          O.ApplicationID AS applicationId,
          O.OfferReferenceNo AS offerReferenceNo,
          C.CandidateID AS candidateCode,
          C.FullName AS candidateName,
          C.Email AS candidateEmail,
          JR.JobTitle AS position,
          O.OfferedSalary AS offeredSalary,
          O.NegotiatedSalary AS negotiatedSalary,
          CASE
            WHEN CandidateResponseStatus.Name = 'Accepted' THEN 'accepted'
            WHEN CandidateResponseStatus.Name = 'Declined' THEN 'rejected'
            WHEN OfferStatus.Name = 'Pending' THEN 'draft'
            WHEN OfferStatus.Name = 'Offer Extended' THEN 'extended'
            ELSE LOWER(COALESCE(OfferStatus.Name, 'unknown'))
          END AS status,
          CASE
            WHEN CandidateResponseStatus.Name = 'Accepted' THEN 'accepted'
            WHEN CandidateResponseStatus.Name = 'Declined' THEN 'rejected'
            ELSE NULL
          END AS response,
          O.ApprovalDate AS approvalDate,
          O.OfferLetterGeneratedDate AS offerLetterGeneratedDate,
          O.ResponseDate AS responseDate,
          O.CreatedDate AS createdDate
        FROM dbo.Offers O
        INNER JOIN dbo.CandidateApplications CA ON CA.ID = O.ApplicationID
        INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
        INNER JOIN dbo.JobOpenings JO ON JO.ID = CA.JobOpeningID
        INNER JOIN dbo.JobRequisitions JR ON JR.ID = JO.RequisitionID
        LEFT JOIN dbo.Mst_ApplicationStatus OfferStatus
          ON OfferStatus.ID = O.OfferStatus
        LEFT JOIN dbo.Mst_ApplicationStatus CandidateResponseStatus
          ON CandidateResponseStatus.ID = O.CandidateResponse
        WHERE
          (@Status = 'all'
            OR (@Status = 'draft' AND OfferStatus.Name = 'Pending' AND O.CandidateResponse IS NULL)
            OR (@Status = 'extended' AND OfferStatus.Name = 'Offer Extended' AND O.CandidateResponse IS NULL)
            OR (@Status = 'accepted' AND CandidateResponseStatus.Name = 'Accepted')
            OR (@Status = 'rejected' AND CandidateResponseStatus.Name = 'Declined'))
          AND (
            @Search IS NULL
            OR O.OfferReferenceNo LIKE '%' + @Search + '%'
            OR C.FullName LIKE '%' + @Search + '%'
            OR C.CandidateID LIKE '%' + @Search + '%'
            OR C.Email LIKE '%' + @Search + '%'
            OR JR.JobTitle LIKE '%' + @Search + '%'
            OR CONVERT(VARCHAR(20), O.ApplicationID) LIKE '%' + @Search + '%'
          )
      )
      SELECT *, COUNT(*) OVER() AS totalCount
      FROM OfferRows
      ORDER BY createdDate DESC, id DESC
      OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;
    `);
    const total = Number(result.recordset[0]?.totalCount ?? 0);
    const data = result.recordset.map(
      ({ totalCount: _totalCount, ...offer }) => offer,
    );
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOffer(id: number) {
    const pool = await this.databaseService.connect();
    const result = await pool
      .request()
      .input('OfferID', sql.Int, id)
      .query(this.offerDetailsQuery);
    const offer = result.recordset[0] as OfferRecord | undefined;
    if (!offer) throw new NotFoundException('Offer was not found.');
    return offer;
  }

  async createOffer(dto: CreateOfferDto, actionBy: string) {
    const pool = await this.databaseService.connect();
    const transaction = new sql.Transaction(pool);
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    let committed = false;
    try {
      const action = await this.requireOfferManager(transaction, actionBy);
      const application = await this.getApplicationForOffer(
        transaction,
        dto.applicationId,
      );
      await this.validateApplicationForOffer(transaction, application);
      this.validateSalary(dto.offeredSalary, dto.negotiatedSalary, application);

      const duplicate = await transaction
        .request()
        .input('ApplicationID', sql.Int, dto.applicationId)
        .query(
          'SELECT TOP (1) ID FROM dbo.Offers WITH (UPDLOCK, HOLDLOCK) WHERE ApplicationID = @ApplicationID',
        );
      if (duplicate.recordset.length) {
        throw new BadRequestException(
          'An offer already exists for this application.',
        );
      }

      const pendingStatus = await this.getStatusId(transaction, 'Pending');
      const company = await transaction
        .request()
        .input('CompanyID', sql.Int, application.companyId)
        .query(
          'SELECT CompanyCode FROM dbo.Mst_Company WHERE CompanyID = @CompanyID',
        );
      const companyCode = String(
        company.recordset[0]?.CompanyCode ?? '',
      ).trim();
      if (!companyCode) {
        throw new BadRequestException(
          'Company code is not configured for this job requisition.',
        );
      }

      const nextReference = await transaction
        .request()
        .input('ReferencePattern', sql.VarChar(30), `${companyCode}-%`).query(`
          SELECT ISNULL(MAX(TRY_CONVERT(INT, RIGHT(OfferReferenceNo, 6))), 0) + 1 AS nextNumber
          FROM dbo.Offers WITH (UPDLOCK, HOLDLOCK)
          WHERE OfferReferenceNo LIKE @ReferencePattern;
        `);
      const offerReferenceNo = `${companyCode}-${String(
        nextReference.recordset[0].nextNumber,
      ).padStart(6, '0')}`;

      const inserted = await transaction
        .request()
        .input('ApplicationID', sql.Int, dto.applicationId)
        .input('ApprovedBy', sql.VarChar(25), actionBy)
        .input('OfferedSalary', sql.Decimal(12, 2), dto.offeredSalary)
        .input(
          'NegotiatedSalary',
          sql.Decimal(12, 2),
          dto.negotiatedSalary ?? null,
        )
        .input('OfferStatus', sql.Int, pendingStatus)
        .input('CreatedBy', sql.Int, action.userId)
        .input('OfferReferenceNo', sql.VarChar(50), offerReferenceNo).query(`
          INSERT INTO dbo.Offers
            (ApplicationID, ApprovedBy, ApprovalDate, OfferLetterGeneratedDate,
             OfferedSalary, NegotiatedSalary, CandidateResponse, ResponseDate,
             OfferStatus, CreatedBy, CreatedDate, OfferReferenceNo)
          OUTPUT INSERTED.ID AS id
          VALUES
            (@ApplicationID, @ApprovedBy, NULL, NULL, @OfferedSalary,
             @NegotiatedSalary, NULL, NULL, @OfferStatus, @CreatedBy,
             GETDATE(), @OfferReferenceNo);
        `);
      await transaction.commit();
      committed = true;
      return this.getOffer(Number(inserted.recordset[0].id));
    } catch (error) {
      if (!committed) await transaction.rollback();
      throw error;
    }
  }

  async updateDraftOffer(id: number, dto: UpdateOfferDto, actionBy: string) {
    const pool = await this.databaseService.connect();
    const transaction = new sql.Transaction(pool);
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    let committed = false;
    try {
      const action = await this.requireOfferManager(transaction, actionBy);
      const offerResult = await transaction
        .request()
        .input('OfferID', sql.Int, id)
        .query(
          'SELECT * FROM dbo.Offers WITH (UPDLOCK, HOLDLOCK) WHERE ID = @OfferID',
        );
      const offer = offerResult.recordset[0];
      if (!offer) throw new NotFoundException('Offer was not found.');
      const pendingStatus = await this.getStatusId(transaction, 'Pending');
      if (
        offer.OfferStatus !== pendingStatus ||
        offer.CandidateResponse != null
      ) {
        throw new BadRequestException('Only draft offers can be updated.');
      }

      const application = await this.getApplicationForOffer(
        transaction,
        offer.ApplicationID,
      );
      const offeredSalary = dto.offeredSalary ?? Number(offer.OfferedSalary);
      const negotiatedSalary =
        dto.negotiatedSalary === undefined
          ? offer.NegotiatedSalary == null
            ? undefined
            : Number(offer.NegotiatedSalary)
          : (dto.negotiatedSalary ?? undefined);
      this.validateSalary(offeredSalary, negotiatedSalary, application);

      await transaction
        .request()
        .input('OfferID', sql.Int, id)
        .input('OfferedSalary', sql.Decimal(12, 2), offeredSalary)
        .input('NegotiatedSalary', sql.Decimal(12, 2), negotiatedSalary ?? null)
        .input('ModifiedBy', sql.Int, action.userId).query(`
          UPDATE dbo.Offers
          SET OfferedSalary = @OfferedSalary,
              NegotiatedSalary = @NegotiatedSalary,
              ModifiedBy = @ModifiedBy,
              ModifiedDate = GETDATE()
          WHERE ID = @OfferID;
        `);
      await transaction.commit();
      committed = true;
      return this.getOffer(id);
    } catch (error) {
      if (!committed) await transaction.rollback();
      throw error;
    }
  }

  async extendOffer(id: number, actionBy: string) {
    const pool = await this.databaseService.connect();
    const transaction = new sql.Transaction(pool);
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    let committed = false;
    try {
      const action = await this.requireOfferManager(transaction, actionBy);
      const offerResult = await transaction
        .request()
        .input('OfferID', sql.Int, id)
        .query(
          this.offerDetailsQuery.replace(
            'FROM dbo.Offers O',
            'FROM dbo.Offers O WITH (UPDLOCK, HOLDLOCK)',
          ),
        );
      const offer = offerResult.recordset[0] as OfferRecord | undefined;
      if (!offer) throw new NotFoundException('Offer was not found.');
      if (offer.status !== 'draft') {
        throw new BadRequestException('Only draft offers can be extended.');
      }
      if (!offer.candidateEmail) {
        throw new BadRequestException(
          'The candidate does not have an email address on file.',
        );
      }

      const extendedStatus = await this.getStatusId(
        transaction,
        'Offer Extended',
      );
      const applicationStatus = extendedStatus;
      const letter = await this.createOfferLetter(offer);
      await transaction
        .request()
        .input('OfferID', sql.Int, id)
        .input('ApplicationID', sql.Int, offer.applicationId)
        .input('OfferStatus', sql.Int, extendedStatus)
        .input('ApplicationStatus', sql.Int, applicationStatus)
        .input('ModifiedBy', sql.Int, action.userId).query(`
          UPDATE dbo.Offers
          SET OfferStatus = @OfferStatus,
              ApprovalDate = GETDATE(),
              OfferLetterGeneratedDate = GETDATE(),
              ModifiedBy = @ModifiedBy,
              ModifiedDate = GETDATE()
          WHERE ID = @OfferID;
          UPDATE dbo.CandidateApplications
          SET ApplicationStatus = @ApplicationStatus
          WHERE ID = @ApplicationID;
        `);

      await this.mailService.sendOfferLetter(
        offer.candidateEmail,
        offer.candidateName,
        offer.position,
        offer.offerReferenceNo,
        letter,
      );
      await transaction.commit();
      committed = true;
      return this.getOffer(id);
    } catch (error) {
      if (!committed) await transaction.rollback();
      throw error;
    }
  }

  async recordOfferResponse(
    id: number,
    response: 'accepted' | 'rejected',
    actionBy: string,
  ) {
    const pool = await this.databaseService.connect();
    const transaction = new sql.Transaction(pool);
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    let committed = false;
    try {
      const action = await this.requireOfferManager(transaction, actionBy);
      const currentOffer = await transaction
        .request()
        .input('OfferID', sql.Int, id)
        .query(
          'SELECT ID, OfferStatus, CandidateResponse FROM dbo.Offers WITH (UPDLOCK, HOLDLOCK) WHERE ID = @OfferID',
        );
      const offer = currentOffer.recordset[0];
      if (!offer) throw new NotFoundException('Offer was not found.');
      const extendedStatus = await this.getStatusId(
        transaction,
        'Offer Extended',
      );
      if (
        Number(offer.OfferStatus) !== extendedStatus ||
        offer.CandidateResponse != null
      ) {
        throw new BadRequestException(
          'A response can only be recorded once for an extended offer.',
        );
      }
      const responseStatus = await this.getStatusId(
        transaction,
        response === 'accepted' ? 'Accepted' : 'Declined',
      );
      await transaction
        .request()
        .input('OfferID', sql.Int, id)
        .input('CandidateResponse', sql.Int, responseStatus)
        .input('ModifiedBy', sql.Int, action.userId).query(`
          UPDATE dbo.Offers
          SET CandidateResponse = @CandidateResponse,
              ResponseDate = GETDATE(),
              ModifiedBy = @ModifiedBy,
              ModifiedDate = GETDATE()
          WHERE ID = @OfferID;
        `);
      await transaction.commit();
      committed = true;
    } catch (error) {
      if (!committed) await transaction.rollback();
      throw error;
    }
    return this.getOffer(id);
  }

  async getOfferLetter(id: number): Promise<Buffer> {
    const offer = await this.getOffer(id);
    this.assertOfferLetterAvailable(offer);
    return this.createOfferLetter(offer);
  }

  async getOfferLetterUrl(id: number): Promise<string> {
    const offer = await this.getOffer(id);
    this.assertOfferLetterAvailable(offer);
    return `/api/offers/${id}/letter`;
  }

  private assertOfferLetterAvailable(offer: OfferRecord) {
    if (offer.status === 'draft' || !offer.offerLetterGeneratedDate) {
      throw new BadRequestException(
        'The offer letter is available after the offer is extended.',
      );
    }
  }

  private async requireOfferManager(
    transaction: sql.Transaction,
    employeeId: string,
  ) {
    const result = await transaction
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId).query(`
        SELECT MU.ID AS userId
        FROM dbo.Employee E
        INNER JOIN dbo.Mst_Users MU
          ON MU.EmployeeID = E.EmployeeID AND MU.IsActive = 1
        INNER JOIN dbo.RecruitmentApprover RA
          ON RA.EmployeeID = E.EmployeeID
         AND RA.ApproverRole = 'HR_MANAGER'
         AND RA.IsActive = 1
        WHERE E.EmployeeID = @EmployeeID;
      `);
    const userId = result.recordset[0]?.userId;
    if (userId == null) {
      throw new ForbiddenException(
        'Only an active HR Manager can manage offers.',
      );
    }
    return { userId: Number(userId) };
  }

  private async getApplicationForOffer(
    transaction: sql.Transaction,
    applicationId: number,
  ) {
    const result = await transaction
      .request()
      .input('ApplicationID', sql.Int, applicationId).query(`
        SELECT
          CA.ID AS applicationId,
          CA.ApplicationStatus AS applicationStatus,
          C.FullName AS candidateName,
          C.Email AS candidateEmail,
          JR.JobTitle AS position,
          JR.CompanyID AS companyId,
          JR.SalaryRangeMin AS salaryRangeMin,
          JR.SalaryRangeMax AS salaryRangeMax
        FROM dbo.CandidateApplications CA
        INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
        INNER JOIN dbo.JobOpenings JO ON JO.ID = CA.JobOpeningID
        INNER JOIN dbo.JobRequisitions JR ON JR.ID = JO.RequisitionID
        WHERE CA.ID = @ApplicationID;
      `);
    const application = result.recordset[0];
    if (!application) throw new NotFoundException('Application was not found.');
    return application;
  }

  private async validateApplicationForOffer(
    transaction: sql.Transaction,
    application: Record<string, unknown>,
  ) {
    const selectedStatus = await this.getStatusId(transaction, 'Selected');
    if (Number(application.applicationStatus) !== selectedStatus) {
      throw new BadRequestException(
        'An offer can only be created for a selected candidate.',
      );
    }
    const feedback = await transaction
      .request()
      .input('ApplicationID', sql.Int, Number(application.applicationId))
      .query(`
        SELECT TOP (1) I.ID
        FROM dbo.Interviews I
        INNER JOIN dbo.InterviewSchedules S ON S.ID = I.InterviewScheduleID
        WHERE S.ApplicationID = @ApplicationID
          AND I.FeedbackSubmitted = 1;
      `);
    if (!feedback.recordset.length) {
      throw new BadRequestException(
        'An offer requires submitted interview feedback.',
      );
    }
  }

  private validateSalary(
    offeredSalary: number,
    negotiatedSalary: number | undefined,
    application: Record<string, unknown>,
  ) {
    const salaryRangeMin = Number(application.salaryRangeMin);
    const salaryRangeMax = Number(application.salaryRangeMax);
    if (!Number.isFinite(salaryRangeMin) || !Number.isFinite(salaryRangeMax)) {
      throw new BadRequestException(
        'Salary range is not configured for this job requisition.',
      );
    }
    for (const [label, salary] of [
      ['Offered salary', offeredSalary],
      ['Negotiated salary', negotiatedSalary],
    ] as const) {
      if (
        salary !== undefined &&
        (salary < salaryRangeMin || salary > salaryRangeMax)
      ) {
        throw new BadRequestException(
          `${label} must be within the job requisition salary range (${salaryRangeMin}-${salaryRangeMax}).`,
        );
      }
    }
  }

  private async getStatusId(
    transaction: sql.Transaction,
    name: string,
  ): Promise<number> {
    const result = await transaction
      .request()
      .input('Name', sql.VarChar(50), name)
      .query(
        'SELECT TOP (1) ID FROM dbo.Mst_ApplicationStatus WHERE Name = @Name',
      );
    const id = result.recordset[0]?.ID;
    if (id == null) {
      throw new InternalServerErrorException(
        `Offer status "${name}" is not configured.`,
      );
    }
    return Number(id);
  }

  private readonly offerDetailsQuery = `
    SELECT
      O.ID AS id,
      O.ApplicationID AS applicationId,
      O.OfferReferenceNo AS offerReferenceNo,
      C.CandidateID AS candidateCode,
      C.FullName AS candidateName,
      C.Email AS candidateEmail,
      JR.JobTitle AS position,
      O.OfferedSalary AS offeredSalary,
      O.NegotiatedSalary AS negotiatedSalary,
      CASE
        WHEN CandidateResponseStatus.Name = 'Accepted' THEN 'accepted'
        WHEN CandidateResponseStatus.Name = 'Declined' THEN 'rejected'
        WHEN OfferStatus.Name = 'Pending' THEN 'draft'
        WHEN OfferStatus.Name = 'Offer Extended' THEN 'extended'
        ELSE LOWER(COALESCE(OfferStatus.Name, 'unknown'))
      END AS status,
      CASE
        WHEN CandidateResponseStatus.Name = 'Accepted' THEN 'accepted'
        WHEN CandidateResponseStatus.Name = 'Declined' THEN 'rejected'
        ELSE NULL
      END AS response,
      O.ApprovalDate AS approvalDate,
      O.OfferLetterGeneratedDate AS offerLetterGeneratedDate,
      O.ResponseDate AS responseDate,
      O.CreatedDate AS createdDate,
      JR.SalaryRangeMin AS salaryRangeMin,
      JR.SalaryRangeMax AS salaryRangeMax
    FROM dbo.Offers O
    INNER JOIN dbo.CandidateApplications CA ON CA.ID = O.ApplicationID
    INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
    INNER JOIN dbo.JobOpenings JO ON JO.ID = CA.JobOpeningID
    INNER JOIN dbo.JobRequisitions JR ON JR.ID = JO.RequisitionID
    LEFT JOIN dbo.Mst_ApplicationStatus OfferStatus
      ON OfferStatus.ID = O.OfferStatus
    LEFT JOIN dbo.Mst_ApplicationStatus CandidateResponseStatus
      ON CandidateResponseStatus.ID = O.CandidateResponse
    WHERE O.ID = @OfferID;
  `;

  private createOfferLetter(offer: OfferRecord): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const document = new PDFDocument({ size: 'A4', margin: 54 });
      const chunks: Buffer[] = [];
      document.on('data', (chunk: Buffer) => chunks.push(chunk));
      document.on('end', () => resolve(Buffer.concat(chunks)));
      document.on('error', reject);

      document
        .fontSize(20)
        .fillColor('#26332c')
        .text('Offer of Employment', { align: 'center' });
      document.moveDown(2);
      document.fontSize(11).fillColor('#26332c');
      document.text(`Date: ${new Date().toLocaleDateString('en-IN')}`);
      document.moveDown();
      document.text(`Dear ${offer.candidateName},`);
      document.moveDown();
      document.text(
        `We are pleased to offer you the position of ${offer.position}.`,
        { lineGap: 5 },
      );
      document.moveDown();
      document.text(`Offer reference: ${offer.offerReferenceNo}`);
      document.text(
        `Annual offered salary: INR ${Number(offer.offeredSalary).toLocaleString('en-IN')}`,
      );
      if (offer.negotiatedSalary != null) {
        document.text(
          `Annual negotiated salary: INR ${Number(offer.negotiatedSalary).toLocaleString('en-IN')}`,
        );
      }
      document.moveDown(2);
      document.text('Regards,');
      document.text('Human Resources');
      document.end();
    });
  }
}
