import { useGetApplicableAttendanceQuery } from "../api/attendanceApi";

export const useApplicableAttendance = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetApplicableAttendanceQuery();
  return { applicableAttendance: data, isLoading, isFetching, isError, refetch };
};