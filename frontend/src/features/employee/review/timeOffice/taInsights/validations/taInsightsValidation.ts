import type { TAInsightFilters } from "../types/taInsightsTypes";

export const validateTAInsightsFilters = (
  filters: TAInsightFilters
): string | null => {
  if (filters.fromDate && filters.toDate) {
    const from = new Date(filters.fromDate);
    const to = new Date(filters.toDate);

    if (from > to) {
      return "From date cannot be greater than To date";
    }
  }

  return null;
};

export const isValidSearch = (value: string): boolean => {
  return value.trim().length >= 0;
};