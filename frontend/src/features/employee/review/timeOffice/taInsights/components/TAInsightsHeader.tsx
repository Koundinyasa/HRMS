import React from "react";
import { Filter, RefreshCw, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";
import type { TAInsightFilters } from "../types/taInsightsTypes";

interface TAInsightsHeaderProps {
  onAddFilter: () => void;
  filters: TAInsightFilters;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onRefresh: () => void;
  onClear: () => void;
}

const TAInsightsHeader: React.FC<TAInsightsHeaderProps> = ({
  onAddFilter,
  filters,
  onFromDateChange,
  onToDateChange,
  onRefresh,
  onClear,
}) => {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap border-b-2 px-1 py-5 text-[15px] font-semibold ${
      isActive
        ? "border-[#1997e8] text-[#1997e8]"
        : "border-transparent text-[#68758a]"
    }`;

  return (
    <div className="mb-3 flex flex-col gap-3 rounded-xl border border-[#e0e5ec] bg-white p-3 shadow-sm xl:flex-row xl:items-center xl:justify-between font-[Urbanist]">
      <div className="flex min-w-0 items-center gap-4 overflow-x-auto px-1 sm:gap-6 font-[Urbanist]">
        <NavLink to="../Punch" className={tabClass}>Punch</NavLink>
        <NavLink to="../MissedPunch" className={tabClass}>Missed Punch</NavLink>
        <NavLink to="../time-office/regularization/attendance" className={tabClass}>
          Attendance
        </NavLink>
        <NavLink to="../TAInsights" className={tabClass}>TA Insights</NavLink>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-[Urbanist]">
        <Button
        type="button"
          variant="ghost"
          size="sm"
        onClick={onAddFilter}
          className="gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 font-[Urbanist]"
      >
          <Filter size={16} />
          Add Filter
        </Button>

        <label className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium text-[#1f2937] sm:flex-none font-[Urbanist]">
          From
          <DateField value={filters.fromDate ?? ""} onChange={onFromDateChange} />
        </label>
        <label className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium text-[#1f2937] sm:flex-none font-[Urbanist]">
          To
          <DateField value={filters.toDate ?? ""} onChange={onToDateChange} />
        </label>

        <Button type="button" variant="ghost" size="icon" title="Refresh" onClick={onRefresh}>
          <RefreshCw size={18} />
        </Button>
        <Button type="button" variant="ghost" size="icon" title="Clear filters" onClick={onClear}>
          <X size={18} className="text-red-500 font-[Urbanist]" />
        </Button>
      </div>
    </div>
  );
};

export default TAInsightsHeader;