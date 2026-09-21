import {
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
    <div className="mt-2 space-y-2">

      {/* =====================================================
          SEARCH / FILTER BAR
      ===================================================== */}

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#e0e5ec] bg-white px-3 py-3 sm:px-4 xl:flex-nowrap xl:flex-row">

        {/* SEARCH */}

        <div className="flex min-w-0 w-full flex-1 items-center gap-3 xl:w-auto">

          <Search
            size={20}
            className="shrink-0 text-[#8ba2c5]"
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
            className="w-full bg-transparent text-sm text-[#374151] outline-none placeholder:text-[#9aa9bd]"
          />

        </div>

        {/* ADD FILTER */}

        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-[#68758a]"
        >
          <SlidersHorizontal
            size={17}
          />
          Add Filter
        </button>

        {/* QUERY */}

        <button
          type="button"
          className="text-sm font-semibold text-[#68758a]"
        >
          Query⌄
        </button>

        {/* T&A POLICY */}

        <button
          type="button"
          className="text-sm font-semibold text-[#68758a]"
        >
          T&A Policy⌄
        </button>

        {/* PATTERN */}

        <button
          type="button"
          className="text-sm font-semibold text-[#68758a]"
        >
          Pattern⌄
        </button>

        {/* TA SUPERVISOR */}

        <button
          type="button"
          className="text-sm font-semibold text-[#68758a]"
        >
          TA Supervisor⌄
        </button>

        {/* ATTENDANCE */}

        <button
          type="button"
          className="text-sm font-semibold text-[#68758a]"
        >
          Attendance⌄
        </button>

        {/* LEAVE */}

        <button
          type="button"
          className="text-sm font-semibold text-[#68758a]"
        >
          Leave⌄
        </button>

        <MoreVertical
          size={20}
          className="hidden shrink-0 text-[#7f94b5] xl:block"
        />

        <button
          type="button"
          title="Clear"
          onClick={() =>
            onSearchChange("")
          }
          className="shrink-0 text-red-500 hover:text-red-600"
        >
          <X size={21} />
        </button>

      </div>
    </div>
  );
}