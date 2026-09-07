import { EmployeeFormData } from "../types";

export type ValidationErrors = Partial<Record<keyof EmployeeFormData, string>>;

export const validateGeneralStep = (data: EmployeeFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = "First Name is required";
  }

  if (!data.gender) {
    errors.gender = "Gender is required";
  }

  if (!data.maritalStatus) {
    errors.maritalStatus = "Marital Status is required";
  }

  if (!data.dateOfJoining?.trim()) {
    errors.dateOfJoining = "Date of Joining is required";
  }

  if (!data.dateOfSalary?.trim()) {
    errors.dateOfSalary = "Date of Salary is required";
  }

  return errors;
};

export const validateStatutoryStep = (data: EmployeeFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (data.panNumber && data.panNumber.length !== 10) {
    errors.panNumber = "PAN must be 10 characters";
  }

  if (data.aadhaarNumber && data.aadhaarNumber.replace(/\s/g, "").length !== 12) {
    errors.aadhaarNumber = "Aadhaar must be 12 digits";
  }

  if (data.uanNumber && data.uanNumber.length !== 12) {
    errors.uanNumber = "UAN must be 12 digits";
  }

  if (data.pfApplicable && !data.pfNumber?.trim()) {
    errors.pfNumber = "PF Number is required when PF is applicable";
  }

  if (data.esiApplicable && !data.esiNumber?.trim()) {
    errors.esiNumber = "ESI Number is required when ESI is applicable";
  }

  if (data.bankIfsc && data.bankIfsc.length !== 11) {
    errors.bankIfsc = "IFSC must be 11 characters";
  }

  return errors;
};

export const validateStep = (
  step: string,
  data: EmployeeFormData
): ValidationErrors => {
  switch (step) {
    case "General":
      return validateGeneralStep(data);
    case "Statutory":
      return validateStatutoryStep(data);
    default:
      return {};
  }
};

export const isStepValid = (step: string, data: EmployeeFormData): boolean => {
  return Object.keys(validateStep(step, data)).length === 0;
};