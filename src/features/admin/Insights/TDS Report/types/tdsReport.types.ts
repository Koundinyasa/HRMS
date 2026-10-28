export interface TDSReportRow {
  [key: string]: unknown;
}

export interface TDSReportFilters {
  search: string;
  query: string;
  branch: string;
  salaryStructure: string;
  leave: string;
  attendance: string;
  designation: string;
  employeeStatus: string;
}

export interface TDSReportState {
  rows: TDSReportRow[];
  loading: boolean;
  error: string | null;
}