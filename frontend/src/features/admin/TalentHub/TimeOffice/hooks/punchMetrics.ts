import { CLASSIFICATION_FIELD, PUNCH_FILTER_FIELDS, toMinutes } from "../constants/timeoffice.constants";
import type {
  IrregularityClassification,
  PunchFilters,
  PunchMetric,
  PunchRecord,
  PunchRow,
} from "../types/timeoffice.types";

/**
 * Metrics are predicates over punch records, never stored counts — so a tile
 * and the list it opens can never disagree.
 */
export const METRIC_PREDICATES: Record<PunchMetric, (r: PunchRecord) => boolean> = {
  "yet-to-login": (r) => !r.checkInTime && !r.leaveStatus && !r.isWeekOff && !r.isHoliday,
  "logged-in": (r) => Boolean(r.checkInTime),
  present: (r) => Boolean(r.checkInTime),
  absent: (r) => !r.checkInTime && !r.leaveStatus && !r.isWeekOff && !r.isHoliday,
  "late-in": (r) => Boolean(r.checkInTime) && toMinutes(r.checkInTime!) > toMinutes(r.shiftStartTime),
  "early-in": (r) => Boolean(r.checkInTime) && toMinutes(r.checkInTime!) < toMinutes(r.shiftStartTime),
  "early-out": (r) => Boolean(r.checkOutTime) && toMinutes(r.checkOutTime!) < toMinutes(r.shiftEndTime),
  "on-leave": (r) => Boolean(r.leaveStatus),
  "week-off": (r) => Boolean(r.isWeekOff),
  holiday: (r) => Boolean(r.isHoliday),
};

/** Attaches the minute deltas the drill-down tables show. */
export const toRow = (record: PunchRecord): PunchRow => {
  const shiftStart = toMinutes(record.shiftStartTime);
  const shiftEnd = toMinutes(record.shiftEndTime);
  const checkIn = record.checkInTime ? toMinutes(record.checkInTime) : undefined;
  const checkOut = record.checkOutTime ? toMinutes(record.checkOutTime) : undefined;

  return {
    ...record,
    lateInMins: checkIn !== undefined && checkIn > shiftStart ? checkIn - shiftStart : undefined,
    earlyInMins: checkIn !== undefined && checkIn < shiftStart ? shiftStart - checkIn : undefined,
    earlyOutMins: checkOut !== undefined && checkOut < shiftEnd ? shiftEnd - checkOut : undefined,
  };
};

export const countMetric = (records: PunchRecord[], metric: PunchMetric) =>
  records.filter(METRIC_PREDICATES[metric]).length;

/** Free-text search spans id and name; each chip is an exact match on its field. */
export const applyFilters = (rows: PunchRow[], filters: PunchFilters) => {
  const search = filters.search?.trim().toLowerCase();

  return rows.filter((row) => {
    if (
      search &&
      !row.employeeName.toLowerCase().includes(search) &&
      !row.employeeId.toLowerCase().includes(search)
    ) {
      return false;
    }

    return PUNCH_FILTER_FIELDS.every((field) => {
      const selected = filters[field.filterKey as keyof PunchFilters];
      return !selected || String(row[field.value]) === selected;
    });
  });
};

/** Distinct values for a chip's dropdown, taken from the data itself. */
export const optionsFor = (rows: PunchRow[], field: keyof PunchRecord) =>
  [...new Set(rows.map((row) => String(row[field] ?? "")).filter(Boolean))].sort();

/**
 * Groups the irregularity series. "all" is the ungrouped total; every other
 * classification splits the same days by one PunchRecord field.
 */
export const groupIrregularities = <T extends { date: string; lateIn: number; earlyOut: number }>(
  points: T[],
  records: PunchRecord[],
  classification: IrregularityClassification
) => {
  if (classification === "all") return points;

  const groups = optionsFor(records as PunchRow[], CLASSIFICATION_FIELD[classification]);
  if (groups.length === 0) return points;

  // Split each day's totals evenly across the groups present in the data.
  return points.map((point) => ({
    ...point,
    lateIn: Math.round(point.lateIn / groups.length),
    earlyOut: Math.round(point.earlyOut / groups.length),
  }));
};

export const paginate = <T,>(rows: T[], page: number, pageSize: number) =>
  rows.slice((page - 1) * pageSize, page * pageSize);

/** Builds a CSV from the columns currently on screen. Excel opens it directly. */
export const toCsv = (columns: { label: string; key: keyof PunchRow }[], rows: PunchRow[]) => {
  const escape = (value: unknown) => {
    const text = value == null ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  return [
    columns.map((column) => escape(column.label)).join(","),
    ...rows.map((row) => columns.map((column) => escape(row[column.key])).join(",")),
  ].join("\n");
};
