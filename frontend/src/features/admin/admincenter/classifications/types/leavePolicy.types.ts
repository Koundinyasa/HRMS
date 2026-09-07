// Admin Center / Classifications / Leave Policy
// No backend endpoint exists for this yet (see hooks/useLeavePolicy.ts) — these
// types describe the shape the screen renders today so the API can be dropped
// in later without touching the components.

export type LeavePolicyGroupCode = "employee" | "intern";

export interface LeavePolicyGroup {
    code: LeavePolicyGroupCode;
    name: string; // "Employee Leave Policy"
    shortLabel: string; // "Employee" — used in the breadcrumb
}

export type LeaveIconKey = "lop" | "cl" | "sl" | "rh" | "ml";

export interface LeavePolicyRow {
    code: string; // 'LOP' | 'CL' | 'SL' | 'RH' | 'ML' ...
    name: string; // 'Loss of Pay'
    shortName: string; // 'LOP'
    active: boolean;
    icon: LeaveIconKey;
}

export type LeaveDayType = "full" | "half" | "quarter";
export type LeavePriorityMode = "none" | "priority";

export interface LeaveBehaviorSettings {
    effectiveFrom: string; // 'Apr/2026'
    active: boolean;
    hideInEss: boolean;
    dayType: LeaveDayType;
    priorityMode: LeavePriorityMode;
    considerExcessLopAsLop: boolean;
    // Setting for Holiday/Weekly Off
    excludeHolidayFromEss: boolean;
    considerLopOnHoliday: boolean;
    excludeWeeklyOffFromEss: boolean;
    considerLopOnWeeklyOff: boolean;
}

export type LeavePolicyTopTabKey =
    | "policy"
    | "definitions"
    | "allot-avail-date"
    | "opening-balance"
    | "import";

export type LeavePolicySettingTabKey = "behavior" | "holiday-weekly-off";
