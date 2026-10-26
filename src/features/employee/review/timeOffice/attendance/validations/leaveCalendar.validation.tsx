import type { UseMonthlyLeaveCalendarParams } from "../types/leavecalendar.types";

export const validateMonthlyLeaveCalendar = (
  params: UseMonthlyLeaveCalendarParams
): string[] => {
  const errors: string[] = [];

  if (!params.companyId) {
    errors.push("Company is required");
  }

  if (
    params.year !== undefined &&
    (!Number.isInteger(params.year) || params.year < 1)
  ) {
    errors.push("Please enter a valid year");
  }

  if (
    params.month !== undefined &&
    (!Number.isInteger(params.month) ||
      params.month < 1 ||
      params.month > 12)
  ) {
    errors.push("Please select a valid month");
  }

  return errors;
};