import { useGetAttendanceQuery } from "../api/attendanceApi";

export const useAttendance = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetAttendanceQuery();
  return { attendance: data, isLoading, isFetching, isError, refetch };
};