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
  /** This login was ended because the same account signed in elsewhere. HTTP 401. */
  SESSION_REPLACED: 'SESSION_REPLACED',
  /** This login was ended on purpose (logout, password change, admin action). HTTP 401. */
  SESSION_ENDED: 'SESSION_ENDED',
  /** This login timed out. HTTP 401. */
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  /** Sign-in refused: the account is in use on another device. HTTP 409. */
  SESSION_ACTIVE_ELSEWHERE: 'SESSION_ACTIVE_ELSEWHERE',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

/** The three codes that mean "this login is over for good" (renewing cannot help). */
export function isSessionEndCode(code: string | undefined): boolean {
  return (
    code === AuthErrorCode.SESSION_REPLACED ||
    code === AuthErrorCode.SESSION_ENDED ||
    code === AuthErrorCode.SESSION_EXPIRED
  );
}
