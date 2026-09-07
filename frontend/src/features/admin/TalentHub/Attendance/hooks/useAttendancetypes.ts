// useAttendanceTypes.ts
import { useGetAttendancetypesQuery } from "../api/attendanceApi";

export const useAttendanceTypes = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetAttendancetypesQuery();
  return { attendanceTypes: data, isLoading, isFetching, isError, refetch };
};