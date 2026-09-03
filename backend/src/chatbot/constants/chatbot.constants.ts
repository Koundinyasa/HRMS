export const DRAFT_TTL_MS   = 30 * 60 * 1000;
export const DRAFT_MAX_SIZE = 500;

// Used by chat() when no real user payload is supplied (e.g. direct testing).
export const DEFAULT_TEST_USER = {
  employeeId: '284512',
  name: 'Test User',
  role: 'employee',
};
