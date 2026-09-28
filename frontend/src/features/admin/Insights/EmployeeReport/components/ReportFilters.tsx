






import { Search, X } from "lucide-react";
import type { ReportFilterState } from "../types/filters";
import type { StatusOption } from "../constants/employeeReport.constants";
import FilterBar from "../../../components/FilterBar";
import type { FilterOption } from "../../../components/FilterDropdown";
import type { FilterFieldKey } from "../../../components/Filterfields.constants";

interface ReportFiltersProps {
  filters: ReportFilterState;
  onFiltersChange: (filters: ReportFilterState) => void;
  onClearAll: () => void;
  showDateRange?: boolean;
  statusOptions?: StatusOption[];
  /** Option lists for the Query/Branch/Designation/etc. dropdowns, keyed by
   *  field. Leave a field out to render it as an empty "No options
   *  available" dropdown until real option data is wired in from the API. */
  quickFilterOptions?: Partial<Record<FilterFieldKey, FilterOption[]>>;
}

export default function ReportFilters({
  filters,
  onFiltersChange,
  onClearAll,
  showDateRange = false,
  statusOptions,
  quickFilterOptions = {},
}: ReportFiltersProps) {
  const toggleStatus = (value: string) => {
    const next = filters.status.includes(value)
      ? filters.status.filter((s) => s !== value)
      : [...filters.status, value];
    onFiltersChange({ ...filters, status: next });
  };

  const setQuickFilter = (key: FilterFieldKey, value: string[] | string) => {
    onFiltersChange({ ...filters, quickFilters: { ...filters.quickFilters, [key]: value } });
  };

  const clearQuickFilters = () => {
    onFiltersChange({ ...filters, quickFilters: {} });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-6 py-3 flex flex-col gap-3">
      {!showDateRange && (
        <div className="flex items-center gap-3 flex-wrap">
          <FilterBar
            fieldOptions={quickFilterOptions}
            values={filters.quickFilters}
            onChange={setQuickFilter}
            onClearAll={clearQuickFilters}
            variant="chip"
          />

          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              placeholder="Search..."
              className="w-full border border-gray-200 rounded-md pl-8 pr-3 py-1.5 text-sm outline-none focus:border-brand-300"
            />
          </div>

          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
            Clear
          </button>
        </div>
      )}

      {showDateRange && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">From</span>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onFiltersChange({ ...filters, fromDate: e.target.value })}
              placeholder="DD-MM-YYYY"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-300 min-w-[160px]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">To</span>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => onFiltersChange({ ...filters, toDate: e.target.value })}
              placeholder="DD-MM-YYYY"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-300 min-w-[160px]"
            />
          </div>

          {statusOptions && (
            <div className="flex items-end gap-3 flex-wrap pb-2">
              {statusOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.status.includes(opt.value)}
                    onChange={() => toggleStatus(opt.value)}
                    className="rounded border-gray-300 text-brand-700 focus:ring-brand-500"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-600 ml-auto self-end pb-2"
          >
            <X size={14} />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}