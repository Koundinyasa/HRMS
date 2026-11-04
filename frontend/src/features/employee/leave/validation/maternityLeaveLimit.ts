import { MATERNITY_MAX_DAYS } from "../constants/leave.constants";

type HistoryField = {
  label: string;
  value: string | number | null;
};

export type MaternityLeaveHistoryEntry = {
  fields?: HistoryField[];
  LeaveTypeName?: string;
  FromDate?: string;
  ToDate?: string;
  Status?: string;
};

const getHistoryValue = (
  entry: MaternityLeaveHistoryEntry,
  label: string,
): string => {
  const directFieldNames: Record<string, keyof MaternityLeaveHistoryEntry> = {
    "Leave Type": "LeaveTypeName",
    "From Date": "FromDate",
    "To Date": "ToDate",
    Status: "Status",
  };
  const directValue = entry[directFieldNames[label]];
  if (typeof directValue === "string") return directValue;

  const normalizedLabel = label.replace(/\s/g, "").toLowerCase();
  const fieldValue = entry.fields?.find(
    (field) => field.label.replace(/\s/g, "").toLowerCase() === normalizedLabel,
  )?.value;
  return fieldValue == null ? "" : String(fieldValue);
};

const parseDate = (value: string): Date | undefined => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? undefined
    : new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
      );
};

const getDaysByYear = (from: Date, to: Date): Map<number, number> => {
  const daysByYear = new Map<number, number>();
  const cursor = new Date(from);

  while (cursor <= to) {
    const year = cursor.getUTCFullYear();
    daysByYear.set(year, (daysByYear.get(year) ?? 0) + 1);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return daysByYear;
};

export const getMaternityLeaveLimitError = (
  fromDate: string,
  toDate: string,
  history: MaternityLeaveHistoryEntry[],
): string | undefined => {
  const requestedFrom = parseDate(fromDate);
  const requestedTo = parseDate(toDate);
  if (!requestedFrom || !requestedTo || requestedTo < requestedFrom) {
    return undefined;
  }

  const usedDaysByYear = new Map<number, number>();
  for (const entry of history) {
    if (!getHistoryValue(entry, "Leave Type").toLowerCase().includes("maternity")) {
      continue;
    }

    const status = getHistoryValue(entry, "Status").toLowerCase();
    if (/reject|withdraw|cancel|denied/.test(status)) continue;

    const previousFrom = parseDate(getHistoryValue(entry, "From Date"));
    const previousTo = parseDate(getHistoryValue(entry, "To Date"));
    if (!previousFrom || !previousTo || previousTo < previousFrom) continue;

    for (const [year, days] of getDaysByYear(previousFrom, previousTo)) {
      usedDaysByYear.set(year, (usedDaysByYear.get(year) ?? 0) + days);
    }
  }

  for (const [year, requestedDays] of getDaysByYear(requestedFrom, requestedTo)) {
    const usedDays = usedDaysByYear.get(year) ?? 0;
    if (usedDays + requestedDays > MATERNITY_MAX_DAYS) {
      const remainingDays = Math.max(MATERNITY_MAX_DAYS - usedDays, 0);
      return `Maternity Leave has ${remainingDays} day(s) remaining in ${year}. Unused days cannot be carried over to another calendar year.`;
    }
  }

  return undefined;
};
