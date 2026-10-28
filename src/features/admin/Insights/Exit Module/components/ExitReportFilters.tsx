
import { Search, RotateCcw } from "lucide-react";

import { useExitFilters } from "../hooks/useExitFilters";
import type { ExitReportFilters as ExitReportFiltersType } from "../types/exitReport.types";

interface ExitReportFiltersProps {
  onFiltersChange?: (filters: ExitReportFiltersType) => void;
}

export default function ExitReportFilters({
  onFiltersChange,
}: ExitReportFiltersProps) {
  const {
    filters,
    setSearch,
    setValues,
    clearAll,
    options,
  } = useExitFilters();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFiltersChange?.({ ...filters, search: value });
  };

  const handleBranchChange = (value: string) => {
    const branch = value ? [value] : [];
    setValues("branch", branch);
    onFiltersChange?.({ ...filters, branch });
  };

  const handleDesignationChange = (value: string) => {
    const designation = value ? [value] : [];
    setValues("designation", designation);
    onFiltersChange?.({ ...filters, designation });
  };

  const handleStatusChange = (value: string) => {
    const empStatus = value ? [value] : [];
    setValues("empStatus", empStatus);
    onFiltersChange?.({ ...filters, empStatus });
  };

  const handleReset = () => {
    clearAll();
    onFiltersChange?.({
      search: "",
      query: [],
      branch: [],
      salaryStructure: [],
      leave: [],
      attendance: [],
      designation: [],
      empStatus: [],
    });
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Exit Report
        </h2>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search
          </label>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={filters.search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Employee ID / Name"
              className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Branch
          </label>

          <select
            value={filters.branch[0] ?? ""}
            onChange={(event) => handleBranchChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none"
          >
            <option value="">All Branches</option>
            {options.branch.data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Designation
          </label>

          <select
            value={filters.designation[0] ?? ""}
            onChange={(event) =>
              handleDesignationChange(event.target.value)
            }
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none"
          >
            <option value="">All Designations</option>
            {options.designation.data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Employee Status
          </label>

          <select
            value={filters.empStatus[0] ?? ""}
            onChange={(event) => handleStatusChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none"
          >
            <option value="">All Statuses</option>
            {options.empStatus.data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
