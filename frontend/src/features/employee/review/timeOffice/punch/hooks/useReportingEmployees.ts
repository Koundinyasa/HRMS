import {
  useGetReportingEmployeesQuery,
} from "../api/punchApi";

import type {
  UseReportingEmployeesResult,
} from "../types/punch.types";

export function useReportingEmployees(): UseReportingEmployeesResult {
  const query = useGetReportingEmployeesQuery();

  return {
    employees: query.data ?? [],
    isLoading: query.isLoading || query.isFetching,
    error: query.error
      ? "Failed to load reporting employees."
      : null,
    refetch: async () => {
      await query.refetch();
    },
  };
}
