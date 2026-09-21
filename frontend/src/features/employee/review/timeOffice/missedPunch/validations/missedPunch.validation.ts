/* =========================================================
   MISSED PUNCH VALIDATIONS
========================================================= */

import type {
  MissedPunchFilters,
} from "../types/missedPunch.types";

/* =========================================================
   DEFAULT DATE
========================================================= */

export function getTodayDate(): string {
  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      today.getDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getMonthStartDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}-01`;
}

/* =========================================================
   DATE VALIDATION
========================================================= */

export function isValidDate(
  value: string,
): boolean {
  if (!value) {
    return false;
  }

  const date =
    new Date(`${value}T00:00:00`);

  return !Number.isNaN(
    date.getTime(),
  );
}

/* =========================================================
   DATE RANGE VALIDATION
========================================================= */

export function validateDateRange(
  fromDate: string,
  toDate: string,
): string | null {
  if (!fromDate) {
    return "From date is required.";
  }

  if (!toDate) {
    return "To date is required.";
  }

  if (!isValidDate(fromDate)) {
    return "Invalid From date.";
  }

  if (!isValidDate(toDate)) {
    return "Invalid To date.";
  }

  const from =
    new Date(`${fromDate}T00:00:00`);

  const to =
    new Date(`${toDate}T00:00:00`);

  if (from > to) {
    return "From date cannot be greater than To date.";
  }

  return null;
}

/* =========================================================
   SEARCH VALIDATION
========================================================= */

export function normalizeSearchText(
  value: string,
): string {
  return value.trim();
}

/* =========================================================
   FILTER VALIDATION
========================================================= */

export function validateFilters(
  filters: MissedPunchFilters,
): string | null {
  const dateError =
    validateDateRange(
      filters.fromDate,
      filters.toDate,
    );

  if (dateError) {
    return dateError;
  }

  return null;
}

/* =========================================================
   DATE FORMAT FOR UI
   YYYY-MM-DD → DD/MM/YYYY
========================================================= */

export function formatDateForDisplay(
  value: string | null | undefined,
): string {
  if (!value) {
    return "-";
  }

  if (value.includes("T")) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");

      return `${day}/${month}/${date.getFullYear()}`;
    }
  }

  const datePart =
    value.substring(0, 10);

  const parts =
    datePart.split("-");

  if (parts.length !== 3) {
    return value;
  }

  const [
    year,
    month,
    day,
  ] = parts;

  return `${day}/${month}/${year}`;
}

/* =========================================================
   DATE FORMAT FOR API
========================================================= */

export function formatDateForApi(
  value: string,
): string {
  return value;
}

/* =========================================================
   EMPLOYEE ID VALIDATION
========================================================= */

export function isValidEmployeeId(
  value: unknown,
): boolean {
  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  return (
    String(value).trim() !== ""
  );
}