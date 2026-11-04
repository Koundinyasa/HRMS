/**
 * Leave Daily API
 *
 * POST http://localhost:3001/api/admin/ta/leave/daily/monthly-leave-calendar
 * Body: { year, month, branchId? } — companyId from JWT
 */
import { baseApi } from "@/app/baseApi";
import * as XLSX from "xlsx";
import type {
  LeaveDailyFilters,
  LeaveDailyResponse,
} from "../types/leaveDaily.types";
 
/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */
 
const API_ROOT = String(import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
 
export const withApiPrefix = (path: string) =>
  API_ROOT.endsWith("/api") ? path : `/api${path}`;
 
export const LEAVE_DAILY_BASE_PATH = withApiPrefix("/admin/ta/leave/daily");
 
export type LeaveDailyFilterKey =
  | "branch"
  | "salaryStructure"
  | "leave"
  | "attendance"
  | "designation"
  | "empStatus";
 
export const LEAVE_DAILY_OPTION_ENDPOINTS: Record<
  LeaveDailyFilterKey,
  string | null
> = {
  branch: withApiPrefix("/admin/employee-details"),
  salaryStructure: null,
  leave: `${LEAVE_DAILY_BASE_PATH}/leavetypes`,
  attendance: null,
  designation: withApiPrefix("/admin/employee-details"),
  empStatus: null,
};
 
/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
 
export interface LeaveDailyOption {
  label: string;
  value: string;
  /** Short code if the backend sends one (e.g. "CL") - used by the Leave / Attendance filters */
  code?: string;
}
 
export interface GetMonthlyLeaveCalendarRequest {
  year: number;
  month: number;
  branchId?: number;
}
 
/**
 * Backend DTO (GetMonthlyLeaveCalendarDto) takes ONE id per filter.
 * The dropdowns allow several values, so one request is sent per combination
 * and the rows are merged (several values of one filter = OR, different filters = AND).
 */
export interface MonthlyLeaveCalendarArgs {
  year: number;
  month: number;
  branchIds?: number[];
  employmentStatusIds?: number[];
  designationIds?: number[];
  structureIds?: number[];
  leaveTypeIds?: number[];
  attendanceStatusIds?: number[];
  /** Leave policy id (single) */
  policyId?: number | null;
}
 
/** Max requests sent for one calendar load (all filter combinations together) */
const MAX_CALENDAR_REQUESTS = 24;
// The company is taken from the login token by the backend, so no companyId is sent from here.
 
export type MonthlyLeaveCalendarRow = Record<string, unknown>;
 
export interface SaveLeaveFormBody {
  employeeId: number;
  date: string;
  firstHalf?: string | null;
  secondHalf?: string | null;
  remarks?: string | null;
}
 
export interface ApplyLeaveBody {
  employeeId: number | number[];
  dates: string[];
  leaveType: string | number;
}
 
/**
 * Backend DTO: BulkLeaveRequestDto
 *  - POST .../bulk-leave-request           -> popup (one employee, one day), returns JSON { summary }
 *  - POST .../bulk-leave-request/download  -> multi-select (employees + dates), returns an Excel file
 */
export interface BulkLeaveRequestBody {
  /** EmployeeID strings, max 25 chars each (dbo.UT_EmployeeList) */
  employeeList: string[];
  /** Leave type id (or Mst_AttendanceStatus id when isAttendanceMarking = true), min 1 */
  leaveTypeId: number;
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
  sessionFrom?: string;
  sessionTo?: string;
  isHalfDay?: boolean;
  /** Which half for a half day: 1 = First Half, 2 = Second Half (backend default = 1) */
  halfDayType?: 1 | 2;
  reason?: string;
  documentPath?: string;
  isHRForceApply?: boolean;
  isAttendanceMarking?: boolean;
}
 
/** One row of the SP's final result set (columns come straight from the DB) */
export type BulkLeaveSummaryRow = Record<string, unknown>;
 
/** Response of POST .../bulk-leave-request: the SP's two result sets */
export interface BulkLeaveRequestResponse {
  /** Audit log rows of the SP (not shown in the UI) */
  logs: BulkLeaveSummaryRow[];
  /**
   * Result per employee: { EmployeeId, Message, StatusCode ... }.
   * When the SP rejects the request early this is a single row { StatusCode, Message }.
   */
  summary: BulkLeaveSummaryRow[];
}
 
/** Response of POST .../bulk-leave-request/download (Excel already parsed to rows) */
export interface BulkLeaveDownloadResult {
  /** File name from Content-Disposition, e.g. bulk-leave-result-2026-10-12T...xlsx */
  fileName: string;
  /** Header names in the same order as the Excel sheet */
  headers: string[];
  /** Rows of the "Bulk Leave Result" sheet */
  rows: BulkLeaveSummaryRow[];
}
 
/** Backend ReprocessItemDto - one employee + one date to recalculate */
export interface ReprocessItem {
  /** EmployeeID, max 25 chars */
  employeeId: string;
  /** YYYY-MM-DD */
  date: string;
}
 
/**
 * Backend ReprocessDto: POST .../reprocess
 * The pairs come from the earlier bulk leave requests (stored on the frontend).
 */
export interface ReprocessBody {
  items: ReprocessItem[];
}
 
/** One row of the reprocess response */
export interface ReprocessResultItem {
  employeeId: string;
  date: string;
  success: boolean;
  message: string | null;
}
 
/** Response of POST .../reprocess */
export interface ReprocessResponse {
  results: ReprocessResultItem[];
}
 
 
/* ------------------------------------------------------------------ */
/*  Company dropdown + leave balance (backend SPs)                     */
/* ------------------------------------------------------------------ */
 
export interface CompanyDropdownData {
  branches: LeaveDailyOption[];
  salaryStructures: LeaveDailyOption[];
  leaveTypes: LeaveDailyOption[];
  /** Attendance FILTER options (Absent, HalfDay, Holiday, OnLeave, Pending, Present, WeeklyOff) */
  attendanceStatuses: LeaveDailyOption[];
  /** Code of each leave type: ID + Code (1 = CL ... 8 = MRL) */
  leaveTypeCodes: LeaveDailyOption[];
  /** Months for the Month dropdown, oldest first, e.g. "Oct/2026" (from `monthYear`) */
  months: LeaveDailyOption[];
  /**
   * Id of the "Present" status from the backend list `presentStatus` (row with Code "P").
   * Sent as leaveTypeId when isAttendanceMarking = true. null if the server did not send it.
   */
  presentStatusId: number | null;
  designations: LeaveDailyOption[];
  employeeStatuses: LeaveDailyOption[];
  /** Active leave policies (value = policy id) */
  activeLeavePolicies: LeaveDailyOption[];
}
 
export interface EmployeeLeaveBalanceRow {
  [key: string]: unknown;
}
 
export interface ImportDailyBody {
  templateType: string;
  policyId: number;
  month: string;
  file: File;
}
 
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
 
function asRecord(value: unknown): Record<string, unknown> | null {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}
 
function unwrapList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  const obj = asRecord(raw);
  if (!obj) return [];
  for (const key of ["data", "result", "recordset", "items", "rows"]) {
    if (Array.isArray(obj[key])) return obj[key] as unknown[];
  }
  return [];
}
 
function pickId(row: Record<string, unknown>): string {
  const v =
    row.id ??
    row.Id ??
    row.ID ??
    row.value ??
    row.Value ??
    row.branchId ??
    row.BranchID ??
    row.BranchId ??
    row.designationId ??
    row.DesignationID ??
    row.PolicyId ??
    row.policyId ??
    row.LeaveTypeId ??
    row.leaveTypeId ??
    row.MonthId ??
    row.monthId ??
    firstValueByKey(row, (k) => k.endsWith("id") && !k.includes("company"));
  return v == null ? "" : String(v);
}
 
/** First value whose (lower-case, letters+digits only) column name passes the test */
function firstValueByKey(
  row: Record<string, unknown>,
  test: (normalizedKey: string) => boolean,
): unknown {
  for (const [key, value] of Object.entries(row)) {
    if (value == null || value === "") continue;
    if (test(key.toLowerCase().replace(/[^a-z0-9]/g, ""))) return value;
  }
  return undefined;
}
 
function pickLabel(row: Record<string, unknown>): string {
  const v =
    row.name ??
    row.Name ??
    row.label ??
    row.Label ??
    row.branchName ??
    row.BranchName ??
    row.designationName ??
    row.DesignationName ??
    row.PolicyName ??
    row.policyName ??
    row.LeaveTypeName ??
    row.leaveTypeName ??
    row.MonthName ??
    row.monthName ??
    row.DisplayName ??
    row.displayName ??
    firstValueByKey(row, (k) => k.endsWith("name") || k === "description" || k === "title");
  return v == null ? pickId(row) : String(v);
}
 
/** Short code of an option row, e.g. "CL" / "P" (empty when the API has none) */
function pickCode(row: Record<string, unknown>): string {
  const v =
    row.code ??
    row.Code ??
    row.LeaveCode ??
    row.leaveCode ??
    row.LeaveTypeCode ??
    row.leaveTypeCode ??
    row.AttendanceCode ??
    row.attendanceCode ??
    row.ShortName ??
    row.shortName ??
    row.Abbreviation ??
    row.abbreviation ??
    // any other "...code" / "short name" column
    firstValueByKey(
      row,
      (k) => k.endsWith("code") || k === "abbr" || k === "shortname" || k === "abbreviation",
    );
  return v == null ? "" : String(v).trim();
}
 
/**
 * Leave types come without a code; the backend sends the codes in `leaveTypeCodes`
 * (same id: 1 = CL, 2 = SL ... 8 = MRL). Copy them onto the leave types.
 */
function applyStatusCodes(options: LeaveDailyOption[], rawStatuses: unknown): LeaveDailyOption[] {
  const codeById = new Map<string, string>();
  for (const item of unwrapList(rawStatuses)) {
    const row = asRecord(item);
    if (!row) continue;
    const code = pickCode(row).toUpperCase();
    const id = pickId(row);
    if (code && code !== "P" && id && !codeById.has(id)) codeById.set(id, code);
  }
  return options.map((option) => {
    if (option.code) return option;
    const code = codeById.get(option.value);
    return code ? { ...option, code } : option;
  });
}
 
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
 
/**
 * Backend `monthYear` rows ({ MonthName: "October", YearNo: 2026, Name: "Oct-2026" })
 * -> month options like "Oct/2026" (the format the pages use), oldest first.
 * The month is read from the name, never from ID (ID is only a row number).
 */
function toMonthOptions(raw: unknown): LeaveDailyOption[] {
  const found = new Map<string, { year: number; monthIndex: number }>();
 
  for (const item of unwrapList(raw)) {
    const row = asRecord(item);
    if (!row) continue;
 
    let year = Number(row.YearNo ?? row.yearNo ?? row.Year ?? row.year);
    const monthText = String(row.MonthName ?? row.monthName ?? row.Month ?? row.month ?? "");
    let monthIndex = MONTH_SHORT.findIndex((short) =>
      monthText.toLowerCase().startsWith(short.toLowerCase()),
    );
 
    // fall back to the display name: "Oct-2026" / "Oct/2026" / "October 2026"
    if (monthIndex < 0 || !Number.isInteger(year)) {
      const match = String(row.Name ?? row.name ?? row.Label ?? row.label ?? "").match(
        /^([A-Za-z]{3})[A-Za-z]*[\s\-/]+(\d{4})$/,
      );
      if (!match) continue;
      monthIndex = MONTH_SHORT.findIndex(
        (short) => short.toLowerCase() === match[1].toLowerCase(),
      );
      year = Number(match[2]);
    }
    if (monthIndex < 0 || !Number.isInteger(year)) continue;
 
    found.set(`${MONTH_SHORT[monthIndex]}/${year}`, { year, monthIndex });
  }
 
  return Array.from(found.entries())
    .sort(([, a], [, b]) => a.year - b.year || a.monthIndex - b.monthIndex)
    .map(([value]) => ({ value, label: value }));
}
 
/**
 * Gives a leave list (for example one employee's leave types) a short, unique code:
 * its own code, else the code with the same id in `codeOptions` (company `leaveTypeCodes`),
 * else one made from the name.
 */
export function withLeaveCodes(
  options: LeaveDailyOption[],
  codeOptions: LeaveDailyOption[],
): LeaveDailyOption[] {
  const codeById = new Map<string, string>();
  for (const option of codeOptions) {
    const code = (option.code ?? "").trim().toUpperCase();
    if (code && code !== "P" && !codeById.has(option.value)) codeById.set(option.value, code);
  }
  return withCodes(
    options.map((option) => {
      if (option.code) return option;
      const code = codeById.get(option.value);
      return code ? { ...option, code } : option;
    }),
  );
}
 
/** "Casual Leave" -> "CL", "Loss of Pay" -> "LOP", "Sick" -> "SIC" */
function deriveCode(label: string): string {
  const words = label.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map((word) => word[0]).join("").toUpperCase();
}
 
/**
 * Gives every option a short, unique code: the code the API sends, or one made
 * from the name when the API has none. Two options never share a code.
 */
function withCodes(options: LeaveDailyOption[]): LeaveDailyOption[] {
  const used = new Set<string>();
  return options.map((option) => {
    let code = (option.code ?? "").trim().toUpperCase() || deriveCode(option.label);
    if (used.has(code)) {
      // same code twice (e.g. "Marriage" and "Maternity" -> ML): use more letters of the name
      const letters = option.label.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      for (let length = Math.min(code.length + 1, letters.length); length <= letters.length; length += 1) {
        const candidate = letters.slice(0, length);
        if (!used.has(candidate)) {
          code = candidate;
          break;
        }
      }
    }
    used.add(code);
    return { ...option, code };
  });
}
 
export function toOptions(raw: unknown, listKey?: string): LeaveDailyOption[] {
  let list = unwrapList(raw);
  if (!list.length && listKey) {
    const obj = asRecord(raw);
    if (obj && Array.isArray(obj[listKey])) {
      list = obj[listKey] as unknown[];
    }
  }
 
  const options: LeaveDailyOption[] = [];
  for (const item of list) {
    const row = asRecord(item);
    if (!row) continue;
    const value = pickId(row);
    const label = pickLabel(row);
    if (!value && !label) continue;
    const code = pickCode(row);
    options.push({
      value: value || label,
      // names in the database can end with a space ("Project Lead ")
      label: (label || value).trim(),
      ...(code ? { code } : {}),
    });
  }
  return options;
}
 
/* ------------------------------------------------------------------ */
/*  Bulk leave result helpers                                          */
/* ------------------------------------------------------------------ */
 
/** "Status Code", "status_code", "StatusCode" -> "statuscode" */
const normalizeKey = (key: string) => key.replace(/[^a-z0-9]/gi, "").toLowerCase();
 
const findValue = (row: BulkLeaveSummaryRow, names: string[]): unknown => {
  for (const [key, value] of Object.entries(row)) {
    if (names.includes(normalizeKey(key))) return value;
  }
  return undefined;
};
 
/**
 * Looks through the SP summary rows and returns the failed ones.
 * A row is "failed" when its StatusCode is not 0 / 200, or its Status / Result
 * text says failed / error / rejected / invalid / insufficient.
 */
export function getBulkLeaveFailures(rows: BulkLeaveSummaryRow[]): {
  failedCount: number;
  firstMessage: string | null;
} {
  let failedCount = 0;
  let firstMessage: string | null = null;
 
  for (const row of rows) {
    const code = findValue(row, ["statuscode", "status_code", "code"]);
    const statusText = String(
      findValue(row, ["status", "result", "remarks", "resultstatus"]) ?? "",
    ).toLowerCase();
    const message = findValue(row, ["message", "errormessage", "remarks", "reason", "result"]);
 
    const codeNumber = code === undefined || code === null || code === "" ? null : Number(code);
    const badCode = codeNumber !== null && Number.isFinite(codeNumber) && codeNumber !== 0 && codeNumber !== 200;
    const badText = /fail|error|reject|invalid|insufficient|not allowed|exceed/.test(statusText);
 
    if (badCode || badText) {
      failedCount += 1;
      if (!firstMessage && message != null && String(message).trim()) {
        firstMessage = String(message).trim();
      }
    }
  }
 
  return { failedCount, firstMessage };
}
 
/**
 * Employee ids whose summary row failed (StatusCode not 0/200, or failed status text).
 * Works with JSON keys (EmployeeId) and Excel headers (" Employee Id").
 */
export function getBulkLeaveFailedEmployeeIds(rows: BulkLeaveSummaryRow[]): Set<string> {
  const failed = new Set<string>();
  for (const row of rows) {
    if (getBulkLeaveFailures([row]).failedCount === 0) continue;
    const id = findValue(row, ["employeeid", "empid", "employeecode"]);
    if (id != null && String(id).trim()) failed.add(String(id).trim());
  }
  return failed;
}
 
/**
 * Finds the id of the Present status (code "P") in the raw attendanceStatuses list.
 * Field names differ between APIs (ID / Id / AttendanceStatusID, Code / StatusCode ...),
 * so any "...id" / "...code" field is accepted.
 */
function findPresentStatusId(raw: unknown): number | null {
  const rows = unwrapList(raw)
    .map((item) => asRecord(item))
    .filter((row): row is Record<string, unknown> => row !== null);
 
  const idOf = (row: Record<string, unknown>): number | null => {
    const entries = Object.entries(row);
    const preferred = ["id", "attendancestatusid", "statusid", "value"];
    const hit =
      entries.find(([key]) => preferred.includes(normalizeKey(key))) ??
      entries.find(([key]) => {
        const k = normalizeKey(key);
        return k.endsWith("id") && !k.includes("company") && !k.includes("branch");
      });
    const id = Number(hit?.[1]);
    return Number.isFinite(id) && id > 0 ? id : null;
  };
 
  const codeOf = (row: Record<string, unknown>): string => {
    const entries = Object.entries(row);
    const hit =
      entries.find(([key]) =>
        ["code", "statuscode", "attendancecode", "attendancestatuscode", "shortcode", "shortname"].includes(
          normalizeKey(key),
        ),
      ) ?? entries.find(([key]) => normalizeKey(key).endsWith("code"));
    return String(hit?.[1] ?? "").trim().toUpperCase();
  };
 
  const nameOf = (row: Record<string, unknown>): string =>
    String(
      Object.entries(row).find(([key]) =>
        ["name", "statusname", "attendancestatusname", "label", "description"].includes(
          normalizeKey(key),
        ),
      )?.[1] ?? "",
    )
      .trim()
      .toUpperCase();
 
  const match =
    rows.find((row) => codeOf(row) === "P") ??
    rows.find((row) => nameOf(row) === "PRESENT" || nameOf(row) === "P");
  return match ? idOf(match) : null;
}
 
/** attendanceStatuses can come under different keys */
function pickAttendanceStatuses(data: Record<string, unknown>): unknown {
  return (
    data.attendanceStatuses ??
    data.AttendanceStatuses ??
    data.attendanceStatus ??
    data.AttendanceStatus ??
    data.attendance_statuses ??
    data.statuses ??
    data.Statuses
  );
}
 
/** Normalises any backend shape to { summary: [...] } */
function toBulkLeaveResponse(raw: unknown): BulkLeaveRequestResponse {
  const obj = asRecord(raw);
  const onlyRows = (list: unknown[]) =>
    list.filter((row): row is BulkLeaveSummaryRow => asRecord(row) !== null);
  const summary = obj && Array.isArray(obj.summary) ? obj.summary : unwrapList(raw);
  const logs = obj && Array.isArray(obj.logs) ? obj.logs : [];
  return { logs: onlyRows(logs), summary: onlyRows(summary) };
}
 
/** Reads the file name out of: attachment; filename="bulk-leave-result-....xlsx" */
function fileNameFromDisposition(header: string | null): string {
  const match = header?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  if (match?.[1]) return decodeURIComponent(match[1]);
  return `bulk-leave-result-${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`;
}
 
export function getLeaveDailyErrorMessage(error: unknown): string {
  const e = error as {
    status?: number | string;
    data?: { message?: string | string[]; error?: string } | string;
    error?: string;
  };
 
  if (!e) return "Something went wrong.";
  if (e.status === "FETCH_ERROR") {
    return "Cannot reach the server. Check that the backend is running.";
  }
  if (typeof e.data === "string" && e.data.trim()) return e.data;
  if (e.data && typeof e.data === "object") {
    const msg = e.data.message ?? e.data.error;
    if (Array.isArray(msg)) return msg.join(", ");
    if (msg) return String(msg);
  }
  return e.error || "Request failed.";
}
 
/* ------------------------------------------------------------------ */
/*  RTK Query                                                          */
/* ------------------------------------------------------------------ */
 
export const leaveDailyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // POST /admin/ta/leave/daily/monthly-leave-calendar
    // body: { year, month, branchId?, employmentStatusId?, designationId?, policyId?,
    //         leaveTypeId?, structureId?, attendanceStatusId? }   (all optional ints)
    getAdminMonthlyLeaveCalendar: build.query<
      MonthlyLeaveCalendarRow[],
      MonthlyLeaveCalendarArgs
    >({
      queryFn: async (args, _api, _extra, baseQuery) => {
        const ints = (list?: number[]) =>
          (list ?? [])
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && id > 0);
 
        // one entry per filter that has selected values
        const dimensions: [string, number[]][] = [
          ["branchId", ints(args.branchIds)],
          ["employmentStatusId", ints(args.employmentStatusIds)],
          ["designationId", ints(args.designationIds)],
          ["structureId", ints(args.structureIds)],
          ["leaveTypeId", ints(args.leaveTypeIds)],
          ["attendanceStatusId", ints(args.attendanceStatusIds)],
        ];
 
        // every combination of the selected values (nothing selected -> one request, no filter)
        let combos: Record<string, number>[] = [{}];
        for (const [key, values] of dimensions) {
          if (values.length === 0) continue;
          combos = combos.flatMap((combo) => values.map((value) => ({ ...combo, [key]: value })));
        }
 
        if (combos.length > MAX_CALENDAR_REQUESTS) {
          return {
            error: {
              status: "CUSTOM_ERROR" as const,
              error: `Too many filter combinations selected (${combos.length}). Please select fewer options.`,
            },
          };
        }
 
        const policyId = Number(args.policyId);
        const results = await Promise.all(
          combos.map((combo) =>
            baseQuery({
              url: `${LEAVE_DAILY_BASE_PATH}/monthly-leave-calendar`,
              method: "POST",
              body: {
                year: Number(args.year),
                month: Number(args.month),
                ...combo,
                ...(Number.isInteger(policyId) && policyId > 0 ? { policyId } : {}),
              },
            }),
          ),
        );
 
        const failed = results.find((r) => r.error);
        if (failed?.error) return { error: failed.error };
 
        // merge, one row per employee (same employee can come from several requests)
        const seen = new Set<string>();
        const data: MonthlyLeaveCalendarRow[] = [];
        for (const result of results) {
          for (const row of unwrapList(result.data)) {
            const record = asRecord(row);
            if (!record) continue;
            const employeeId = String(
              record.EmployeeID ?? record.EmployeeId ?? record.employeeId ?? "",
            ).trim();
            if (employeeId) {
              if (seen.has(employeeId)) continue;
              seen.add(employeeId);
            }
            data.push(record as MonthlyLeaveCalendarRow);
          }
        }
 
        return { data };
      },
      providesTags: ["Leave"],
    }),
 
    // Leave types allowed for ONE employee (Leave Form).
    // GET /admin/ta/leave/daily/leave-master-data?employeeId=...   (USP_LeaveMasterData)
    // -> { success, message, data: [ ...leave types ] }. The company comes from the login token.
    getLeaveMasterData: build.query<LeaveDailyOption[], string>({
      query: (employeeId) =>
        `${LEAVE_DAILY_BASE_PATH}/leave-master-data?employeeId=${encodeURIComponent(employeeId)}`,
      transformResponse: (raw: unknown) => {
        const root = asRecord(raw) ?? {};
        return toOptions(root.data ?? root.Data ?? raw);
      },
      providesTags: ["Leave"],
    }),
 
    getDailyMonths: build.query<LeaveDailyOption[], void>({
      query: () => `${LEAVE_DAILY_BASE_PATH}/months`,
      transformResponse: (raw: unknown) => toOptions(raw),
      providesTags: ["Leave"],
    }),
 
    getDailyLeaveTypes: build.query<LeaveDailyOption[], void>({
      query: () => `${LEAVE_DAILY_BASE_PATH}/leavetypes`,
      transformResponse: (raw: unknown) => toOptions(raw),
      providesTags: ["Leave"],
    }),
 
    getDailyDayTypes: build.query<LeaveDailyOption[], void>({
      query: () => `${LEAVE_DAILY_BASE_PATH}/daytypes`,  // not in controller yet — may 404
      transformResponse: (raw: unknown) => toOptions(raw),
      providesTags: ["Leave"],
    }),
 
    getDailyEmployees: build.query<
      Record<string, unknown>[],
      { policyId: number; month: string }
    >({
      query: ({ policyId, month }) =>
        `${LEAVE_DAILY_BASE_PATH}/employees?policyId=${policyId}&month=${encodeURIComponent(month)}`,
      transformResponse: (raw: unknown) => {
        return unwrapList(raw).filter(
          (row): row is Record<string, unknown> => asRecord(row) !== null,
        );
      },
      providesTags: ["Leave"],
    }),
 
    getDailyLeaveForm: build.query<
      Record<string, unknown>[],
      { employeeId: number; date: string }
    >({
      query: ({ employeeId, date }) =>
        `${LEAVE_DAILY_BASE_PATH}/leaveform?employeeId=${employeeId}&date=${encodeURIComponent(date)}`,
      transformResponse: (raw: unknown) => {
        return unwrapList(raw).filter(
          (row): row is Record<string, unknown> => asRecord(row) !== null,
        );
      },
      providesTags: ["Leave"],
    }),
 
    saveDailyLeaveForm: build.mutation<unknown, SaveLeaveFormBody>({
      query: (body) => ({
        url: `${LEAVE_DAILY_BASE_PATH}/leaveform`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Leave"],
    }),
 
    // legacy apply (kept)
    applyDailyLeave: build.mutation<unknown, ApplyLeaveBody>({
      query: (body) => ({
        url: `${LEAVE_DAILY_BASE_PATH}/apply`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Leave"],
    }),
 
    // Popup (one employee, one day) -> JSON { summary }
    // POST /admin/ta/leave/daily/bulk-leave-request
    bulkLeaveRequest: build.mutation<BulkLeaveRequestResponse, BulkLeaveRequestBody>({
      query: (body) => ({
        url: `${LEAVE_DAILY_BASE_PATH}/bulk-leave-request`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => toBulkLeaveResponse(raw),
      invalidatesTags: ["Leave"],
    }),
 
    // Multi-select (employees + dates) -> Excel file
    // POST /admin/ta/leave/daily/bulk-leave-request/download
    // The Excel is parsed here into plain rows (a Blob can't be stored in Redux).
    bulkLeaveRequestDownload: build.mutation<BulkLeaveDownloadResult, BulkLeaveRequestBody>({
      query: (body) => ({
        url: `${LEAVE_DAILY_BASE_PATH}/bulk-leave-request/download`,
        method: "POST",
        body,
        responseHandler: async (response: Response) => {
          // Errors come back as JSON ({ message }) - pass them on as normal error data
          if (!response.ok) {
            const text = await response.text();
            try {
              return JSON.parse(text);
            } catch {
              return text;
            }
          }
 
          const buffer = await response.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: "array", cellDates: false });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const matrix = sheet
            ? XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: false })
            : [];
          const headers = (matrix[0] ?? []).map((cell) => String(cell ?? "").trim());
          const rows = matrix
            .slice(1)
            .filter((line) => line.some((cell) => String(cell ?? "").trim() !== ""))
            .map((line) =>
              Object.fromEntries(headers.map((header, index) => [header, line[index] ?? ""])),
            );
 
          return {
            fileName: fileNameFromDisposition(response.headers.get("Content-Disposition")),
            headers,
            rows,
          } satisfies BulkLeaveDownloadResult;
        },
      }),
      invalidatesTags: ["Leave"],
    }),
 
    // Recalculates the daily attendance NOW (USP_ProcessDailyAttendance) for every employee/date pair.
    // POST /admin/ta/leave/daily/reprocess   { items: [{ employeeId, date }] }
    // -> { results: [{ employeeId, date, success, message }] }   (one result per item)
    reprocessDailyLeave: build.mutation<ReprocessResponse, ReprocessBody>({
      query: ({ items }) => ({
        url: `${LEAVE_DAILY_BASE_PATH}/reprocess`,
        method: "POST",
        body: { items },
      }),
      transformResponse: (raw: unknown): ReprocessResponse => {
        const obj = asRecord(raw);
        const list = obj && Array.isArray(obj.results) ? obj.results : unwrapList(raw);
        return {
          results: list
            .map((item) => asRecord(item))
            .filter((row): row is Record<string, unknown> => row !== null)
            .map((row) => ({
              employeeId: String(row.employeeId ?? row.EmployeeID ?? ""),
              date: String(row.date ?? row.AttendanceDate ?? "").slice(0, 10),
              success: row.success === true || row.success === 1 || row.success === "true",
              message: row.message == null ? null : String(row.message),
            })),
        };
      },
      invalidatesTags: ["Leave"],
    }),
 
    importDailyLeave: build.mutation<unknown, ImportDailyBody>({
      query: ({ file, templateType, policyId, month }) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("templateType", templateType);
        fd.append("policyId", String(policyId));
        fd.append("month", month);
        return {
          url: `${LEAVE_DAILY_BASE_PATH}/import`,
          method: "POST",
          body: fd,
        };
      },
      invalidatesTags: ["Leave"],
    }),
 
    // ===== CHANGED: company dropdown data (one SP → all filter lists) =====
    // GET /admin/ta/leave/daily/company-dropdown-data   (the company comes from the login token)
    getCompanyDropdownData: build.query<CompanyDropdownData, void>({
      query: () => `${LEAVE_DAILY_BASE_PATH}/company-dropdown-data`,
      transformResponse: (raw: unknown): CompanyDropdownData => {
        const root = asRecord(raw) ?? {};
        const data = asRecord(root.data) ?? root;
        return {
          branches: toOptions(data.branches ?? data.Branches),
          salaryStructures: toOptions(
            data.salaryStructures ?? data.SalaryStructures,
          ),
          leaveTypes: withCodes(
            applyStatusCodes(
              toOptions(data.leaveTypes ?? data.LeaveTypes),
              data.leaveTypeCodes ?? data.LeaveTypeCodes,
            ),
          ),
          attendanceStatuses: toOptions(pickAttendanceStatuses(data)),
          leaveTypeCodes: toOptions(data.leaveTypeCodes ?? data.LeaveTypeCodes),
          months: toMonthOptions(data.monthYear ?? data.MonthYear ?? data.months),
          presentStatusId: findPresentStatusId(data.presentStatus ?? data.PresentStatus),
          designations: toOptions(data.designations ?? data.Designations),
          employeeStatuses: toOptions(
            data.employeeStatuses ?? data.EmployeeStatuses,
          ),
          activeLeavePolicies: toOptions(
            data.activeLeavePolicies ?? data.ActiveLeavePolicies,
          ),
        };
      },
      providesTags: ["Leave"],
    }),
 
    // ===== CHANGED: employee leave balance =====
    // GET /admin/ta/leave/daily/employee-leave-balance?employeeId=
    getEmployeeLeaveBalance: build.query<
      EmployeeLeaveBalanceRow[],
      string
    >({
      query: (employeeId) =>
        `${LEAVE_DAILY_BASE_PATH}/employee-leave-balance?employeeId=${encodeURIComponent(employeeId)}`,
      transformResponse: (raw: unknown): EmployeeLeaveBalanceRow[] => {
        return unwrapList(raw).filter(
          (row): row is EmployeeLeaveBalanceRow => asRecord(row) !== null,
        ) as EmployeeLeaveBalanceRow[];
      },
      providesTags: (_r, _e, employeeId) => [
        { type: "Leave", id: `BALANCE_${employeeId}` },
      ],
    }),
 
    // Keep per-key helper for older callers — maps from company-dropdown lists
    getLeaveDailyFilterOptions: build.query<
      LeaveDailyOption[],
      { key: LeaveDailyFilterKey }
    >({
      async queryFn({ key }, _api, _extra, baseQuery) {
        const result = await baseQuery({
          url: `${LEAVE_DAILY_BASE_PATH}/company-dropdown-data`,
          method: "GET",
        });
        if (result.error) return { error: result.error };
 
        const root = asRecord(result.data) ?? {};
        const data = asRecord(root.data) ?? root;
 
        const map: Record<LeaveDailyFilterKey, unknown> = {
          branch: data.branches ?? data.Branches,
          salaryStructure: data.salaryStructures ?? data.SalaryStructures,
          leave: data.leaveTypes ?? data.LeaveTypes,
          attendance: data.attendanceStatuses ?? data.AttendanceStatuses,
          designation: data.designations ?? data.Designations,
          empStatus: data.employeeStatuses ?? data.EmployeeStatuses,
        };
 
        return { data: toOptions(map[key]) };
      },
      providesTags: ["Leave"],
    }),
  }),
});
 
export const {
  useGetAdminMonthlyLeaveCalendarQuery,
  useGetLeaveMasterDataQuery,
  useGetDailyMonthsQuery,
  useGetDailyLeaveTypesQuery,
  useGetDailyDayTypesQuery,
  useGetDailyEmployeesQuery,
  useGetDailyLeaveFormQuery,
  useSaveDailyLeaveFormMutation,
  useApplyDailyLeaveMutation,
  useBulkLeaveRequestMutation,
  useBulkLeaveRequestDownloadMutation,
  useReprocessDailyLeaveMutation,
  useImportDailyLeaveMutation,
  useGetLeaveDailyFilterOptionsQuery,
  useGetCompanyDropdownDataQuery,
  useGetEmployeeLeaveBalanceQuery,
} = leaveDailyApi;
 
export const getLeaveDaily = async (
  _filters: LeaveDailyFilters,
  _pageNumber = 1,
  _pageSize = 10,
): Promise<LeaveDailyResponse> => {
  void _filters;
  void _pageNumber;
  void _pageSize;
  throw new Error("Leave Daily API endpoint is not configured yet.");
};
 