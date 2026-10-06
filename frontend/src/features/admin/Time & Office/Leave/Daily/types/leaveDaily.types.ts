export interface LeaveDailyRow {
  id: number | string;
  employeeId: number | string;
  employeeName: string;
  employeeCode?: string;
  department?: string;
  designation?: string;
  leaveType?: string;
  leaveDate?: string;
  status?: string;
  duration?: number;
  remarks?: string;
}

export interface LeaveDailyFilters {
  month: string;
  leavePolicyId?: number | string;
  employeeId?: number | string;
  departmentId?: number | string;
  leaveTypeId?: number | string;
  status?: string;
}

export interface LeaveDailyResponse {
  data: LeaveDailyRow[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface LeaveDailyPagination {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}