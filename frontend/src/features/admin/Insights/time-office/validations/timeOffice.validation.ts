export interface TimeOfficeValidationResult {
  isValid: boolean;
  message: string;
}

export const validateDateRange = (
  fromDate: string,
  toDate: string
): TimeOfficeValidationResult => {
  if (!fromDate) {
    return {
      isValid: false,
      message: "Please select From Date.",
    };
  }

  if (!toDate) {
    return {
      isValid: false,
      message: "Please select To Date.",
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
    message: "",
  };
};