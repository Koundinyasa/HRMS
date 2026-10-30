import { toast } from 'react-toastify';
import { AuthErrorCode } from './constants/authErrorCodes';

const MESSAGES: Record<string, string> = {
  [AuthErrorCode.SESSION_REPLACED]:
    'You were signed out because this account signed in on another device.',
  [AuthErrorCode.SESSION_EXPIRED]: 'Your session expired. Please sign in again.',
  [AuthErrorCode.SESSION_ENDED]: 'Your session has ended. Please sign in again.',
};

/**
 * Tells the user why they were sent back to the login page. Shown once, even
 * when several requests fail at the same moment. Nothing is shown when the
 * server gave no reason (for example a normal sign-out).
 */
export function showSessionEndedMessage(code?: string): void {
  const text = code ? MESSAGES[code] : undefined;
  if (!text) return;
  toast.info(text, { toastId: 'session-ended', autoClose: 8000 });
}
