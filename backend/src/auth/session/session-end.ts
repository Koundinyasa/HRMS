import { UnauthorizedException } from '@nestjs/common';
import { AuthErrorCode } from '../auth-error-codes';

/**
 * Why a login ended, as stored in AuthSessions.RevokedReason:
 *   replaced        the same account signed in somewhere else
 *   expired         the absolute limit (30 minutes) was reached, or the row is gone
 *   idle            no activity for longer than the idle window
 *   anything else   ended on purpose: logout, password_changed, admin_reset,
 *                   user_blocked, reuse_detected, mismatch
 */
export function codeForEndReason(reason?: string | null): AuthErrorCode {
  if (reason === 'replaced') return AuthErrorCode.SESSION_REPLACED;
  if (reason === 'idle') return AuthErrorCode.SESSION_IDLE;
  if (!reason || reason === 'expired') return AuthErrorCode.SESSION_EXPIRED;
  return AuthErrorCode.SESSION_ENDED;
}

const MESSAGES: Record<string, string> = {
  [AuthErrorCode.SESSION_REPLACED]:
    'You were signed out because this account signed in on another device.',
  [AuthErrorCode.SESSION_EXPIRED]: 'Your session has expired. Please sign in again.',
  [AuthErrorCode.SESSION_IDLE]: 'You were signed out because of inactivity.',
  [AuthErrorCode.SESSION_ENDED]: 'Session has ended',
};

export function messageForEndReason(reason?: string | null): string {
  return MESSAGES[codeForEndReason(reason)];
}

/** The 401 sent for a login that is over, with a code the browser can act on. */
export function sessionEndedException(reason?: string | null): UnauthorizedException {
  return new UnauthorizedException({
    statusCode: 401,
    message: messageForEndReason(reason),
    code: codeForEndReason(reason),
  });
}
