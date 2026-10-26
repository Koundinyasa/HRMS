import type {
  PolicySummary,
  ProcessHistoryEntry,
  ProcessSummary,
  PunchPeriod,
  PunchRecord,
  PunchRequestsSummary,
  ShiftSummary,
} from "../types/timeoffice.types";

/**
 * Sample data so the dashboard renders without a backend. Delete this file and
 * point the hook at RTK Query once /api/time-office/* exists.
 */

export const TOTAL_EMPLOYEES = 90;
export const LATEST_PUNCH_INTEGRATED_AT = "12/06/2026 @ 18:29:13";
export const TODAY_LABEL = "Today Fri, 12 Jun 2026";

const SHIFT = { shiftAssigned: "GS", shiftStartTime: "10:00:00", shiftEndTime: "19:00:00" };

// Names lifted from the reference screenshots, then padded out to 90.
const SEED_NAMES = [
  "RAJESH UBBAPALLY", "Varalaxmi Gumudala", "Sreya Chaluvadi", "Rama Veera Manikanta Pusunuri",
  "Divyasree Taguru", "Rajesh Reddy Thuti", "Daniel Raju Ravi", "Himasaiteja Tummala",
  "Umar Sharief Shaik", "Chandra Shekar Saka", "Anull Umesh Wandkar", "Rakshitha Golagani",
  "DIVYA LAKKIREDDY", "Jasti Eesvar Santhosh Prame", "Jagadeeshwar Chary Vadla", "Harika Manya",
  "Sairaj Rampally", "Sneha Kondapally", "Vamshi Krishna Reddy", "Pavan Kumar Pisay",
  "Aarthi Nagarajan", "Bhavya Sree Kolli", "Chaitanya Varma", "Deepak Sharma",
  "Eshwar Prasad Rao", "Farhan Ahmed", "Gayatri Devi", "Harsha Vardhan Reddy",
  "Ishita Bansal", "Jyothi Lakshmi",
];

const DEPARTMENTS = ["Engineering", "Human Resources", "Finance", "Operations", "Sales"];
const TEAMS = ["Platform", "Payroll", "Support", "Field", "Growth"];
const BRANCHES = ["Hyderabad", "Bengaluru", "Chennai"];
const SALARY_STRUCTURES = ["Standard", "Executive", "Intern"];
const LEAVE_POLICIES = ["Employee Leave Policy", "Intern Leave Policy"];
const ATTENDANCES = ["Daily", "Monthly", "Hourly"];
const DESIGNATIONS = ["Software Engineer", "Senior Engineer", "HR Executive", "Accountant", "Team Lead"];
const COST_CENTERS = ["CC-100", "CC-200", "CC-300"];
const TA_POLICIES = ["General Policy", "Flexi Policy"];
const PATTERNS = ["Weekly", "Fortnightly", "Monthly"];
const SUPERVISORS = ["Rajesh Ubbapally", "Sreya Chaluvadi", "Daniel Raju Ravi"];

const pick = <T,>(list: readonly T[], index: number) => list[index % list.length];

const buildName = (index: number) =>
  index < SEED_NAMES.length ? SEED_NAMES[index] : `Employee ${String(index + 1).padStart(3, "0")}`;

const buildEmployeeId = (index: number) => (index === 0 ? "1" : String(294600 + index * 3));

/** Everything except the punch times — the dimensions the filter chips slice on. */
const baseRecord = (index: number): Omit<PunchRecord, "checkInTime" | "checkOutTime" | "leaveStatus"> => ({
  employeeId: buildEmployeeId(index),
  employeeName: buildName(index),
  ...SHIFT,
  punchMode: index % 12 === 0 ? "ESS" : "Bio Metric",
  department: pick(DEPARTMENTS, index),
  team: pick(TEAMS, index + 1),
  branch: pick(BRANCHES, index),
  salaryStructure: pick(SALARY_STRUCTURES, index + 2),
  leavePolicy: pick(LEAVE_POLICIES, index),
  attendance: pick(ATTENDANCES, index + 1),
  designation: pick(DESIGNATIONS, index),
  costCenter: pick(COST_CENTERS, index + 1),
  taPolicy: pick(TA_POLICIES, index),
  pattern: pick(PATTERNS, index + 2),
  taSupervisor: pick(SUPERVISORS, index + 1),
});

/**
 * Index bands decide each employee's day, which keeps the tile counts matching
 * the reference: 19 yet to login, 68 logged in, 1 late, 50 early, 2 early out,
 * 2 on leave.
 */
const todayRecord = (index: number): PunchRecord => {
  const base = baseRecord(index);

  if (index < 2) {
    const leaveStatus = index === 0 ? "Second Half : SL" : "Second Half : LOP, First Half : SL";
    return { ...base, leaveStatus };
  }
  if (index < 21) return base; // yet to login — no punch at all

  // Logged in. One arrives late, the next 50 arrive early, the rest on time.
  const checkInTime = index === 21 ? "11:19" : index < 72 ? earlyArrival(index) : "10:00";
  const checkOutTime = index === 30 ? "16:54" : index === 31 ? "16:03" : undefined;
  return { ...base, checkInTime, checkOutTime };
};

/** Spread early arrivals between 09:06 and 09:58 so "Early IN Mins" varies. */
const earlyArrival = (index: number) => {
  const minutesEarly = 2 + ((index * 7) % 53);
  const arrival = 10 * 60 - minutesEarly;
  return `${String(Math.floor(arrival / 60)).padStart(2, "0")}:${String(arrival % 60).padStart(2, "0")}`;
};

/** Yesterday is settled: 33 absent, the rest present, 3 of them leaving early. */
const yesterdayRecord = (index: number): PunchRecord => {
  const base = baseRecord(index);
  if (index < 33) return base; // absent

  const checkInTime = index < 83 ? earlyArrival(index) : "10:00";
  const checkOutTime = index === 40 ? "16:54" : index === 41 ? "16:03" : index === 42 ? "18:29" : "19:00";
  return { ...base, checkInTime, checkOutTime };
};

export const PUNCH_RECORDS: Record<PunchPeriod, PunchRecord[]> = {
  today: Array.from({ length: TOTAL_EMPLOYEES }, (_, index) => todayRecord(index)),
  yesterday: Array.from({ length: TOTAL_EMPLOYEES }, (_, index) => yesterdayRecord(index)),
};

// ---- Chart data (last 7 days, matching the reference shape) ----

export const ATTENDANCE_OVERVIEW = [
  { date: "06 Jun", present: 0, absent: 0, leave: 0, weekOff: 84, generalHoliday: 0 },
  { date: "07 Jun", present: 0, absent: 0, leave: 0, weekOff: 85, generalHoliday: 0 },
  { date: "08 Jun", present: 28, absent: 61, leave: 1, weekOff: 0, generalHoliday: 0 },
  { date: "09 Jun", present: 38, absent: 78, leave: 2, weekOff: 0, generalHoliday: 0 },
  { date: "10 Jun", present: 55, absent: 34, leave: 1, weekOff: 0, generalHoliday: 0 },
  { date: "11 Jun", present: 60, absent: 30, leave: 2, weekOff: 0, generalHoliday: 0 },
  { date: "12 Jun", present: 5, absent: 57, leave: 3, weekOff: 0, generalHoliday: 0 },
];

export const IRREGULARITIES = [
  { date: "06 Jun", lateIn: 0, earlyOut: 0 },
  { date: "07 Jun", lateIn: 0, earlyOut: 0 },
  { date: "08 Jun", lateIn: 5, earlyOut: 1 },
  { date: "09 Jun", lateIn: 4, earlyOut: 28 },
  { date: "10 Jun", lateIn: 3, earlyOut: 1 },
  { date: "11 Jun", lateIn: 9, earlyOut: 0 },
  { date: "12 Jun", lateIn: 1, earlyOut: 1 },
];

export const WORKING_HOURS = [
  { date: "06 Jun", avgWorkMinutes: 0, avgOtMinutes: 0 },
  { date: "07 Jun", avgWorkMinutes: 0, avgOtMinutes: 0 },
  { date: "08 Jun", avgWorkMinutes: 180, avgOtMinutes: 2 },
  { date: "09 Jun", avgWorkMinutes: 200, avgOtMinutes: 4 },
  { date: "10 Jun", avgWorkMinutes: 340, avgOtMinutes: 6 },
  { date: "11 Jun", avgWorkMinutes: 380, avgOtMinutes: 3 },
  { date: "12 Jun", avgWorkMinutes: 180, avgOtMinutes: 0 },
];

export const POLICIES: PolicySummary[] = [
  { name: "General Policy", effectiveFrom: "07 May 2026", updatedAgo: "1 month ago" },
];

export const SHIFTS: ShiftSummary[] = [{ name: "GS", timing: "10:00 - 19:00" }];

export const PENDING_REQUESTS: { id: string; label: string }[] = [];

// ---- Process tab ----

export const MOCK_TODAY_ISO = "2026-06-12";

export const PROCESS_SUMMARY: ProcessSummary = {
  timeAttendance: 90,
  nonTimeAttendance: 0,
  missedPunch: 1,
  shiftUnassigned: 0,
  processed: 90,
  yetToProcess: 0,
  reProcessEffectiveDate: 0,
  allReProcess: 0,
};

export const PUNCH_REQUESTS_SUMMARY: PunchRequestsSummary = { regularization: 0, essMobile: 0 };

export const PROCESS_HISTORY: ProcessHistoryEntry[] = [
  { id: "1", rangeLabel: "June 4 to 4, 2026", processedOn: "04/Jun/2026, 11:36", status: "Completed" },
  { id: "2", rangeLabel: "June 1 to 1, 2026", processedOn: "02/Jun/2026, 11:36", status: "Completed" },
  { id: "3", rangeLabel: "May 18 to 18, 2026", processedOn: "19/May/2026, 10:32", status: "Completed" },
  { id: "4", rangeLabel: "May 1 to 7, 2026", processedOn: "07/May/2026, 17:37", status: "Completed" },
];
