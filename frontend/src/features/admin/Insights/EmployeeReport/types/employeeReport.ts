





export interface EmployeeReportRow {
  slNo: number;
  employeeId: string;
  employeeName: string;
  [key: string]: unknown;
}

export interface ResignationReportStats {
  total: number;
  pending: number;
  approved: number;
  thisMonth: number;
}

export interface EmployeeReportApiResponse {
  data: EmployeeReportRow[];
  totalCount: number;
  stats?: ResignationReportStats;
}