import { PUNCH_RECORDS } from "./punch.mock";
import type { AssignEmployeeRow, PolicyUpdateRow } from "../types/timeoffice.types";

/** Reuses the same 90 employees as Punch Process — same convention as the other mock files. */
export const ASSIGN_EMPLOYEE_ROWS: AssignEmployeeRow[] = PUNCH_RECORDS.today.map((r) => ({
  employeeId: r.employeeId,
  employeeName: r.employeeName,
}));

export const GEO_LOCATION_ASSIGNED: Record<string, boolean> = { "1": true };

export const POLICY_UPDATE_ROWS: PolicyUpdateRow[] = PUNCH_RECORDS.today.map((r) => ({
  employeeId: r.employeeId,
  employeeName: r.employeeName,
  effectiveDate: r.employeeId === "1" ? "01/Jun/2026" : "01/Apr/2026",
  policy: "General Policy",
}));
