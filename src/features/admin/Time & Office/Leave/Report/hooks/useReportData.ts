import { useMemo } from "react";

interface UseReportDataOptions<T> {
  data?: T[] | null;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
}

export const useReportData = <T>({
  data,
  isLoading = false,
  isFetching = false,
  error = null,
}: UseReportDataOptions<T>) => {
  const rows = useMemo(() => data ?? [], [data]);

  const isEmpty = !isLoading && !isFetching && rows.length === 0;

  return {
    rows,
    isLoading,
    isFetching,
    isEmpty,
    error,
  };
};

export default useReportData;