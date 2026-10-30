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
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];
