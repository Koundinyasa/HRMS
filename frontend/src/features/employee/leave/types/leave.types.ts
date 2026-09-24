// ===============================
// Leave Types API
// ===============================

export interface LeaveType {
  ID: number;
  Name: string;
  Code: string;
  Description: string;
  AnnualQuota: number | null;
  CarryForwardAllowed: boolean;
  EncashmentAllowed: boolean;
}

// ===============================
// Holiday List API
// ===============================

export interface Holiday {
  HolidayId: number;
  HolidayDate: string;
  HolidayName: string;
  StateCode: string;
  HolidayType: string;
  HolidayYear: number;
  IsOptional: boolean;
}

// ===============================
// Leave Status API
// ===============================

export interface LeaveStage {
  LevelNo: number;
  StageName: string;
  StageState: string;
  ApproverId: string;
}

export interface LeaveApplication {
  Id: number;
  OverallStatus: string;
  LeaveName: string;
  FromDate: string;
  ToDate: string;
  AppliedDate: string;
  TotalLevels: number;
  CurrentLevelNo?: number;
  Stages: LeaveStage[];

  [key: string]:
  | string
  | number
  | LeaveStage[]
  | undefined;
}

export interface LeaveStatusResponse {
  LeaveApplications: LeaveApplication[];
}

// ===============================
// Leave History API
// ===============================

export interface LeaveHistoryField {
  label: string;
  value: string | number | null;
}

export interface LeaveHistoryRecord {
  fields: LeaveHistoryField[];
}

export interface LeaveHistorySection {
  title: string;
  records: LeaveHistoryRecord[];
}

export interface LeaveHistoryResponse {
  sections: LeaveHistorySection[];
}

// ===============================
// Leave Balance API
// ===============================

export interface LeaveBalanceField {
  label: string;
  value: string | number | null;
}

export interface LeaveBalanceRecord {
  fields: LeaveBalanceField[];
}

export interface LeaveBalanceSection {
  title: string;
  records: LeaveBalanceRecord[];
}

export interface LeaveBalanceResponse {
  sections: LeaveBalanceSection[];
}

// ===============================
// Leave Apply Form
// ===============================

export interface LeaveApplyForm {
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  isHalfDay: boolean;
  sessionFrom: string;
  sessionTo: string;

  attachment: File | null;
}

// ===============================
// Apply Leave API
// ===============================

export interface ApplyLeavePayload {
  leaveTypeId: number;
  fromDate: string;
  toDate: string;
  reason: string;
  isHalfDay: "true" | "false";
  sessionFrom: string;
  sessionTo: string;
  attachment: File | null;
}

export interface ApplyLeaveResponse {
  StatusCode: number;
  Message: string;
  LeaveApplicationId: number;
  NotificationId: number;
}
// ===============================
// Apply For Employee (manager / HR)
// ===============================
 
export interface ReportingEmployee {
  EmployeeID: string;
  EmployeeName: string;
}
 
export interface HrApplyLeavePayload extends ApplyLeavePayload {
  employeeId: string;
  isHRForceApply?: 0 | 1;
}

// GET /employee/leave/employee-details — three recordsets of raw rows.
export interface EmployeeDetails {
  MobileNo: string | null;
  Email: string | null;
  BranchName: string | null;
  DesignationName: string | null;
  PolicyName: string | null;
}
 
export interface EmployeeLeaveBalanceRow {
  LeaveName: string;
  OpeningBalance: number | null;
  Accrued: number | null;
  Availed: number | null;
  Adjusted: number | null;
  Encashed: number | null;
  ClosingBalance: number | null;
}
 
export interface EmployeeLeaveHistoryRow {
  LeaveId: string;
  LeaveTypeName: string;
  FromDate: string;
  ToDate: string;
  NoOfDays: number;
  AppliedDate: string;
  Reason: string | null;
  Status: string;
  ActionBy: string | null;
}
 
export interface EmployeeLeaveDetailsResponse {
  employeeDetails: EmployeeDetails[];
  employeeLeaveBalance: EmployeeLeaveBalanceRow[];
  employeeLeaveHistory: EmployeeLeaveHistoryRow[];
}

// ===============================
// Withdraw Leave API
// ===============================

export interface WithdrawLeavePayload {
  leaveApplicationId: number;
  actionId: number;
  reason: string;
}

export interface WithdrawLeaveResponse {
  StatusCode: number;
  Message: string;
}

// ===============================
// Component Props
// ===============================

export interface DateFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  isInvalid?: boolean;
  disablePreviousYears?: boolean;
  initialMonth?: string;
  holidays?: Map<string, { name: string; isOptional: boolean }>;
  inputClassName?: string;
}

export interface LeaveNavItem {
  label: string;
  path: string;
}

// ===============================
// Withdraw Leave Dialog
// ===============================

export interface WithdrawLeaveData {
  leaveApplicationId: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: string | number;
  reason: string;
}

export interface WithdrawLeaveDialogProps {
  open: boolean;
  onClose: () => void;
  leave: WithdrawLeaveData | null;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
  record: LeaveHistoryRecord | null;
  
}

export interface LeaveHistoryFieldMap {
  leaveApplicationId: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number | string;
  reason: string;
}

export interface LeaveApprovalTimelineProps {
  leave: LeaveApplication;
}

export interface ApplyForEmployeeProps {
  id?: string;
  employees: ReportingEmployee[];
  value: string;
  onChange: (employeeId: string) => void;
  loading?: boolean;
  isInvalid?: boolean;
  placeholder?: string;
}
 
export interface CancelLeaveDialogProps {
  open: boolean;
  onClose: () => void;
  leave: LeaveApplication;
}
 
export interface EmployeeInfoCardProps {
  employee: ReportingEmployee | null;
  details?: EmployeeDetails | null;
  loading?: boolean;
}
 
export interface LeaveStatusCardProps {
  leave: LeaveApplication;
  defaultExpanded?: boolean;
}
 
export interface LeaveSummaryTableProps {
  balances: LeaveBalanceSection | null;
  loading?: boolean;
}
 
export interface LeaveHistoryTableProps {
  // Supplied when viewing another employee's history; falls back to own.
  section?: LeaveHistorySection | null;
  loading?: boolean;
}
 
export interface LeaveBalanceCardProps {
  balances: LeaveBalanceSection | null;
}

