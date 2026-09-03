import type {
  HelpDeskState,
  ValidationResult,
} from "../types/helpDesk.types";

export const validateHelpDeskTicket = (
  values: HelpDeskState,
  assetNumberRequired: boolean
): ValidationResult => {

  if (!values.departmentId) {
    return {
      valid: false,
      error: "Please select a department.",
    };
  }

  if (!values.categoryId) {
    return {
      valid: false,
      error: "Please select a category.",
    };
  }

  if (!values.subCategoryId) {
    return {
      valid: false,
      error: "Please select a subcategory.",
    };
  }

  if (
    assetNumberRequired &&
    !values.assetNumber.trim()
  ) {
    return {
      valid: false,
      error:
        "Asset Number is required for Hardware Support and Software Support.",
    };
  }

  if (!values.location.trim()) {
    return {
      valid: false,
      error: "Location is required.",
    };
  }

  if (!values.contactNo.trim()) {
    return {
      valid: false,
      error: "Contact number is required.",
    };
  }

  if (
    !/^[0-9]{10}$/.test(
      values.contactNo.trim()
    )
  ) {
    return {
      valid: false,
      error:
        "Enter a valid 10-digit contact number.",
    };
  }

  if (!values.subject.trim()) {
    return {
      valid: false,
      error: "Subject is required.",
    };
  }

  if (
    values.subject.trim().length < 5
  ) {
    return {
      valid: false,
      error:
        "Subject should contain at least 5 characters.",
    };
  }

  if (!values.description.trim()) {
    return {
      valid: false,
      error: "Description is required.",
    };
  }

  if (
    values.description.trim().length < 10
  ) {
    return {
      valid: false,
      error:
        "Description should contain at least 10 characters.",
    };
  }

  if (
    values.description.trim().length > 1000
  ) {
    return {
      valid: false,
      error:
        "Description cannot exceed 1000 characters.",
    };
  }

  return {
    valid: true,
  };
};