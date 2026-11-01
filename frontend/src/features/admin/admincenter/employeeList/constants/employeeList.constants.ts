import type { EmployeeFilterType } from "../api/employeeListApi";

/* ------------------------------------------------------------------ */
/* Routes (all inside Admin Center)                                    */
/* ------------------------------------------------------------------ */

/** Admin Center > Add Employee. */
export const addEmployeePath = (domain?: string) =>
  `/${domain}/admin/admin-center/add-employee`;

/** Admin Center > Employee List > one employee. */
export const employeeDetailPath = (domain: string | undefined, employeeId: number | string) =>
  `/${domain}/admin/admin-center/employee/list/${employeeId}`;

/* ------------------------------------------------------------------ */
/* Dashboard cards link here with ?type=...                            */
/* ------------------------------------------------------------------ */

export const TYPE_LABELS: Record<EmployeeFilterType, string> = {
  all: "All employees",
  male: "Male employees",
  female: "Female employees",
  joined: "Joined employees",
  left: "Left employees",
  "confirmation-pending": "Confirmation pending",
};

export const isFilterType = (value: string): value is EmployeeFilterType =>
  value in TYPE_LABELS;

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

export interface Column {
  key: string;
  label: string;
  /** No sort or filter menu (the value is worked out, not a field). */
  plain?: boolean;
}

export const COLUMNS: Column[] = [
  { key: "EmployeeName", label: "Name" },
  { key: "JoiningDate", label: "Joining date" },
  { key: "Email", label: "Contact" },
  { key: "BranchName", label: "Branch" },
  { key: "LeavePolicyName", label: "Leave policy" },
  { key: "Status", label: "Status", plain: true },
];

export const ACTION_COLUMN_WIDTH = "96px";

export const GRID_COLUMNS = [
  "minmax(240px,2.3fr)",
  "minmax(140px,1.1fr)",
  "minmax(210px,1.8fr)",
  "minmax(190px,1.6fr)",
  "minmax(170px,1.4fr)",
  "110px",
  ACTION_COLUMN_WIDTH,
].join(" ");

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
