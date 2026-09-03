import { Search, X } from "lucide-react";

import {
  SEPARATION_STATUS,
  SEPARATION_TYPES,
} from "../constants/separationConstants";

import type { SeparationFilters as Filters } from "../types/separationTypes";

interface SeparationFiltersProps {
  filters: Filters;
  onChange: (
    key: keyof Filters,
    value: string
  ) => void;
  onReset: () => void;
}

export default function SeparationFilters({
  filters,
  onChange,
  onReset,
}: SeparationFiltersProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 mb-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={filters.search}
            onChange={(event) =>
              onChange("search", event.target.value)
            }
            placeholder="Search employee..."
            className="h-10 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <select
          value={filters.status}
          onChange={(event) =>
            onChange("status", event.target.value)
          }
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none"
        >
          <option value="">All Status</option>

          {SEPARATION_STATUS.map((status) => (
            <option
              key={status.value}
              value={status.value}
            >
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={filters.separationType}
          onChange={(event) =>
            onChange(
              "separationType",
              event.target.value
            )
          }
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none"
        >
          <option value="">All Separation Types</option>

          {SEPARATION_TYPES.map((type) => (
            <option
              key={type.value}
              value={type.value}
            >
              {type.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 text-sm text-gray-700 hover:bg-gray-50"
        >
          <X size={15} />
          Reset
        </button>
      </div>
    </div>
  );
}