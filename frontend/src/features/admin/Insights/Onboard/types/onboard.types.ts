



export interface OnboardEmployee {
  id: number;
  employeeId: string;
  employeeName: string;
  dateOfJoining: string;
  designation: string;
  branch: string;
  status: "Current" | "Left";
}

export type OnboardFilter =
  | "query"
  | "branch"
  | "salaryStructure"
  | "leave"
  | "attendance"
  | "designation"
  | "employeeStatus";

export interface OnboardFilters {
  search: string;
  branch: string;
  designation: string;
  employeeStatus: string;
}

export type OnboardReportType =
  | "month-wise"
  | "date-wise";