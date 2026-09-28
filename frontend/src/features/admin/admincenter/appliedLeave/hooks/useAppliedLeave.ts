// frontend/src/features/admin/admincenter/appliedLeave/hooks/useAppliedLeave.ts

import {
  useGetAppliedLeaveEmployeeDetailsQuery,
  useGetAppliedLeaveTypesQuery,
} from "../api/appliedLeaveApi";

export const useAppliedLeave = (
  employeeId: string,
) => {
  const leaveTypesQuery =
    useGetAppliedLeaveTypesQuery(
      employeeId,
      {
        skip: !employeeId,
      },
    );

  const employeeDetailsQuery =
    useGetAppliedLeaveEmployeeDetailsQuery(
      employeeId,
      {
        skip: !employeeId,
      },
    );

  return {
    leaveTypes:
      leaveTypesQuery.currentData ??
      [],

    leaveTypesLoading:
      leaveTypesQuery.isLoading ||
      leaveTypesQuery.isFetching,

    employeeDetails:
      employeeDetailsQuery.data,

    employeeDetailsLoading:
      employeeDetailsQuery.isLoading ||
      employeeDetailsQuery.isFetching,

    refetchEmployeeDetails:
      employeeDetailsQuery.refetch,
  };
};