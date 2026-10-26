export interface OnboardValidationErrors {
  search?: string;
  page?: string;
  pageSize?: string;
}

export function validateOnboardSearch(
  search: string,
): string | undefined {
  const value = search.trim();

  if (value.length > 100) {
    return "Search cannot exceed 100 characters.";
  }

  return undefined;
}

export function validateOnboardPagination(
  page: number,
  pageSize: number,
): OnboardValidationErrors {
  const errors: OnboardValidationErrors = {};

  if (!Number.isInteger(page) || page < 1) {
    errors.page = "Invalid page number.";
  }

  if (![10, 20, 50, 100].includes(pageSize)) {
    errors.pageSize = "Invalid page size.";
  }

  return errors;
}