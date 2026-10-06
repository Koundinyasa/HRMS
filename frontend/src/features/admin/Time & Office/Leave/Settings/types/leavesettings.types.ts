// ── TalentHub / Leave / Settings ────────────────────────────────
// Endpoints (as given):
// 1  GET  /admin/ta/leave/settings/policies
// 2  GET  /admin/ta/leave/settings/policies/:policyId/leaves
// 3  GET  /admin/ta/leave/settings/policies/:policyId/leaves/:leaveId
// 4  PUT  /admin/ta/leave/settings/policies/:policyId/leaves/:leaveId
// 5  POST /admin/ta/leave/settings/leave-policy
// 6  PUT  /admin/ta/leave/settings/leave-policy
// 7  POST /admin/ta/leave/settings/leave-policy/details
// 8  PUT  /admin/ta/leave/settings/leave-policy/details
//
// ⚠️ MISSING — no endpoint given for either of these, both needed by the UI:
//   - DELETE a policy (trash icon next to "Employee Leave Policy", Image 5)
//   - DELETE a leave type from a policy (trash icon per row, Image 1)

export type LeaveIconKey = "lop" | "cl" | "sl" | "rh" | "ml";

// ---- Policy list (left sidebar) ----
export interface LeavePolicySummary {
  policyId: number;
  name: string; // e.g. "Employee Leave Policy"
  shortLabel: string; // e.g. "E" — first-letter avatar shown in the sidebar
}

// ---- Leave rows within a policy (main table) ----
export interface PolicyLeaveRow {
  leaveId: number;
  leaveName: string; // e.g. "Loss of Pay"
  shortName: string; // e.g. "LOP"
  active: boolean;
  icon: LeaveIconKey;
}

// ---- Add Leave Policy modal (Image 2) → POST/PUT #5 #6 ----
export interface LeavePolicyFormValues {
  policyId?: number; // present when editing (PUT), absent when creating (POST)
  policyName: string;
  maxLeavesAllowedInNoticePeriod?: number;
  allowedLeavesDuringNoticePeriod?: string; // dropdown — option set unconfirmed
  maxDaysAllowedToApplyFutureMonth?: number;
  emergencyContact: boolean;
  notifyTo: boolean;
  standInEmployee: boolean;
}

// ---- Add Leave Type modal (Image 3) → POST/PUT #7 #8 ----
export interface AddLeaveTypeFormValues {
  policyId: number;
  leaveTypeId: number; // "Select Leave Type" dropdown — reuses the leave types listed under GET #2 for now
  effectiveFrom: string; // e.g. "Sep/2026"
}

// ---- Leave Behaviour settings (Image 4) → GET/PUT #3 #4 ----
// Reuses the exact shape already established for Admin Center/Classifications'
// Leave Policy screen (LeaveBehaviorSettings) since the fields are identical.
export type LeaveDayType = "full" | "half" | "quarter";
export type LeavePriorityMode = "none" | "priority";

export interface LeaveBehaviorSettings {
  effectiveFrom: string;
  active: boolean;
  hideInEss: boolean;
  dayType: LeaveDayType;
  priorityMode: LeavePriorityMode;
  considerExcessLopAsLop: boolean;
  excludeHolidayFromEss: boolean;
  considerLopOnHoliday: boolean;
  excludeWeeklyOffFromEss: boolean;
  considerLopOnWeeklyOff: boolean;
}