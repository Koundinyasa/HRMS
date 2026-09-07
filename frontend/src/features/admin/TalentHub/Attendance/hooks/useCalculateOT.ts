import { useGetCalculateOTQuery } from "../api/attendanceApi";

export const useCalculateOT = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetCalculateOTQuery();
  return { calculateOT: data, isLoading, isFetching, isError, refetch };
};