




import { useState } from "react";

import type {
  OnboardFilters,
} from "../types/onboard.types";

import {
  validateOnboardSearch,
} from "../validations/onboard.validation";

const INITIAL_FILTERS: OnboardFilters = {
  search: "",
  branch: "",
  designation: "",
  employeeStatus: "",
};

export function useOnboardFilters() {
  const [filters, setFilters] =
    useState<OnboardFilters>(
      INITIAL_FILTERS,
    );

  const [searchError, setSearchError] =
    useState<string | undefined>();

  const setSearch = (
    value: string,
  ) => {
    const error =
      validateOnboardSearch(value);

    setSearchError(error);

    if (error) {
      return;
    }

    setFilters((current) => ({
      ...current,
      search: value,
    }));
  };

  const setFilter = <
    K extends keyof OnboardFilters,
  >(
    key: K,
    value: OnboardFilters[K],
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchError(undefined);
  };

  return {
    filters,
    searchError,
    setSearch,
    setFilter,
    resetFilters,
  };
}