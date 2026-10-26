import { useGetReconcileLeaveTypesQuery } from "../api/attendanceApi";

export const useReconcileLeaveTypes = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetReconcileLeaveTypesQuery();
  return { leaveTypes: data, isLoading, isFetching, isError, refetch };
};