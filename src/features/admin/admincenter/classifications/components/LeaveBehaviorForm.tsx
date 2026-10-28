import LeaveEffectiveFromRow from "./LeaveEffectiveFromRow";
import type { LeaveBehaviorSettings, LeaveDayType, LeavePriorityMode } from "../types/leavePolicy.types";

const DAY_TYPE_OPTIONS: { value: LeaveDayType; label: string }[] = [
  { value: "full", label: "Allow Full Day" },
  { value: "half", label: "Allow Half Day" },
  { value: "quarter", label: "Allow Quarter Day" },
];

const PRIORITY_OPTIONS: { value: LeavePriorityMode; label: string }[] = [
  { value: "none", label: "None" },
  { value: "priority", label: "Use Priority setting" },
];

export default function LeaveBehaviorForm({
  settings,
  onChange,
}: {
  settings: LeaveBehaviorSettings;
  onChange: (patch: Partial<LeaveBehaviorSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Effective From / Active / Hide in ESS row */}
      <LeaveEffectiveFromRow
        effectiveFrom={settings.effectiveFrom}
        onEffectiveFromChange={(v) => onChange({ effectiveFrom: v })}
        active={settings.active}
        onActiveChange={(v) => onChange({ active: v })}
        hideInEss={settings.hideInEss}
        onHideInEssChange={(v) => onChange({ hideInEss: v })}
      />

      {/* Day Type */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">Day Type</h3>
          <div className="h-px bg-gray-100 flex-1" />
        </div>
        <div className="flex items-center gap-8 flex-wrap">
          {DAY_TYPE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="day-type"
                checked={settings.dayType === opt.value}
                onChange={() => onChange({ dayType: opt.value })}
                className="accent-violet-600 w-4 h-4"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Priority setting */}
      <div className="rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col gap-3">
          {PRIORITY_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="priority-mode"
                checked={settings.priorityMode === opt.value}
                onChange={() => onChange({ priorityMode: opt.value })}
                className="accent-violet-600 w-4 h-4"
              />
              {opt.label}
            </label>
          ))}
        </div>

        <div className="h-px bg-gray-100 my-4" />

        <label className="flex items-start gap-2.5 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.considerExcessLopAsLop}
            onChange={(e) => onChange({ considerExcessLopAsLop: e.target.checked })}
            className="accent-violet-600 w-4 h-4 mt-0.5"
          />
          Consider excess Loss of Pay taken as LOP, i.e when there is 0 leave balance for priority
          leave(s)
        </label>
      </div>
    </div>
  );
}
