import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  useGetEmployeesQuery,
  type EmployeeFilterType,
} from "../api/employeeListApi";
import { isFilterType } from "../constants/employeeList.constants";
import {
  FILTERS,
  fieldOf,
  matchesSearch,
  matchesType,
  sortValue,
  text,
  uniqueSorted,
  type ColumnFilters,
  type SortConfig,
} from "../utils/employeeList.utils";

/**
 * Everything the Employee List screen shows: load, filter, sort and page.
 * The server returns every employee, so all of it happens in the browser.
 */
export function useEmployeeList() {
  const [searchParams] = useSearchParams();
  const rawType = searchParams.get("type") ?? "all";
  const type: EmployeeFilterType = isFilterType(rawType) ? rawType : "all";

  const { data, isLoading, isError, refetch } = useGetEmployeesQuery();

  const [search, setSearchState] = useState("");
  const [filters, setFiltersState] = useState<Record<string, string[]>>({});
  const [columnFilters, setColumnFiltersState] = useState<ColumnFilters>({});
  const [sort, setSort] = useState<SortConfig>({ key: null, dir: "asc" });
  const [rowsPerPage, setRowsPerPageState] = useState(10);
  const [page, setPage] = useState(1);

  // Every change that narrows the list goes back to page 1.
  const setSearch = (value: string) => {
    setSearchState(value);
    setPage(1);
  };
  const setFilter = (key: string, selected: string[]) => {
    setFiltersState((prev) => ({ ...prev, [key]: selected }));
    setPage(1);
  };
  const setColumnFilter = (key: string, value: string) => {
    setColumnFiltersState((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const setRowsPerPage = (value: number) => {
    setRowsPerPageState(value);
    setPage(1);
  };

  /** Click once for A to Z, again for Z to A, a third time to clear. */
  const toggleSort = (key: string) =>
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return { key: null, dir: "asc" };
    });

  const forType = useMemo(
    () => (data ?? []).filter((employee) => matchesType(employee, type)),
    [data, type],
  );

  const filterOptions = useMemo(
    () =>
      FILTERS.map((filter) => ({
        key: filter.key,
        label: filter.label,
        options: uniqueSorted(forType.map(filter.pick)),
      })).filter((filter) => filter.options.length > 0),
    [forType],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const rows = forType.filter((employee) => {
      if (query && !matchesSearch(employee, query)) return false;

      for (const filter of FILTERS) {
        const selected = filters[filter.key];
        if (selected?.length && !selected.includes(filter.pick(employee) ?? "")) return false;
      }

      return Object.entries(columnFilters).every(
        ([key, value]) =>
          !value || text(fieldOf(employee, key)).toLowerCase().includes(value.toLowerCase()),
      );
    });

    const { key, dir } = sort;
    if (!key) return rows;

    const direction = dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const first = sortValue(a, key);
      const second = sortValue(b, key);
      if (first === second) return 0;
      return first < second ? -direction : direction;
    });
  }, [forType, search, filters, columnFilters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const firstIndex = (currentPage - 1) * rowsPerPage;

  const hasActiveFilters =
    Boolean(search) ||
    Object.values(filters).some((selected) => selected.length > 0) ||
    Object.values(columnFilters).some(Boolean);

  const clearAll = () => {
    setSearchState("");
    setFiltersState({});
    setColumnFiltersState({});
    setSort({ key: null, dir: "asc" });
    setPage(1);
  };

  return {
    type,
    isLoading,
    isError,
    refetch,

    employees: filtered,
    pageRows: filtered.slice(firstIndex, firstIndex + rowsPerPage),
    totalCount: data?.length ?? 0,

    search,
    setSearch,
    filterOptions,
    filters,
    setFilter,
    columnFilters,
    setColumnFilter,
    sort,
    toggleSort,
    hasActiveFilters,
    clearAll,

    page: currentPage,
    setPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    firstShown: filtered.length === 0 ? 0 : firstIndex + 1,
    lastShown: Math.min(firstIndex + rowsPerPage, filtered.length),
  };
}
