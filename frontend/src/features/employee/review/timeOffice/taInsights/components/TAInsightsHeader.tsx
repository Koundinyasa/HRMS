import React from "react";
import { Filter, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";
import TimeOfficeNavbar from "../../components/TimeOfficeNavbar";
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
  return (
    <TimeOfficeNavbar className="mb-3">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onAddFilter}
        className="shrink-0 gap-2 whitespace-nowrap text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <Filter size={16} />
        Add Filter
      </Button>

      <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-[#1f2937]">
        From
        <DateField
          value={filters.fromDate ?? ""}
          onChange={onFromDateChange}
          className="w-[140px] shrink-0"
        />
      </label>
      <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-[#1f2937]">
        To
        <DateField
          value={filters.toDate ?? ""}
          onChange={onToDateChange}
          className="w-[140px] shrink-0"
        />
      </label>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Refresh"
        onClick={onRefresh}
        className="shrink-0"
      >
        <RefreshCw size={18} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Clear filters"
        onClick={onClear}
        className="shrink-0"
      >
        <X size={18} className="text-red-500" />
      </Button>
    </TimeOfficeNavbar>
  );
};

export default TAInsightsHeader;