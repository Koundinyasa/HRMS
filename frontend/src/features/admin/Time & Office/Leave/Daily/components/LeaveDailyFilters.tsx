import { ChevronDown } from "lucide-react";
import type { LeaveDailyFilters as LeaveDailyFilterValues } from "../types/leaveDaily.types";

interface LeaveDailyFiltersProps {
  filters: LeaveDailyFilterValues;
  onChange: (filters: LeaveDailyFilterValues) => void;
  onApply?: () => void;
  onReset?: () => void;
}

const LeaveDailyFilters = ({
  filters,
  onChange,
  onApply,
  onReset,
}: LeaveDailyFiltersProps) => {
  const updateFilter = (
    key: keyof LeaveDailyFilterValues,
    value: string | number | undefined,
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 font-[Urbanist]">
      {/* Employee Leave Policy */}
      <div className="relative">
        <select
          value={filters.leavePolicyId ?? ""}
          onChange={(event) =>
            updateFilter(
              "leavePolicyId",
              event.target.value || undefined,
            )
          }
          className="h-[40px] min-w-[190px] appearance-none rounded-md border border-slate-200 bg-white px-3 pr-9 text-[13px] font-medium leading-[18px] text-slate-600 outline-none focus:border-[#2563EB]"
        >
          <option value="">Employee Leave Policy</option>
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {/* Month */}
      <div className="relative">
        <select
          value={filters.month}
          onChange={(event) => updateFilter("month", event.target.value)}
          className="h-[40px] min-w-[150px] appearance-none rounded-md border border-slate-200 bg-white px-3 pr-9 text-[13px] font-medium leading-[18px] text-slate-600 outline-none focus:border-[#2563EB]"
        >
          <option value="">Select Month</option>
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {onApply && (
        <button
          type="button"
          onClick={onApply}
          className="h-[40px] rounded-md bg-[#2563EB] px-4 font-[Urbanist] text-[13px] font-semibold leading-[18px] text-white transition hover:bg-[#1D4ED8]"
        >
          Apply
        </button>
      )}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="h-[40px] rounded-md border border-slate-200 bg-white px-4 font-[Urbanist] text-[13px] font-medium leading-[18px] text-slate-600 transition hover:bg-slate-50"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default LeaveDailyFilters;