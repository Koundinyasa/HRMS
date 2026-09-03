/**
 * Validates withdrawal reason.
 * Returns null if valid.
 */
export const validateWithdrawReason = (
  reason: string
): string | null => {
  const value = reason.trim();

  if (!value) {
    return "Withdrawal reason is required.";
  }

  

  if (value.length > 500) {
    return "Withdrawal reason cannot exceed 500 characters.";
  }

  return null;
};