import {
  useGetEmployeePunchDashboardQuery,
} from "../api/punchApi";

import type {
  PunchDashboardParams,
  UsePunchDashboardResult,
} from "../types/punch.types";

export function usePunchDashboard(
  params: PunchDashboardParams | null,
): UsePunchDashboardResult {
  const query = useGetEmployeePunchDashboardQuery(
    params ?? { employeeId: "" },
    { skip: !params?.employeeId },
  );

  return {
    data: query.data ?? null,
    isLoading: query.isLoading || query.isFetching,
    error: query.error
      ? "Failed to load punch dashboard."
      : null,
    refetch: async () => {
      if (params?.employeeId) {
        await query.refetch();
      }
    },
  };
}
