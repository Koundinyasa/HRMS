// /** Request parameters sent to the pending leave requests API. */
// export interface PendingLeaveRequestParams {
//   fromDate: string;
//   toDate: string;
// }

// /** Raw leave-request record returned by the backend API. */
// export interface PendingLeaveRequest {
//   ApprovalId?: string | number;
//   ApprovalID?: string | number;
//   LeaveId?: string | number;
//   LeaveID?: string | number;
//   Id?: string | number;
//   EmployeeId?: string | number;
//   EmployeeName?: string;
//   LeaveName?: string;
//   FromDate?: string;
//   ToDate?: string;
//   NoDays?: number | string;
//   NoOfDays?: number | string;
//   AppliedDate?: string;
//   Reason?: string | null;
// }

// /** Fields used by the requisition UI. */
// export interface Requisition {
//   id: string;
//   approvalId: number;
//   leaveId: number;
//   employeeId: string;
//   employeeName: string;
//   leaveName: string;
//   date: string;
//   days: number;
//   reason: string;
// }

// /** Props for the requisition table. */
// export interface RequisitionTableProps {
//   requisitions: Requisition[];
//   selectedIds: string[];
//   onSelectAll: () => void;
//   onSelect: (id: string) => void;
// }

// /** Props for the requisition toolbar. */
// export interface RequisitionToolbarProps {
//   search: string;
//   onSearchChange: (value: string) => void;
//   onApprove: () => void;
//   onReject: () => void;
//   onHistory: () => void;
//   hasSelection: boolean;
//   approved?: boolean;
// }

// /** Result returned by requisition date validation. */
// export interface RequisitionValidationResult {
//   isValid: boolean;
//   message: string;
// }

// export type PendingLeaveRequestsResponse =
//   PendingLeaveRequest[];


/** Request parameters sent to the pending leave requests API. */
export interface PendingLeaveRequestParams {
  fromDate: string;
  toDate: string;
}

/** Raw leave-request record returned by the backend API. */
export interface PendingLeaveRequest {
  ApprovalId?: string | number;
  ApprovalID?: string | number;
  approvalId?: string | number;

  LeaveId?: string | number;
  LeaveID?: string | number;
  leaveId?: string | number;

  Id?: string | number;
  id?: string | number;

  EmployeeId?: string | number;
  employeeId?: string | number;

  ApproverEmployeeId?: string | number;
  ApproverEmployeeID?: string | number;
  approverEmployeeId?: string | number;

  EmployeeName?: string;
  employeeName?: string;

  LeaveName?: string;
  leaveName?: string;

  FromDate?: string;
  fromDate?: string;

  ToDate?: string;
  toDate?: string;

  NoDays?: number | string;
  NoOfDays?: number | string;

  AppliedDate?: string;
  appliedDate?: string;

  Reason?: string | null;
  reason?: string | null;
}

/** Fields used by the requisition UI. */
export interface Requisition {
  /** Unique UI identifier used for checkbox selection. */
  id: string;

  /** Actual backend approval record ID. */
  approvalId: number;

  /** Leave record ID. */
  leaveId: number;

  /** Employee who applied for leave. */
  employeeId: string;

  /** Employee who applied for leave. */
  employeeName: string;

  /** Leave type/name. */
  leaveName: string;

  /** Display date for the leave request. */
  date: string;

  /** Number of leave days. */
  days: number;

  /** Reason provided for the leave. */
  reason: string;

  /** Employee ID of the logged-in approver. */
  approverEmployeeId?: string;
}

/** Payload used for approving or rejecting a leave request. */
export interface LeaveActionRequest {
  approvalId: number;
  approverEmployeeId: string;
  actionStatusId: number;
  remarks?: string;
}

/** Props for the requisition table. */
export interface RequisitionTableProps {
  requisitions: Requisition[];
  selectedIds: string[];
  onSelectAll: () => void;
  onSelect: (id: string) => void;
}

/** Props for the requisition toolbar. */
export interface RequisitionToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onHistory: () => void;
  hasSelection: boolean;
  approved?: boolean;
}

/** Result returned by requisition date validation. */
export interface RequisitionValidationResult {
  isValid: boolean;
  message: string;
}

/** Result returned by the pending leave requests API. */
export type PendingLeaveRequestsResponse =
  PendingLeaveRequest[];