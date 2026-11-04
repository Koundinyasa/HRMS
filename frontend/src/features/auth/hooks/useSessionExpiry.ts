import { useEffect } from 'react';
import { getSessionTiming } from '@/app/sessionClock';
import { notifySessionExpired } from '@/app/sessionRefresh';
import { AuthErrorCode } from '../constants/authErrorCodes';

/**
 * Signs the user out the moment the session's hard limit (30 minutes after
 * sign-in) is reached, even if they are busy. The server enforces the same
 * limit; this just makes the screen react at once instead of on the next
 * request. Checks once a second against the clock, so sleep or a throttled
 * background tab cannot make it late.
 */
export function useSessionExpiry(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    let firedFor: number | null = null;

    const check = () => {
      const { expiresAt } = getSessionTiming();
      if (expiresAt === null || firedFor === expiresAt) return;
      if (Date.now() >= expiresAt) {
        firedFor = expiresAt;
        notifySessionExpired(AuthErrorCode.SESSION_EXPIRED);
      }
    };

    const timer = window.setInterval(check, 1000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') check();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled]);
}
