import {
  Search,
  RotateCcw,
} from "lucide-react";

import { EXIT_DEPARTMENTS, EXIT_STATUS } from "../constants/exitReport.constants";
import { useExitReports } from "../hooks/useExitReports";

export default function ExitReportFilters() {
  const {
    filters,
    searchText,
    setSearchText,
    updateFilter,
    clearFilters,
  } = useExitReports();

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* <div className="mb-4 flex items-center justify-between"> */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Exit Report
        </h2>

        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"> */}
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
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Employee ID / Name"
              // className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-gray-600"

              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Department
          </label>

          <select
            value={filters.department}
            onChange={(event) =>
              updateFilter("department", event.target.value)
            }
            // className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-600"
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none"
          >
            {EXIT_DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            From Date
          </label>

          <input
            type="date"
            value={filters.fromDate}
            onChange={(event) =>
              updateFilter("fromDate", event.target.value)
            }
            // className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none"
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            To Date
          </label>

          <input
            type="date"
            value={filters.toDate}
            onChange={(event) =>
              updateFilter("toDate", event.target.value)
            }
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={filters.status}
            onChange={(event) =>
              updateFilter("status", event.target.value)
            }
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none"
          >
            {EXIT_STATUS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}