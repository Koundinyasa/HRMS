import type { SeparationFormData } from "../types/separationTypes";

export interface ValidationErrors {
  employeeId?: string;
  separationDate?: string;
  separationType?: string;
  reason?: string;
}

export const validateSeparationForm = (
  values: SeparationFormData
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!values.employeeId.trim()) {
    errors.employeeId = "Employee is required";
  }

  if (!values.separationDate.trim()) {
    errors.separationDate = "Separation date is required";
  }

  if (!values.separationType.trim()) {
    errors.separationType = "Separation type is required";
  }

  if (!values.reason.trim()) {
    errors.reason = "Reason is required";
  }

  return errors;
};