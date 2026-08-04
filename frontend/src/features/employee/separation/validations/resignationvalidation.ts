import type { ResignationRequest } from "../types/separation.types";

/**
 * Validates resignation request.
 * Returns null if valid.
 */
export const validateResignation = (
  data: ResignationRequest
): string | null => {
  const { requestedLastWorkingDate, reason } = data;

  if (!reason.trim()) {
    return "Reason is required.";
  }

  if (requestedLastWorkingDate) {
    const selectedDate = new Date(requestedLastWorkingDate);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Requested Last Working Date cannot be earlier than today.";
    }
  }

  return null;
};