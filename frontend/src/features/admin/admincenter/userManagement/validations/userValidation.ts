// userValidation.ts
// Form-level validation for the Add User modal.

import { PAYROLL_ROLE_OPTIONS } from "../constants/userManagementConstants";
import type { AddUserPayload } from "../types/user.types";
import {
  isFormValid,
  validateEmail,
  validateMobile,
  validateRequiredText,
  validateSelectRequired,
} from "./validators";

export type AddUserFormErrors = {
  userName: string;
  email: string;
  mobile: string;
  payrollRole: string;
};

export const EMPTY_ADD_USER_ERRORS: AddUserFormErrors = {
  userName: "",
  email: "",
  mobile: "",
  payrollRole: "",
};

/**
 * Validates the Add User form as a whole.
 * Returns a per-field error map — empty string means that field is valid.
 * Use `isFormValid(errors)` (or `isAddUserFormValid`) to check overall validity.
 */
export const validateAddUserForm = (form: AddUserPayload): AddUserFormErrors => ({
  userName: validateRequiredText(form.userName, "User Name", { min: 2, max: 50 }),
  email: validateEmail(form.email, { required: true }),
  mobile: validateMobile(form.mobile, { required: true }),
  payrollRole: validateSelectRequired(form.payrollRole, "Payroll Role", PAYROLL_ROLE_OPTIONS),
});

export const isAddUserFormValid = (form: AddUserPayload): boolean =>
  isFormValid(validateAddUserForm(form));