import LeaveEffectiveFromRow from "./LeaveEffectiveFromRow";
import type { LeaveBehaviorSettings } from "../types/leavePolicy.types";

function Check({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-2.5 text-sm text-gray-700 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-violet-600 w-4 h-4 mt-0.5"
      />
      <span>{children}</span>
    </label>
  );
}

export default function LeaveHolidayWeeklyOffForm({
  settings,
  onChange,
  leaveName,
}: {
  settings: LeaveBehaviorSettings;
  onChange: (patch: Partial<LeaveBehaviorSettings>) => void;
  /** Name of the leave this settings screen belongs to, e.g. "Loss of Pay" — interpolated into the labels below. */
  leaveName: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <LeaveEffectiveFromRow
        effectiveFrom={settings.effectiveFrom}
        onEffectiveFromChange={(v) => onChange({ effectiveFrom: v })}
        active={settings.active}
        onActiveChange={(v) => onChange({ active: v })}
        hideInEss={settings.hideInEss}
        onHideInEssChange={(v) => onChange({ hideInEss: v })}
      />

      <div className="rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
        <Check
          checked={settings.excludeHolidayFromEss}
          onChange={(v) => onChange({ excludeHolidayFromEss: v })}
        >
          While Applying Leave From ESS Exclude Holiday
        </Check>

        <Check
          checked={settings.considerLopOnHoliday}
          onChange={(v) => onChange({ considerLopOnHoliday: v })}
        >
          If Applied <strong>{leaveName}</strong> has Holiday, consider as <strong>{leaveName}</strong>{" "}
          (Leave - Holiday - Leave)
        </Check>

        <Check
          checked={settings.excludeWeeklyOffFromEss}
          onChange={(v) => onChange({ excludeWeeklyOffFromEss: v })}
        >
          While Applying Leave From ESS Exclude Weekly Off
        </Check>

        <Check
          checked={settings.considerLopOnWeeklyOff}
          onChange={(v) => onChange({ considerLopOnWeeklyOff: v })}
        >
          If Applied <strong>{leaveName}</strong> has Weekly off, Consider as <strong>{leaveName}</strong>{" "}
          (Leave - Weekly Off - Leave)
        </Check>
      </div>
    </div>
  );
}
