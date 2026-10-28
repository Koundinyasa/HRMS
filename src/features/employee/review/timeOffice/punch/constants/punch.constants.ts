import type { ViewType } from "../types/punch.types";

export const PUNCH_VIEW_TYPE: ViewType = "SingleDate";

export const PUNCH_STORAGE_KEYS = {
  employeeId: "employeeId",
  legacyEmployeeId: "EmployeeID",
} as const;

export const PUNCH_PERIOD_TYPES = [
  "Custom Month",
  "Custom Week",
] as const;

export type PunchPeriodType = (typeof PUNCH_PERIOD_TYPES)[number];

export const DEFAULT_PUNCH_PERIOD = PUNCH_PERIOD_TYPES[0];
export const DEFAULT_PERIOD_VALUE = "1";
export const DEFAULT_LEAVE_FILTER = "Select Leave";
