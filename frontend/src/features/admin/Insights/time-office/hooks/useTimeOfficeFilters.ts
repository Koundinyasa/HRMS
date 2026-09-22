import { useState } from "react";

export interface TimeOfficeFilters {
  fromDate: string;
  toDate: string;
  employeeId: string;
  employeeName: string;
}

const initialFilters: TimeOfficeFilters = {
  fromDate: "",
  toDate: "",
  employeeId: "",
  employeeName: "",
};

export function useTimeOfficeFilters() {
  const [filters, setFilters] =
    useState<TimeOfficeFilters>(initialFilters);

  const updateFilter = (
    field: keyof TimeOfficeFilters,
    value: string
  ) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    updateFilter,
    resetFilters,
  };
}