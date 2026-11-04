// frontend/src/features/admin/admincenter/appliedLeave/constants/appliedLeave.constants.ts

export const MAX_REASON_LENGTH = 500;

export const BACKDATE_ALLOWED_DAYS = 7;

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MATERNITY_LEAVE_ID = "4";
export const PATERNITY_LEAVE_ID = "5";

export const MATERNITY_MAX_DAYS = 180;
export const PATERNITY_MAX_DAYS = 15;

export const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const todayIso = (): string => {
  return toIsoDate(new Date());
};

export const minFromDateIso = (): string => {
  const date = new Date();

  date.setDate(
    date.getDate() -
      BACKDATE_ALLOWED_DAYS,
  );

  return toIsoDate(date);
};

export const maxApplyDateIso = (): string => {
  const date = new Date();

  date.setFullYear(
    date.getFullYear() + 1,
  );

  return toIsoDate(date);
};

export const isWeekendIso = (
  isoDate: string,
): boolean => {
  if (!isoDate) {
    return false;
  }

  const date = new Date(
    `${isoDate}T00:00:00`,
  );

  const day = date.getDay();

  return day === 0 || day === 6;
};