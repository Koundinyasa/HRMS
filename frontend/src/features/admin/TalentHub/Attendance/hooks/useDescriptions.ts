import { useGetDescriptionsQuery } from "../api/attendanceApi";

export const useDescriptions = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetDescriptionsQuery();
  return { descriptions: data, isLoading, isFetching, isError, refetch };
};