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
  HolidayDate: string;
  HolidayName: string;
  HolidayType: string;
  StateCode: string;
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