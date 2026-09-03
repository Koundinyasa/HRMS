import type {
    LeavePolicyGroup,
    LeavePolicyGroupCode,
    LeavePolicyRow,
    LeaveBehaviorSettings,
    LeavePolicyTopTabKey,
    LeavePolicySettingTabKey,
} from "../types/leavePolicy.types";

export const LEAVE_POLICY_SECTION_PATH = "admin-center/classifications/leave-policy";

export const LEAVE_POLICY_GROUPS: LeavePolicyGroup[] = [
    { code: "employee", name: "Employee Leave Policy", shortLabel: "Employee" },
    { code: "intern", name: "Intern Leave Policy", shortLabel: "Intern" },
];

export const LEAVE_POLICY_TOP_TABS: { key: LeavePolicyTopTabKey; label: string }[] = [
    { key: "policy", label: "Policy" },
    { key: "definitions", label: "Definitions" },
    { key: "allot-avail-date", label: "Allot/Avail Date" },
    { key: "opening-balance", label: "Opening Balance" },
    { key: "import", label: "Import" },
];

export const LEAVE_POLICY_SETTING_TABS: { key: LeavePolicySettingTabKey; label: string }[] = [
    { key: "behavior", label: "Leave Behavior" },
    { key: "holiday-weekly-off", label: "Setting for Holiday/Weekly Off" },
];

// Per-icon badge colors, matched to the source design (green $, amber sun,
// blue plus, sky star, rose heart).
export const LEAVE_ICON_STYLES: Record<
    LeavePolicyRow["icon"],
    { bg: string; text: string }
> = {
    lop: { bg: "bg-emerald-50", text: "text-emerald-600" },
    cl: { bg: "bg-amber-50", text: "text-amber-500" },
    sl: { bg: "bg-blue-50", text: "text-blue-500" },
    rh: { bg: "bg-sky-50", text: "text-sky-500" },
    ml: { bg: "bg-rose-50", text: "text-rose-500" },
};

// Seed rows per policy group — no backend endpoint for leave-policy CRUD yet,
// so useLeavePolicy keeps this in local state (see hook comment).
export const LEAVE_POLICY_SEED_ROWS: Record<LeavePolicyGroupCode, LeavePolicyRow[]> = {
    employee: [
        { code: "LOP", name: "Loss of Pay", shortName: "LOP", active: true, icon: "lop" },
        { code: "CL", name: "Casual Leave", shortName: "CL", active: true, icon: "cl" },
        { code: "SL", name: "Sick Leave", shortName: "SL", active: true, icon: "sl" },
        { code: "RH", name: "Restricted Holiday", shortName: "RH", active: true, icon: "rh" },
        { code: "ML", name: "Medical Wellness Leave", shortName: "ML", active: true, icon: "ml" },
    ],
    intern: [
        { code: "LOP", name: "Loss of Pay", shortName: "LOP", active: true, icon: "lop" },
        { code: "SL", name: "Sick Leave", shortName: "SL", active: true, icon: "sl" },
        { code: "RH", name: "Restricted Holiday", shortName: "RH", active: true, icon: "rh" },
    ],
};

export const EFFECTIVE_FROM_OPTIONS = [
    "Jan/2026",
    "Feb/2026",
    "Mar/2026",
    "Apr/2026",
    "May/2026",
    "Jun/2026",
    "Jul/2026",
    "Aug/2026",
];

export const DEFAULT_LEAVE_BEHAVIOR_SETTINGS: LeaveBehaviorSettings = {
    effectiveFrom: "Apr/2026",
    active: true,
    hideInEss: false,
    dayType: "half",
    priorityMode: "none",
    considerExcessLopAsLop: false,
    excludeHolidayFromEss: false,
    considerLopOnHoliday: false,
    excludeWeeklyOffFromEss: false,
    considerLopOnWeeklyOff: false,
};
