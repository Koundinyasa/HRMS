import { useGetConsolidatedSalaryQuery } from '../api/detailsApi';

export function useConsolidatedSalary(monthYear?: string) {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetConsolidatedSalaryQuery(monthYear ? { monthYear } : undefined);

  const rows = data?.rows ?? data?.data ?? [];
  const companyName = data?.companyName ?? '';

  return {
    rows,
    companyName,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}