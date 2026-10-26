// filters.ts
export interface MonthOption {
  label: string;
  value: string;
}

// Each dropdown filter (branch, salaryStructure, leave, attendance,
// designation, empStatus) now holds an array of selected option values, so
// multiple checkboxes can be selected at once, matching the UI.
export interface ReportFilterState {
  search: string;
  query: string;
  branch: string[];
  salaryStructure: string[];
  leave: string[];
  attendance: string[];
  designation: string[];
  empStatus: string[];
}

export interface DateRangeFilterState {
  fromDate: string;
  toDate: string;
}

export interface GroupByLeavePolicyState {
  employeeLeavePolicy: boolean;
  internLeavePolicy: boolean;
}

export const DEFAULT_REPORT_FILTERS: ReportFilterState = {
  search: "",
  query: "",
  branch: [],
  salaryStructure: [],
  leave: [],
  attendance: [],
  designation: [],
  empStatus: [],
};

export const DEFAULT_GROUP_BY_STATE: GroupByLeavePolicyState = {
  employeeLeavePolicy: false,
  internLeavePolicy: false,
};