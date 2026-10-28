






import { useState } from "react";
import { Search, Plus, ChevronDown, X } from "lucide-react";

import OnboardFilterDropdown from "./OnboardFilterDropdown";
import { FILTER_OPTIONS } from "../constants/onboard.constants";

interface OnboardFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (
    key: "branch" | "designation" | "employeeStatus",
    value: string,
  ) => void;
  onReset: () => void;
}

const DROPDOWNS: { label: string; key: string; isQuery?: boolean }[] = [
  { label: "Query", key: "query", isQuery: true },
  { label: "Branch", key: "branch" },
  { label: "Salary Structure", key: "salaryStructure" },
  { label: "Leave", key: "leave" },
  { label: "Attendance", key: "attendance" },
  { label: "Designation", key: "designation" },
  { label: "Emp Status", key: "employeeStatus" },
];

export default function OnboardFilters({
  search,
  onSearchChange,
  onFilterChange,
  onReset,
}: OnboardFiltersProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const handleChange = (key: string, values: string[]) => {
    setSelections((prev) => ({ ...prev, [key]: values }));

    if (key === "branch" || key === "designation" || key === "employeeStatus") {
      onFilterChange(key, values[0] ?? "");
    }
  };

  const handleClearOne = (key: string) => {
    handleChange(key, []);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
      <div className="flex min-w-[160px] items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-slate-400">
        <Search size={13} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search ."
          className="w-full border-none bg-transparent text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <button
        type="button"
        className="flex items-center gap-1.5 rounded-md bg-[#D97B3F] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#C2672E]"
      >
        <Plus size={13} />
        Add Filter
      </button>

      {DROPDOWNS.map(({ label, key, isQuery }) => {
        const count = selections[key]?.length ?? 0;
        return (
          <div key={key} className="relative">
            <button
              type="button"
              onClick={() => setOpenKey(openKey === key ? null : key)}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              {label}
              {count > 0 && (
                <span className="rounded-full bg-[#D97B3F] px-1.5 text-[10px] text-white">
                  {count}
                </span>
              )}
              <ChevronDown size={12} />
            </button>

            {openKey === key && (
              <OnboardFilterDropdown
                label={label}
                filterKey={key}
                options={FILTER_OPTIONS[key] ?? []}
                isQuery={isQuery}
                selected={selections[key] ?? []}
                onChange={handleChange}
                onClear={handleClearOne}
                onClose={() => setOpenKey(null)}
              />
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => {
          onReset();
          setSelections({});
          setOpenKey(null);
        }}
        className="ml-auto flex items-center gap-1 text-xs font-medium text-[#D97B3F] hover:text-[#C2672E]"
      >
        <X size={13} />
        Clear
      </button>
    </div>
  );
}