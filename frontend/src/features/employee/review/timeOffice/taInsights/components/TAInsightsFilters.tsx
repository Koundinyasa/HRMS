import React from "react";
import { Button } from "@/components/ui/button";
import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";
import type { TAInsightFilters } from "../types/taInsightsTypes";

interface TAInsightsFiltersProps {
  filters: TAInsightFilters;
  onChange: (filters: TAInsightFilters) => void;
  onClose: () => void;
}

const TAInsightsFilters: React.FC<TAInsightsFiltersProps> = ({
  filters,
  onChange,
  onClose,
}) => {
  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Employee ID
          </label>

          <input
            type="text"
            value={filters.employeeId || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                employeeId: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Employee ID"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            From Date
          </label>

          <DateField
            value={filters.fromDate || ""}
            onChange={(fromDate) => onChange({ ...filters, fromDate })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            To Date
          </label>

          <DateField
            value={filters.toDate || ""}
            onChange={(toDate) => onChange({ ...filters, toDate })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Search
          </label>

          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                search: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Search employee"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default TAInsightsFilters;