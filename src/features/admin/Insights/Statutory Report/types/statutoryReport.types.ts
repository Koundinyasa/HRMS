// export type StatutoryReportType =
//   | "pf"
//   | "esi"
//   | "lwf"
//   | "pt";

// ============================================================
// Statutory Report Types
// ============================================================

export type StatutoryReportType =
  | "pf"
  | "esi"
  | "lwf"
  | "pt";

// ============================================================
// Common API Parameters
// ============================================================

export interface StatutoryReportParams {
  companyId?: number;
  year?: number;
  month?: number;
  branchId?: number;
}

// ============================================================
// Monthly Report Parameters
// ============================================================

export interface MonthlyStatutoryReportParams
  extends StatutoryReportParams {
  month?: number;
  year?: number;
}

// ============================================================
// PT Half-Yearly Report Parameters
// ============================================================

export interface PTHalfYearlyReportParams
  extends StatutoryReportParams {
  year?: number;
  halfYear?: number;
}

// ============================================================
// PT Yearly Report Parameters
// ============================================================

export interface PTYearlyReportParams
  extends StatutoryReportParams {
  year?: number;
}

// ============================================================
// Acknowledgement GET Parameters
// ============================================================

export interface StatutoryAcknowledgementParams
  extends StatutoryReportParams {
  month?: number;
  year?: number;
}

// ============================================================
// Acknowledgement POST Request
//
// Keep this flexible because the exact backend request body
// was not included in the endpoint list.
// ============================================================

export interface StatutoryAcknowledgementRequest {
  companyId?: number;
  branchId?: number;
  year?: number;
  month?: number;

  [key: string]: unknown;
}

// ============================================================
// Generic API Response
// ============================================================

export interface StatutoryReportResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

// ============================================================
// Monthly Report Response
// ============================================================

export type StatutoryMonthlyReportResponse =
  StatutoryReportResponse<Record<string, unknown>[]>;

// ============================================================
// PT Half-Yearly Report Response
// ============================================================

export type PTHalfYearlyReportResponse =
  StatutoryReportResponse<Record<string, unknown>[]>;

// ============================================================
// PT Yearly Report Response
// ============================================================

export type PTYearlyReportResponse =
  StatutoryReportResponse<Record<string, unknown>[]>;

// ============================================================
// Acknowledgement Response
// ============================================================

export type StatutoryAcknowledgementResponse =
  StatutoryReportResponse<Record<string, unknown> | Record<string, unknown>[]>;