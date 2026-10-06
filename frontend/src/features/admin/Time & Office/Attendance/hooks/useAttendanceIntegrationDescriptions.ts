
import { useGetAttendanceIntegrationDescriptionsQuery } from "../api/attendanceApi";

export const useAttendanceIntegrationDescriptions = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetAttendanceIntegrationDescriptionsQuery();
  return { descriptions: data, isLoading, isFetching, isError, refetch };
};