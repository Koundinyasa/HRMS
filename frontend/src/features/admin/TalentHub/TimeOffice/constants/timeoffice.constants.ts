import type {
  AssignTab,
  ForceApprovalTab,
  IrregularityClassification,
  MastersTab,
  ProcessTile,
  PunchMetric,
  PunchPeriod,
  PunchProcessTab,
  PunchRecord,
  PunchRow,
  RegularizationTab,
  SettingsTab,
  TaReportCategory,
} from "../types/timeoffice.types";

export const TIME_OFFICE_SECTION_PATH = "talent-hub/timeoffice/punch-process";

export const PUNCH_PROCESS_TABS: { label: string; path: PunchProcessTab }[] = [
  { label: "Dashboard", path: "dashboard" },
  { label: "Process", path: "process" },
  { label: "Punch", path: "punch" },
  { label: "Attendance Overview", path: "attendance-overview" },
  { label: "TA Insights", path: "ta-insights" },
  { label: "Import", path: "import" },
];

export const REGULARIZATION_SECTION_PATH = "talent-hub/timeoffice/regularization";

export const REGULARIZATION_TABS: { label: string; path: RegularizationTab }[] = [
  { label: "Punch", path: "punch" },
  { label: "Missed Punch", path: "missed-punch" },
  { label: "Attendance", path: "attendance" },
  { label: "TA Insights", path: "ta-insights" },
];

export const TA_REPORTS_SECTION_PATH = "talent-hub/timeoffice/ta-reports";

export const FORCE_APPROVAL_SECTION_PATH = "talent-hub/timeoffice/force-approval";

export const FORCE_APPROVAL_TABS: { label: string; path: ForceApprovalTab }[] = [
  { label: "Punch", path: "punch" },
  { label: "Weekly Off", path: "weekly-off" },
  { label: "Over Time", path: "over-time" },
  { label: "Official Permission", path: "official-permission" },
  { label: "Personal Permission", path: "personal-permission" },
  { label: "Shift", path: "shift" },
  { label: "Face Template", path: "face-template" },
];

export const MASTERS_SECTION_PATH = "talent-hub/timeoffice/masters";

export const MASTERS_TABS: { label: string; path: MastersTab }[] = [
  { label: "Policy", path: "policy" },
  { label: "Shift Pattern", path: "shift-pattern" },
  { label: "Shift Master", path: "shift-master" },
  { label: "Geo Location", path: "geo-location" },
  { label: "Import", path: "import" },
];

export const SETTINGS_SECTION_PATH = "talent-hub/timeoffice/settings";

export const SETTINGS_TABS: { label: string; path: SettingsTab }[] = [
  { label: "General Settings", path: "general-settings" },
  { label: "Auto Process", path: "auto-process" },
  { label: "Mail Scheduler", path: "mail-scheduler" },
  { label: "Punch Integration", path: "punch-integration" },
];

export const ASSIGN_SECTION_PATH = "talent-hub/timeoffice/assign";

export const ASSIGN_TABS: { label: string; path: AssignTab }[] = [
  { label: "Geo-Location", path: "geo-location" },
  { label: "Policy Update", path: "policy-update" },
  { label: "Face Template", path: "face-template" },
  { label: "Import", path: "import" },
];

export const TA_REPORT_CATEGORIES: TaReportCategory[] = [
  {
    title: "Day-Wise Reports",
    reports: [
      "Day-Wise Summary",
      "Day-Wise Detailed",
      "Attendance Register",
      "Day-Wise Employee Shift",
      "Employee Day Summary",
      "Employee CW Details",
      "Employee Day-Wise Overview",
    ],
  },
  {
    title: "TA Employee wise Report",
    reports: [
      "Assigned shift",
      "Assigned Temp. Shift",
      "Assigned Pattern",
      "Assigned Policy",
      "Temporary Policy",
      "Employee TA Details",
      "Non Working Hours",
      "Penalty Leave Adjustment",
    ],
  },
  {
    title: "Day Wise Attendance Summary",
    reports: [
      "Late In",
      "Early Out",
      "Early In",
      "Late Out",
      "InOut Punch",
      "Over Time",
      "Attendance Status",
      "Work Hours",
      "Week Off",
      "Absent Status",
    ],
  },
  {
    title: "Monthly Attendance Summary",
    reports: [
      "Late In",
      "Early Out",
      "Early In",
      "Late Out",
      "Over Time",
      "Work Hours",
      "Attendance Status",
      "Monthly Shift",
      "Monthly Overview",
      "Continuous absent Days",
    ],
  },
  {
    title: "Employee Punch Reports",
    reports: [
      "Punch Report",
      "Time Card",
      "Punch Events",
      "Punch Penalty",
      "WFH Punch",
      "OD Punch",
      "Absentee (No Punch)",
      "Missed Punch",
      "Location Punches",
    ],
  },
  {
    title: "Employee Permissions",
    reports: ["Personal Permission", "OD Permission"],
  },
  {
    title: "Regularizations/Authorization",
    reports: [
      "Punch Correction",
      "Attendance Override",
      "CW Authorization",
      "OT Authorization",
      "OT to CW Converted",
    ],
  },
  {
    title: "Yearly",
    reports: ["Yearly Performance"],
  },
];

export const PUNCH_PERIOD_OPTIONS: { label: string; value: PunchPeriod }[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
];

/**
 * The tile row differs by period: today shows live login state, yesterday
 * shows the settled present/absent split.
 */
export const PUNCH_TILES_BY_PERIOD: Record<PunchPeriod, PunchMetric[]> = {
  today: ["yet-to-login", "logged-in", "late-in", "early-in", "early-out", "on-leave", "week-off", "holiday"],
  yesterday: ["present", "absent", "late-in", "early-in", "early-out", "on-leave", "week-off", "holiday"],
};

export const PUNCH_METRIC_LABELS: Record<PunchMetric, string> = {
  "yet-to-login": "Yet to Login",
  "logged-in": "Logged In",
  present: "Present",
  absent: "Absent",
  "late-in": "Late In",
  "early-in": "Early In",
  "early-out": "Early Out",
  "on-leave": "On Leave",
  "week-off": "Week Off",
  holiday: "Holiday",
};

/** Tile arrow colour + drill-down heading colour, per the reference. */
export const PUNCH_METRIC_ACCENTS: Record<PunchMetric, string> = {
  "yet-to-login": "#6366F1",
  "logged-in": "#3B82F6",
  present: "#10B981",
  absent: "#EF4444",
  "late-in": "#EF4444",
  "early-in": "#10B981",
  "early-out": "#F59E0B",
  "on-leave": "#F59E0B",
  "week-off": "#0EA5E9",
  holiday: "#EC4899",
};

export type MetricColumn = { label: string; key: keyof PunchRow };

const IDENTITY_COLUMNS: MetricColumn[] = [
  { label: "Employee Id", key: "employeeId" },
  { label: "Employee Name", key: "employeeName" },
  { label: "Shift Assigned", key: "shiftAssigned" },
];

/** Every drill-down shares the first three columns; only the tail differs. */
export const METRIC_COLUMNS: Record<PunchMetric, MetricColumn[]> = {
  "yet-to-login": [...IDENTITY_COLUMNS, { label: "Shift Start Time", key: "shiftStartTime" }],
  "logged-in": [
    ...IDENTITY_COLUMNS,
    { label: "Shift Start Time", key: "shiftStartTime" },
    { label: "Check IN Time", key: "checkInTime" },
  ],
  present: [...IDENTITY_COLUMNS, { label: "Check IN Time", key: "checkInTime" }],
  absent: IDENTITY_COLUMNS,
  "late-in": [
    ...IDENTITY_COLUMNS,
    { label: "Shift Start Time", key: "shiftStartTime" },
    { label: "Check IN Time", key: "checkInTime" },
    { label: "Late IN Mins", key: "lateInMins" },
  ],
  "early-in": [
    ...IDENTITY_COLUMNS,
    { label: "Shift Start Time", key: "shiftStartTime" },
    { label: "Check IN Time", key: "checkInTime" },
    { label: "Early IN Mins", key: "earlyInMins" },
  ],
  "early-out": [
    ...IDENTITY_COLUMNS,
    { label: "Shift End Time", key: "shiftEndTime" },
    { label: "Check Out Time", key: "checkOutTime" },
    { label: "Early Out Mins", key: "earlyOutMins" },
  ],
  "on-leave": [...IDENTITY_COLUMNS, { label: "Leave Status", key: "leaveStatus" }],
  "week-off": IDENTITY_COLUMNS,
  holiday: IDENTITY_COLUMNS,
};

export const IRREGULARITY_CLASSIFICATIONS: { label: string; value: IrregularityClassification }[] = [
  { label: "All", value: "all" },
  { label: "Department", value: "department" },
  { label: "Team", value: "team" },
  { label: "Branch", value: "branch" },
  { label: "Salary Structure", value: "salary-structure" },
  { label: "Leave Policy", value: "leave-policy" },
  { label: "Attendance", value: "attendance" },
  { label: "Designation", value: "designation" },
  { label: "Cost Center", value: "cost-center" },
  { label: "T&A Policy", value: "ta-policy" },
];

/** Which PunchRecord field each classification groups by. */
export const CLASSIFICATION_FIELD: Record<Exclude<IrregularityClassification, "all">, keyof PunchRecord> = {
  department: "department",
  team: "team",
  branch: "branch",
  "salary-structure": "salaryStructure",
  "leave-policy": "leavePolicy",
  attendance: "attendance",
  designation: "designation",
  "cost-center": "costCenter",
  "ta-policy": "taPolicy",
};

/**
 * Filter chips on the drill-down lists. Note this set differs from the one on
 * Reconcile Leave — the bar takes its fields as a prop.
 */
export const PUNCH_FILTER_FIELDS: { label: string; value: keyof PunchRecord; filterKey: string }[] = [
  { label: "Query", value: "designation", filterKey: "query" },
  { label: "T&A Policy", value: "taPolicy", filterKey: "taPolicy" },
  { label: "Pattern", value: "pattern", filterKey: "pattern" },
  { label: "TA Supervisor", value: "taSupervisor", filterKey: "taSupervisor" },
  { label: "Attendance", value: "attendance", filterKey: "attendance" },
  { label: "Leave", value: "leavePolicy", filterKey: "leave" },
];

export const ATTENDANCE_OVERVIEW_SERIES = [
  { key: "present", label: "PRESENT", color: "#10B981" },
  { key: "absent", label: "ABSENT", color: "#EF4444" },
  { key: "leave", label: "LEAVE", color: "#F59E0B" },
  { key: "weekOff", label: "WO", color: "#06B6D4" },
  { key: "generalHoliday", label: "GH", color: "#EC4899" },
] as const;

export const PUNCH_MODE_COLORS: Record<string, string> = {
  "Bio Metric": "#60A5FA",
  ESS: "#34D399",
};

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

/** Order, label, unit and whether the tile drills into a list — per the reference layout. */
export const PROCESS_TILES: {
  key: ProcessTile;
  label: string;
  unit: "Employee(s)" | "Record(s)";
  color: string;
  hasDrilldown: boolean;
}[] = [
  { key: "timeAttendance", label: "Time & Attendance", unit: "Employee(s)", color: "#2563EB", hasDrilldown: false },
  // ponytail: no /nontimeattendance endpoint yet, flip to true once the backend adds one.
  { key: "nonTimeAttendance", label: "Non Time & Attendance", unit: "Employee(s)", color: "#7C3AED", hasDrilldown: false },
  { key: "missedPunch", label: "Missed Punch", unit: "Record(s)", color: "#F59E0B", hasDrilldown: true },
  { key: "shiftUnassigned", label: "Shift Unassigned", unit: "Employee(s)", color: "#0EA5E9", hasDrilldown: true },
  { key: "processed", label: "Processed", unit: "Employee(s)", color: "#10B981", hasDrilldown: true },
  { key: "yetToProcess", label: "Yet To Process", unit: "Employee(s)", color: "#F59E0B", hasDrilldown: true },
  { key: "reProcessEffectiveDate", label: "Re-Process Effective Date", unit: "Record(s)", color: "#7C3AED", hasDrilldown: true },
  { key: "allReProcess", label: "All Re-Process", unit: "Record(s)", color: "#EC4899", hasDrilldown: true },
];

/** Minutes -> "H:MM", the format the work-hours charts use on their axis. */
export const formatMinutes = (minutes: number) =>
  `${Math.floor(minutes / 60)}:${String(Math.round(minutes) % 60).padStart(2, "0")}`;

/** "HH:MM" or "HH:MM:SS" -> minutes since midnight. */
export const toMinutes = (time: string) => {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
};
