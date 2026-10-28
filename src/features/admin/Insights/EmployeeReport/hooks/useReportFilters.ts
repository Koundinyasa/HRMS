// useReportFilters.ts
import { useState, useCallback } from "react";
import { DEFAULT_REPORT_FILTERS } from "../types/filters";
import type { ReportFilterState, ColumnVisibilityState } from "../types/filters";

export function useReportFilters(defaultColumns: ColumnVisibilityState = {}) {
  const [filters, setFilters] = useState<ReportFilterState>(DEFAULT_REPORT_FILTERS);
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibilityState>(defaultColumns);

  const clearAll = useCallback(() => {
    setFilters(DEFAULT_REPORT_FILTERS);
  }, []);

  const toggleColumn = useCallback((key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return {
    filters,
    setFilters,
    clearAll,
    visibleColumns,
    setVisibleColumns,
    toggleColumn,
  };
}