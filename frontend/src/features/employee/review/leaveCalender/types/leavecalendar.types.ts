import type { Dispatch, SetStateAction } from "react";

// ===============================
// Monthly Leave Calendar Params
// ===============================

export interface UseMonthlyLeaveCalendarParams {
  companyId: number;
  year?: number;
  month?: number;
  branchId?: number;
}

// ===============================
// Employee Attendance Count Params
// ===============================

export interface GetEmployeeAttendanceCountParams {
  year?: number;
  month?: number;
  branchId?: number;
}
export interface LeaveCalendarEmployee {
  EmployeeID: string;
  FullName: string;
  [dayKey: string]: string | undefined;
}

// ===============================
// Employee Attendance Count - raw API record
// ===============================

export interface AttendanceCountEmployee extends Record<string, unknown> {}

export interface EmployeeAttendanceCountResponse {
  success: boolean;
  message: string;
  data: AttendanceCountEmployee[];
}

// ===============================
// Attendance History - normalized record used by the UI
// ===============================

export interface AttendanceHistoryEmployee {
  employeeId: string;
  employeeName: string;
  present: number;
  absent: number;
}

// ===============================
// A single calendar day column, e.g. { date: 1, weekday: "Sat", key: "1 Sat" }
// ===============================

export interface LeaveCalendarDay {
  date: number;
  weekday: string;
  key: string;
}

// ===============================
// Component Props
// ===============================

export interface LeaveCalendarHeaderProps {
  selectedMonth: number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
}

export interface LeaveCalendarSearchProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export interface LeaveCalendarTableProps {
  employees: LeaveCalendarEmployee[];
  days: LeaveCalendarDay[];
}

export interface EmployeeRowProps {
  employee: LeaveCalendarEmployee;
  days: LeaveCalendarDay[];
}

export interface StatusBadgeProps {
  status: string | null | undefined;
}

export interface LeaveCalendarFooterProps {
  totalItems: number;
  currentPage: number;
  rowsPerPage: number;
  legendCodes: string[];
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export interface LeaveStatusConfig {
  code: string;
  label: string;
  className?: string;
}
