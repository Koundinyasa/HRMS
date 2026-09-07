import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import DropdownSelect from "../../../components/DropdownSelect";
import { PUNCH_FILTER_FIELDS } from "../constants/timeoffice.constants";
import { optionsFor } from "../hooks/punchMetrics";
import type { PunchFilters, PunchRow } from "../types/timeoffice.types";

interface PunchFilterBarProps {
  /** Unfiltered rows — chip options come from the data itself, not a hardcoded list. */
  rows: PunchRow[];
  filters: PunchFilters;
  onChange: (next: PunchFilters) => void;
  onClear: () => void;
}

export default function PunchFilterBar({ rows, filters, onChange, onClear }: PunchFilterBarProps) {
  // "+ Add Filter" reveals the chips; active ones stay visible once chosen.
  const [showChips, setShowChips] = useState(false);
  const activeCount = PUNCH_FILTER_FIELDS.filter(
    (field) => filters[field.filterKey as keyof PunchFilters]
  ).length;

  return (
    <div className="flex items-center gap-2 flex-wrap rounded-xl border border-slate-100 bg-white px-3 py-2">
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        <input
          className="w-full h-8 pl-8 pr-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-400"
          placeholder="Start Typing..."
          value={filters.search ?? ""}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowChips((open) => !open)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-emerald-600 whitespace-nowrap"
      >
        <Plus size={14} /> Add Filter
      </button>

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
              className={`h-8 rounded-lg border px-2 text-sm ${
                value ? "border-emerald-400 text-emerald-600 font-medium" : "border-slate-200 text-slate-600"
              }`}
            />
          );
        })}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          title="Clear filters"
          className="text-red-500 hover:text-red-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
