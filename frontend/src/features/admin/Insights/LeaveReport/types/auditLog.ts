// auditLog.ts
export interface AuditLogEntry {
  id: string;
  /** e.g. "Top Attendance Viewed", "Leave Allotment Report Exported" */
  recordDetails: string;
  /** Human readable diff/summary of what changed, if anything. */
  recordChanges?: string;
  /** ISO timestamp of when the action occurred. */
  actionTime: string;
  /** Email/username of the person who performed the action. */
  user: string;
  /** Employee the record pertains to, if applicable. */
  employeeName?: string;
}

export interface AuditLogFilterState {
  search: string;
  employee: string[];
  action: string[];
}

export const DEFAULT_AUDIT_LOG_FILTERS: AuditLogFilterState = {
  search: "",
  employee: [],
  action: [],
};

export interface AuditLogApiResponse {
  data: AuditLogEntry[];
  totalCount: number;
}