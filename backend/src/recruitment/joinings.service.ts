import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import * as sql from 'mssql';
import { DatabaseService } from '../database/database.service';
import { MailService } from '../mail/mail.service';
import { ConfirmJoiningDto } from './dto/confirm-joining.dto';
import { PrepareJoiningDto } from './dto/prepare-joining.dto';
import { UpdateJoiningDto } from './dto/update-joining.dto';

const EMPLOYEE_CODE_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface EligibleJoiningRow {
  ApplicationID: number;
  CandidateID: string | number;
  FullName: string;
  Email: string;
  JobTitle: string;
  IsClear: boolean;
}

export interface JoiningRecordRow {
  id: number;
  applicationId: number;
  candidateCode: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string | null;
  position: string;
  joiningDate: Date | string;
  employeeCode: string | null;
  employeeId: string | null;
  status: 'prepared' | 'confirmed';
}

interface JoiningProcedureResponse {
  StatusCode: number;
  Message: string;
}

interface JoiningIdRow {
  ID: number;
}

interface AffectedRows {
  affected: number;
}

interface ConfirmableJoiningRow {
  applicationId: number;
  joiningDate: Date | string;
  employeeCode: string | null;
  employeeId: string | null;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string | null;
}

interface EmployeeCreationResponse {
  StatusCode: number;
  Message: string;
  NewEmployeeRowID: number;
}

interface SchemaColumnCheck {
  supportsEmployeeConfirmation?: number;
  hasEmployeeCode?: number;
  hasEmployeeId?: number;
}

@Injectable()
export class JoiningsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  async getJoinings(employeeId: string) {
    const pool = await this.databaseService.connect();
    await this.requireHrManager(pool, employeeId);
    const eligible = await pool
      .request()
      .input('HRManagerEmployeeID', sql.VarChar(25), employeeId)
      .execute<EligibleJoiningRow>('USP_GetCandidatesForJoining');
    const employeeIdExpression = await this.joinedEmployeeIdExpression(pool);
    const prepared = await pool.request().query<JoiningRecordRow>(`
      SELECT
        JA.ID AS id,
        JA.ApplicationID AS applicationId,
        C.CandidateID AS candidateCode,
        C.FullName AS candidateName,
        C.Email AS candidateEmail,
        C.Phone AS candidatePhone,
        JR.JobTitle AS position,
        JA.JoiningDate AS joiningDate,
        ${await this.employeeCodeExpression(pool)} AS employeeCode,
        ${employeeIdExpression} AS employeeId,
        CASE WHEN AppStatus.Name = 'Joined' THEN 'confirmed' ELSE 'prepared' END AS status
      FROM dbo.JoiningApprovals JA
      INNER JOIN dbo.CandidateApplications CA ON CA.ID = JA.ApplicationID
      INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
      INNER JOIN dbo.JobOpenings JO ON JO.ID = CA.JobOpeningID
      INNER JOIN dbo.JobRequisitions JR ON JR.ID = JO.RequisitionID
      LEFT JOIN dbo.Mst_ApplicationStatus AppStatus ON AppStatus.ID = CA.ApplicationStatus
      ORDER BY JA.JoiningDate, JA.ID;
    `);
    const preparedApplications = new Set<number>(
      prepared.recordset.map((record) => Number(record.applicationId)),
    );
    return {
      eligible: eligible.recordset.filter(
        (record) => !preparedApplications.has(Number(record.ApplicationID)),
      ),
      prepared: prepared.recordset,
    };
  }

  async getJoining(id: number, employeeId: string) {
    const pool = await this.databaseService.connect();
    await this.requireHrManager(pool, employeeId);
    const employeeIdExpression = await this.joinedEmployeeIdExpression(pool);
    const result = await pool.request().input('JoiningID', sql.Int, id)
      .query<JoiningRecordRow>(`
      SELECT
        JA.ID AS id,
        JA.ApplicationID AS applicationId,
        C.CandidateID AS candidateCode,
        C.FullName AS candidateName,
        C.Email AS candidateEmail,
        C.Phone AS candidatePhone,
        JR.JobTitle AS position,
        JA.JoiningDate AS joiningDate,
        ${await this.employeeCodeExpression(pool)} AS employeeCode,
        ${employeeIdExpression} AS employeeId,
        CASE WHEN AppStatus.Name = 'Joined' THEN 'confirmed' ELSE 'prepared' END AS status
      FROM dbo.JoiningApprovals JA
      INNER JOIN dbo.CandidateApplications CA ON CA.ID = JA.ApplicationID
      INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
      INNER JOIN dbo.JobOpenings JO ON JO.ID = CA.JobOpeningID
      INNER JOIN dbo.JobRequisitions JR ON JR.ID = JO.RequisitionID
      LEFT JOIN dbo.Mst_ApplicationStatus AppStatus ON AppStatus.ID = CA.ApplicationStatus
      WHERE JA.ID = @JoiningID;
    `);
    const joining = result.recordset[0];
    if (!joining) {
      throw new NotFoundException('Joining record was not found.');
    }
    return joining;
  }

  async prepareJoining(dto: PrepareJoiningDto, employeeId: string) {
    const pool = await this.databaseService.connect();
    await this.requireHrManager(pool, employeeId);
    await this.requireJoiningSchema(pool);

    const transaction = new sql.Transaction(pool);
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    let transactionOpen = true;
    try {
      const existing = await transaction
        .request()
        .input('ApplicationID', sql.Int, dto.applicationId)
        .query(
          'SELECT TOP (1) ID FROM dbo.JoiningApprovals WITH (UPDLOCK, HOLDLOCK) WHERE ApplicationID = @ApplicationID',
        );
      if (existing.recordset.length) {
        throw new BadRequestException(
          'Joining has already been prepared for this candidate.',
        );
      }

      const response = await transaction
        .request()
        .input('ApplicationID', sql.Int, dto.applicationId)
        .input('JoiningDate', sql.Date, dto.joiningDate)
        .input('ApprovedBy', sql.VarChar(25), employeeId)
        .execute<JoiningProcedureResponse>('USP_ApproveCandidateJoining');
      const procedureResult = response.recordset?.[0];
      if (!procedureResult) {
        throw new InternalServerErrorException(
          'The joining preparation procedure returned no result.',
        );
      }
      if (Number(procedureResult.StatusCode) !== 200) {
        transactionOpen = Reflect.get(transaction, '_aborted') !== true;
        throw new BadRequestException(
          String(procedureResult.Message || 'Unable to prepare joining.'),
        );
      }

      const approval = await transaction
        .request()
        .input('ApplicationID', sql.Int, dto.applicationId)
        .query<JoiningIdRow>(`
          SELECT TOP (1) ID
          FROM dbo.JoiningApprovals WITH (UPDLOCK, HOLDLOCK)
          WHERE ApplicationID = @ApplicationID
          ORDER BY ID DESC;
        `);
      const joiningId = Number(approval.recordset[0]?.ID);
      if (!Number.isInteger(joiningId) || joiningId <= 0) {
        throw new InternalServerErrorException(
          'Joining was prepared but its joining record could not be found.',
        );
      }

      const employeeCode = await this.generateEmployeeCode(transaction);
      await transaction
        .request()
        .input('JoiningID', sql.Int, joiningId)
        .input('EmployeeCode', sql.VarChar(6), employeeCode)
        .query(
          'UPDATE dbo.JoiningApprovals SET EmployeeCode = @EmployeeCode WHERE ID = @JoiningID',
        );
      await transaction.commit();
      transactionOpen = false;
      return this.getJoining(joiningId, employeeId);
    } catch (error) {
      if (transactionOpen) await transaction.rollback();
      throw error;
    }
  }

  async updateJoiningDate(
    id: number,
    dto: UpdateJoiningDto,
    employeeId: string,
  ) {
    const pool = await this.databaseService.connect();
    await this.requireHrManager(pool, employeeId);
    const joinedEmployeeIdExpression =
      await this.joinedEmployeeIdExpression(pool);
    const result = await pool
      .request()
      .input('JoiningID', sql.Int, id)
      .input('JoiningDate', sql.Date, dto.joiningDate).query<AffectedRows>(`
        UPDATE JA
        SET JoiningDate = @JoiningDate
        FROM dbo.JoiningApprovals JA
        INNER JOIN dbo.CandidateApplications CA ON CA.ID = JA.ApplicationID
        INNER JOIN dbo.Mst_ApplicationStatus AppStatus ON AppStatus.ID = CA.ApplicationStatus
        WHERE JA.ID = @JoiningID
          AND (${joinedEmployeeIdExpression} IS NULL OR ${joinedEmployeeIdExpression} = '')
          AND AppStatus.Name <> 'Joined';
        SELECT @@ROWCOUNT AS affected;
      `);
    if (Number(result.recordset[0]?.affected) === 0) {
      const existing = await pool
        .request()
        .input('JoiningID', sql.Int, id)
        .query('SELECT ID FROM dbo.JoiningApprovals WHERE ID = @JoiningID');
      if (!existing.recordset.length) {
        throw new NotFoundException('Joining record was not found.');
      }
      throw new BadRequestException(
        'A confirmed joining date cannot be changed.',
      );
    }
    return this.getJoining(id, employeeId);
  }

  async sendJoiningEmail(id: number, employeeId: string) {
    const joining = await this.getJoining(id, employeeId);
    await this.mailService.sendJoiningEmail(
      String(joining.candidateEmail),
      String(joining.candidateName),
      String(joining.position),
      this.formatDate(joining.joiningDate),
    );
    return {
      success: true,
      message: `Joining email sent to ${joining.candidateEmail}.`,
    };
  }

  async confirmJoining(id: number, dto: ConfirmJoiningDto, employeeId: string) {
    const pool = await this.databaseService.connect();
    await this.requireHrManager(pool, employeeId);
    await this.requireJoiningSchema(pool);

    const transaction = new sql.Transaction(pool);
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    let transactionOpen = true;
    try {
      const detailResult = await transaction
        .request()
        .input('JoiningID', sql.Int, id).query<ConfirmableJoiningRow>(`
          SELECT
            JA.ID AS id,
            JA.ApplicationID AS applicationId,
            JA.JoiningDate AS joiningDate,
            JA.EmployeeCode AS employeeCode,
            JA.EmployeeID AS employeeId,
            CA.ApplicationStatus AS applicationStatusId,
            C.FullName AS candidateName,
            C.Email AS candidateEmail,
            C.Phone AS candidatePhone
          FROM dbo.JoiningApprovals JA WITH (UPDLOCK, HOLDLOCK)
          INNER JOIN dbo.CandidateApplications CA ON CA.ID = JA.ApplicationID
          INNER JOIN dbo.Candidates C ON C.ID = CA.CandidateID
          WHERE JA.ID = @JoiningID;
        `);
      const joining = detailResult.recordset[0];
      if (!joining) {
        throw new NotFoundException('Joining record was not found.');
      }
      if (joining.employeeId) {
        throw new BadRequestException(
          'This joining has already been confirmed.',
        );
      }

      const employeeCode =
        String(joining.employeeCode ?? '') ||
        (await this.generateEmployeeCode(transaction));
      const passwordHash = await bcrypt.hash(dto.initialPassword, 10);
      const nameParts = String(joining.candidateName).trim().split(/\s+/);
      const firstName = dto.firstName.trim();
      const lastName = dto.lastName?.trim() || null;
      if (!firstName) {
        throw new BadRequestException('Employee first name is required.');
      }

      const created = await transaction
        .request()
        .input('EmployeeID', sql.VarChar(50), dto.employeeId.trim())
        .input('Code', sql.VarChar(50), employeeCode)
        .input('FirstName', sql.VarChar(100), firstName || nameParts[0])
        .input('LastName', sql.VarChar(100), lastName)
        .input(
          'FullName',
          sql.VarChar(250),
          [firstName || nameParts[0], lastName].filter(Boolean).join(' '),
        )
        .input('CompanyID', sql.Int, dto.companyId)
        .input('BranchID', sql.Int, dto.branchId)
        .input('DeptID', sql.Int, dto.deptId)
        .input('RoleID', sql.Int, dto.roleId)
        .input('DesignationID', sql.Int, dto.designationId ?? null)
        .input(
          'ReportingManagerID',
          sql.VarChar(50),
          dto.reportingManagerId?.trim() || null,
        )
        .input('DOB', sql.Date, dto.dob)
        .input('DOJ', sql.Date, joining.joiningDate)
        .input('DOL', sql.Date, null)
        .input('GenderID', sql.Int, dto.genderId)
        .input('EmploymentTypeID', sql.Int, dto.employmentTypeId)
        .input('EmploymentStatusID', sql.Int, dto.employmentStatusId)
        .input('MaritalStatusID', sql.Int, dto.maritalStatusId ?? null)
        .input('Grade', sql.VarChar(20), dto.grade?.trim() || null)
        .input('ProfilePhoto', sql.VarChar(500), null)
        .input('UserID', sql.VarChar(100), null)
        .input('PasswordHash', sql.VarChar(500), passwordHash)
        .input('Email', sql.VarChar(150), String(joining.candidateEmail))
        .input(
          'Mobileno',
          sql.VarChar(20),
          dto.mobileNo?.trim() || joining.candidatePhone || null,
        )
        .input('AltMobileNo', sql.VarChar(20), dto.alternateMobileNo ?? null)
        .input('EmergencyNo', sql.VarChar(20), dto.emergencyNo ?? null)
        .input('AlternateEmailId', sql.VarChar(150), dto.alternateEmail ?? null)
        .input('AadhaarNumber', sql.VarChar(12), dto.aadhaarNumber ?? null)
        .input('PANNumber', sql.VarChar(10), dto.panNumber ?? null)
        .input('UANNumber', sql.VarChar(12), dto.uanNumber ?? null)
        .input('PFNumber', sql.VarChar(30), dto.pfNumber ?? null)
        .input('CreatedBy', sql.VarChar(50), employeeId)
        .output('NewEmployeeRowID', sql.Int)
        .output('NewUserRowID', sql.Int)
        .execute<EmployeeCreationResponse>('USP_EmployeeCreation');
      const employeeResult = created.recordset?.[0];
      if (!employeeResult) {
        throw new InternalServerErrorException(
          'The employee creation procedure returned no result.',
        );
      }
      if (Number(employeeResult.StatusCode) !== 1) {
        transactionOpen = Reflect.get(transaction, '_aborted') !== true;
        throw new BadRequestException(
          String(employeeResult.Message || 'Employee creation failed.'),
        );
      }

      const joinedStatusId = await this.getStatusId(transaction, 'Joined');
      await transaction
        .request()
        .input('ApplicationID', sql.Int, Number(joining.applicationId))
        .input('ApplicationStatus', sql.Int, joinedStatusId)
        .input('JoiningID', sql.Int, id)
        .input('EmployeeCode', sql.VarChar(6), employeeCode)
        .input('EmployeeID', sql.VarChar(50), dto.employeeId.trim()).query(`
          UPDATE dbo.CandidateApplications
          SET ApplicationStatus = @ApplicationStatus
          WHERE ID = @ApplicationID;
          UPDATE dbo.JoiningApprovals
          SET EmployeeCode = @EmployeeCode, EmployeeID = @EmployeeID
          WHERE ID = @JoiningID;
        `);
      await transaction.commit();
      transactionOpen = false;
      return {
        success: true,
        message: 'Employee joining confirmed.',
        joiningId: id,
        applicationId: Number(joining.applicationId),
        employeeId: dto.employeeId.trim(),
        employeeCode,
        employeeRowId: Number(employeeResult.NewEmployeeRowID),
      };
    } catch (error) {
      if (transactionOpen) await transaction.rollback();
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
        'Only an active HR Manager can manage joinings.',
      );
    }
  }

  private async requireJoiningSchema(
    executor: sql.ConnectionPool | sql.Transaction,
  ) {
    const result = await executor.request().query<SchemaColumnCheck>(`
      SELECT CASE
        WHEN COL_LENGTH('dbo.JoiningApprovals', 'EmployeeCode') IS NOT NULL
          AND COL_LENGTH('dbo.JoiningApprovals', 'EmployeeID') IS NOT NULL
        THEN 1 ELSE 0
      END AS supportsEmployeeConfirmation;
    `);
    if (Number(result.recordset[0]?.supportsEmployeeConfirmation) !== 1) {
      throw new ServiceUnavailableException(
        'The database is not configured for joining preparation and employee confirmation. Ask a database administrator to apply the joining employee-code migration.',
      );
    }
  }

  private async employeeCodeExpression(
    executor: sql.ConnectionPool | sql.Transaction,
  ): Promise<string> {
    const result = await executor.request().query<{
      hasEmployeeCode: number;
    }>("SELECT CASE WHEN COL_LENGTH('dbo.JoiningApprovals', 'EmployeeCode') IS NULL THEN 0 ELSE 1 END AS hasEmployeeCode");
    return Number(result.recordset[0]?.hasEmployeeCode) === 1
      ? 'JA.EmployeeCode'
      : 'CAST(NULL AS VARCHAR(6))';
  }

  private async joinedEmployeeIdExpression(
    executor: sql.ConnectionPool | sql.Transaction,
  ): Promise<string> {
    const result = await executor.request().query<{
      hasEmployeeId: number;
    }>("SELECT CASE WHEN COL_LENGTH('dbo.JoiningApprovals', 'EmployeeID') IS NULL THEN 0 ELSE 1 END AS hasEmployeeId");
    return Number(result.recordset[0]?.hasEmployeeId) === 1
      ? 'JA.EmployeeID'
      : 'CAST(NULL AS VARCHAR(50))';
  }

  private async generateEmployeeCode(
    executor: sql.Transaction,
  ): Promise<string> {
    for (let attempt = 0; attempt < 25; attempt += 1) {
      let code = '';
      for (let index = 0; index < 6; index += 1) {
        code +=
          EMPLOYEE_CODE_ALPHABET[randomInt(EMPLOYEE_CODE_ALPHABET.length)];
      }
      const existing = await executor
        .request()
        .input('EmployeeCode', sql.VarChar(6), code).query<JoiningIdRow>(`
          SELECT TOP (1) ID
          FROM dbo.JoiningApprovals WITH (UPDLOCK, HOLDLOCK)
          WHERE EmployeeCode = @EmployeeCode
          UNION ALL
          SELECT TOP (1) ID
          FROM dbo.Employee WITH (UPDLOCK, HOLDLOCK)
          WHERE Code = @EmployeeCode;
        `);
      if (!existing.recordset.length) return code;
    }
    throw new InternalServerErrorException(
      'Unable to generate a unique employee code.',
    );
  }

  private async getStatusId(
    transaction: sql.Transaction,
    name: string,
  ): Promise<number> {
    const result = await transaction
      .request()
      .input('Name', sql.VarChar(50), name)
      .query<{
        ID: number;
      }>('SELECT TOP (1) ID FROM dbo.Mst_ApplicationStatus WHERE Name = @Name');
    const id = result.recordset[0]?.ID;
    if (id == null) {
      throw new InternalServerErrorException(
        `Application status "${name}" is not configured.`,
      );
    }
    return Number(id);
  }

  private formatDate(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new InternalServerErrorException(
        'The stored joining date is invalid.',
      );
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
