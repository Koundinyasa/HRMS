import { useEffect } from 'react';
import { getLastActivity } from '@/app/activity';
import { getSessionTiming } from '@/app/sessionClock';
import {
  getLastRefreshAt,
  getLastSessionEndCode,
  notifySessionExpired,
  refreshSession,
} from '@/app/sessionRefresh';
import { RENEW_BEFORE_IDLE_MS } from '@/shared/constants/session';

const CHECK_EVERY_MS = 5000;
const RETRY_AFTER_MS = 10000;

/**
 * Keeps an ACTIVE user signed in without a prompt, and never anyone else.
 *
 * The server ends a login after a short idle window (5 minutes) that only a
 * refresh moves forward. This hook asks for that refresh quietly, but only when
 *   - the window is about to run out (RENEW_BEFORE_IDLE_MS left), and
 *   - the user did something since the last renewal.
 * A user who has stopped is never renewed, so the server ends their login on its
 * own even if this page keeps running. The server also refuses to move the
 * 30-minute limit, so a renewal can never extend past it.
 *
 * Run it only in the tab that is in use (the same tab that sends heartbeats).
 */
export function useSilentRefresh(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    let renewedAt = Date.now();
    let busy = false;
    let lastTry = 0;

    const check = async () => {
      if (busy) return;
      const { expiresAt, idleExpiresAt } = getSessionTiming();
      if (expiresAt === null || idleExpiresAt === null) return;

      const now = Date.now();
      // Another request may have refreshed already (for example after a 401).
      renewedAt = Math.max(renewedAt, getLastRefreshAt());

      if (expiresAt <= now) return; // the hard limit passed; the expiry watcher signs out
      if (idleExpiresAt - now > RENEW_BEFORE_IDLE_MS) return; // plenty of time left
      if (getLastActivity() <= renewedAt) return; // idle since the last renewal: do not renew
      if (now - lastTry < RETRY_AFTER_MS) return;

      lastTry = now;
      busy = true;
      try {
        const outcome = await refreshSession();
        if (outcome === 'ok') renewedAt = Date.now();
        else if (outcome === 'expired') notifySessionExpired(getLastSessionEndCode());
        // 'unavailable' (network or server trouble): try again shortly.
      } finally {
        busy = false;
      }
    };

    const timer = window.setInterval(() => void check(), CHECK_EVERY_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void check();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled]);
}
