// ---- Punch Process ----
 
/** The dashboard's only period selector. */
export type PunchPeriod = "today" | "yesterday";
 
/** Every KPI tile drills down to a filtered employee list. */
export type PunchMetric =
  | "yet-to-login"
  | "logged-in"
  | "present"
  | "absent"
  | "late-in"
  | "early-in"
  | "early-out"
  | "on-leave"
  | "week-off"
  | "holiday";
 
export type PunchProcessTab =
  | "dashboard"
  | "process"
  | "punch"
  | "attendance-overview"
  | "ta-insights"
  | "import";
 
/** Grouping for the "Attendance Irregularities" charts. */
export type IrregularityClassification =
  | "all"
  | "department"
  | "team"
  | "branch"
  | "salary-structure"
  | "leave-policy"
  | "attendance"
  | "designation"
  | "cost-center"
  | "ta-policy";
 
/**
 * One punch record per employee per period. Metrics are derived from these
 * fields rather than stored, so the tile counts and the drill-down lists can
 * never disagree.
 */
export interface PunchRecord {
  employeeId: string;
  employeeName: string;
  shiftAssigned: string;
  shiftStartTime: string;
  shiftEndTime: string;
  checkInTime?: string;
  checkOutTime?: string;
  /** e.g. "Second Half : SL" or "Second Half : LOP, First Half : SL" */
  leaveStatus?: string;
  isWeekOff?: boolean;
  isHoliday?: boolean;
  punchMode?: "Bio Metric" | "ESS";
 
  // Dimensions the filter chips slice on.
  department: string;
  team: string;
  branch: string;
  salaryStructure: string;
  leavePolicy: string;
  attendance: string;
  designation: string;
  costCenter: string;
  taPolicy: string;
  pattern: string;
  taSupervisor: string;
}
 
/** A PunchRecord plus the minute deltas the drill-down tables display. */
export interface PunchRow extends PunchRecord {
  lateInMins?: number;
  earlyInMins?: number;
  earlyOutMins?: number;
}
 
/** Free-text search plus one value per filter chip. */
export interface PunchFilters {
  search?: string;
  query?: string;
  taPolicy?: string;
  pattern?: string;
  taSupervisor?: string;
  attendance?: string;
  leave?: string;
}
 
export interface AttendanceOverviewPoint {
  date: string;
  present: number;
  absent: number;
  leave: number;
  weekOff: number;
  generalHoliday: number;
}
 
export interface IrregularityPoint {
  date: string;
  lateIn: number;
  earlyOut: number;
}
 
export interface WorkingHoursPoint {
  date: string;
  /** Minutes. The axis renders these as H:MM. */
  avgWorkMinutes: number;
  avgOtMinutes: number;
}
 
/** Tile counts, keyed by metric. */
export interface DashboardSummary {
  totalEmployees: number;
  latestPunchIntegratedAt?: string;
  counts: Partial<Record<PunchMetric, number>>;
}
 
export interface PunchModeSlice {
  mode: string;
  count: number;
}
 
export interface PendingRequest {
  id: string;
  label: string;
}
 
/** Avg work and avg OT are separate endpoints, so each returns a single series. */
export interface HoursPoint {
  date: string;
  minutes: number;
}
 
export interface PolicySummary {
  name: string;
  effectiveFrom: string;
  updatedAgo: string;
}
 
export interface ShiftSummary {
  name: string;
  timing: string;
}
 
// ---- Process tab ----
 
export type ProcessTile =
  | "timeAttendance"
  | "nonTimeAttendance"
  | "missedPunch"
  | "shiftUnassigned"
  | "processed"
  | "yetToProcess"
  | "reProcessEffectiveDate"
  | "allReProcess";
 
export type ProcessSummary = Record<ProcessTile, number>;
 
export type ProcessHistoryStatus = "Completed" | "Processing" | "Failed";
 
export interface ProcessHistoryEntry {
  id: string;
  rangeLabel: string;
  processedOn: string;
  status: ProcessHistoryStatus;
}
 
export interface PunchRequestsSummary {
  regularization: number;
  essMobile: number;
}
 
/** Backend hasn't published field names for the drill-down lists yet, so columns render dynamically from whatever keys come back. */
export type ProcessDrilldownRow = Record<string, string | number>;
 
/** The subset of ProcessTile that has a real drill-down endpoint. */
export type ProcessDrilldownTile = Extract<
  ProcessTile,
  "missedPunch" | "shiftUnassigned" | "yetToProcess" | "processed" | "reProcessEffectiveDate" | "allReProcess"
>;
 
// ---- Regularization ----
 
export type RegularizationTab = "punch" | "missed-punch" | "attendance" | "ta-insights";
 
export interface MissedPunchRow {
  employeeId: string;
  employeeName: string;
  punchDate: string;
}
 
export interface RegularizationPunch {
  direction: "In" | "Out";
  time: string;
  status: "Approved" | "Pending" | "Rejected";
}
 
/** A punch row as returned by the Punch tab / Missed Punch regularization-details endpoints. */
export interface PunchDetailRow extends RegularizationPunch {
  punchId: string;
  remarks?: string;
}
 
/** Single-half codes plus the "first-half/second-half differ" combos the grid shows as a split circle. */
export type AttendanceDayCode = "P" | "A" | "H" | "WO" | "IN" | "P_A" | "A_P" | "P_AB" | "AB_P";
 
export interface AttendanceDayCell {
  code: AttendanceDayCode;
  tooltip: string;
}
 
export interface AttendanceEmployeeRow {
  empId: string;
  name: string;
  days: AttendanceDayCell[];
}
 
export interface DailyLogPunch {
  punchId?: string;
  direction: "In" | "Out";
  time: string;
  entryType: string;
}
 
export interface DailyLog {
  empName: string;
  date: string;
  fhStatus: string;
  shStatus: string;
  lateIn: string;
  earlyOut: string;
  totalHours: string;
  ot: string;
  punches: DailyLogPunch[];
}
 
export interface InsightTile {
  key: string;
  label: string;
  value: number;
  total: number;
  color: string;
  active: boolean;
}
 
// ---- Settings ----
 
export type SettingsTab = "general-settings" | "auto-process" | "mail-scheduler" | "punch-integration";
 
// ---- Assign ----
 
export type AssignTab = "geo-location" | "policy-update" | "face-template" | "import";
 
export interface AssignEmployeeRow {
  employeeId: string;
  employeeName: string;
}
 
export interface PolicyUpdateRow extends AssignEmployeeRow {
  effectiveDate: string;
  policy: string;
}
 
// ---- Force Approval ----
 
export type ForceApprovalTab =
  | "punch"
  | "weekly-off"
  | "over-time"
  | "official-permission"
  | "personal-permission"
  | "shift"
  | "face-template";
 
// ---- TA Reports ----
 
export interface TaReportCategory {
  title: string;
  reports: string[];
}
 
// ---- Masters ----
 
export type MastersTab = "policy" | "shift-pattern" | "shift-master" | "geo-location" | "import";
 
export interface ShiftMasterRow {
  shiftCode: string;
  shiftName: string;
  startTime: string;
  endTime: string;
}
 
export interface GeoLocationRow {
  locationName: string;
  address: string;
  radiusMeters: number;
}
 
export interface PunchEvent {
  direction: "In" | "Out";
  time: string;
}
 
// ---- Sidebar ----
 
export interface SubNavItem {
  label: string;
  path: string;
  children?: SubNavItem[];
}
 
// ---- Module-level (slice) ----
 
export type TimeOfficeSection =
  | "punch-process"
  | "regularization"
  | "ta-reports"
  | "force-approval"
  | "masters"
  | "assign"
  | "settings";
 