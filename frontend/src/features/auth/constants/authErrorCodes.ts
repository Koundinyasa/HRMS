/**
 * Machine-readable `code` values the backend sends with an auth error.
 * Keep in step with backend/src/auth/auth-error-codes.ts. The app decides
 * what to do from the code, never from the message text.
 */
export const AuthErrorCode = {
  /** Two refresh calls crossed; retry once. HTTP 409. */
  REFRESH_RACE: 'REFRESH_RACE',
  /** The password must be changed before anything else. HTTP 403. */
  PASSWORD_CHANGE_REQUIRED: 'PASSWORD_CHANGE_REQUIRED',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];
