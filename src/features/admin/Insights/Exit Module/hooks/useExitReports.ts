import { useGetExitReportsQuery } from "../api/exitReportsApi";

import type { ExitReportFilters } from "../types/exitReport.types";

/** Fetches the employee rows for a given (already-composed) filter state. */
export const useExitReports = (filters: ExitReportFilters) => {
  const { data, isLoading, isFetching, error, refetch } = useGetExitReportsQuery(filters);

  return {
    employees: data ?? [],
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
