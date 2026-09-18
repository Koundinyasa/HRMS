










// ReportFilters.tsx
import { useEffect, useRef, useState } from "react";
import { Search, Plus, MoreVertical, X, ChevronDown } from "lucide-react";
import { FILTER_DROPDOWNS } from "../constants/leaveReport.constants";
import type { FilterDropdownConfig } from "../constants/leaveReport.constants";
import type { ReportFilterState } from "../types/filters";

interface ReportFiltersProps {
  filters: ReportFilterState;
  onFiltersChange: (filters: ReportFilterState) => void;
  onClearAll: () => void;
}

export default function ReportFilters({
  filters,
  onFiltersChange,
  onClearAll,
}: ReportFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close any open dropdown when clicking outside the filter bar.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const getSelected = (key: FilterDropdownConfig["key"]): string[] => {
    if (key === "query") return [];
    return (filters[key] as string[]) ?? [];
  };

  const toggleOption = (key: FilterDropdownConfig["key"], value: string) => {
    const current = getSelected(key);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: next });
  };

  const toggleSelectAll = (dropdown: FilterDropdownConfig) => {
    const allValues = (dropdown.options ?? []).map((o) => o.value);
    const current = getSelected(dropdown.key);
    const allSelected = allValues.length > 0 && allValues.every((v) => current.includes(v));
    onFiltersChange({ ...filters, [dropdown.key]: allSelected ? [] : allValues });
  };

  const clearDropdown = (dropdown: FilterDropdownConfig) => {
    if (dropdown.type === "search") {
      onFiltersChange({ ...filters, query: "" });
    } else {
      onFiltersChange({ ...filters, [dropdown.key]: [] });
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, query: e.target.value });
  };

  return (
    <div
      ref={wrapperRef}
      className="bg-white rounded-lg shadow-sm border border-gray-200 px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3 flex-wrap"
    >
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 min-w-[160px]">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Start Typing..."
          className="w-full text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
        />
      </div>

      {/* Add Filter */}
      <button
        type="button"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-800 text-white text-sm font-medium hover:bg-orange-900 transition-colors whitespace-nowrap shrink-0"
      >
        <Plus size={14} />
        Add Filter
      </button>

      {/* Dropdown filters */}
      {FILTER_DROPDOWNS.map((dropdown) => {
        const selected = getSelected(dropdown.key);
        const hasSelection =
          dropdown.type === "search" ? !!filters.query : selected.length > 0;
        const allValues = (dropdown.options ?? []).map((o) => o.value);
        const allSelected =
          allValues.length > 0 && allValues.every((v) => selected.includes(v));

        return (
          <div key={dropdown.key} className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((p) => (p === dropdown.key ? null : dropdown.key))
              }
              className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                hasSelection ? "text-orange-800" : "text-gray-700 hover:text-orange-800"
              }`}
            >
              {dropdown.label}
              {hasSelection && dropdown.type === "checkbox" && (
                <span className="text-xs bg-orange-100 text-orange-800 rounded-full px-1.5">
                  {selected.length}
                </span>
              )}
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {openDropdown === dropdown.key && (
              <div className="absolute z-20 mt-2 w-64 max-w-[90vw] bg-white border border-gray-200 rounded-md shadow-lg py-2 text-sm max-h-80 overflow-y-auto">
                {dropdown.type === "search" ? (
                  <div className="px-3">
                    <input
                      type="text"
                      autoFocus
                      value={filters.query}
                      onChange={handleQueryChange}
                      placeholder="Enter query..."
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-orange-400"
                    />
                  </div>
                ) : (
                  <>
                    {dropdown.showSelectAllHeader && (
                      <label className="flex items-center gap-2 px-3 py-2 font-semibold text-gray-800 cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={() => toggleSelectAll(dropdown)}
                          className="w-4 h-4 rounded border-gray-300 text-orange-800 focus:ring-orange-400"
                        />
                        {dropdown.label}
                      </label>
                    )}
                    {dropdown.showHeaderLabel && (
                      <div className="px-3 py-2 font-semibold text-gray-800">
                        {dropdown.label}
                      </div>
                    )}
                    {(dropdown.options ?? []).map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(option.value)}
                          onChange={() => toggleOption(dropdown.key, option.value)}
                          className="w-4 h-4 rounded border-gray-300 text-orange-800 focus:ring-orange-400"
                        />
                        {option.label}
                      </label>
                    ))}
                  </>
                )}

                <div className="border-t border-gray-100 mt-2 pt-2 px-3">
                  <button
                    type="button"
                    onClick={() => clearDropdown(dropdown)}
                    disabled={!hasSelection}
                    className={`flex items-center gap-1 text-sm ${
                      hasSelection
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <X size={14} />
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Kebab menu */}
      <button
        type="button"
        aria-label="More filter options"
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {/* Clear all */}
      <button
        type="button"
        onClick={onClearAll}
        aria-label="Clear all filters"
        className="text-red-500 hover:text-red-600 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}