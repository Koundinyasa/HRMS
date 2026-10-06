import type {
  LeaveDailyFilters,
  LeaveDailyResponse,
} from "../types/leaveDaily.types";

/**
 * Leave Daily API
 *
 * Backend endpoint is intentionally not added yet.
 * Add the actual API URL and response mapping once the backend contract
 * is provided.
 */
export const getLeaveDaily = async (
  _filters: LeaveDailyFilters,
  _pageNumber = 1,
  _pageSize = 10,
): Promise<LeaveDailyResponse> => {
  throw new Error("Leave Daily API endpoint is not configured yet.");
};