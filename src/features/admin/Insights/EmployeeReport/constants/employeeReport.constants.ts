// employeeReport.constants.ts
export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_ROWS_PER_PAGE = 10;

export interface StatusOption {
  value: string;
  label: string;
}

/** Used by Resignation Report's Status filter. */
export const RESIGNATION_STATUS_OPTIONS: StatusOption[] = [
  { value: "pending", label: "Pending / In Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];