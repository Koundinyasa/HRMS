// export interface CreateAttendance {
//   attendanceName: string;
//   shortName: string;
//   salaryCalendarDayId: number;
//   attendanceTypeId: number;
//   independent: boolean;
//   ot2Enable: boolean;
//   overtime: boolean;
//   lateInEarlyOut: boolean;
// }

// export interface AttendanceIntegration {
//   description: string;
//   integrationTypeId: number;
//   url?: string;
//   userName?: string;
//   password?: string;
//   applicableAttendanceId: number;
//   present?: string;
//   absent?: string;
//   weeklyOff?: string;
//   holiday?: string;
//   skipHolidays?: boolean;
//   autoIntegrationHours?: number;
//   calculateOTId?: number;
//   refNo?: string;
//   processDate?: string;
//   firstHalf?: string;
//   secondHalf?: string;
//   otUnits?: string;
// }

// export interface ReconcileLeaveEmployee {
//   employeeId: number;
//   date: string;
// }

// export interface ReconcileLeaveUpdate {
//   leaveTypeId: number;
//   employees: ReconcileLeaveEmployee[];
// }


// // ── Add to attendance.types.ts ────────────────────────────────

// // Shared query params across all three Reconcile Leave tabs —
// // month/date range + the standard filter bar (Branch, Salary Structure,
// // Leave, Attendance, Designation, Emp Status) + free-text search.
// export interface ReconcileLeaveQueryParams {
//   month: string;      // e.g. "2026-09"
//   fromDate: string;   // e.g. "2026-09-01"
//   toDate: string;     // e.g. "2026-09-30"
//   search?: string;
//   query?: string;
//   branch?: string[];
//   salaryStructure?: string[];
//   leave?: string[];
//   attendance?: string[];
//   designation?: string[];
//   empStatus?: string[];
// }


// export interface MissingLeaveRow {
//   employeeId: string;
//   employeeName: string;
//   date: string;          
//   taStatus: string;      
//   workingHours: string;   
//   firstHalfIndicator: string | null;
//   secondHalfConfirmed: boolean;
// }


// export interface PenaltyLeaveDeductionRow {
//   employeeId: string;
//   employeeName: string;
//   date: string;
//   leaveType: string;
//   deductionDays: number;
//   reason?: string;
// }

// export interface PenaltyLeaveDeductionQueryParams extends ReconcileLeaveQueryParams {
//   leaveTypeId: number; 
// }

// export interface LeavePunchExistRow {
//   employeeId: string;
//   employeeName: string;
//   date: string;
//   workingHours: string;
//   hasPunchRecord: boolean;
//   appliedLeave: string; 
// }

export interface CreateAttendance {
  attendanceName: string;
  shortName: string;
  salaryCalendarDayId: number;
  attendanceTypeId: number;
  independent: boolean;
  ot2Enable: boolean;
  overtime: boolean;
  lateInEarlyOut: boolean;
}

export interface AttendanceIntegration {
  description: string;
  integrationTypeId: number;
  url?: string;
  userName?: string;
  password?: string;
  applicableAttendanceId: number;
  present?: string;
  absent?: string;
  weeklyOff?: string;
  holiday?: string;
  skipHolidays?: boolean;
  autoIntegrationHours?: number;
  calculateOTId?: number;
  refNo?: string;
  processDate?: string;
  firstHalf?: string;
  secondHalf?: string;
  otUnits?: string;
}

export interface ReconcileLeaveEmployee {
  employeeId: number;
  date: string;
}

export interface ReconcileLeaveUpdate {
  leaveTypeId: number;
  employees: ReconcileLeaveEmployee[];
}

// ── Reconcile Leave tabs ─────────────────────────────────────

// Shared query params across all three Reconcile Leave tabs —
// month/date range + the standard filter bar (Branch, Salary Structure,
// Leave, Attendance, Designation, Emp Status) + free-text search.
export interface ReconcileLeaveQueryParams {
  month: string;      // e.g. "2026-09"
  fromDate: string;   // e.g. "2026-09-01"
  toDate: string;     // e.g. "2026-09-30"
  search?: string;
  query?: string;
  branch?: string[];
  salaryStructure?: string[];
  leave?: string[];
  attendance?: string[];
  designation?: string[];
  empStatus?: string[];
}

// ---- Missing Leave tab ----
// Employees with no punch records and no leave applied.
export interface MissingLeaveRow {
  employeeId: string;
  employeeName: string;
  date: string;           // e.g. "03/Sep/2026"
  taStatus: string;        // e.g. "P+AB"
  workingHours: string;    // e.g. "8 Hr 48 Min"
  /** Colored swatch shown under "First Half" — yellow = present /
   *  checked in before the in-time. */
  firstHalfIndicator: string | null;
  /** Checkmark shown under "Second Half" — left before the out-time. */
  secondHalfConfirmed: boolean;
}

// ---- Penalty Leave Deduction tab ----
// ⚠️ GUESSED — no populated example was available (screenshot only showed
// the empty state). Confirm/replace once real API data is seen.
export interface PenaltyLeaveDeductionRow {
  employeeId: string;
  employeeName: string;
  date: string;
  leaveType: string;
  deductionDays: number;
  reason?: string;
}

export interface PenaltyLeaveDeductionQueryParams extends ReconcileLeaveQueryParams {
  leaveTypeId: number; // required — this tab only loads after a leave type is selected + Apply is clicked
}

// ---- Leave/Punch Exist tab ----
// Employees who have both punch records AND applied leave.
export interface LeavePunchExistRow {
  employeeId: string;
  employeeName: string;
  date: string;
  workingHours: string;
  /** Fingerprint icon shown when a punch record exists. */
  hasPunchRecord: boolean;
  appliedLeave: string; // e.g. "SL (Second Half)"
}