import { useCallback, useState } from "react";
import { getLeaveDaily } from "../api";
import type {
  LeaveDailyFilters,
  LeaveDailyPagination,
  LeaveDailyRow,
} from "../types/leaveDaily.types";
import {
  LEAVE_DAILY_DEFAULT_PAGE_SIZE,
  LEAVE_DAILY_DEFAULT_FILTERS,
} from "../constants/leaveDaily.constants";

export const useLeaveDaily = () => {
  const [filters, setFilters] = useState<LeaveDailyFilters>(
    LEAVE_DAILY_DEFAULT_FILTERS,
  );

  const [rows, setRows] = useState<LeaveDailyRow[]>([]);
  const [pagination, setPagination] = useState<LeaveDailyPagination>({
    pageNumber: 1,
    pageSize: LEAVE_DAILY_DEFAULT_PAGE_SIZE,
    totalCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaveDaily = useCallback(
    async (
      nextFilters: LeaveDailyFilters = filters,
      pageNumber = pagination.pageNumber,
      pageSize = pagination.pageSize,
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getLeaveDaily(
          nextFilters,
          pageNumber,
          pageSize,
        );

        setRows(response.data ?? []);

        setPagination({
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalCount: response.totalCount,
        });
      } catch (err) {
        setRows([]);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Leave Daily data.",
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.pageNumber, pagination.pageSize],
  );

  const updateFilters = (nextFilters: LeaveDailyFilters) => {
    setFilters(nextFilters);
    setPagination((current) => ({
      ...current,
      pageNumber: 1,
    }));
  };

  const changePage = (pageNumber: number) => {
    setPagination((current) => ({
      ...current,
      pageNumber,
    }));
  };

  const changePageSize = (pageSize: number) => {
    setPagination({
      pageNumber: 1,
      pageSize,
      totalCount: pagination.totalCount,
    });
  };

  return {
    filters,
    rows,
    pagination,
    loading,
    error,
    updateFilters,
    fetchLeaveDaily,
    changePage,
    changePageSize,
  };
};