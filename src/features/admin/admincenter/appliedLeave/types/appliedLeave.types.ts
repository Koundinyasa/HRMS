// frontend/src/features/admin/admincenter/appliedLeave/types/appliedLeave.types.ts

export interface ReportingEmployee {
  EmployeeID: string;
  EmployeeName?: string;
  FullName?: string;
  ShortName?: string;
  [key: string]: unknown;
}

export interface LeaveType {
  ID: number;
  Name: string;
  [key: string]: unknown;
}

export interface EmployeeDetails {
  EmployeeID?: string;
  FullName?: string;
  ShortName?: string;
  Email?: string;
  MobileNumber?: string;
  Mobile?: string;
  Department?: string;
  Designation?: string;
   DesignationName?: string;
  Branch?: string;
  BranchName?: string;
  CompanyName?: string;
  PolicyName?: string;
  [key: string]: unknown;
}

export interface EmployeeLeaveDetailsResponse {
  employeeDetails: EmployeeDetails[];
  employeeLeaveBalance?: LeaveBalance[];
  employeeLeaveHistory?: EmployeeLeaveHistoryRow[];
}

export interface LeaveApplyForm {
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
  isHalfDay: boolean;
  sessionFrom: string;
  sessionTo: string;
  attachment?: File | null;
}

export interface HrApplyLeavePayload {
  employeeId: string;
  leaveTypeId: number;
  fromDate: string;
  toDate: string;
  reason: string;
  isHalfDay: "true" | "false";
  sessionFrom: string;
  sessionTo: string;
  attachment: File | null;
  isHRForceApply: 0 | 1;
}

export interface ApplyLeaveResponse {
  StatusCode?: number;
  Message?: string;
  LeaveApplicationId?: number;
}

export interface ApplyForEmployeeSelectorProps {
  id?: string;
  employees: ReportingEmployee[];
  value: string;
  onChange: (employeeId: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export interface DateFieldProps {
  id: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  align?: "left" | "right";
  initialMonth?: string;
}

export interface EmployeeInfoCardProps {
  employee: ReportingEmployee | null;
  details?: EmployeeDetails | null;
  loading?: boolean;
}

export interface LeaveBalance {
  LeaveName: string;
  OpeningBalance: number | null;
  Accrued: number | null;
  Availed: number | null;
  Adjusted: number | null;
  Encashed: number | null;
  ClosingBalance: number | null;
}

export interface LeaveBalanceCardProps {
  balances: LeaveBalance[];
}

export interface EmployeeLeaveHistoryRow {
  LeaveId: number | string;
  LeaveTypeName: string;
  FromDate: string;
  ToDate: string;
  NoOfDays: number;
  AppliedDate: string;
  Reason?: string | null;
  Status?: string | null;
  ActionBy?: string | null;
}
export interface LeaveHistoryTableProps {
  history: EmployeeLeaveHistoryRow[];
  loading?: boolean;
}

export interface LeaveSummaryTableProps {
  balances: LeaveBalance[];
  loading?: boolean;
}
