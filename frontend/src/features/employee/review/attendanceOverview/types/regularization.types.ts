// export type WorkStatus =
//   | "P"
//   | "AB"
//   | "WO"
//   | "GH"
//   | "W"
//   | "H"
//   | "CL"
//   | "SL"
//   | "PL"
//   | "AB/P"
//   | "P+AB"
//   | "-"
//   | string;

// export type OverviewColor =
//   | "emerald"
//   | "red"
//   | "amber"
//   | "blue"
//   | "sky"
//   | string;

// export type PunchType =
//   | "IN"
//   | "OUT"
//   | "In"
//   | "Out"
//   | string;

// // ============================================================
// // EMPLOYEE
// // ============================================================

// export interface Employee {
//   id: string;
//   name: string;
// }

// // ============================================================
// // ATTENDANCE DAY
// // ============================================================

// export interface AttendanceDay {
//   date: number;
//   day: string;
//   shift: string;
//   status: WorkStatus;
//   secondaryStatus?: WorkStatus;

//   checkIn?: string;
//   checkOut?: string;

//   overtime?: string;
//   overTime?: string;

//   grossWorkHours?: string;
//   workHours?: string;
//   breakHours?: string;

//   isWeekOff?: boolean;
//   isHoliday?: boolean;
// }

// // ============================================================
// // EMPLOYEE ATTENDANCE OVERVIEW
// // ============================================================
// //
// // Actual API response:
// //
// // [
// //   {
// //     "EmployeeID": "294663",
// //     "FullName": "K. Sriram Preetham",
// //     "1 Sat": "W",
// //     "2 Sun": "W",
// //     "3 Mon": "-",
// //     ...
// //     "11 Tue": "P",
// //     "12 Wed": "AB"
// //   }
// // ]
// //
// // The day fields are dynamic, so they are represented by
// // the index signature below.
// // ============================================================

// export interface AttendanceOverviewEmployee {
//   EmployeeID: string;
//   FullName: string;

//   [key: string]: string;
// }

// export type AttendanceOverviewResponse =
//   AttendanceOverviewEmployee[];

// // The hook will use the selected employee's overview row.
// // It can be null when no employee is selected.

// export type AttendanceOverviewData =
//   AttendanceOverviewEmployee | null;

// // ============================================================
// // MONTHLY OVERVIEW ITEM
// // ============================================================
// //
// // Kept because the employee punch dashboard response type
// // currently expects attendanceSummary.
// // We will only change this further if the actual dashboard
// // API response is provided.
// // ============================================================

// export interface MonthlyOverviewItem {
//   label?: string;
//   value?: string | number;
//   total?: string | number;
//   percent?: number;
//   name?: string;
//   count?: number | string;
//   hours?: string | number;

//   [key: string]: unknown;
// }

// // ============================================================
// // RAW / PROCESSED PUNCH
// // ============================================================
// //
// // Actual raw punch API response:
// //
// // {
// //   "PunchType": "IN",
// //   "OriginalTime": "09:47:39",
// //   "EntryType": "GPS",
// //   "Approverstatus": "Success"
// // }
// //
// // The API layer will transform those backend names into:
// //
// // {
// //   time: "09:47:39",
// //   type: "IN",
// //   source: "GPS",
// //   approverStatus: "Success"
// // }
// // ============================================================

// export interface PunchRecord {
//   time: string;
//   type: PunchType;
//   source: string;
//   approverStatus?: string;
// }

// // ============================================================
// // USE ATTENDANCE
// // ============================================================

// export interface UseAttendanceProps {
//   employeeId: string;
//   month: number;
//   year: number;

//   // Required by employeemonthlyattendancedetails.
//   // We will NOT hardcode this value.
//   classificationId: number;
// }

// // ============================================================
// // MONTHLY ATTENDANCE DETAILS PARAMS
// // ============================================================
// //
// // POST /review/employeemonthlyattendancedetails
// //
// // {
// //   employeeId,
// //   month,
// //   year,
// //   classificationId
// // }
// // ============================================================

// export interface MonthlyAttendanceParams {
//   employeeId: number;
//   month: number;
//   year: number;
//   classificationId: number;
// }

// // ============================================================
// // EMPLOYEE ATTENDANCE OVERVIEW PARAMS
// // ============================================================
// //
// // POST /review/employeeattendanceoverview
// //
// // {
// //   employeeId,
// //   year,
// //   month
// // }
// //
// // There is NO companyId.
// // ============================================================

// export interface AttendanceOverviewParams {
//   employeeId: string;
//   year: number;
//   month: number;
// }

// // ============================================================
// // EMPLOYEE PUNCH DASHBOARD PARAMS
// // ============================================================

// export interface PunchDashboardParams {
//   employeeId: string;
//   selectedDate?: string;
//   viewType?: string;
// }

// // ============================================================
// // EMPLOYEE PUNCH DASHBOARD RESPONSE
// // ============================================================
// //
// // Keep this until the actual /employeepunchdashboard response
// // is available. We should not invent its backend fields.
// // ============================================================

// export interface EmployeePunchDashboardResponse {
//   employeeProfile: Employee[];
//   attendanceSummary: MonthlyOverviewItem[];
//   punchRecords: PunchRecord[];
// }

// // ============================================================
// // RAW PUNCH PARAMS
// // ============================================================
// //
// // POST /review/employeerawpunches
// //
// // {
// //   "employeeId": "294663",
// //   "date": "2026-09-10"
// // }
// // ============================================================

// export interface RawPunchParams {
//   employeeId: string;
//   date: string;
// }

// // ============================================================
// // REPORTING EMPLOYEE
// // ============================================================
// //
// // Actual API response:
// //
// // [
// //   {
// //     "EmployeeID": "294676",
// //     "EmployeeName": "Mandapuram Divya"
// //   },
// //   {
// //     "EmployeeID": "284519",
// //     "EmployeeName": "Rakesh Peddi"
// //   },
// //   {
// //     "EmployeeID": "294623",
// //     "EmployeeName": "Tharun Nagarjunapu"
// //   },
// //   {
// //     "EmployeeID": "284512",
// //     "EmployeeName": "Varalaxmi Gumudala"
// //   }
// // ]
// //
// // Do NOT add classificationId, shift, policy, pattern etc.
// // because the API response does not provide them.
// // ============================================================

// export interface ReportingEmployee {
//   EmployeeID: string;
//   EmployeeName: string;
// }

export type WorkStatus =
  | "P"
  | "AB"
  | "WO"
  | "GH"
  | "W"
  | "H"
  | "CL"
  | "SL"
  | "PL"
  | "AB/P"
  | "P+AB"
  | "-"
  | string;

export type OverviewColor =
  | "emerald"
  | "red"
  | "amber"
  | "blue"
  | "sky"
  | string;

export type PunchType =
  | "IN"
  | "OUT"
  | "In"
  | "Out"
  | string;

// ============================================================
// EMPLOYEE
// ============================================================

export interface Employee {
  id: string;
  name: string;
  /** Optional – only present when the reporting-employees API returns it */
  classificationId?: number;
}

// ============================================================
// ATTENDANCE DAY
// ============================================================

export interface AttendanceDay {
  date: number;
  day: string;
  shift: string;
  status: WorkStatus;
  secondaryStatus?: WorkStatus;

  checkIn?: string;
  checkOut?: string;

  overtime?: string;
  overTime?: string;

  grossWorkHours?: string;
  workHours?: string;
  breakHours?: string;

  isWeekOff?: boolean;
  isHoliday?: boolean;
}

// ============================================================
// EMPLOYEE ATTENDANCE OVERVIEW
// ============================================================
//
// Actual API response:
//
// [
//   {
//     "EmployeeID": "294663",
//     "FullName": "K. Sriram Preetham",
//     "1 Sat": "W",
//     "2 Sun": "W",
//     "3 Mon": "-",
//     ...
//     "11 Tue": "P",
//     "12 Wed": "AB"
//   }
// ]
//
// The day fields are dynamic, so they are represented by
// the index signature below.
// ============================================================

export interface AttendanceOverviewEmployee {
  EmployeeID: string;
  FullName: string;

  [key: string]: string;
}

export type AttendanceOverviewResponse =
  AttendanceOverviewEmployee[];

// The hook will use the selected employee's overview row.
// It can be null when no employee is selected.

export type AttendanceOverviewData =
  AttendanceOverviewEmployee | null;

// ============================================================
// MONTHLY OVERVIEW ITEM
// ============================================================
//
// Kept because the employee punch dashboard response type
// currently expects attendanceSummary.
// We will only change this further if the actual dashboard
// API response is provided.
// ============================================================

export interface MonthlyOverviewItem {
  label?: string;
  value?: string | number;
  total?: string | number;
  percent?: number;
  name?: string;
  count?: number | string;
  hours?: string | number;

  [key: string]: unknown;
}

// ============================================================
// RAW / PROCESSED PUNCH
// ============================================================
//
// Actual raw punch API response:
//
// {
//   "PunchType": "IN",
//   "OriginalTime": "09:47:39",
//   "EntryType": "GPS",
//   "Approverstatus": "Success"
// }
//
// The API layer will transform those backend names into:
//
// {
//   time: "09:47:39",
//   type: "IN",
//   source: "GPS",
//   approverStatus: "Success"
// }
// ============================================================

export interface PunchRecord {
  time: string;
  type: PunchType;
  source: string;
  approverStatus?: string;
}

// ============================================================
// USE ATTENDANCE
// ============================================================

export interface UseAttendanceProps {
  employeeId: string;
  month: number;
  year: number;

  // Optional – only sent to the backend when > 0.
  // Sending 0 was causing 400 "Invalid Attendance".
  classificationId?: number;
}

// ============================================================
// MONTHLY ATTENDANCE DETAILS PARAMS
// ============================================================
//
// POST /attendance/employeemonthlyattendancedetails
//
// {
//   employeeId,
//   month,
//   year,
//   classificationId   // only included when > 0
// }
// ============================================================

export interface MonthlyAttendanceParams {
  employeeId: number;
  month: number;
  year: number;
  classificationId?: number;
}

// ============================================================
// EMPLOYEE ATTENDANCE OVERVIEW PARAMS
// ============================================================
//
// POST /attendance/employeeattendanceoverview
//
// {
//   employeeId,
//   year,
//   month
// }
//
// There is NO companyId.
// ============================================================

export interface AttendanceOverviewParams {
  employeeId: string;
  year: number;
  month: number;
}

// ============================================================
// EMPLOYEE PUNCH DASHBOARD PARAMS
// ============================================================

export interface PunchDashboardParams {
  employeeId: string;
  selectedDate?: string;
  viewType?: string;
}

// ============================================================
// EMPLOYEE PUNCH DASHBOARD RESPONSE
// ============================================================
//
// Keep this until the actual /employeepunchdashboard response
// is available. We should not invent its backend fields.
// ============================================================

export interface EmployeePunchDashboardResponse {
  employeeProfile: Employee[];
  attendanceSummary: MonthlyOverviewItem[];
  punchRecords: PunchRecord[];
}

// ============================================================
// RAW PUNCH PARAMS
// ============================================================
//
// POST /attendance/employeerawpunches
//
// {
//   "employeeId": "294663",
//   "date": "2026-09-10"
// }
// ============================================================

export interface RawPunchParams {
  employeeId: string;
  date: string;
}

// ============================================================
// REPORTING EMPLOYEE
// ============================================================
//
// Actual API response:
//
// [
//   {
//     "EmployeeID": "294676",
//     "EmployeeName": "Mandapuram Divya"
//   },
//   {
//     "EmployeeID": "284519",
//     "EmployeeName": "Rakesh Peddi"
//   },
//   {
//     "EmployeeID": "294623",
//     "EmployeeName": "Tharun Nagarjunapu"
//   },
//   {
//     "EmployeeID": "284512",
//     "EmployeeName": "Varalaxmi Gumudala"
//   }
// ]
//
// classificationId is optional – some backends include it,
// others do not. Frontend maps it when present.
// ============================================================

export interface ReportingEmployee {
  EmployeeID: string;
  EmployeeName: string;
  /** Optional – present only when the backend supplies it */
  ClassificationId?: number | string;
  classificationId?: number | string;
}