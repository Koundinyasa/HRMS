import {
  ChevronDown,
  MoreVertical,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type {
  MissedPunchFiltersProps,
} from "../types/missedPunch.types";

export default function MissedPunchFilters({
  filters,
  onSearchChange,
}: MissedPunchFiltersProps) {
  return (
    <div className="mt-2 space-y-2 font-[Urbanist]">

      {/* =====================================================
          SEARCH / FILTER BAR
      ===================================================== */}

      <div className="punch-horizontal-scroll flex w-full min-w-0 items-center justify-between gap-3 overflow-x-auto rounded-xl border border-[#e0e5ec] bg-white px-3 py-3 sm:px-4">

        {/* SEARCH */}

        <div className="flex w-[150px] shrink-0 items-center gap-3">

          <Search
            size={20}
            className="shrink-0 text-[#8ba2c5] font-[Urbanist]"
          />

          <input
            type="text"
            value={
              filters.searchText
            }
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Start Typing..."
            className="min-w-0 w-full bg-transparent text-sm text-[#374151] outline-none placeholder:text-[#9aa9bd]"
          />

        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* ADD FILTER */}
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium text-[#68758a]"
          >
            <SlidersHorizontal size={14} />
            Add Filter
          </button>

        {/* QUERY */}

          <button
            type="button"
            className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-medium text-[#68758a]"
          >
            Query <ChevronDown size={12} />
          </button>

        {/* T&A POLICY */}

          <button
            type="button"
            className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-medium text-[#68758a]"
          >
            T&A Policy <ChevronDown size={12} />
          </button>

        {/* PATTERN */}

          <button
            type="button"
            className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-medium text-[#68758a]"
          >
            Pattern <ChevronDown size={12} />
          </button>

        {/* TA SUPERVISOR */}

          <button
            type="button"
            className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-medium text-[#68758a]"
          >
            TA Supervisor <ChevronDown size={12} />
          </button>

        {/* ATTENDANCE */}

          <button
            type="button"
            className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-medium text-[#68758a]"
          >
            Attendance <ChevronDown size={12} />
          </button>

        {/* LEAVE */}

          <button
            type="button"
            className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-medium text-[#68758a]"
          >
            Leave <ChevronDown size={12} />
          </button>

          <MoreVertical
            size={16}
            className="hidden shrink-0 text-[#7f94b5] xl:block font-[Urbanist]"
          />

          <button
            type="button"
            title="Clear"
            onClick={() => onSearchChange("")}
            className="shrink-0 text-red-500 hover:text-red-600 font-[Urbanist]"
          >
            <X size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}