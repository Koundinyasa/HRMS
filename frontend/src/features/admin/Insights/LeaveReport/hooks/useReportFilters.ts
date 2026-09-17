// useReportFilters.ts
import { useState, useCallback } from "react";
import { DEFAULT_REPORT_FILTERS, DEFAULT_GROUP_BY_STATE } from "../types/filters";
import type { ReportFilterState, GroupByLeavePolicyState } from "../types/filters";
import { generateMonthOptions } from "../constants/leaveReport.constants";

export function useReportFilters() {
  const monthOptions = generateMonthOptions();

  const [fromMonth, setFromMonth] = useState(monthOptions[0]?.value ?? "");
  const [toMonth, setToMonth] = useState(monthOptions[0]?.value ?? "");
  const [filters, setFilters] = useState<ReportFilterState>(DEFAULT_REPORT_FILTERS);
  const [groupBy, setGroupBy] = useState<GroupByLeavePolicyState>(DEFAULT_GROUP_BY_STATE);

  const clearAll = useCallback(() => {
    setFilters(DEFAULT_REPORT_FILTERS);
    setGroupBy(DEFAULT_GROUP_BY_STATE);
  }, []);

  return {
    monthOptions,
    fromMonth,
    toMonth,
    setFromMonth,
    setToMonth,
    filters,
    setFilters,
    groupBy,
    setGroupBy,
    clearAll,
  };
}