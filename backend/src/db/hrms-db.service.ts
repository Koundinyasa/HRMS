import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';
import { PoolHolder, buildSqlConfig } from '../database/sql-pool';
import { TtlCache } from '../common/ttl-cache';
import type {
  EmployeeInfoRecord,
  EmployeeInfoResultSets,
} from '../chatbot/types/employee-business-profile.types';

@Injectable()
export class HrmsDbService implements OnModuleDestroy {
  private readonly logger = new Logger(HrmsDbService.name);

  // This pool keeps the driver's default useUTC (true) on purpose: the methods
  // below turn DATE columns into 'YYYY-MM-DD' with toISOString(), which is
  // only right when dates are read as UTC midnight. The main pool
  // (DatabaseService) reads them the other way, so the two are not merged.
  private readonly holder = new PoolHolder('chatbot', () =>
    buildSqlConfig(this.config, true),
  );

  // The chatbot asks for the same company-wide data on every message. These
  // short-lived caches let one lookup serve many messages (and many employees of
  // the same company for the directory). Each key includes the company, so one
  // company's data is never handed to another. Failed lookups are not kept.
  private readonly userInfoCache = new TtlCache(5_000);
  private readonly directoryCache = new TtlCache(60_000);
  private readonly masterDataCache = new TtlCache(60_000);

  constructor(private readonly config: ConfigService) {}

  private getPool() {
    return this.holder.get();
  }

  async onModuleDestroy(): Promise<void> {
    await this.holder.close();
  }

  // ─── Chatbot drafts (table dbo.ChatbotDrafts) ────────────────────────────────

  async saveChatbotDraft(
    employeeId: string,
    draftType: string,
    payload: string,
    savedAtMs: number,
  ): Promise<void> {
    const pool = await this.getPool();
    await pool
      .request()
      .input('EmployeeID', sql.VarChar(100), employeeId)
      .input('DraftType', sql.VarChar(40), draftType)
      .input('Payload', sql.NVarChar(sql.MAX), payload)
      .input('SavedAtMs', sql.BigInt, savedAtMs).query(`
        MERGE dbo.ChatbotDrafts AS t
        USING (SELECT @EmployeeID AS EmployeeID, @DraftType AS DraftType) AS s
          ON t.EmployeeID = s.EmployeeID AND t.DraftType = s.DraftType
        WHEN MATCHED THEN
          UPDATE SET Payload = @Payload, SavedAtMs = @SavedAtMs
        WHEN NOT MATCHED THEN
          INSERT (EmployeeID, DraftType, Payload, SavedAtMs)
          VALUES (@EmployeeID, @DraftType, @Payload, @SavedAtMs);
      `);
  }

  async deleteChatbotDraft(
    employeeId: string,
    draftType: string,
  ): Promise<void> {
    const pool = await this.getPool();
    await pool
      .request()
      .input('EmployeeID', sql.VarChar(100), employeeId)
      .input('DraftType', sql.VarChar(40), draftType)
      .query(
        'DELETE FROM dbo.ChatbotDrafts WHERE EmployeeID = @EmployeeID AND DraftType = @DraftType',
      );
  }

  async deleteExpiredChatbotDrafts(olderThanMs: number): Promise<void> {
    const pool = await this.getPool();
    await pool
      .request()
      .input('Cutoff', sql.BigInt, olderThanMs)
      .query('DELETE FROM dbo.ChatbotDrafts WHERE SavedAtMs < @Cutoff');
  }

  async loadChatbotDrafts(
    newerThanMs: number,
  ): Promise<{ employeeId: string; draftType: string; payload: string }[]> {
    const pool = await this.getPool();
    const result = await pool
      .request()
      .input('Cutoff', sql.BigInt, newerThanMs)
      .query(
        'SELECT EmployeeID, DraftType, Payload FROM dbo.ChatbotDrafts WHERE SavedAtMs >= @Cutoff',
      );
    return (result.recordset as any[]).map((row) => ({
      employeeId: String(row.EmployeeID),
      draftType: String(row.DraftType),
      payload: String(row.Payload),
    }));
  }

  // ─── HRMSDEV: real basic-info via USP_GetUserInfo ────────────────────────────
  // One USP_GetUserInfo run is shared by the calls made for the same employee
  // within a few seconds (a single chat message asks for it more than once).
  // A missing result (not found, or the call failed) is not kept.
  async getUserInfo(employeeId: string) {
    return this.userInfoCache.get(
      employeeId,
      () => this.loadUserInfo(employeeId),
      (info) => info !== null,
    );
  }

  private async loadUserInfo(employeeId: string) {
    const pool = await this.getPool();

    let result: sql.IProcedureResult<any>;
    try {
      result = await pool
        .request()
        .input('EmployeeID', sql.VarChar, employeeId)
        .execute('USP_GetUserInfo');
    } catch (err) {
      console.error(
        'getUserInfo failed for',
        employeeId,
        '-',
        (err as Error).message,
      );
      return null;
    }

    const profileRow = result.recordsets[0]?.[0];
    const holidayRows = (result.recordsets[2] as any[]) ?? [];

    if (!profileRow) return null;

    const self = {
      id: profileRow.EmployeeID,
      name: profileRow.FullName,
      department: profileRow.Department ?? 'N/A',
      designation: profileRow.Designation ?? 'N/A',
      company: profileRow.CompanyName ?? '',
      companyId: profileRow.CompanyID ?? null,
      email: profileRow.Email ?? '',
      role: profileRow.DefaultRole ?? '',
    };
    const holidays = holidayRows.map((h: any) => ({
      date: h.HolidayDate
        ? new Date(h.HolidayDate).toISOString().slice(0, 10)
        : '',
      name: h.HolidayName,
      stateCode: h.StateCode ?? null,
    }));

    return { self, holidays };
  }

  async getEmployeeLeaveSessionDetails(employeeId: string, companyId?: number) {
    const normalizedEmployeeId = employeeId.trim();
    if (!normalizedEmployeeId) return [];

    const pool = await this.getPool();
    const request = pool
      .request()
      .input('EmployeeID', sql.VarChar(100), normalizedEmployeeId);
    let query = `
      SELECT Id, IsHalfDay, SessionFrom, SessionTo
      FROM LeaveApplication
      WHERE EmployeeId = @EmployeeID
    `;

    if (companyId !== undefined) {
      request.input('CompanyId', sql.Int, companyId);
      query += ' AND CompanyId = @CompanyId';
    }

    const result = await request.query(query);
    return result.recordset;
  }

  // ─── HRMSDEV: fetch user by email for login (USP_Validateuser) ────────────────
  async validateUser(email: string) {
    const pool = await this.getPool();
    const result = await pool
      .request()
      .input('EmailID', sql.VarChar, email)
      .execute('USP_Validateuser');

    return result.recordset[0] ?? null;
  }

  // ─── HRMSDEV: shared executor for the merged company-master-data procedure ───
  // USP_GetCompanyMasterData returns 8 result sets in a fixed order:
  // 0. leave types, 1. departments, 2. designations, 3. company info,
  // 4. employee's own office, 5. all branches, 6. active teams, 7. team
  // members. All three params are optional — SQL Server naturally returns an
  // empty result set for a piece that wasn't asked for (WHERE Col = NULL).
  private async execCompanyMasterData(
    companyId?: number | null,
    employeeId?: string | null,
    teamTechId?: number | null,
  ) {
    const pool = await this.getPool();
    const result = await pool
      .request()
      .input('CompanyID', sql.Int, companyId ?? null)
      .input('EmployeeID', sql.VarChar(100), employeeId ?? null)
      .input('TeamTechID', sql.Int, teamTechId ?? null)
      .execute('USP_GetCompanyMasterData');
    return result.recordsets as unknown as any[][];
  }

  // ─── HRMSDEV: real leave-type catalogue via USP_GetCompanyMasterData (set 0) ─
  async getLeaveTypes() {
    try {
      const sets = await this.execCompanyMasterData();
      return (sets[0] ?? []).map((r: any) => ({
        id: Number(r.ID),
        name: r.Name,
        code: r.Code,
        description: r.Description,
      }));
    } catch (err) {
      console.error('getLeaveTypes failed -', (err as Error).message);
      return [];
    }
  }
  // ─── HRMSDEV: real department list via USP_GetCompanyMasterData (set 1) ──────
  async getDepartments() {
    try {
      const sets = await this.execCompanyMasterData();
      return (sets[1] ?? []).map((r: any) => r.Name as string);
    } catch (err) {
      console.error('getDepartments failed -', (err as Error).message);
      return [];
    }
  }
  // ─── HRMSDEV: real designation list via USP_GetCompanyMasterData (set 2) ─────
  async getDesignations() {
    try {
      const sets = await this.execCompanyMasterData();
      return (sets[2] ?? []).map((r: any) => r.Name as string);
    } catch (err) {
      console.error('getDesignations failed -', (err as Error).message);
      return [];
    }
  }
  // ─── HRMSDEV: company info via USP_GetCompanyMasterData (set 3) ──────────────
  async getCompanyInfo(companyId: number) {
    try {
      const sets = await this.execCompanyMasterData(companyId);
      const r = sets[3]?.[0];
      if (!r) return null;
      return {
        name: r.CompanyName as string,
        code: r.CompanyCode as string,
        contactPerson: r.ContactPerson ?? '',
        contactEmail: r.ContactEmail ?? '',
      };
    } catch (err) {
      console.error('getCompanyInfo failed -', (err as Error).message);
      return null;
    }
  }
  // ─── HRMSDEV: office branch for one employee via USP_GetCompanyMasterData ────
  // (set 4). Regular employees should only see their OWN branch, not every
  // branch in the company — resolved via the SP's @EmployeeID filter.
  async getEmployeeOffice(employeeId: string) {
    try {
      const sets = await this.execCompanyMasterData(null, employeeId);
      const r = sets[4]?.[0];
      if (!r) return null;
      return {
        branchId: r.BranchID as number,
        branchName: r.BranchName as string,
        address: r.Address1 ?? '',
        city: r.City ?? '',
        phone: r.PhoneNo ?? '',
        stateCode: r.StateCode ?? '',
      };
    } catch (err) {
      console.error('getEmployeeOffice failed -', (err as Error).message);
      return null;
    }
  }
  // ─── HRMSDEV: all company branches via USP_GetCompanyMasterData (set 5) ──────
  async getBranches(companyId: number) {
    try {
      const sets = await this.execCompanyMasterData(companyId);
      return (sets[5] ?? []).map((r: any) => ({
        branchName: r.BranchName as string,
        address: r.Address1 ?? '',
        city: r.City ?? '',
        phone: r.PhoneNo ?? '',
      }));
    } catch (err) {
      console.error('getBranches failed -', (err as Error).message);
      return [];
    }
  }
  // ─── HRMSDEV: active employee directory via USP_GetEmployeeDirectory ─────────
  // NOTE: this SP now returns { EmployeeID, FullName, Designation } — it no
  // longer selects Code. Any caller that used to show e.code (e.g. the
  // "Tester (T1)" style badge in the chatbot's employee list) needs to switch
  // to e.designation, or the SP needs Code added back — check with the team.
  //
  // The list is for one company and is kept for 60 seconds, shared by everyone
  // in that company, so the database is not asked again for every chat message.
  async getEmployeeDirectory(
    companyId: number,
    options: { failOnError?: boolean; bypassCache?: boolean } = {},
  ) {
    try {
      const rows = options.bypassCache
        ? await this.loadEmployeeDirectory(companyId)
        : await this.directoryCache.get(String(companyId), () =>
            this.loadEmployeeDirectory(companyId),
          );
      return [...rows];
    } catch (err) {
      this.logger.error('Employee directory lookup failed.');
      if (options.failOnError) throw err;
      return [];
    }
  }

  private async loadEmployeeDirectory(companyId: number) {
    const pool = await this.getPool();
    const result = await pool
      .request()
      .input('CompanyID', sql.Int, companyId)
      .execute('USP_GetEmployeeDirectory');
    return result.recordset.map((r: any) => ({
      id: String(r.EmployeeID ?? '').trim(),
      name: String(r.FullName ?? '').trim(),
      designation: String(r.Designation ?? '').trim(),
    }));
  }

  async getEmployeeBusinessProfile(
    employeeId: string,
    companyId: number,
  ): Promise<EmployeeInfoResultSets | null> {
    const pool = await this.getPool();
    const result = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId)
      .input('CompanyID', sql.Int, companyId)
      .execute('dbo.USP_GetEmployeeBasicDetailsChat');

    const recordsets = result.recordsets ?? [];
    const resultSets: EmployeeInfoResultSets = [
      this.asEmployeeInfoRecords(recordsets[0]),
      this.asEmployeeInfoRecords(recordsets[1]),
      this.asEmployeeInfoRecords(recordsets[2]),
      this.asEmployeeInfoRecords(recordsets[3]),
      this.asEmployeeInfoRecords(recordsets[4]),
      this.asEmployeeInfoRecords(recordsets[5]),
      this.asEmployeeInfoRecords(recordsets[6]),
    ];
    const personalInformation = resultSets[0];
    if (
      personalInformation.length === 0 ||
      Object.keys(personalInformation[0]).length === 0
    ) {
      return null;
    }

    if (Number(personalInformation[0].StatusCode) === 500) {
      throw new Error('Employee profile procedure reported a failure.');
    }

    return resultSets;
  }

  private asEmployeeInfoRecords(recordset: unknown): EmployeeInfoRecord[] {
    if (!Array.isArray(recordset)) return [];
    return recordset.filter(
      (row): row is EmployeeInfoRecord =>
        typeof row === 'object' && row !== null && !Array.isArray(row),
    );
  }

  // ─── HRMSDEV: batched read for the chatbot's per-message ctx build ───────────
  // Bundles departments/designations/companyInfo/ownOffice/branches into a
  // single USP_GetCompanyMasterData call instead of 5 separate ones. Used by
  // chatbot.service.ts; the individual getters above remain for callers that
  // only need one piece (e.g. the team export endpoint).
  //
  // Kept for 60 seconds per company and employee (the own-office part is
  // specific to the employee). The lists are copied so a caller cannot change
  // the cached ones.
  async getCompanyMasterData(companyId: number | null, employeeId: string) {
    const data = await this.masterDataCache.get(
      `${companyId ?? 'none'}:${employeeId}`,
      () => this.loadCompanyMasterData(companyId, employeeId),
    );
    return {
      ...data,
      departments: [...data.departments],
      designation: [...data.designation],
      branches: [...data.branches],
    };
  }

  private async loadCompanyMasterData(
    companyId: number | null,
    employeeId: string,
  ) {
    const sets = await this.execCompanyMasterData(companyId, employeeId);
    return {
      departments: (sets[1] ?? []).map((r: any) => r.Name as string),
      designation: (sets[2] ?? []).map((r: any) => r.Name as string),
      companyInfo: sets[3]?.[0]
        ? {
            name: sets[3][0].CompanyName as string,
            code: sets[3][0].CompanyCode as string,
            contactPerson: sets[3][0].ContactPerson ?? '',
            contactEmail: sets[3][0].ContactEmail ?? '',
          }
        : null,
      ownOffice: sets[4]?.[0]
        ? {
            branchId: sets[4][0].BranchID as number,
            branchName: sets[4][0].BranchName as string,
            address: sets[4][0].Address1 ?? '',
            city: sets[4][0].City ?? '',
            phone: sets[4][0].PhoneNo ?? '',
            stateCode: sets[4][0].StateCode ?? '',
          }
        : null,
      branches: (sets[5] ?? []).map((r: any) => ({
        branchName: r.BranchName as string,
        address: r.Address1 ?? '',
        city: r.City ?? '',
        phone: r.PhoneNo ?? '',
      })),
    };
  }

  // ─── TEAMS ───────────────────────────────────────────────────────────────────

  // ─── HRMSDEV: active teams via USP_GetCompanyMasterData (set 6) ──────────────
  async getActiveTeams() {
    try {
      const sets = await this.execCompanyMasterData();
      return (sets[6] ?? []).map((r: any) => ({
        id: r.ID as number,
        name: r.TechName as string,
        badgeColor: r.BadgeColorHex ?? '',
      }));
    } catch (err) {
      console.error('getActiveTeams failed -', (err as Error).message);
      return [];
    }
  }
  // Team membership = employees reporting to that team's current lead.
  // There is no direct Employee->Team column today; this is the agreed
  // workaround via ReportingManagerID until the DB team adds a real link.
  // ─── HRMSDEV: team members via USP_GetCompanyMasterData (set 7) ──────────────
  async getTeamMembers(teamTechId: number) {
    try {
      const sets = await this.execCompanyMasterData(null, null, teamTechId);
      return (sets[7] ?? []).map((r: any) => ({
        employeeId: r.EmployeeID as string,
        name: r.FullName as string,
        designation: (r.Designation as string) ?? 'N/A',
      }));
    } catch (err) {
      console.error('getTeamMembers failed -', (err as Error).message);
      return [];
    }
  }

  // ─── AUTH ────────────────────────────────────────────────────────────────────

  async findUserById(userId: string) {
    const pool = await this.getPool();
    const result = await pool
      .request()
      .input('UserId', sql.VarChar, userId)
      .execute('usp_GetUserById');
    const row = result.recordset[0];
    if (!row) return null;
    return {
      userId: row.user_id as string,
      employeeId: row.employee_id as string,
      email: row.email as string,
      role: row.role as string,
      name: row.name as string,
    };
  }
  async findUserByEmailAndPassword(email: string, password: string) {
    const pool = await this.getPool();
    const result = await pool
      .request()
      .input('Email', sql.NVarChar, email.toLowerCase())
      .input('Password', sql.NVarChar, password)
      .execute('usp_LoginUser');
    const row = result.recordset[0];
    if (!row) return null;
    return {
      userId: row.user_id as string,
      employeeId: row.employee_id as string,
      email: row.email as string,
      role: row.role as string,
      name: row.name as string,
    };
  }

  // ─── EMPLOYEES ───────────────────────────────────────────────────────────────

  async findEmployeeById(employeeId: string) {
    const pool = await this.getPool();
    const result = await pool
      .request()
      .input('EmployeeId', sql.VarChar, employeeId)
      .execute('usp_GetEmployeeById');

    return result.recordset[0] ?? null;
  }

  async getAllEmployees() {
    const pool = await this.getPool();

    const result = await pool
      .request()
      .input('SearchText', null)
      .input('DeptID', null)
      .input('DesignationID', null)
      .input('BranchID', null)
      .input('EmploymentStatusID', null)
      .input('CompanyID', 1)
      .execute('dbo.USP_GetEmployeeMasterListing');

    return result.recordset;
  }

  async getPayrollSummary() {
    const pool = await this.getPool();
    const result = await pool.request().execute('usp_GetPayrollSummary');

    const row = result.recordset[0];
    const averageSalary =
      row.employeeCount > 0
        ? Math.round(row.totalPayroll / row.employeeCount)
        : 0;
    return {
      totalPayroll: row.totalPayroll,
      averageSalary,
      highestSalary: row.highestSalary,
      employeeCount: row.employeeCount,
    };
  }

  // ─── LEAVE REQUESTS ──────────────────────────────────────────────────────────

  async getLeaveRequests(employeeId?: string | null) {
    const pool = await this.getPool();
    const result = await pool
      .request()
      .input('EmployeeId', sql.VarChar, employeeId ?? null)
      .execute('usp_GetLeaveRequests');
    return result.recordset.map((row) => ({
      ...row,
      leaveDate: row.leave_date,
      startDate: row.start_date,
      endDate: row.end_date,
      requestCode: row.request_code,
      createdAt: row.created_at,
      approvedAt: row.approved_at,
      cancelledAt: row.cancelled_at,
    }));
  }
  async getLeaveRequestByCode(code: string) {
    const pool = await this.getPool();
    const result = await pool
      .request()
      .input('RequestCode', sql.NVarChar, code)
      .execute('usp_GetLeaveRequestByCode');

    const row = result.recordset[0];
    if (!row) return null;

    const toDateStr = (v: unknown) => {
      if (!v) return '';
      const d = v instanceof Date ? v : new Date(String(v));
      if (isNaN(d.getTime())) return '';
      const s = d.toISOString().slice(0, 10);
      return s <= '1900-01-02' ? '' : s;
    };
    const rawStart = toDateStr(row.start_date);
    const rawLeave = toDateStr(row.leave_date);
    const rawEnd = toDateStr(row.end_date);
    const startDate = rawStart || rawLeave;
    const endDate = rawEnd || startDate;
    return {
      id: row.id as number,
      requestCode: row.request_code as string,
      employeeId: row.employee_id as string,
      leaveType: row.leave_type as string,
      startDate,
      endDate,
      leaveDate: rawLeave,
      duration: Number(row.duration) || 1,
      dayType: row.day_type as string,
      reason: row.reason as string,
      status: row.status as string,
    };
  }
  async approveLeaveRequest(code: string, approverId: string) {
    const pool = await this.getPool();
    await pool
      .request()
      .input('RequestCode', sql.NVarChar, code)
      .input('ApproverId', sql.VarChar, approverId)
      .execute('usp_ApproveLeaveRequest');

    return { requestCode: code, status: 'approved' };
  }

  // ─── HRMSDEV: cancel or withdraw a leave via USP_LeaveWithdrawCancel ──────────
  // actionId: 13 = Cancel (only while Pending), 38 = Withdraw (only while
  // Approved AND before the leave's start date). Proc also refunds balance
  // automatically on withdraw. Returns { ok, statusCode, message }.
  async withdrawOrCancelLeave(
    employeeId: string,
    leaveApplicationId: number,
    actionId: 13 | 38,
    reason?: string | null,
  ): Promise<{ ok: boolean; statusCode: number; message: string }> {
    const pool = await this.getPool();
    try {
      const result = await pool
        .request()
        .input('EmployeeId', sql.VarChar, employeeId)
        .input('LeaveApplicationId', sql.BigInt, leaveApplicationId)
        .input('ActionId', sql.Int, actionId)
        .input('Reason', sql.NVarChar, reason ?? null)
        .execute('USP_LeaveWithdrawCancel');
      // Same issue as applyLeave in leave.service.ts: USP_LeaveWithdrawCancel
      // fires notification EXEC calls (each returning their own result set)
      // BEFORE its real final SELECT {StatusCode, Message}. The real answer
      // is reliably the LAST result set, not the first.
      const allResultSets = result.recordsets as unknown as any[][];
      const lastSet = allResultSets[allResultSets.length - 1] ?? [];
      const row = lastSet[0] ?? {};
      const statusCode = Number(row.StatusCode ?? 500);
      const message = String(row.Message ?? 'Unknown response from server.');
      return { ok: statusCode === 200, statusCode, message };
    } catch (err) {
      console.error(
        'withdrawOrCancelLeave failed for',
        employeeId,
        '-',
        (err as Error).message,
      );
      return {
        ok: false,
        statusCode: 500,
        message: 'Could not process the request. Please try again.',
      };
    }
  }
  async cancelLeaveRequestByCode(
    code: string,
    specificDates?: string[] | null,
  ) {
    const pool = await this.getPool();
    const cancelledDates =
      specificDates && specificDates.length > 0
        ? JSON.stringify(
            specificDates
              .map((d) => new Date(d).toISOString().slice(0, 10))
              .sort(),
          )
        : null;
    const result = await pool
      .request()
      .input('RequestCode', sql.NVarChar, code)
      .input('CancelledDates', sql.NVarChar(sql.MAX), cancelledDates)
      .execute('usp_CancelLeaveRequestByCode');

    const row = result.recordset[0];
    if (!row) return null;

    const toDateStr = (v: unknown) => {
      if (!v) return '';
      const d = v instanceof Date ? v : new Date(String(v));
      if (isNaN(d.getTime())) return '';
      const s = d.toISOString().slice(0, 10);
      return s <= '1900-01-02' ? '' : s;
    };
    const rawStart = toDateStr(row.start_date);
    const rawLeave = toDateStr(row.leave_date);
    const rawEnd = toDateStr(row.end_date);
    const startDate = rawStart || rawLeave;
    const endDate = rawEnd || startDate;
    return {
      id: row.id as number,
      requestCode: row.request_code as string,
      employeeId: row.employee_id as string,
      leaveType: row.leave_type as string,
      startDate,
      endDate,
      leaveDate: rawLeave,
      duration: Number(row.duration) || 1,
      dayType: row.day_type as string,
      reason: row.reason as string,
      status: row.status as string,
    };
  }
  // ─── HRMSDEV: real leave balance via USP_EmployeeLeaveBalance ─────────────────
  async getLeaveBalance(employeeId: string) {
    const pool = await this.getPool();
    let result: sql.IProcedureResult<any>;
    try {
      result = await pool
        .request()
        .input('EmployeeId', sql.VarChar, employeeId)
        .execute('USP_EmployeeLeaveBalance');
    } catch (err) {
      console.error(
        'getLeaveBalance failed for',
        employeeId,
        '-',
        (err as Error).message,
      );
      return { initialised: false, rows: [] as any[] };
    }
    const rows = result.recordset ?? [];
    if (!rows.length || rows[0].StatusCode !== undefined) {
      return { initialised: false, rows: [] as any[] };
    }
    return {
      initialised: true,
      rows: rows.map((r: any) => ({
        leaveTypeId: Number(r.LeaveTypeId),
        openingBalance: Number(r.OpeningBalance ?? 0),
        accrued: Number(r.Accrued ?? 0),
        availed: Number(r.Availed ?? 0),
        closingBalance: Number(r.ClosingBalance ?? 0),
      })),
    };
  }

  // ─── COMPANY DATA ────────────────────────────────────────────────────────────

  async getCompanyData() {
    const pool = await this.getPool();
    let holidays: Array<{ date: string; name: string }> = [];
    let announcements: Array<{ date: string; title: string }> = [];
    try {
      const r = await pool.request().execute('usp_GetHolidays');
      holidays = r.recordset as Array<{ date: string; name: string }>;
    } catch {
      /* table may not exist */
    }
    try {
      const r = await pool.request().execute('usp_GetAnnouncements');
      announcements = r.recordset as Array<{ date: string; title: string }>;
    } catch {
      /* table may not exist */
    }

    return { holidays, announcements };
  }

  async getCompanyLogo() {
    const pool = await this.getPool();
    const result = await pool.request().execute('usp_GetCompanyLogo');
    return result.recordset[0]?.logo_url ?? null;
  }
}

