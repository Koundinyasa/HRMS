// // auditLog.service.ts
// import type { AuditLogApiResponse, AuditLogFilterState } from "../types/auditLog";

// interface FetchAuditLogParams {
//   reportType: string;
//   filters: AuditLogFilterState;
//   page: number;
//   pageSize: number;
// }

// const BASE_URL = "/api/insights/leave-report";

// export async function fetchAuditLog(
//   params: FetchAuditLogParams
// ): Promise<AuditLogApiResponse> {
//   const query = new URLSearchParams({
//     page: String(params.page),
//     pageSize: String(params.pageSize),
//     ...(params.filters.search ? { search: params.filters.search } : {}),
//     ...(params.filters.employee.length
//       ? { employee: params.filters.employee.join(",") }
//       : {}),
//     ...(params.filters.action.length
//       ? { action: params.filters.action.join(",") }
//       : {}),
//   });

//   const res = await fetch(
//     `${BASE_URL}/${params.reportType}/audit-log?${query.toString()}`
//   );

//   if (!res.ok) {
//     throw new Error(`Failed to fetch audit log for ${params.reportType}: ${res.status}`);
//   }

//   return res.json();
// }

// export async function exportAuditLog(
//   reportType: string,
//   format: "pdf" | "excel"
// ): Promise<Blob> {
//   const query = new URLSearchParams({ format });
//   const res = await fetch(`${BASE_URL}/${reportType}/audit-log/export?${query.toString()}`);

//   if (!res.ok) {
//     throw new Error(`Failed to export audit log for ${reportType} as ${format}`);
//   }

//   return res.blob();
// }














import type { AuditLogApiResponse, AuditLogFilterState } from "../types/auditLog";

interface FetchAuditLogParams {
  reportType: string;
  filters: AuditLogFilterState;
  page: number;
  pageSize: number;
}

/** Frontend reportType → backend audit path */
const AUDIT_ENDPOINT: Record<string, string> = {
  "top-attendance": "topattendance/auditlog",
};

const BASE_URL = "/api/reports/leavereport";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchAuditLog(
  params: FetchAuditLogParams
): Promise<AuditLogApiResponse> {
  const path =
    AUDIT_ENDPOINT[params.reportType] ?? `${params.reportType}/auditlog`;

  const q = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.filters.search) q.set("search", params.filters.search);
  if (params.filters.employee.length) {
    q.set("employee", params.filters.employee.join(","));
  }
  if (params.filters.action.length) {
    q.set("action", params.filters.action.join(","));
  }

  const res = await fetch(`${BASE_URL}/${path}?${q.toString()}`, {
    credentials: "include",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch audit log for ${params.reportType}: ${res.status}`
    );
  }

  return res.json();
}

export async function exportAuditLog(
  reportType: string,
  format: "pdf" | "excel"
): Promise<Blob> {
  const path =
    AUDIT_ENDPOINT[reportType] ?? `${reportType}/auditlog`;

  const q = new URLSearchParams({ format });

  const res = await fetch(`${BASE_URL}/${path}?${q.toString()}`, {
    credentials: "include",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to export audit log for ${reportType} as ${format}`
    );
  }

  return res.blob();
}