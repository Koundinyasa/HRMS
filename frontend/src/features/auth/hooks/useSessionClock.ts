import { useEffect, useState, useSyncExternalStore } from 'react';
import { getSessionTiming, subscribeSessionTiming } from '@/app/sessionClock';

/**
 * Seconds left until the session's hard limit (30 minutes after sign-in), or
 * null while the server has not reported it yet. Ticks once a second.
 */
export function useSessionRemainingSeconds(): number | null {
  const timing = useSyncExternalStore(subscribeSessionTiming, getSessionTiming);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (timing.expiresAt === null) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [timing.expiresAt]);

  if (timing.expiresAt === null) return null;
  return Math.max(0, Math.ceil((timing.expiresAt - now) / 1000));
}

/** 754 -> "12:34" */
export function formatMinutesSeconds(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}
