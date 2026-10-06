import type React from "react";

export interface ReportColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface ReportDateRange {
  fromDate: string | null;
  toDate: string | null;
}

export interface ReportPagination {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
}

export interface ReportResponse<T> {
  data: T[];
  pagination?: ReportPagination;
}