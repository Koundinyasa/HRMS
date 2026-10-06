import { useCallback, useState } from "react";

export interface ReportFilters {
  search: string;
  fromDate: string | null;
  toDate: string | null;
  month: string | null;
}

const INITIAL_FILTERS: ReportFilters = {
  search: "",
  fromDate: null,
  toDate: null,
  month: null,
};

export const useReportFilters = (
  initialFilters: Partial<ReportFilters> = {}
) => {
  const [filters, setFilters] = useState<ReportFilters>({
    ...INITIAL_FILTERS,
    ...initialFilters,
  });

  const updateFilter = useCallback(
    <K extends keyof ReportFilters>(
      key: K,
      value: ReportFilters[K]
    ) => {
      setFilters((previous) => ({
        ...previous,
        [key]: value,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({
      ...INITIAL_FILTERS,
      ...initialFilters,
    });
  }, [initialFilters]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
  };
};

export default useReportFilters;