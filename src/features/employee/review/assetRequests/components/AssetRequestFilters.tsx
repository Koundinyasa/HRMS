import {
  Search,
  RotateCcw,
} from "lucide-react";

import {
  ASSET_REQUEST_PRIORITIES,
  ASSET_REQUEST_STATUS,
  ASSET_TYPES,
} from "../constants/assetRequestConstants";

import type {
  AssetRequestFilterParams,
} from "../types/assetRequest.types";

interface Props {
  filters: AssetRequestFilterParams;

  onChange: (
    filters: AssetRequestFilterParams
  ) => void;

  onReset: () => void;
}

const AssetRequestFilters = ({
  filters,
  onChange,
  onReset,
}: Props) => {
  return (
    <div className="mb-5 rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                search: e.target.value,
              })
            }
            placeholder="Search request..."
            className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Status */}
        <select
          value={filters.status ?? "All"}
          onChange={(e) =>
            onChange({
              ...filters,
              status: e.target.value as AssetRequestFilterParams["status"],
            })
          }
          className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="All">All Status</option>

          {ASSET_REQUEST_STATUS.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>

        {/* Asset Type */}
        <select
          value={filters.assetType ?? "All"}
          onChange={(e) =>
            onChange({
              ...filters,
              assetType: e.target.value,
            })
          }
          className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="All">
            All Asset Types
          </option>

          {ASSET_TYPES.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>

        {/* Priority */}
        <div className="flex gap-2">
          <select
            value={filters.priority ?? "All"}
            onChange={(e) =>
              onChange({
                ...filters,
                priority:
                  e.target.value as AssetRequestFilterParams["priority"],
              })
            }
            className="h-10 flex-1 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">
              All Priorities
            </option>

            {ASSET_REQUEST_PRIORITIES.map(
              (priority) => (
                <option
                  key={priority}
                  value={priority}
                >
                  {priority}
                </option>
              )
            )}
          </select>

          <button
            type="button"
            onClick={onReset}
            title="Reset filters"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetRequestFilters;