import { Calendar, Clock, ChevronDown } from "lucide-react";
import LeavePolicyToggle from "./LeavePolicyToggle";
import { EFFECTIVE_FROM_OPTIONS } from "../constants/leavePolicy.constants";

export default function LeaveEffectiveFromRow({
  effectiveFrom,
  onEffectiveFromChange,
  active,
  onActiveChange,
  hideInEss,
  onHideInEssChange,
}: {
  effectiveFrom: string;
  onEffectiveFromChange: (value: string) => void;
  active: boolean;
  onActiveChange: (value: boolean) => void;
  hideInEss: boolean;
  onHideInEssChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 bg-[#F5F3FF] rounded-xl px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-violet-500 shrink-0">
          <Calendar size={17} />
        </span>
        <span className="text-sm font-medium text-gray-700">Effective From</span>
      </div>

      <div className="relative">
        <select
          value={effectiveFrom}
          onChange={(e) => onEffectiveFromChange(e.target.value)}
          className="appearance-none h-9 rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 outline-none"
        >
          {EFFECTIVE_FROM_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      <LeavePolicyToggle
        checked={active}
        onChange={onActiveChange}
        label="Active"
        labelClassName={active ? "text-emerald-600" : "text-gray-500"}
      />

      <LeavePolicyToggle checked={hideInEss} onChange={onHideInEssChange} label="Hide in ESS" />

      <Clock size={18} className="text-gray-400" />
    </div>
  );
}
