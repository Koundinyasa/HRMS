/**
 * Machine-readable `code` values the auth endpoints send with an error.
 * HttpExceptionFilter copies `code` into the JSON body, and the frontend
 * decides what to do from the code, never from the message text.
 *
 * Add a code here first, then throw it; do not write code strings inline.
 */
export const AuthErrorCode = {
  /** Two refresh calls crossed; the client should retry once. HTTP 409. */
  REFRESH_RACE: 'REFRESH_RACE',
  /** The password must be changed before anything else. HTTP 403. */
  PASSWORD_CHANGE_REQUIRED: 'PASSWORD_CHANGE_REQUIRED',
  /** This login was ended because the same account signed in elsewhere. HTTP 401. */
  SESSION_REPLACED: 'SESSION_REPLACED',
  /** This login was ended on purpose (logout, password change, admin action). HTTP 401. */
  SESSION_ENDED: 'SESSION_ENDED',
  /** The absolute session limit (30 minutes by default) was reached. HTTP 401. */
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  /** The user was inactive for longer than the idle window. HTTP 401. */
  SESSION_IDLE: 'SESSION_IDLE',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];
