import type { ClassificationFormValues, ClassificationFormErrors } from "../types/classification.types";

const NAME_MIN = 2;
const NAME_MAX = 50;
const SHORT_NAME_MAX = 10;

/**
 * Validates a classification form. Dependency-free by design so it drops
 * straight into this project without adding zod/yup as a hard requirement.
 * If your project already standardizes on one of those, swap the body of
 * this function for a schema.safeParse() call and keep the same signature.
 */
export function validateClassificationSchema(
  values: ClassificationFormValues
): ClassificationFormErrors {
  const errors: ClassificationFormErrors = {};

  const name = values.name?.trim() ?? "";
  if (!name) {
    errors.name = "Classification name is required";
  } else if (name.length < NAME_MIN) {
    errors.name = `Name must be at least ${NAME_MIN} characters`;
  } else if (name.length > NAME_MAX) {
    errors.name = `Name must be under ${NAME_MAX} characters`;
  }

  const shortName = values.shortName?.trim() ?? "";
  if (!shortName) {
    errors.shortName = "Short name is required";
  } else if (shortName.length > SHORT_NAME_MAX) {
    errors.shortName = `Short name must be under ${SHORT_NAME_MAX} characters`;
  }

  if (!values.type) {
    errors.type = "Type is required";
  }

  return errors;
}

export function isClassificationFormValid(errors: ClassificationFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
