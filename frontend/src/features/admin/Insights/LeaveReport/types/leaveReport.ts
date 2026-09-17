// // leaveReport.ts
// export interface LeaveReportRow {
//   slNo: number;
//   employeeId: string;
//   employeeName: string;
//   /** Extra descriptive text for a row — e.g. leave type/reason/remarks shown in Leave Summary (Detailed). */
//   description?: string;
//   [key: string]: unknown;
// }










// leaveReport.ts
export interface LeaveReportRow {
  slNo: number;
  employeeId: string;
  employeeName: string;
  /** Extra descriptive text for a row — e.g. leave type/reason/remarks shown in Leave Summary (Detailed). */
  description?: string;
  [key: string]: unknown;
}

export interface LeaveReportApiResponse {
  data: LeaveReportRow[];
  totalCount: number;
}