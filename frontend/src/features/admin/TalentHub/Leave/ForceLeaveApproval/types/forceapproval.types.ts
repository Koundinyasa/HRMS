export type ForceLeaveApprovalTab =
  | "applied"
  | "cancellation";

export type ForceLeaveApprovalMonthTab =
  | "current"
  | "non-current";

export interface ForceLeaveApprovalRecord {
  id: number;
  approverName: string;
  employeeId: string;
  employeeName: string;
  leaveName: string;
  date: string;
  days: string;
}

export interface ForceLeaveApprovalFilters {
  search: string;
  branchId?: number;
  salaryStructureId?: number;
  leaveId?: number;
  attendanceId?: number;
  designationId?: number;
  employmentStatusId?: number;
}

export interface ForceLeaveApprovalPagination {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ForceLeaveApprovalResponse {
  data: ForceLeaveApprovalRecord[];
  pagination: ForceLeaveApprovalPagination;
}

export interface ForceLeaveApprovalActionRequest {
  ids: number[];
  action: "approve" | "reject";
}