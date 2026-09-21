import { useState } from "react";

interface TDSReportFilters {
  search: string;
  query: string;
  branch: string;
  salaryStructure: string;
  leave: string;
  attendance: string;
  designation: string;
  employeeStatus: string;
}

const INITIAL_FILTERS: TDSReportFilters = {
  search: "",
  query: "",
  branch: "",
  salaryStructure: "",
  leave: "",
  attendance: "",
  designation: "",
  employeeStatus: "",
};

export default function useTDSReportFilters() {
  const [filters, setFilters] =
    useState<TDSReportFilters>(INITIAL_FILTERS);

  const updateFilter = (
    key: keyof TDSReportFilters,
    value: string
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return {
    filters,
    updateFilter,
    resetFilters,
  };
}