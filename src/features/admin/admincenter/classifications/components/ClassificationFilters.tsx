import { STATUS_FILTER_OPTIONS, CLASSIFICATION_TYPES } from "../constants/classification.constants";
import type { ClassificationFilters } from "../types/classification.types";

export default function ClassificationFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: ClassificationFilters;
  onChange: <K extends keyof ClassificationFilters>(key: K, value: ClassificationFilters[K]) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <select
        value={filters.status}
        onChange={(e) => onChange("status", e.target.value as ClassificationFilters["status"])}
        className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#7654e8]"
      >
        {STATUS_FILTER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.type}
        onChange={(e) => onChange("type", e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#7654e8]"
      >
        <option value="all">All Types</option>
        {CLASSIFICATION_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button
        onClick={onReset}
        className="text-sm text-[#7654e8] font-medium hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}
