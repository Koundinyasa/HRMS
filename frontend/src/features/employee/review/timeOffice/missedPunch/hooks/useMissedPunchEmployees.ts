import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getMissedPunchEmployees,
} from "../api/missedPunchApi";

import type {
  MissedPunchEmployee,
  MissedPunchFilters,
  UseMissedPunchResult,
} from "../types/missedPunch.types";

import {
  getMonthStartDate,
  getTodayDate,
  normalizeSearchText,
  validateFilters,
} from "../validations/missedPunch.validation";
import { COMPANY_STORAGE_KEYS } from "../constants/missedPunch.constants";

/* =========================================================
   GET COMPANY ID
========================================================= */

function getCompanyId():
  | string
  | undefined {
  for (const key of COMPANY_STORAGE_KEYS) {
    const value =
      localStorage.getItem(key);

    if (
      value &&
      value.trim()
    ) {
      return value;
    }
  }

  return undefined;
}

/* =========================================================
   HOOK
========================================================= */

export function useMissedPunch():
  UseMissedPunchResult {
  const today =
    getTodayDate();

  const monthStart =
    getMonthStartDate();

  const [
    employees,
    setEmployees,
  ] =
    useState<
      MissedPunchEmployee[]
    >([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    filters,
    setFilters,
  ] =
    useState<MissedPunchFilters>({
      fromDate: monthStart,
      toDate: today,
      searchText: "",
    });

  /* =======================================================
     FETCH
  ======================================================= */

  const fetchEmployees =
    useCallback(
      async (
        currentFilters: MissedPunchFilters,
      ) => {
        const validationError =
          validateFilters(
            currentFilters,
          );

        if (validationError) {
          setError(
            validationError,
          );

          setEmployees([]);

          return;
        }

        setIsLoading(true);

        setError(null);

        try {
          const companyId =
            getCompanyId();

          /*
           * Do NOT block the API call if companyId
           * is not in localStorage.
           *
           * Backend authentication can provide
           * the company context.
           */

          const data =
            await getMissedPunchEmployees(
              {
                companyId,

                fromDate:
                  currentFilters.fromDate,

                toDate:
                  currentFilters.toDate,

                searchText:
                  normalizeSearchText(
                    currentFilters.searchText,
                  ),
              },
            );

          setEmployees(data);
        } catch (err) {
          console.error(
            "[Missed Punch] Fetch error:",
            err,
          );

          setEmployees([]);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load missed punch employees.",
          );
        } finally {
          setIsLoading(false);
        }
      },
      [],
    );

  /* =======================================================
     FETCH WHEN THE DATE RANGE CHANGES
  ======================================================= */

  useEffect(() => {
    void fetchEmployees(filters);
  }, [
    fetchEmployees,
    filters.fromDate,
    filters.toDate,
  ]);

  /* =======================================================
     FROM DATE
  ======================================================= */

  const setFromDate =
    (value: string) => {
      setFilters(
        (previous) => ({
          ...previous,
          fromDate: value,
        }),
      );
    };

  /* =======================================================
     TO DATE
  ======================================================= */

  const setToDate =
    (value: string) => {
      setFilters(
        (previous) => ({
          ...previous,
          toDate: value,
        }),
      );
    };

  /* =======================================================
     SEARCH
  ======================================================= */

  const setSearchText =
    (value: string) => {
      setFilters(
        (previous) => ({
          ...previous,
          searchText: value,
        }),
      );
    };

  /* =======================================================
     REFRESH
  ======================================================= */

  const refetch =
    async () => {
      await fetchEmployees(
        filters,
      );
    };

  return {
    employees,

    isLoading,

    error,

    filters,

    setFromDate,

    setToDate,

    setSearchText,

    refetch,
  };
}