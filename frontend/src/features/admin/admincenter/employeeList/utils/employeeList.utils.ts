import {
  isEmployeeFull,
  type Employee,
  type EmployeeFilterType,
} from "../api/employeeListApi";

export type SortConfig = { key: string | null; dir: "asc" | "desc" };
export type ColumnFilters = Record<string, string>;

/** A dropdown filter shown above the table. Empty ones are hidden. */
export interface FilterDef {
  key: string;
  label: string;
  pick: (employee: Employee) => string | null | undefined;
}

export const text = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

export const fieldOf = (employee: Employee, key: string): unknown =>
  (employee as unknown as Record<string, unknown>)[key];

export function getStatus(employee: Employee): string {
  return employee.EmpStatus ?? employee.EmployeeStatus ?? (employee.ExitDate ? "Left" : "Active");
}

export const FILTERS: FilterDef[] = [
  { key: "branch", label: "Branch", pick: (e) => (isEmployeeFull(e) ? e.BranchName : null) },
  { key: "leave", label: "Leave policy", pick: (e) => (isEmployeeFull(e) ? e.LeavePolicyName : null) },
  { key: "attendance", label: "Attendance", pick: (e) => (isEmployeeFull(e) ? e.AttendanceType : null) },
  {
    key: "salary",
    label: "Salary structure",
    pick: (e) => (isEmployeeFull(e) ? e.SalaryStructureName ?? e.SalaryStructure : null),
  },
  { key: "designation", label: "Designation", pick: (e) => (isEmployeeFull(e) ? e.DesignationName : null) },
  { key: "status", label: "Status", pick: getStatus },
];

/** The dashboard cards open this list with ?type=... */
export function matchesType(employee: Employee, type: EmployeeFilterType): boolean {
  switch (type) {
    case "male":
      return text(employee.Gender).trim().toLowerCase() === "male";
    case "female":
      return text(employee.Gender).trim().toLowerCase() === "female";
    case "joined":
      return Boolean(employee.JoiningDate);
    case "left":
      return Boolean(employee.ExitDate);
    case "confirmation-pending":
      return text(employee.ConfirmationStatus ?? employee.EmpStatus ?? employee.EmployeeStatus)
        .toLowerCase()
        .includes("pending");
    default:
      return true;
  }
}

export function matchesSearch(employee: Employee, query: string): boolean {
  const haystack = [employee.EmployeeName, String(employee.EmployeeID)];

  if (isEmployeeFull(employee)) {
    haystack.push(employee.Email ?? "", employee.DesignationName ?? "", employee.BranchName ?? "");
  }

  return haystack.some((value) => value.toLowerCase().includes(query));
}

const DAY_MONTH_YEAR = /^(\d{2})-(\d{2})-(\d{4})/;

/** Dates arrive as dd-mm-yyyy; sort them by year, month, day. */
export function sortValue(employee: Employee, key: string): string {
  const raw = text(fieldOf(employee, key));

  if (key === "JoiningDate") {
    const match = DAY_MONTH_YEAR.exec(raw);
    if (match) return `${match[3]}${match[2]}${match[1]}`;
  }

  return raw.toLowerCase();
}

export function initials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0));
  return letters.join("").toUpperCase() || "?";
}

export function uniqueSorted(values: (string | null | undefined)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v)))).sort((a, b) =>
    a.localeCompare(b),
  );
}
