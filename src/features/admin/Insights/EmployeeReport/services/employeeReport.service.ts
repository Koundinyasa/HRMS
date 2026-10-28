// employeeReport.service.ts
import type { EmployeeReportApiResponse } from "../types/employeeReport";
import type { ReportFilterState } from "../types/filters";

interface FetchEmployeeReportParams {
  reportType: string;
  filters: ReportFilterState;
  page: number;
  pageSize: number;
}

// NOTE: this mirrors the sibling LeaveReport module's convention
// (BASE_URL = "/api/reports/leavereport" + "/<endpoint>"). Confirm the
// exact backend route/slugs against your actual controller before relying
// on this in production — these slugs are provisional.
const BASE_URL = "/api/reports/employeereport";

/** Frontend reportType → backend path under /api/reports/employeereport */
const REPORT_TYPE_TO_ENDPOINT: Record<string, string> = {
  "employee-report-list": "list",
  "employee-custom-report": "custom",
  "employee-id-card": "idcard",
  "employee-profile-report": "profile",
  "employee-dob-report": "dob",
  "employee-doj-report": "doj",
  "employee-dol-report": "dol",
  "resignation-report": "resignation",
  "login-report": "login",
  "login-not-disabled-report": "loginnotdisabled",
  "reporting-authority-report": "reportingauthority",
  "classification-report": "classification",
  "employee-hr-category-report": "hrcategory",
};

function getEndpoint(reportType: string): string {
  const endpoint = REPORT_TYPE_TO_ENDPOINT[reportType];
  if (!endpoint) throw new Error(`Unknown reportType: ${reportType}`);
  return endpoint;
}

function buildQuery(params: {
  page?: number;
  pageSize?: number;
  filters?: ReportFilterState;
  format?: string;
}): string {
  const q = new URLSearchParams();

  if (params.page != null) q.set("page", String(params.page));
  if (params.pageSize != null) q.set("pageSize", String(params.pageSize));
  if (params.format) q.set("format", params.format);

  const f = params.filters;
  if (f) {
    if (f.search) q.set("search", f.search);
    if (f.fromDate) q.set("fromDate", f.fromDate);
    if (f.toDate) q.set("toDate", f.toDate);
    if (f.status?.length) q.set("status", f.status.join(","));
  }

  return q.toString();
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchEmployeeReportData(
  params: FetchEmployeeReportParams
): Promise<EmployeeReportApiResponse> {
  const endpoint = getEndpoint(params.reportType);
  const query = buildQuery({
    page: params.page,
    pageSize: params.pageSize,
    filters: params.filters,
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

export async function exportEmployeeReport(
  reportType: string,
  format: "pdf" | "excel",
  params: Omit<FetchEmployeeReportParams, "page" | "pageSize">
): Promise<Blob> {
  const endpoint = getEndpoint(reportType);
  const query = buildQuery({
    filters: params.filters,
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