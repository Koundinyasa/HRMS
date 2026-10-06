import { useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MoreVertical, Plus, Search, X } from "lucide-react";
import LeaveQueryFilter from "../../components/LeaveQueryFilter";

export interface ReportFilterOption {
  key: string;
  label: string;
  options?: string[];
}

interface ReportFiltersProps {
  showFilters: boolean;
  onHideFilters: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  onSearch?: () => void;
  onAddFilter?: () => void;
  filterOptions?: ReportFilterOption[];
  selectedFilters?: Record<string, string[]>;
  onFiltersChange?: (filters: Record<string, string[]>) => void;
}

export default function ReportFilters({
  showFilters,
  onHideFilters,
  search,
  onSearchChange,
  onSearch,
  onAddFilter,
  filterOptions = [],
  selectedFilters = {},
  onFiltersChange,
}: ReportFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  if (!showFilters) return null;

  const updateFilter = (key: string, value: string) => {
    onFiltersChange?.({
      ...selectedFilters,
      [key]: value === "All" || value === key ? [] : [value],
    });
    setOpenDropdown(null);
    setDropdownPosition(null);
  };

  return (
    <div className="mt-1 min-w-0 overflow-x-auto rounded-[9px] border border-[#ead2cc] bg-white px-3 py-2 font-[Urbanist] shadow-[0_1px_3px_rgba(15,23,42,0.04)] [scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f] xl:overflow-x-visible sm:px-4">
      <div className="flex min-h-[36px] w-max min-w-full flex-nowrap items-center gap-2 xl:w-full xl:flex-wrap">
      <div className="flex w-[230px] shrink-0 items-center gap-2 text-[#a45a4a]">
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onSearch?.()}
          placeholder="Start Typing..."
          className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#b8a6a1]"
        />
      </div>

      <button
        type="button"
        onClick={onAddFilter}
        className="flex h-9 items-center gap-2 px-2 text-[13px] font-medium text-[#039855] hover:text-[#027a48]"
      >
        <Plus size={17} /> Add Filter
      </button>

      <LeaveQueryFilter
        value={selectedFilters.query?.[0] ?? ""}
        onChange={(value) => onFiltersChange?.({
          ...selectedFilters,
          query: value ? [value] : [],
        })}
      />

      {filterOptions.filter((filter) => filter.key !== "query").slice(0, 7).map((filter) => (
        <div key={filter.key} className="relative shrink-0">
          <button
            type="button"
            onClick={(event) => {
              if (openDropdown === filter.key) {
                setOpenDropdown(null);
                setDropdownPosition(null);
                return;
              }
              const rect = event.currentTarget.getBoundingClientRect();
              setDropdownPosition({
                top: Math.min(rect.bottom + 4, window.innerHeight - Math.min(420, window.innerHeight * 0.6) - 8),
                left: Math.max(8, Math.min(rect.left, window.innerWidth - 190)),
              });
              setOpenDropdown(filter.key);
            }}
            className="flex h-9 items-center gap-1 rounded-[7px] px-2 text-[13px] font-medium text-[#475467] hover:bg-[#fff7f5] hover:text-[#9a5547]"
          >
            {filter.key === "query" && <Search size={14} />}
            {selectedFilters[filter.key]?.[0] || filter.label}
            <ChevronDown size={14} />
          </button>
          {openDropdown === filter.key && dropdownPosition && createPortal(
            <div style={{ top: dropdownPosition.top, left: dropdownPosition.left }} className="fixed z-[100] max-h-[min(60vh,420px)] min-w-[170px] overflow-y-auto rounded-lg border border-[#ead2cc] bg-white p-1 shadow-[0_8px_25px_rgba(15,23,42,0.14)]">
              {(filter.options ?? ["All"]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateFilter(filter.key, option)}
                  className="block w-full rounded px-3 py-2 text-left text-[12px] text-[#475467] hover:bg-[#fff5f2] hover:text-[#9a5547]"
                >
                  {option}
                </button>
              ))}
            </div>,
            document.body,
          )}
        </div>
      ))}

      {filterOptions.length > 7 && (
        <button type="button" className="flex h-9 w-8 items-center justify-center text-[#a45a4a]">
          <MoreVertical size={18} />
        </button>
      )}
      <button
        type="button"
        onClick={onHideFilters}
        className="flex h-9 w-8 items-center justify-center text-[#f04438]"
        title="Hide filters"
      >
        <X size={19} />
      </button>
      </div>
    </div>
  );
}
