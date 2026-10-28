// import type { StatutoryReportType } from "../types/statutoryReport.types";

// export const isValidStatutoryReportType = (
//   value: string,
// ): value is StatutoryReportType => {
//   return (
//     value === "pf" ||
//     value === "esi" ||
//     value === "lwf" ||
//     value === "pt"
//   );
// };


// ============================================================
// Statutory Report Validations
// ============================================================

import type {
  MonthlyStatutoryReportParams,
  PTHalfYearlyReportParams,
  PTYearlyReportParams,
  StatutoryAcknowledgementParams,
  StatutoryAcknowledgementRequest,
} from "../types/statutoryReport.types";

// ============================================================
// Validation Result
// ============================================================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================================
// Common Number Validation
// ============================================================

const isValidPositiveNumber = (
  value: unknown,
): boolean => {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  );
};

// ============================================================
// Year Validation
// ============================================================

export const validateYear = (
  year?: number,
): string | null => {
  if (year === undefined || year === null) {
    return "Year is required";
  }

  if (!Number.isInteger(year)) {
    return "Year must be a valid number";
  }

  if (year < 2000 || year > 2100) {
    return "Year must be between 2000 and 2100";
  }

  return null;
};

// ============================================================
// Month Validation
// ============================================================

export const validateMonth = (
  month?: number,
): string | null => {
  if (month === undefined || month === null) {
    return "Month is required";
  }

  if (!Number.isInteger(month)) {
    return "Month must be a valid number";
  }

  if (month < 1 || month > 12) {
    return "Month must be between 1 and 12";
  }

  return null;
};

// ============================================================
// Company Validation
// ============================================================

export const validateCompanyId = (
  companyId?: number,
): string | null => {
  if (
    companyId !== undefined &&
    !isValidPositiveNumber(companyId)
  ) {
    return "Company ID must be a valid positive number";
  }

  return null;
};

// ============================================================
// Branch Validation
// ============================================================

export const validateBranchId = (
  branchId?: number,
): string | null => {
  if (
    branchId !== undefined &&
    !isValidPositiveNumber(branchId)
  ) {
    return "Branch ID must be a valid positive number";
  }

  return null;
};

// ============================================================
// Half-Year Validation
// ============================================================

export const validateHalfYear = (
  halfYear?: number,
): string | null => {
  if (
    halfYear === undefined ||
    halfYear === null
  ) {
    return "Half-year is required";
  }

  if (!Number.isInteger(halfYear)) {
    return "Half-year must be a valid number";
  }

  if (halfYear !== 1 && halfYear !== 2) {
    return "Half-year must be either 1 or 2";
  }

  return null;
};

// ============================================================
// Monthly Report Validation
// ============================================================

export const validateMonthlyReport = (
  params: MonthlyStatutoryReportParams,
): ValidationResult => {
  const errors: Record<string, string> = {};

  const yearError = validateYear(params.year);

  if (yearError) {
    errors.year = yearError;
  }

  const monthError = validateMonth(params.month);

  if (monthError) {
    errors.month = monthError;
  }

  const companyError = validateCompanyId(
    params.companyId,
  );

  if (companyError) {
    errors.companyId = companyError;
  }

  const branchError = validateBranchId(
    params.branchId,
  );

  if (branchError) {
    errors.branchId = branchError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// PT Half-Yearly Validation
// ============================================================

export const validatePTHalfYearlyReport = (
  params: PTHalfYearlyReportParams,
): ValidationResult => {
  const errors: Record<string, string> = {};

  const yearError = validateYear(params.year);

  if (yearError) {
    errors.year = yearError;
  }

  const halfYearError = validateHalfYear(
    params.halfYear,
  );

  if (halfYearError) {
    errors.halfYear = halfYearError;
  }

  const companyError = validateCompanyId(
    params.companyId,
  );

  if (companyError) {
    errors.companyId = companyError;
  }

  const branchError = validateBranchId(
    params.branchId,
  );

  if (branchError) {
    errors.branchId = branchError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// PT Yearly Validation
// ============================================================

export const validatePTYearlyReport = (
  params: PTYearlyReportParams,
): ValidationResult => {
  const errors: Record<string, string> = {};

  const yearError = validateYear(params.year);

  if (yearError) {
    errors.year = yearError;
  }

  const companyError = validateCompanyId(
    params.companyId,
  );

  if (companyError) {
    errors.companyId = companyError;
  }

  const branchError = validateBranchId(
    params.branchId,
  );

  if (branchError) {
    errors.branchId = branchError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// Acknowledgement GET Validation
// ============================================================

export const validateAcknowledgementParams = (
  params: StatutoryAcknowledgementParams,
): ValidationResult => {
  const errors: Record<string, string> = {};

  const yearError = validateYear(params.year);

  if (yearError) {
    errors.year = yearError;
  }

  const monthError = validateMonth(params.month);

  if (
    params.month !== undefined &&
    monthError
  ) {
    errors.month = monthError;
  }

  const companyError = validateCompanyId(
    params.companyId,
  );

  if (companyError) {
    errors.companyId = companyError;
  }

  const branchError = validateBranchId(
    params.branchId,
  );

  if (branchError) {
    errors.branchId = branchError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// Acknowledgement POST Validation
// ============================================================

export const validateAcknowledgementRequest = (
  data: StatutoryAcknowledgementRequest,
): ValidationResult => {
  const errors: Record<string, string> = {};

  // ----------------------------------------------------------
  // Company
  // ----------------------------------------------------------

  if (data.companyId !== undefined) {
    const companyError = validateCompanyId(
      data.companyId,
    );

    if (companyError) {
      errors.companyId = companyError;
    }
  }

  // ----------------------------------------------------------
  // Branch
  // ----------------------------------------------------------

  if (data.branchId !== undefined) {
    const branchError = validateBranchId(
      data.branchId,
    );

    if (branchError) {
      errors.branchId = branchError;
    }
  }

  // ----------------------------------------------------------
  // Year
  // ----------------------------------------------------------

  if (data.year !== undefined) {
    const yearError = validateYear(data.year);

    if (yearError) {
      errors.year = yearError;
    }
  }

  // ----------------------------------------------------------
  // Month
  // ----------------------------------------------------------

  if (data.month !== undefined) {
    const monthError = validateMonth(data.month);

    if (monthError) {
      errors.month = monthError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// Validate PF Monthly
// ============================================================

export const validatePFMonthly = (
  params: MonthlyStatutoryReportParams,
): ValidationResult => {
  return validateMonthlyReport(params);
};

// ============================================================
// Validate ESI Monthly
// ============================================================

export const validateESIMonthly = (
  params: MonthlyStatutoryReportParams,
): ValidationResult => {
  return validateMonthlyReport(params);
};

// ============================================================
// Validate LWF Monthly
// ============================================================

export const validateLWFMonthly = (
  params: MonthlyStatutoryReportParams,
): ValidationResult => {
  return validateMonthlyReport(params);
};

// ============================================================
// Validate PT Monthly
// ============================================================

export const validatePTMonthly = (
  params: MonthlyStatutoryReportParams,
): ValidationResult => {
  return validateMonthlyReport(params);
};