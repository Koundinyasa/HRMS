export interface TDSReportValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateTDSReport = (
  fromDate?: string,
  toDate?: string,
): TDSReportValidationResult => {
  if (!fromDate || !toDate) {
    return {
      isValid: false,
      message: "Please select the required dates.",
    };
  }

  if (new Date(fromDate) > new Date(toDate)) {
    return {
      isValid: false,
      message: "From Date cannot be greater than To Date.",
    };
  }

  return {
    isValid: true,
  };
};