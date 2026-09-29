import type {
  HelpdeskRequestFormValues,
} from "../types/helpdeskRequests.types";

export interface HelpdeskRequestValidationErrors {
  category?: string;
  subject?: string;
  description?: string;
  priority?: string;
}

export const validateHelpdeskRequest = (
  values: HelpdeskRequestFormValues,
): HelpdeskRequestValidationErrors => {
  const errors: HelpdeskRequestValidationErrors = {};

  if (!values.category?.trim()) {
    errors.category = "Category is required.";
  }

  if (!values.subject?.trim()) {
    errors.subject = "Subject is required.";
  } else if (values.subject.trim().length < 3) {
    errors.subject = "Subject must contain at least 3 characters.";
  }

  if (!values.description?.trim()) {
    errors.description = "Description is required.";
  } else if (values.description.trim().length < 10) {
    errors.description =
      "Description must contain at least 10 characters.";
  }

  if (!values.priority?.trim()) {
    errors.priority = "Priority is required.";
  }

  return errors;
};