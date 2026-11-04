// export interface LeaveDailyRow {
//   id: number | string;
//   employeeId: number | string;
//   employeeName: string;
//   employeeCode?: string;
//   department?: string;
//   designation?: string;
//   leaveType?: string;
//   leaveDate?: string;
//   status?: string;
//   duration?: number;
//   remarks?: string;
// }

// export interface LeaveDailyFilters {
//   month: string;
//   leavePolicyId?: number | string;
//   employeeId?: number | string;
//   departmentId?: number | string;
//   leaveTypeId?: number | string;
//   status?: string;
// }

// export interface LeaveDailyResponse {
//   data: LeaveDailyRow[];
//   totalCount: number;
//   pageNumber: number;
//   pageSize: number;
// }

// export interface LeaveDailyPagination {
//   pageNumber: number;
//   pageSize: number;
//   totalCount: number;
// }


















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
  /** "Sep/2026" or "2026-09" */
  month: string;
  leavePolicyId?: number | string;
  employeeId?: number | string;
  departmentId?: number | string;
  leaveTypeId?: number | string;
  status?: string;
  /** Used by POST monthly-leave-calendar */
  branchId?: number | string;
  salaryStructureId?: number | string;
  designationId?: number | string;
  employmentStatusId?: number | string;
  attendanceTypeId?: number | string;
}

/** Body for POST monthly-leave-calendar (GetMonthlyLeaveCalendarDto) */
export interface MonthlyLeaveCalendarDto {
  year: number;
  month: number;
  branchId?: number | string | null;
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

export interface FilterOption {
  id: number | string;
  name: string;
}

/** Dropdown data for Branch / Designation / Emp Status / etc. */
export interface LeaveDailyFilterMasters {
  branches: FilterOption[];
  designations: FilterOption[];
  employmentStatuses: FilterOption[];
  departments: FilterOption[];
  salaryStructures: FilterOption[];
  leaveTypes: FilterOption[];
  attendanceTypes: FilterOption[];
  leavePolicies: FilterOption[];
}
