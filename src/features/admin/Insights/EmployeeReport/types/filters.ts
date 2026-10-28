









// filters.ts
export interface ReportFilterState {
  search: string;
  fromDate: string;
  toDate: string;
  status: string[];
  quickFilters: Record<string, string[] | string>;
}

export const DEFAULT_REPORT_FILTERS: ReportFilterState = {
  search: "",
  fromDate: "",
  toDate: "",
  status: [],
  quickFilters: {},
};

/**
 * Which columns the viewer has chosen to show, keyed by column key.
 * Only used by pages that expose a "Columns List" selector
 * (Employee Report, Employee Custom Report).
 */
export type ColumnVisibilityState = Record<string, boolean>;