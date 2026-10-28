import type { LeaveDailyFilters } from "../types/leaveDaily.types";

export const validateLeaveDailyFilters = (
  filters: LeaveDailyFilters,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!filters.month?.trim()) {
    errors.month = "Month is required";
  }

  return errors;
};

export const isLeaveDailyFiltersValid = (
  filters: LeaveDailyFilters,
): boolean => {
  return Object.keys(validateLeaveDailyFilters(filters)).length === 0;
};