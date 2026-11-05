import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../../../database/database.service';

/**
 * Face re-registration approvals.
 *
 * An employee who already has a face on file cannot re-register on their own.
 * They send a request to their Reporting Manager (Employee.ReportingManagerID).
 * When the RM approves it, the employee may re-register ONCE within
 * APPROVAL_VALID_DAYS. The enroll endpoint checks this (see
 * attendance.controller.ts), so the rule holds even if someone calls the API
 * directly instead of using the page.
 *
 * First-time registration (no active face vectors) never needs approval.
 *
 * Table: dbo.FaceReRegistrationRequest
 *   ApproverID  = the Reporting Manager's Employee.EmployeeID (who must act)
 *   ApprovedBy  = Mst_Users.ID of the manager who approved / rejected
 *   Status      = Mst_Status.ID (see STATUS below)
 */

/** Mst_Status IDs used by this feature. */
export const FACE_REREG_STATUS = {
  PENDING: 3,
  APPROVED: 4,
  REJECTED: 5,
  CANCELLED: 13,
  EXPIRED: 19,
  USED: 83,
} as const;

const STATUS_NAME: Record<number, string> = {
  3: 'Pending',
  4: 'Approved',
  5: 'Rejected',
  13: 'Cancelled',
  19: 'Expired',
  83: 'Used',
};

const STATUS_BY_NAME: Record<string, number> = Object.fromEntries(
  Object.entries(STATUS_NAME).map(([id, name]) => [name, Number(id)]),
);

export type ReRegistrationStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface MyReRegistrationStatus {
  status: ReRegistrationStatus;
  requestId: number | null;
  requestedAt: string | null;
  decidedAt: string | null;
  expiresAt: string | null;
  rejectionReason: string | null;
}

export interface ReRegistrationRequestRow {
  id: number;
  employeeId: string;
  employeeCode: string | null;
  employeeName: string;
  reason: string | null;
  status: string;
  requestedAt: string;
  decidedAt: string | null;
  expiresAt: string | null;
  rejectionReason: string | null;
  currentRegistrationDate: string | null;
}

const toIso = (value: unknown): string | null =>
  value ? new Date(value as string).toISOString() : null;

// SQL Server unique-index violation numbers.
const UNIQUE_VIOLATION = new Set([2601, 2627]);

// Mst_Users.ID of an employee (newest active login first). Used for ApprovedBy.
const USER_ID_OF = (param: string) => `
  (SELECT TOP 1 u.ID FROM dbo.Mst_Users u
    WHERE CAST(u.EmployeeID AS VARCHAR(25)) = ${param}
    ORDER BY u.IsActive DESC, u.ID DESC)`;

@Injectable()
export class FaceReRegistrationService {
  private readonly logger = new Logger(FaceReRegistrationService.name);

  /** How long an approval stays usable. */
  private readonly APPROVAL_VALID_DAYS = 7;

  private readonly MAX_TEXT = 500;

  constructor(private readonly databaseService: DatabaseService) {}

  // ---------------------------------------------------------------------------
  // Employee side
  // ---------------------------------------------------------------------------

  /** True when the employee already has an active face registration. */
  async hasActiveFace(employeeId: string): Promise<boolean> {
    const pool = await this.databaseService.connect();
    const result = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId)
      .query(
        'SELECT TOP 1 1 AS Found FROM EmployeeFaceVectors WHERE EmployeeID = @EmployeeID AND IsActive = 1',
      );
    return (result.recordset?.length ?? 0) > 0;
  }

  /** Creates a Pending request routed to the employee's reporting manager. */
  async createRequest(
    employeeId: string,
    reason?: string,
  ): Promise<{ success: boolean; message: string }> {
    const cleanReason = reason?.trim().slice(0, this.MAX_TEXT) || null;

    if (!(await this.hasActiveFace(employeeId))) {
      throw new BadRequestException(
        "You haven't registered your face yet, so no approval is needed. Use Register Now instead.",
      );
    }

    const current = await this.getMyStatus(employeeId);
    if (current.status === 'pending') {
      throw new BadRequestException(
        'You already have a request waiting for your Reporting Manager.',
      );
    }
    if (current.status === 'approved') {
      throw new BadRequestException(
        'Your request is already approved. You can re-register now.',
      );
    }

    const pool = await this.databaseService.connect();

    // The manager is always looked up here, never taken from the client.
    const managerResult = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId).query(`
        SELECT e.ReportingManagerID AS ManagerID,
               ${USER_ID_OF('e.ReportingManagerID')} AS ManagerUserID
        FROM dbo.Employee e
        WHERE e.EmployeeID = @EmployeeID AND e.Deleted = 0
      `);
    const manager = managerResult.recordset?.[0];
    const managerId = String(manager?.ManagerID ?? '').trim();
    if (!managerId) {
      throw new BadRequestException(
        'No Reporting Manager is assigned to you. Please contact HR.',
      );
    }
    if (manager?.ManagerUserID == null) {
      throw new BadRequestException(
        "Your Reporting Manager doesn't have a login account yet. Please contact HR.",
      );
    }

    try {
      // ApprovedBy is filled with the assigned approver's user id up front
      // (the column is NOT NULL); it is set again when they approve/reject.
      await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('ApproverID', sql.VarChar(25), managerId)
        .input('ApproverUserID', sql.Int, Number(manager.ManagerUserID))
        .input('Reason', sql.NVarChar(this.MAX_TEXT), cleanReason)
        .input('Status', sql.Int, FACE_REREG_STATUS.PENDING).query(`
          INSERT INTO dbo.FaceReRegistrationRequest
            (EmployeeID, ApproverID, Reason, Status, ApprovedBy)
          VALUES
            (@EmployeeID, @ApproverID, @Reason, @Status, @ApproverUserID)
        `);

      return {
        success: true,
        message: 'Your request has been sent to your Reporting Manager.',
      };
    } catch (err) {
      if (UNIQUE_VIOLATION.has((err as any)?.number)) {
        throw new BadRequestException(
          'You already have a request waiting for your Reporting Manager.',
        );
      }
      this.logger.error(
        `createRequest failed for ${employeeId} - ${(err as Error).message}`,
      );
      throw err;
    }
  }

  /** The employee's latest request, as the Face Registration page needs it. */
  async getMyStatus(employeeId: string): Promise<MyReRegistrationStatus> {
    const none: MyReRegistrationStatus = {
      status: 'none',
      requestId: null,
      requestedAt: null,
      decidedAt: null,
      expiresAt: null,
      rejectionReason: null,
    };

    const pool = await this.databaseService.connect();
    await this.expireStaleApprovals(pool, employeeId);

    const result = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId).query(`
        SELECT TOP 1 ID, Status, RequestedDateTime, ApprovedDateTime,
               ExpiresDateTime, RejectionReason
        FROM dbo.FaceReRegistrationRequest
        WHERE EmployeeID = @EmployeeID AND Deleted = 0
        ORDER BY RequestedDateTime DESC, ID DESC
      `);

    const row = result.recordset?.[0];
    if (!row) return none;

    const map: Record<number, ReRegistrationStatus> = {
      [FACE_REREG_STATUS.PENDING]: 'pending',
      [FACE_REREG_STATUS.APPROVED]: 'approved',
      [FACE_REREG_STATUS.REJECTED]: 'rejected',
    };
    const status = map[Number(row.Status)];
    // Used / Expired / Cancelled: nothing open, the employee can ask again.
    if (!status) return none;

    return {
      status,
      requestId: row.ID,
      requestedAt: toIso(row.RequestedDateTime),
      decidedAt: toIso(row.ApprovedDateTime),
      expiresAt: toIso(row.ExpiresDateTime),
      rejectionReason: row.RejectionReason ?? null,
    };
  }

  /** True when the employee holds an approved, unexpired, unused request. */
  async hasUsableApproval(employeeId: string): Promise<boolean> {
    const pool = await this.databaseService.connect();
    const result = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId)
      .input('Approved', sql.Int, FACE_REREG_STATUS.APPROVED).query(`
        SELECT TOP 1 1 AS Found
        FROM dbo.FaceReRegistrationRequest
        WHERE EmployeeID = @EmployeeID
          AND Status = @Approved
          AND ExpiresDateTime > GETDATE()
          AND Deleted = 0
      `);
    return (result.recordset?.length ?? 0) > 0;
  }

  /** Called after a successful re-enrollment: the approval is spent. */
  async markApprovalUsed(employeeId: string): Promise<void> {
    try {
      const pool = await this.databaseService.connect();
      await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('Approved', sql.Int, FACE_REREG_STATUS.APPROVED)
        .input('Used', sql.Int, FACE_REREG_STATUS.USED).query(`
          UPDATE dbo.FaceReRegistrationRequest
          SET Status = @Used, UsedDateTime = GETDATE()
          WHERE EmployeeID = @EmployeeID AND Status = @Approved AND Deleted = 0
        `);
    } catch (err) {
      // The face is already saved at this point; never fail the enrollment.
      this.logger.error(
        `markApprovalUsed failed for ${employeeId} - ${(err as Error).message}`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Reporting manager side
  // ---------------------------------------------------------------------------

  /** status: 'Pending' | 'Approved' | 'Rejected' | 'Used' | 'Expired' | 'Cancelled'; anything else = all. */
  async listForManager(
    managerId: string,
    status?: string,
  ): Promise<ReRegistrationRequestRow[]> {
    const statusId = status ? STATUS_BY_NAME[status] ?? null : null;

    const pool = await this.databaseService.connect();
    await this.expireStaleApprovals(pool);

    const result = await pool
      .request()
      .input('ApproverID', sql.VarChar(25), managerId)
      .input('Status', sql.Int, statusId)
      .input('Pending', sql.Int, FACE_REREG_STATUS.PENDING).query(`
        SELECT r.ID, r.EmployeeID, e.Code, e.FullName, r.Reason, r.Status,
               r.RequestedDateTime, r.ApprovedDateTime, r.ExpiresDateTime,
               r.RejectionReason,
               (SELECT MAX(v.EnrolledDateTime)
                  FROM dbo.EmployeeFaceVectors v
                 WHERE v.EmployeeID = r.EmployeeID AND v.IsActive = 1) AS CurrentRegistrationDate
        FROM dbo.FaceReRegistrationRequest r
        JOIN dbo.Employee e ON e.EmployeeID = r.EmployeeID
        WHERE r.ApproverID = @ApproverID
          AND r.Deleted = 0
          AND (@Status IS NULL OR r.Status = @Status)
        ORDER BY CASE WHEN r.Status = @Pending THEN 0 ELSE 1 END,
                 r.RequestedDateTime DESC
      `);

    return (result.recordset ?? []).map((row: any) => ({
      id: row.ID,
      employeeId: row.EmployeeID,
      employeeCode: row.Code ?? null,
      employeeName: row.FullName ?? row.EmployeeID,
      reason: row.Reason ?? null,
      status: STATUS_NAME[Number(row.Status)] ?? String(row.Status),
      requestedAt: toIso(row.RequestedDateTime) as string,
      decidedAt: toIso(row.ApprovedDateTime),
      expiresAt: toIso(row.ExpiresDateTime),
      rejectionReason: row.RejectionReason ?? null,
      currentRegistrationDate: toIso(row.CurrentRegistrationDate),
    }));
  }

  async approve(
    requestId: number,
    managerId: string,
  ): Promise<{ success: boolean; message: string }> {
    const pool = await this.databaseService.connect();
    // ApproverID + Status in the WHERE: only this request's own RM can act,
    // and only once (double clicks and stale screens update nothing).
    const result = await pool
      .request()
      .input('ID', sql.Int, requestId)
      .input('ApproverID', sql.VarChar(25), managerId)
      .input('Days', sql.Int, this.APPROVAL_VALID_DAYS)
      .input('Pending', sql.Int, FACE_REREG_STATUS.PENDING)
      .input('Approved', sql.Int, FACE_REREG_STATUS.APPROVED).query(`
        UPDATE dbo.FaceReRegistrationRequest
        SET Status = @Approved,
            ApprovedBy = ISNULL(${USER_ID_OF('@ApproverID')}, ApprovedBy),
            ApprovedDateTime = GETDATE(),
            ExpiresDateTime = DATEADD(DAY, @Days, GETDATE())
        OUTPUT inserted.ID
        WHERE ID = @ID AND ApproverID = @ApproverID
          AND Status = @Pending AND Deleted = 0
      `);

    if (!result.recordset?.length) {
      throw new NotFoundException(
        'This request was not found, is not assigned to you, or was already handled.',
      );
    }
    return {
      success: true,
      message: `Approved. The employee can re-register within ${this.APPROVAL_VALID_DAYS} days.`,
    };
  }

  async reject(
    requestId: number,
    managerId: string,
    rejectionReason: string,
  ): Promise<{ success: boolean; message: string }> {
    const cleanReason = rejectionReason?.trim().slice(0, this.MAX_TEXT);
    if (!cleanReason) {
      throw new BadRequestException('Please enter a reason for rejecting.');
    }

    const pool = await this.databaseService.connect();
    const result = await pool
      .request()
      .input('ID', sql.Int, requestId)
      .input('ApproverID', sql.VarChar(25), managerId)
      .input('Reason', sql.NVarChar(this.MAX_TEXT), cleanReason)
      .input('Pending', sql.Int, FACE_REREG_STATUS.PENDING)
      .input('Rejected', sql.Int, FACE_REREG_STATUS.REJECTED).query(`
        UPDATE dbo.FaceReRegistrationRequest
        SET Status = @Rejected,
            ApprovedBy = ISNULL(${USER_ID_OF('@ApproverID')}, ApprovedBy),
            ApprovedDateTime = GETDATE(),
            RejectionReason = @Reason
        OUTPUT inserted.ID
        WHERE ID = @ID AND ApproverID = @ApproverID
          AND Status = @Pending AND Deleted = 0
      `);

    if (!result.recordset?.length) {
      throw new NotFoundException(
        'This request was not found, is not assigned to you, or was already handled.',
      );
    }
    return { success: true, message: 'Request rejected.' };
  }

  // ---------------------------------------------------------------------------

  /** Approved requests past their expiry become Expired. */
  private async expireStaleApprovals(
    pool: Awaited<ReturnType<DatabaseService['connect']>>,
    employeeId?: string,
  ): Promise<void> {
    try {
      await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId ?? null)
        .input('Approved', sql.Int, FACE_REREG_STATUS.APPROVED)
        .input('Expired', sql.Int, FACE_REREG_STATUS.EXPIRED).query(`
          UPDATE dbo.FaceReRegistrationRequest
          SET Status = @Expired
          WHERE Status = @Approved
            AND ExpiresDateTime <= GETDATE()
            AND (@EmployeeID IS NULL OR EmployeeID = @EmployeeID)
        `);
    } catch (err) {
      this.logger.warn(`expireStaleApprovals failed - ${(err as Error).message}`);
    }
  }
}
