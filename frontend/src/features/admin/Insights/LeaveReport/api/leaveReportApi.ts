import { baseApi } from "@/app/baseApi";
import type { LeaveReportRow } from "../types/leaveReport";
import type { ReportFilterState, GroupByLeavePolicyState } from "../types/filters";
import type { AuditLogEntry, AuditLogFilterState } from "../types/auditLog";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface LeaveReportQueryParams {
  fromMonth?: string;
  toMonth?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  query?: string;
  branch?: string[];
  salaryStructure?: string[];
  leave?: string[];
  attendance?: string[];
  designation?: string[];
  empStatus?: string[];
  employeeLeavePolicy?: boolean;
  internLeavePolicy?: boolean;
}

export interface LeaveReportApiResponse {
  data: LeaveReportRow[];
  totalCount: number;
}

export interface AuditLogQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  employee?: string[];
  action?: string[];
}

export interface AuditLogApiResponse {
  data: AuditLogEntry[];
  totalCount: number;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const buildParams = (
  params: LeaveReportQueryParams | AuditLogQueryParams
): Record<string, string> => {
  const q: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      if (value.length > 0) q[key] = value.join(",");
    } else if (typeof value === "boolean") {
      if (value) q[key] = "true";
    } else {
      q[key] = String(value);
    }
  });

  return q;
};

/** Map UI filters → backend query params (use in pages/hooks) */
export const mapFiltersToParams = (
  filters: ReportFilterState,
  groupBy: GroupByLeavePolicyState,
  fromMonth: string,
  toMonth: string,
  page: number,
  pageSize: number
): LeaveReportQueryParams => ({
  fromMonth,
  toMonth,
  page,
  pageSize,
  search: filters.search || undefined,
  query: filters.query || undefined,
  branch: filters.branch,
  salaryStructure: filters.salaryStructure,
  leave: filters.leave,
  attendance: filters.attendance,
  designation: filters.designation,
  empStatus: filters.empStatus,
  employeeLeavePolicy: groupBy.employeeLeavePolicy || undefined,
  internLeavePolicy: groupBy.internLeavePolicy || undefined,
});

// ─────────────────────────────────────────────────────────────
// RTK Query API
// baseUrl (VITE_API_URL) already has /api → paths start after that
// Final URL example: http://localhost:3001/api/reports/leavereport/allotment
// ─────────────────────────────────────────────────────────────

const BASE = "reports/leavereport";

export const leaveReportApi = baseApi.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    // ── Leave ───────────────────────────────────────────────
    getLeaveAllotment: builder.query<LeaveReportApiResponse, LeaveReportQueryParams>({
      query: (params) => ({
        url: `${BASE}/allotment`,
        params: buildParams(params),
      }),
    }),

    getLeaveAvailed: builder.query<LeaveReportApiResponse, LeaveReportQueryParams>({
      query: (params) => ({
        url: `${BASE}/availed`,
        params: buildParams(params),
      }),
    }),

    getLeaveLapsed: builder.query<LeaveReportApiResponse, LeaveReportQueryParams>({
      query: (params) => ({
        url: `${BASE}/lapsed`,
        params: buildParams(params),
      }),
    }),

    getLeaveEncashed: builder.query<LeaveReportApiResponse, LeaveReportQueryParams>({
      query: (params) => ({
        url: `${BASE}/encashed`,
        params: buildParams(params),
      }),
    }),

    getLeaveSummary: builder.query<LeaveReportApiResponse, LeaveReportQueryParams>({
      query: (params) => ({
        url: `${BASE}/summary`,
        params: buildParams(params),
      }),
    }),

    getLeaveSummaryBetweenMonths: builder.query<
      LeaveReportApiResponse,
      LeaveReportQueryParams
    >({
      query: (params) => ({
        url: `${BASE}/summarybetweenmonths`,
        params: buildParams(params),
      }),
    }),

    getLeaveSummaryDetailed: builder.query<
      LeaveReportApiResponse,
      LeaveReportQueryParams
    >({
      query: (params) => ({
        url: `${BASE}/summarydetailed`,
        params: buildParams(params),
      }),
    }),

    getLeaveHistoryDateWise: builder.query<
      LeaveReportApiResponse,
      LeaveReportQueryParams
    >({
      query: (params) => ({
        url: `${BASE}/historydatewise`,
        params: buildParams(params),
      }),
    }),

    // ── Attendance ──────────────────────────────────────────
    getAttendanceIndependent: builder.query<
      LeaveReportApiResponse,
      LeaveReportQueryParams
    >({
      query: (params) => ({
        url: `${BASE}/attendanceindependent`,
        params: buildParams(params),
      }),
    }),

    getHourlyAttendance: builder.query<LeaveReportApiResponse, LeaveReportQueryParams>({
      query: (params) => ({
        url: `${BASE}/hourlyattendance`,
        params: buildParams(params),
      }),
    }),

    getAttendanceIntegration: builder.query<
      LeaveReportApiResponse,
      LeaveReportQueryParams
    >({
      query: (params) => ({
        url: `${BASE}/attendanceintegration`,
        params: buildParams(params),
      }),
    }),

    // ── Additional ──────────────────────────────────────────
    getOvertime: builder.query<LeaveReportApiResponse, LeaveReportQueryParams>({
      query: (params) => ({
        url: `${BASE}/overtime`,
        params: buildParams(params),
      }),
    }),

    getLateInEarlyOut: builder.query<LeaveReportApiResponse, LeaveReportQueryParams>({
      query: (params) => ({
        url: `${BASE}/lateinearlyout`,
        params: buildParams(params),
      }),
    }),

    getLateInEarlyOutMonthly: builder.query<
      LeaveReportApiResponse,
      LeaveReportQueryParams
    >({
      query: (params) => ({
        url: `${BASE}/lateinearlyoutmonthly`,
        params: buildParams(params),
      }),
    }),

    getExceptionReconcile: builder.query<
      LeaveReportApiResponse,
      LeaveReportQueryParams
    >({
      query: (params) => ({
        url: `${BASE}/exceptionreconcile`,
        params: buildParams(params),
      }),
    }),

    // ── Top ─────────────────────────────────────────────────
    getTopAttendance: builder.query<LeaveReportApiResponse, LeaveReportQueryParams>({
      query: (params) => ({
        url: `${BASE}/topattendance`,
        params: buildParams(params),
      }),
    }),

    getTopLeaveTaken: builder.query<LeaveReportApiResponse, LeaveReportQueryParams>({
      query: (params) => ({
        url: `${BASE}/topleavetaken`,
        params: buildParams(params),
      }),
    }),

    // ── Audit log ───────────────────────────────────────────
    getTopAttendanceAuditLog: builder.query<
      AuditLogApiResponse,
      AuditLogQueryParams
    >({
      query: (params) => ({
        url: `${BASE}/topattendance/auditlog`,
        params: buildParams(params),
      }),
    }),
  }),
});

// ─────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────

export const {
  useGetLeaveAllotmentQuery,
  useGetLeaveAvailedQuery,
  useGetLeaveLapsedQuery,
  useGetLeaveEncashedQuery,
  useGetLeaveSummaryQuery,
  useGetLeaveSummaryBetweenMonthsQuery,
  useGetLeaveSummaryDetailedQuery,
  useGetLeaveHistoryDateWiseQuery,
  useGetAttendanceIndependentQuery,
  useGetHourlyAttendanceQuery,
  useGetAttendanceIntegrationQuery,
  useGetOvertimeQuery,
  useGetLateInEarlyOutQuery,
  useGetLateInEarlyOutMonthlyQuery,
  useGetExceptionReconcileQuery,
  useGetTopAttendanceQuery,
  useGetTopLeaveTakenQuery,
  useGetTopAttendanceAuditLogQuery,

  useLazyGetLeaveAllotmentQuery,
  useLazyGetLeaveAvailedQuery,
  useLazyGetLeaveLapsedQuery,
  useLazyGetLeaveEncashedQuery,
  useLazyGetLeaveSummaryQuery,
  useLazyGetLeaveSummaryBetweenMonthsQuery,
  useLazyGetLeaveSummaryDetailedQuery,
  useLazyGetLeaveHistoryDateWiseQuery,
  useLazyGetAttendanceIndependentQuery,
  useLazyGetHourlyAttendanceQuery,
  useLazyGetAttendanceIntegrationQuery,
  useLazyGetOvertimeQuery,
  useLazyGetLateInEarlyOutQuery,
  useLazyGetLateInEarlyOutMonthlyQuery,
  useLazyGetExceptionReconcileQuery,
  useLazyGetTopAttendanceQuery,
  useLazyGetTopLeaveTakenQuery,
  useLazyGetTopAttendanceAuditLogQuery,
} = leaveReportApi;