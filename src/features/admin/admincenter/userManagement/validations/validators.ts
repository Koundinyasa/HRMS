// validators.ts
// Generic, reusable field-level validators. No UI or form knowledge here —
// each function takes a raw value and returns an error message string,
// or an empty string when the value is valid.

const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

/** Required text field (e.g. User Name). */
export const validateRequiredText = (
  value: string,
  fieldLabel: string,
  { min = 2, max = 50 }: { min?: number; max?: number } = {}
): string => {
  const trimmed = value.trim();

  if (!trimmed) return `${fieldLabel} is required.`;
  if (trimmed.length < min) return `${fieldLabel} must be at least ${min} characters.`;
  if (trimmed.length > max) return `${fieldLabel} must not exceed ${max} characters.`;
  if (!NAME_REGEX.test(trimmed)) {
    return `${fieldLabel} can only contain letters, spaces, and . ' -`;
  }
  return "";
};

/** Email address. */
export const validateEmail = (value: string, { required = true }: { required?: boolean } = {}): string => {
  const trimmed = value.trim();

  if (!trimmed) return required ? "Email is required." : "";
  if (trimmed.length > 100) return "Email must not exceed 100 characters.";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address (e.g. abc@email.com).";
  return "";
};

/** 10-digit Indian mobile number, starting 6-9. */
export const validateMobile = (value: string, { required = true }: { required?: boolean } = {}): string => {
  const trimmed = value.trim();

  if (!trimmed) return required ? "Mobile number is required." : "";
  if (!/^\d+$/.test(trimmed)) return "Mobile number can only contain digits.";
  if (!INDIAN_MOBILE_REGEX.test(trimmed)) {
    return "Enter a valid 10-digit mobile number starting with 6-9.";
  }
  return "";
};

/** Required dropdown / select value, checked against an allowed list. */
export const validateSelectRequired = (
  value: string,
  fieldLabel: string,
  allowedOptions?: readonly string[]
): string => {
  if (!value || !value.trim()) return `${fieldLabel} is required.`;
  if (allowedOptions && !allowedOptions.includes(value)) {
    return `${fieldLabel} is not a valid option.`;
  }
  return "";
};

/** True if every value in an errors record is an empty string. */
export const isFormValid = (errors: Record<string, string>): boolean =>
  Object.values(errors).every((message) => message === "");