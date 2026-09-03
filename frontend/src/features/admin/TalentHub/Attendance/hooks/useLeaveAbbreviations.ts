import { useGetLeaveAbbreviationsQuery } from "../api/attendanceApi";

export const useLeaveAbbreviations = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetLeaveAbbreviationsQuery();
  return { leaveAbbreviations: data, isLoading, isFetching, isError, refetch };
};