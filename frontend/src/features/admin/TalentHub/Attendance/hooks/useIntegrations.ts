import { useGetIntegrationsQuery } from "../api/attendanceApi";

export const useIntegrations = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetIntegrationsQuery();
  return { integrations: data, isLoading, isFetching, isError, refetch };
};