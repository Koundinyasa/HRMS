import { useEffect, useRef, useState } from "react";
import { MoreVertical, Plus, Search, X } from "lucide-react";
import DropdownSelect from "../../../components/DropdownSelect";
import { PUNCH_FILTER_FIELDS } from "../constants/timeoffice.constants";
import { optionsFor } from "../hooks/punchMetrics";
import type { PunchFilterBarProps, PunchFilters } from "../types/timeoffice.types";

export default function PunchFilterBar({ rows, filters, onChange, onClear, onDismiss, showChipsInitially = false, showOverflowControls = false, showAddFilter = true, scrollable = false, searchPlaceholder = "Start Typing...", showSearch = true }: PunchFilterBarProps) {
  // "+ Add Filter" reveals the chips; active ones stay visible once chosen.
  const [showChips, setShowChips] = useState(showChipsInitially);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const activeCount = PUNCH_FILTER_FIELDS.filter(
    (field) => filters[field.filterKey as keyof PunchFilters]
  ).length;

  useEffect(() => {
    if (!showSearch && filterBarRef.current) {
      filterBarRef.current.scrollLeft = 0;
    }
  }, [showSearch]);

  return (
    <div ref={filterBarRef} className={`flex min-w-0 items-center justify-start gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 ${scrollable ? "flex-nowrap overflow-x-auto punch-horizontal-scroll [touch-action:pan-x]" : "flex-wrap"}`}>
      {showSearch && (
        <div className="relative min-w-[180px] flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            className="w-full h-8 pl-8 pr-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-400"
            placeholder={searchPlaceholder}
            value={filters.search ?? ""}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>
      )}

      {showAddFilter && (
        <button
          type="button"
          onClick={() => setShowChips((open) => !open)}
          className={`flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-slate-600 hover:text-emerald-600 ${showSearch ? "" : "ml-auto"}`}
        >
          <Plus size={14} /> Add Filter
        </button>
      )}

      {(showChips || activeCount > 0) &&
        PUNCH_FILTER_FIELDS.map((field) => {
          const value = (filters[field.filterKey as keyof PunchFilters] as string) ?? "";
          if (!showChips && !value) return null;

          return (
            <DropdownSelect
              key={field.filterKey}
              value={value}
              onChange={(next) => onChange({ [field.filterKey]: next || undefined })}
              options={[
                { label: field.label, value: "" },
                ...optionsFor(rows, field.value).map((option) => ({ label: option, value: option })),
              ]}
              menuClassName="w-44"
              align={field.filterKey === "leave" ? "right" : "left"}
              portalMenu
              className={`h-8 shrink-0 rounded-lg border px-2 text-sm ${
                value ? "border-emerald-400 text-emerald-600 font-medium" : "border-slate-200 text-slate-600"
              }`}
            />
          );
        })}

      {showOverflowControls && (
        <button
          type="button"
          aria-label={showChips ? "Hide filters" : "Show filters"}
          title={showChips ? "Hide filters" : "Show filters"}
          aria-pressed={showChips}
          onClick={() => setShowChips((open) => !open)}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-500"
        >
          <MoreVertical size={17} />
        </button>
      )}

      {(activeCount > 0 || showChips || onDismiss) && (
        <button
          type="button"
          aria-label="Close filters and clear selections"
          onClick={() => {
            if (onDismiss) {
              onDismiss();
            } else {
              setShowChips(false);
              onClear();
            }
          }}
          title={onDismiss ? "Close filter bar" : "Close filters and clear selections"}
          className="shrink-0 text-red-500 hover:text-red-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
