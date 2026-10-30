import { useEffect } from 'react';
import { apiFetch } from '@/app/apiFetch';
import { HEARTBEAT_MS } from '@/shared/constants/session';

/**
 * While this tab is the one in use, tell the server every few seconds that the
 * login is still open. If the login was ended in the meantime (for example the
 * same account signed in on another device) the answer is a 401 and apiFetch
 * signs the user out with the reason, so the old screen does not sit there
 * looking alive. Network trouble is ignored. (Interval: HEARTBEAT_MS.)
 */
export function useSessionHeartbeat(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const beat = () => {
      void apiFetch('/auth/heartbeat', { method: 'POST' }).catch(() => undefined);
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') beat();
    };

    const timer = window.setInterval(beat, HEARTBEAT_MS);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled]);
}
