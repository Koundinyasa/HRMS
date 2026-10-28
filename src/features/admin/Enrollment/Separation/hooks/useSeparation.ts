import { useMemo, useState } from "react";

import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SEPARATION_FILTERS,
} from "../constants/separationConstants";

import {
  useDeleteSeparationMutation,
  useGetSeparationEmployeesQuery,
} from "../api/separationApi";

import type {
  SeparationFilters,
} from "../types/separationTypes";

export const useSeparation = () => {
  const [filters, setFilters] = useState<SeparationFilters>(
    DEFAULT_SEPARATION_FILTERS
  );

  const [page, setPage] = useState(1);

  const [limit] = useState(DEFAULT_PAGE_SIZE);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetSeparationEmployeesQuery({
    search: filters.search || undefined,
    status: filters.status || undefined,
    separationType: filters.separationType || undefined,
    page,
    limit,
  });

  const [deleteSeparation, deleteState] =
    useDeleteSeparationMutation();

  const employees = useMemo(
    () => data?.data ?? [],
    [data]
  );

  const updateFilter = (
    key: keyof SeparationFilters,
    value: string
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));

    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_SEPARATION_FILTERS);
    setPage(1);
  };

  const removeSeparation = async (id: string) => {
    await deleteSeparation(id).unwrap();
  };

  return {
    employees,
    filters,
    page,
    setPage,
    updateFilter,
    resetFilters,
    removeSeparation,
    refetch,

    total: data?.total ?? 0,

    isLoading,
    isFetching,
    error,

    isDeleting: deleteState.isLoading,
  };
};