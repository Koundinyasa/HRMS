import type { ExitFilterOption, ExitReportFilters } from "../types/exitReport.types";

export const EXIT_STATUS = ["All", "Relieved", "Pending", "Resigned"];

export const EXIT_DEPARTMENTS = ["All", "HR", "IT", "Finance", "Admin", "Sales"];

export const EXIT_REASONS = [
  "Resignation",
  "Termination",
  "Retirement",
  "Contract Completed",
  "Other",
];

/** Static options for the "Emp Status" filter chip (Branch, Salary Structure,
 * Leave, Attendance and Designation options come from the API instead). */
export const EMP_STATUS_OPTIONS: ExitFilterOption[] = [
  { id: "current", label: "Current Employees" },
  { id: "left", label: "Left Employees" },
];

export const DEFAULT_EXIT_FILTERS: ExitReportFilters = {
  search: "",
  query: [],
  branch: [],
  salaryStructure: [],
  leave: [],
  attendance: [],
  designation: [],
  empStatus: [],
};

export const EXIT_REPORT_LABELS = {
  "exit-report": "Exit Module Report",
  "relieving-letter": "Relieving Letter",
  "experience-letter": "Experience Letter",
} as const;
