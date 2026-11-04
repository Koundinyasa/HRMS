/**
 * Filters for the Daily Attendance grid.
 *
 * Branch is filtered by the backend (branchId in monthly-leave-calendar).
 * The other filters work on the rows that are already loaded:
 *
 *   Leave            -> employee has that leave (e.g. CL) on any day of the month
 *   Attendance       -> employee has that status (Absent, Present, Holiday...) on any day
 *   Salary Structure -> employee's salary structure is one of the selected
 *   Designation      -> employee's designation is one of the selected
 *   Emp Status       -> employee's status is one of the selected
 *
 * Several values inside ONE filter = OR   (CL or SL)
 * Different filters together          = AND  (Designation AND Leave)
 */

export interface FilterOption {
  label: string;
  value: string;
  /** Short code if the API sends one (e.g. "CL") */
  code?: string;
}

export type FilterSelection = Record<string, string[]>;
export type FilterOptionMap = Partial<Record<string, FilterOption[]>>;

type Row = Record<string, unknown>;

/* ------------------------------ helpers ------------------------------ */

/** "Notice Period", "notice_period", "NoticePeriod" -> "noticeperiod" */
const norm = (value: unknown) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/** Codes that are NOT a leave */
const NON_LEAVE_CODES = new Set(["", "-", "P", "AB", "H", "WO", "W", "PN"]);

interface DayCodes {
  /** Whole cell values, e.g. "P/AB" */
  whole: string[];
  /** Each half separately, e.g. "P", "AB" */
  parts: string[];
}

/** Day columns look like "1 Thu", "2 Fri" -> read the code of every day */
function getDayCodes(row: Row): DayCodes {
  const whole: string[] = [];
  const parts: string[] = [];
  for (const [key, value] of Object.entries(row)) {
    if (!/^\d+\b/.test(key)) continue;
    const text = String(value ?? "").trim().toUpperCase();
    if (!text || text === "-") continue;
    whole.push(text);
    for (const part of text.split("/")) {
      const code = part.trim();
      if (code) parts.push(code);
    }
  }
  return { whole, parts };
}

/* ------------------------------ Leave filter ------------------------------ */

/** Possible grid codes for a leave type, e.g. "Casual Leave" -> CL */
function leaveCodesFor(option: FilterOption): Set<string> {
  const codes = new Set<string>();
  if (option.code) codes.add(option.code.trim().toUpperCase());

  // The label may already be a code ("CL")
  if (/^[A-Za-z]{1,4}$/.test(option.label.trim())) codes.add(option.label.trim().toUpperCase());

  // Only guess from the name when the API gave no code
  if (!option.code) {
    const words = option.label.split(/[^A-Za-z]+/).filter(Boolean);
    if (words.length > 1) {
      codes.add(words.map((w) => w[0]).join("").toUpperCase()); // Casual Leave -> CL, Loss of Pay -> LOP
      codes.add(
        words
          .filter((w) => w.toLowerCase() !== "of")
          .map((w) => w[0])
          .join("")
          .toUpperCase(),
      );
    }
    const name = norm(option.label);
    if (name.includes("compensatory")) codes.add("CO");
    if (name.includes("lossofpay")) codes.add("LOP");
  }
  return codes;
}

/* ------------------------------ Attendance filter ------------------------------ */

function attendanceMatcher(option: FilterOption): (codes: DayCodes) => boolean {
  const label = norm(option.label);
  const extra = option.code ? option.code.trim().toUpperCase() : "";

  switch (label) {
    case "absent":
      return ({ parts }) => parts.includes("AB");
    case "present":
      return ({ whole }) => whole.includes("P");
    case "halfday":
      return ({ whole }) => whole.some((code) => code.includes("/"));
    case "holiday":
      return ({ parts }) => parts.includes("H");
    case "onleave":
      return ({ parts }) => parts.some((code) => !NON_LEAVE_CODES.has(code));
    case "pending":
      return ({ parts }) => parts.includes("PN");
    case "weeklyoff":
      return ({ parts }) => parts.includes("WO");
    default: {
      // unknown label: match its code / name against the day codes
      const wanted = new Set([extra, option.label.trim().toUpperCase()].filter(Boolean));
      return ({ parts }) => parts.some((code) => wanted.has(code));
    }
  }
}

/* ------------------------------ Employee fields ------------------------------ */

/** Row columns that hold each employee-level filter (matched by column name) */
const FIELD_PATTERNS: Record<string, string[]> = {
  salaryStructure: ["salarystructure", "structurename", "structureid"],
  designation: ["designation"],
  empStatus: ["empstatus", "employeestatus", "employmentstatus"],
};

/** Values of all matching columns of a row; null when the row has no such column */
function fieldValues(row: Row, patterns: string[]): string[] | null {
  let found = false;
  const values: string[] = [];
  for (const [key, value] of Object.entries(row)) {
    const k = norm(key);
    if (!patterns.some((pattern) => k.includes(pattern))) continue;
    found = true;
    if (value != null && value !== "") values.push(norm(value));
  }
  return found ? values : null;
}

/* ------------------------------ main ------------------------------ */

export interface FilterResult {
  rows: Row[];
  /**
   * Filters that were selected but cannot be applied because the calendar data
   * has no column for them (the backend needs to send it).
   */
  unavailable: string[];
}

export function filterLeaveDailyRows(
  rows: Row[],
  selected: FilterSelection,
  options: FilterOptionMap,
): FilterResult {
  const optionsOf = (key: string) =>
    (selected[key] ?? [])
      .map((value) => (options[key] ?? []).find((option) => option.value === value))
      .filter((option): option is FilterOption => Boolean(option));

  const unavailable: string[] = [];
  const checks: ((row: Row) => boolean)[] = [];

  // ----- Leave -----
  const leaveOptions = optionsOf("leave");
  if (leaveOptions.length > 0) {
    const wanted = new Set(leaveOptions.flatMap((option) => [...leaveCodesFor(option)]));
    checks.push((row) => getDayCodes(row).parts.some((code) => wanted.has(code)));
  }

  // ----- Attendance -----
  const attendanceOptions = optionsOf("attendance");
  if (attendanceOptions.length > 0) {
    const matchers = attendanceOptions.map(attendanceMatcher);
    checks.push((row) => {
      const codes = getDayCodes(row);
      return matchers.some((matches) => matches(codes));
    });
  }

  // ----- Salary Structure / Designation / Emp Status -----
  for (const key of Object.keys(FIELD_PATTERNS)) {
    const chosen = optionsOf(key);
    if ((selected[key] ?? []).length === 0) continue;

    const patterns = FIELD_PATTERNS[key];
    // does ANY row have a column for this filter?
    if (!rows.some((row) => fieldValues(row, patterns) !== null)) {
      if (rows.length > 0) unavailable.push(key);
      continue;
    }

    // match by name or by id (the row may hold either)
    const wanted = new Set(
      (chosen.length > 0
        ? chosen.flatMap((option) => [norm(option.label), norm(option.value)])
        : (selected[key] ?? []).map(norm)
      ).filter(Boolean),
    );
    checks.push((row) => {
      const values = fieldValues(row, patterns);
      return values !== null && values.some((value) => wanted.has(value));
    });
  }

  const filtered = checks.length === 0 ? rows : rows.filter((row) => checks.every((check) => check(row)));
  return { rows: filtered, unavailable };
}