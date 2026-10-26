import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../database/database.service';
import { UpdateBgvDocumentDto } from './dto/update-bgv-document.dto';
import { UpdateBgvDto } from './dto/update-bgv.dto';

type BgvStatus = 'all' | 'in-progress' | 'clear' | 'failed';

@Injectable()
export class BgvService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getBgvs(
    employeeId: string,
    query: {
      search?: string;
      status: BgvStatus;
      page?: string;
      limit?: string;
    },
  ) {
    const page = query.page === undefined ? 1 : Number(query.page);
    const limit = query.limit === undefined ? 20 : Number(query.limit);
    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('Page must be a positive integer.');
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100.');
    }

    const pool = await this.databaseService.connect();
    await this.requireHrManager(pool, employeeId);
    const startedByExpression = await this.getStartedByExpression(pool);
    const result = await pool
      .request()
      .input('Search', sql.NVarChar(200), query.search?.trim() || null)
      .input('Status', sql.VarChar(20), query.status)
      .input('Offset', sql.Int, (page - 1) * limit)
      .input('Limit', sql.Int, limit).query(`
        WITH BgvRows AS (
          SELECT
            BV.ID AS id,
            BV.ApplicationID AS applicationId,
            C.CandidateID AS candidateCode,
            C.FullName AS candidateName,
            C.Email AS candidateEmail,
            JR.JobTitle AS position,
            Offer.OfferReferenceNo AS offerReferenceNo,
            CASE
              WHEN BV.IsClear IS NULL THEN 'in-progress'
              WHEN BV.IsClear = 1 THEN 'clear'
              ELSE 'failed'
            END AS status,
            BV.IsClear AS isClear,
            ${startedByExpression} AS startedBy,
            BV.VerifiedBy AS verifiedBy,
            BV.VerificationDate AS verificationDate,
            BV.Remarks AS remarks,
            (SELECT COUNT(*) FROM dbo.CandidateDocuments CD
             WHERE CD.ApplicationID = BV.ApplicationID) AS documentCount,
            COUNT(*) OVER() AS totalCount
          FROM dbo.BackgroundVerifications BV
          INNER JOIN dbo.CandidateApplications CA ON CA.ID = BV.ApplicationID
          INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
          INNER JOIN dbo.JobOpenings JO ON JO.ID = CA.JobOpeningID
          INNER JOIN dbo.JobRequisitions JR ON JR.ID = JO.RequisitionID
          OUTER APPLY (
            SELECT TOP (1) O.OfferReferenceNo
            FROM dbo.Offers O
            WHERE O.ApplicationID = CA.ID
            ORDER BY O.ID DESC
          ) Offer
          WHERE
            (@Status = 'all'
              OR (@Status = 'in-progress' AND BV.IsClear IS NULL)
              OR (@Status = 'clear' AND BV.IsClear = 1)
              OR (@Status = 'failed' AND BV.IsClear = 0))
            AND (
              @Search IS NULL
              OR C.FullName LIKE '%' + @Search + '%'
              OR C.CandidateID LIKE '%' + @Search + '%'
              OR C.Email LIKE '%' + @Search + '%'
              OR JR.JobTitle LIKE '%' + @Search + '%'
              OR Offer.OfferReferenceNo LIKE '%' + @Search + '%'
              OR CONVERT(VARCHAR(20), BV.ApplicationID) LIKE '%' + @Search + '%'
            )
        )
        SELECT *
        FROM BgvRows
        ORDER BY
          CASE WHEN status = 'in-progress' THEN 0 ELSE 1 END,
          verificationDate DESC,
          id DESC
        OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;
      `);
    const total = Number(result.recordset[0]?.totalCount ?? 0);
    const data = result.recordset.map((row) => {
      const { totalCount, ...record } = row;
      void totalCount;
      return record;
    });
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async startBgv(applicationId: number, employeeId: string) {
    const pool = await this.databaseService.connect();
    const transaction = new sql.Transaction(pool);
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    let committed = false;
    try {
      await this.requireHrManager(transaction, employeeId);
      await this.requirePendingBgvSchema(transaction);
      const applicationResult = await transaction
        .request()
        .input('ApplicationID', sql.Int, applicationId).query(`
          SELECT
            CA.ID AS applicationId,
            C.FullName AS candidateName,
            C.Email AS candidateEmail
          FROM dbo.CandidateApplications CA
          INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
          WHERE CA.ID = @ApplicationID;
        `);
      const application = applicationResult.recordset[0];
      if (!application) {
        throw new NotFoundException('Candidate application was not found.');
      }

      const acceptedStatus = await this.getStatusId(transaction, 'Accepted');
      const acceptedOffer = await transaction
        .request()
        .input('ApplicationID', sql.Int, applicationId)
        .input('AcceptedStatus', sql.Int, acceptedStatus).query(`
          SELECT TOP (1) ID
          FROM dbo.Offers WITH (UPDLOCK, HOLDLOCK)
          WHERE ApplicationID = @ApplicationID
            AND CandidateResponse = @AcceptedStatus;
        `);
      if (!acceptedOffer.recordset.length) {
        throw new BadRequestException(
          'Background verification can only start after the candidate accepts an offer.',
        );
      }

      const documents = await transaction
        .request()
        .input('ApplicationID', sql.Int, applicationId)
        .query(
          'SELECT COUNT(*) AS documentCount FROM dbo.CandidateDocuments WHERE ApplicationID = @ApplicationID',
        );
      if (Number(documents.recordset[0]?.documentCount ?? 0) === 0) {
        throw new BadRequestException(
          'The candidate has not uploaded any verification documents.',
        );
      }

      const existing = await transaction
        .request()
        .input('ApplicationID', sql.Int, applicationId).query(`
          SELECT TOP (1) ID
          FROM dbo.BackgroundVerifications WITH (UPDLOCK, HOLDLOCK)
          WHERE ApplicationID = @ApplicationID;
        `);
      if (existing.recordset.length) {
        throw new BadRequestException(
          'Background verification has already been started for this candidate.',
        );
      }

      const inserted = await transaction
        .request()
        .input('ApplicationID', sql.Int, applicationId)
        .input('StartedBy', sql.VarChar(25), employeeId).query(`
          INSERT INTO dbo.BackgroundVerifications
            (ApplicationID, StartedBy, VerifiedBy, VerificationDate, IsClear, Remarks)
          OUTPUT INSERTED.ID AS id
          VALUES (@ApplicationID, @StartedBy, NULL, NULL, NULL, NULL);
        `);
      await transaction.commit();
      committed = true;
      return this.getBgv(Number(inserted.recordset[0].id), employeeId);
    } catch (error) {
      if (!committed) await transaction.rollback();
      throw error;
    }
  }

  async getBgv(id: number, employeeId: string) {
    const pool = await this.databaseService.connect();
    await this.requireHrManager(pool, employeeId);
    const startedByExpression = await this.getStartedByExpression(pool);
    const result = await pool.request().input('BgvID', sql.Int, id).query(`
        SELECT
          BV.ID AS id,
          BV.ApplicationID AS applicationId,
          C.CandidateID AS candidateCode,
          C.FullName AS candidateName,
          C.Email AS candidateEmail,
          JR.JobTitle AS position,
          Offer.OfferReferenceNo AS offerReferenceNo,
          CASE
            WHEN BV.IsClear IS NULL THEN 'in-progress'
            WHEN BV.IsClear = 1 THEN 'clear'
            ELSE 'failed'
          END AS status,
          BV.IsClear AS isClear,
          ${startedByExpression} AS startedBy,
          BV.VerifiedBy AS verifiedBy,
          BV.VerificationDate AS verificationDate,
          BV.Remarks AS remarks
        FROM dbo.BackgroundVerifications BV
        INNER JOIN dbo.CandidateApplications CA ON CA.ID = BV.ApplicationID
        INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
        INNER JOIN dbo.JobOpenings JO ON JO.ID = CA.JobOpeningID
        INNER JOIN dbo.JobRequisitions JR ON JR.ID = JO.RequisitionID
        OUTER APPLY (
          SELECT TOP (1) O.OfferReferenceNo
          FROM dbo.Offers O
          WHERE O.ApplicationID = CA.ID
          ORDER BY O.ID DESC
        ) Offer
        WHERE BV.ID = @BgvID;
      `);
    const record = result.recordset[0];
    if (!record) {
      throw new NotFoundException(
        'Background verification record was not found.',
      );
    }

    const documents = await pool
      .request()
      .input('ApplicationID', sql.Int, record.applicationId).query(`
        SELECT
          CD.ID AS id,
          CD.DocumentType AS documentTypeId,
          DT.DocumentCode AS documentCode,
          DT.DocumentName AS documentName,
          CD.DocumentURL AS documentUrl,
          CD.ActualFileName AS actualFileName,
          CD.FileName AS fileName,
          CD.FileExtension AS fileExtension,
          CD.UploadedDate AS uploadedDate,
          CD.VerificationStatus AS verificationStatus,
          CD.VerificationRemarks AS verificationRemarks,
          CD.VerifiedBy AS verifiedBy,
          CD.VerifiedDate AS verifiedDate
        FROM dbo.CandidateDocuments CD
        LEFT JOIN dbo.Mst_DocumentType DT ON DT.ID = CD.DocumentType
        WHERE CD.ApplicationID = @ApplicationID
        ORDER BY CD.UploadedDate, CD.ID;
      `);
    return { ...record, documents: documents.recordset };
  }

  async updateBgv(id: number, dto: UpdateBgvDto, employeeId: string) {
    if (dto.status === 'failed' && !dto.remarks?.trim()) {
      throw new BadRequestException(
        'Remarks are required when background verification fails.',
      );
    }

    const pool = await this.databaseService.connect();
    const transaction = new sql.Transaction(pool);
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    let committed = false;
    try {
      await this.requireHrManager(transaction, employeeId);
      const current = await transaction.request().input('BgvID', sql.Int, id)
        .query(`
          SELECT ID, IsClear
          FROM dbo.BackgroundVerifications WITH (UPDLOCK, HOLDLOCK)
          WHERE ID = @BgvID;
        `);
      if (!current.recordset.length) {
        throw new NotFoundException(
          'Background verification record was not found.',
        );
      }

      await transaction
        .request()
        .input('BgvID', sql.Int, id)
        .input('VerifiedBy', sql.VarChar(25), employeeId)
        .input('IsClear', sql.Bit, dto.status === 'clear')
        .input('Remarks', sql.VarChar(500), dto.remarks?.trim() || null).query(`
          UPDATE dbo.BackgroundVerifications
          SET VerifiedBy = @VerifiedBy,
              VerificationDate = GETDATE(),
              IsClear = @IsClear,
              Remarks = @Remarks
          WHERE ID = @BgvID;
        `);
      await transaction.commit();
      committed = true;
      return this.getBgv(id, employeeId);
    } catch (error) {
      if (!committed) await transaction.rollback();
      throw error;
    }
  }

  async updateBgvDocument(
    documentId: number,
    dto: UpdateBgvDocumentDto,
    employeeId: string,
  ) {
    const remarks = dto.remarks?.trim() || null;
    if (dto.status === 'rejected' && !remarks) {
      throw new BadRequestException(
        'Remarks are required when rejecting a document.',
      );
    }

    const pool = await this.databaseService.connect();
    const transaction = new sql.Transaction(pool);
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    let committed = false;
    try {
      await this.requireHrManager(transaction, employeeId);
      const current = await transaction
        .request()
        .input('DocumentID', sql.Int, documentId).query(`
          SELECT ID
          FROM dbo.CandidateDocuments WITH (UPDLOCK, HOLDLOCK)
          WHERE ID = @DocumentID;
        `);
      const document = current.recordset[0] as { ID: number } | undefined;
      if (!document) {
        throw new NotFoundException('Candidate document was not found.');
      }

      const updated = await transaction
        .request()
        .input('DocumentID', sql.Int, documentId)
        .input(
          'VerificationStatus',
          sql.VarChar(20),
          dto.status === 'approved' ? 'Approved' : 'Rejected',
        )
        .input('VerificationRemarks', sql.VarChar(500), remarks)
        .input('VerifiedBy', sql.VarChar(25), employeeId).query(`
          UPDATE dbo.CandidateDocuments
          SET VerificationStatus = @VerificationStatus,
              VerificationRemarks = @VerificationRemarks,
              VerifiedBy = @VerifiedBy,
              VerifiedDate = GETDATE()
          OUTPUT
            INSERTED.ID AS id,
            INSERTED.VerificationStatus AS verificationStatus,
            INSERTED.VerificationRemarks AS verificationRemarks,
            INSERTED.VerifiedBy AS verifiedBy,
            INSERTED.VerifiedDate AS verifiedDate
          WHERE ID = @DocumentID;
        `);

      await transaction.commit();
      committed = true;
      return updated.recordset[0];
    } catch (error) {
      if (!committed) await transaction.rollback();
      throw error;
    }
  }

  private async requireHrManager(
    executor: sql.ConnectionPool | sql.Transaction,
    employeeId: string,
  ) {
    const result = await executor
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId).query(`
        SELECT TOP (1) EmployeeID
        FROM dbo.RecruitmentApprover
        WHERE EmployeeID = @EmployeeID
          AND ApproverRole = 'HR_MANAGER'
          AND IsActive = 1;
      `);
    if (!result.recordset.length) {
      throw new ForbiddenException(
        'Only an active HR Manager can manage background verification.',
      );
    }
  }

  private async getStartedByExpression(
    executor: sql.ConnectionPool | sql.Transaction,
  ): Promise<string> {
    const result = await executor
      .request()
      .query(
        "SELECT CASE WHEN COL_LENGTH('dbo.BackgroundVerifications', 'StartedBy') IS NULL THEN 0 ELSE 1 END AS hasStartedBy",
      );
    return Number(result.recordset[0]?.hasStartedBy) === 1
      ? 'BV.StartedBy'
      : 'CAST(NULL AS VARCHAR(25))';
  }

  private async requirePendingBgvSchema(
    transaction: sql.Transaction,
  ): Promise<void> {
    const result = await transaction.request().query(`
      SELECT CASE
        WHEN COL_LENGTH('dbo.BackgroundVerifications', 'StartedBy') IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = 'dbo'
              AND TABLE_NAME = 'BackgroundVerifications'
              AND COLUMN_NAME IN ('VerifiedBy', 'VerificationDate', 'IsClear')
            GROUP BY TABLE_SCHEMA, TABLE_NAME
            HAVING COUNT(*) = 3 AND MIN(CASE WHEN IS_NULLABLE = 'YES' THEN 1 ELSE 0 END) = 1
          )
        THEN 1 ELSE 0
      END AS supportsPending;
    `);
    if (Number(result.recordset[0]?.supportsPending) !== 1) {
      throw new ServiceUnavailableException(
        'The database is not yet configured to start background verifications. Ask a database administrator to apply the BGV pending-state migration.',
      );
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
        `Application status "${name}" is not configured.`,
      );
    }
    return Number(id);
  }
}
