// // leaveReport.service.ts
// import type { LeaveReportApiResponse } from "../types/leaveReport";
// import type { ReportFilterState, GroupByLeavePolicyState } from "../types/filters";

// interface FetchLeaveReportParams {
//   reportType: string;
//   fromMonth: string;
//   toMonth: string;
//   filters: ReportFilterState;
//   groupBy: GroupByLeavePolicyState;
//   page: number;
//   pageSize: number;
// }

// const BASE_URL = "/api/insights/leave-report";

// export async function fetchLeaveReportData(
//   params: FetchLeaveReportParams
// ): Promise<LeaveReportApiResponse> {
//   const query = new URLSearchParams({
//     fromMonth: params.fromMonth,
//     toMonth: params.toMonth,
//     page: String(params.page),
//     pageSize: String(params.pageSize),
//     ...(params.filters.search ? { search: params.filters.search } : {}),
//   });

//   const res = await fetch(`${BASE_URL}/${params.reportType}?${query.toString()}`);

//   if (!res.ok) {
//     throw new Error(`Failed to fetch ${params.reportType}: ${res.status}`);
//   }

//   return res.json();
// }

// export async function exportLeaveReport(
//   reportType: string,
//   format: "pdf" | "excel",
//   params: Omit<FetchLeaveReportParams, "page" | "pageSize">
// ): Promise<Blob> {
//   const query = new URLSearchParams({
//     fromMonth: params.fromMonth,
//     toMonth: params.toMonth,
//     format,
//   });

//   const res = await fetch(`${BASE_URL}/${reportType}/export?${query.toString()}`);

//   if (!res.ok) {
//     throw new Error(`Failed to export ${reportType} as ${format}`);
//   }

//   return res.blob();
// }













import type { LeaveReportApiResponse } from "../types/leaveReport";
import type { ReportFilterState, GroupByLeavePolicyState } from "../types/filters";

interface FetchLeaveReportParams {
  reportType: string;
  fromMonth: string;
  toMonth: string;
  filters: ReportFilterState;
  groupBy: GroupByLeavePolicyState;
  page: number;
  pageSize: number;
}

/** Frontend reportType → backend path under /api/reports/leavereport */
const REPORT_TYPE_TO_ENDPOINT: Record<string, string> = {
  "leave-allotment-report": "allotment",
  "leave-availed-report": "availed",
  "leave-lapsed-report": "lapsed",
  "leave-encashed-report": "encashed",
  "leave-summary-report": "summary",
  "leave-summary-report-between-months": "summarybetweenmonths",
  "leave-summary-report-detailed": "summarydetailed",
  "leave-history-report-date-wise": "historydatewise",
  "leave-history-report-month-wise": "historydatewise",
  "attendance-independent-report": "attendanceindependent",
  "hourly-attendance-report": "hourlyattendance",
  "attendance-integration-report": "attendanceintegration",
  "over-time-report": "overtime",
  "late-in-early-out-report": "lateinearlyout",
  "late-in-early-out-report-monthly": "lateinearlyoutmonthly",
  "exception-report-reconcile": "exceptionreconcile",
  "exception-report-reconcile-monthly": "exceptionreconcile",
  "top-attendance": "topattendance",
  "top-leave-taken": "topleavetaken",
};

const BASE_URL = "/api/reports/leavereport";

function getEndpoint(reportType: string): string {
  const endpoint = REPORT_TYPE_TO_ENDPOINT[reportType];
  if (!endpoint) throw new Error(`Unknown reportType: ${reportType}`);
  return endpoint;
}

function buildQuery(params: {
  fromMonth?: string;
  toMonth?: string;
  page?: number;
  pageSize?: number;
  filters?: ReportFilterState;
  groupBy?: GroupByLeavePolicyState;
  format?: string;
}): string {
  const q = new URLSearchParams();

  if (params.fromMonth) q.set("fromMonth", params.fromMonth);
  if (params.toMonth) q.set("toMonth", params.toMonth);
  if (params.page != null) q.set("page", String(params.page));
  if (params.pageSize != null) q.set("pageSize", String(params.pageSize));
  if (params.format) q.set("format", params.format);

  const f = params.filters;
  if (f) {
    if (f.search) q.set("search", f.search);
    if (f.query) q.set("query", f.query);
    if (f.branch?.length) q.set("branch", f.branch.join(","));
    if (f.salaryStructure?.length) q.set("salaryStructure", f.salaryStructure.join(","));
    if (f.leave?.length) q.set("leave", f.leave.join(","));
    if (f.attendance?.length) q.set("attendance", f.attendance.join(","));
    if (f.designation?.length) q.set("designation", f.designation.join(","));
    if (f.empStatus?.length) q.set("empStatus", f.empStatus.join(","));
  }

  const g = params.groupBy;
  if (g?.employeeLeavePolicy) q.set("employeeLeavePolicy", "true");
  if (g?.internLeavePolicy) q.set("internLeavePolicy", "true");

  return q.toString();
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchLeaveReportData(
  params: FetchLeaveReportParams
): Promise<LeaveReportApiResponse> {
  const endpoint = getEndpoint(params.reportType);
  const query = buildQuery({
    fromMonth: params.fromMonth,
    toMonth: params.toMonth,
    page: params.page,
    pageSize: params.pageSize,
    filters: params.filters,
    groupBy: params.groupBy,
  });

  const res = await fetch(`${BASE_URL}/${endpoint}?${query}`, {
    credentials: "include",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${params.reportType}: ${res.status}`);
  }

  return res.json();
}

export async function exportLeaveReport(
  reportType: string,
  format: "pdf" | "excel",
  params: Omit<FetchLeaveReportParams, "page" | "pageSize">
): Promise<Blob> {
  const endpoint = getEndpoint(reportType);
  const query = buildQuery({
    fromMonth: params.fromMonth,
    toMonth: params.toMonth,
    filters: params.filters,
    groupBy: params.groupBy,
    format,
  });

  const res = await fetch(`${BASE_URL}/${endpoint}?${query}`, {
    credentials: "include",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to export ${reportType} as ${format}`);
  }

  return res.blob();
}