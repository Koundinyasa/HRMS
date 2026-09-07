import { useEffect, useMemo, useState } from "react";
import {
    LEAVE_POLICY_GROUPS,
    LEAVE_POLICY_SEED_ROWS,
    DEFAULT_LEAVE_BEHAVIOR_SETTINGS,
} from "../constants/leavePolicy.constants";
import type {
    LeavePolicyGroupCode,
    LeavePolicyRow,
    LeaveBehaviorSettings,
} from "../types/leavePolicy.types";

// NOTE: there is no `employee/leave-policy` backend route yet (compare
// leaveApi.ts, which only has employees/leavetypes/balance/summary/history).
// Everything here is local state so the Policy/Definitions/Behavior screens
// are usable now; swap the useState calls for RTK Query hooks once the API
// lands, keeping the same return shape.

export function useLeavePolicy(initialGroup: LeavePolicyGroupCode = "employee") {
    const [groupCode, setGroupCode] = useState<LeavePolicyGroupCode>(initialGroup);
    const [rowsByGroup, setRowsByGroup] = useState(LEAVE_POLICY_SEED_ROWS);
    const [settingsByLeave, setSettingsByLeave] = useState<Record<string, LeaveBehaviorSettings>>({});
    const [isSaving, setIsSaving] = useState(false);

    // LeavePolicyPage passes the URL's :group param in as initialGroup on
    // every render, but React Router keeps the same component instance
    // mounted when only the param changes (e.g. /employee -> /intern), so
    // useState's initial value is never revisited on its own. Without this,
    // clicking "Intern Leave Policy" changes the URL but groupCode — and
    // everything derived from it below — stays stuck on whatever group was
    // active on first mount.
    useEffect(() => {
        setGroupCode(initialGroup);
    }, [initialGroup]);

    const groups = LEAVE_POLICY_GROUPS;
    const activeGroup = useMemo(
        () => groups.find((g) => g.code === groupCode) ?? groups[0],
        [groupCode, groups],
    );
    const rows = rowsByGroup[groupCode] ?? [];

    const selectGroup = (code: LeavePolicyGroupCode) => setGroupCode(code);

    const toggleActive = (code: string) => {
        setRowsByGroup((prev) => ({
            ...prev,
            [groupCode]: prev[groupCode].map((r) =>
                r.code === code ? { ...r, active: !r.active } : r,
            ),
        }));
    };

    const deleteLeave = (code: string) => {
        setRowsByGroup((prev) => ({
            ...prev,
            [groupCode]: prev[groupCode].filter((r) => r.code !== code),
        }));
    };

    const addLeave = (row: LeavePolicyRow) => {
        setRowsByGroup((prev) => ({
            ...prev,
            [groupCode]: [...prev[groupCode], row],
        }));
    };

    const getSettings = (leaveCode: string): LeaveBehaviorSettings =>
        settingsByLeave[leaveCode] ?? DEFAULT_LEAVE_BEHAVIOR_SETTINGS;

    const updateSettings = (leaveCode: string, patch: Partial<LeaveBehaviorSettings>) => {
        setSettingsByLeave((prev) => ({
            ...prev,
            [leaveCode]: { ...(prev[leaveCode] ?? DEFAULT_LEAVE_BEHAVIOR_SETTINGS), ...patch },
        }));
    };

    // Placeholder save — resolves immediately since there's nowhere to persist
    // to yet. Kept async so the page can show a "Saving..." state already.
    const saveSettings = async (_leaveCode: string) => {
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIsSaving(false);
    };

    return {
        groups,
        activeGroup,
        groupCode,
        selectGroup,
        rows,
        toggleActive,
        deleteLeave,
        addLeave,
        getSettings,
        updateSettings,
        saveSettings,
        isSaving,
    };
}
