import { useEffect, useRef, useCallback } from "react";

interface UseIdleTimerOptions {
  timeout: number;
  warningTime?: number;
  onIdle: () => void;
  onWarning?: () => void;
  enabled: boolean;
}

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];

// The last time the user did anything in ANY tab of this browser. Several tabs
// share one login, so a tab must not sign everyone out while the user is busy
// in another tab. This is only a timestamp, not a secret.
const LAST_ACTIVITY_KEY = "hrms_last_activity";
const WRITE_EVERY_MS = 5000;

const readLastActivity = (): number => {
  try {
    return Number(localStorage.getItem(LAST_ACTIVITY_KEY)) || 0;
  } catch {
    return 0;
  }
};

const writeLastActivity = (now: number) => {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
  } catch {
    /* storage can be blocked; this tab's own timer still works */
  }
};

export function useIdleTimer({ timeout, warningTime, onIdle, onWarning, enabled }: UseIdleTimerOptions) {
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastWriteRef = useRef(0);

  // Keep the latest callbacks without restarting the timer on every render.
  const onIdleRef = useRef(onIdle);
  const onWarningRef = useRef(onWarning);
  useEffect(() => {
    onIdleRef.current = onIdle;
    onWarningRef.current = onWarning;
  });

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
  }, []);

  const schedule = useCallback(
    (delay: number) => {
      clearTimers();
      if (warningTime && delay > warningTime) {
        warningTimerRef.current = setTimeout(() => onWarningRef.current?.(), delay - warningTime);
      }
      idleTimerRef.current = setTimeout(() => {
        // Another tab may have seen activity since this timer started.
        const remaining = timeout - (Date.now() - readLastActivity());
        if (remaining > 1000) {
          schedule(remaining);
          return;
        }
        onIdleRef.current();
      }, delay);
    },
    [clearTimers, timeout, warningTime],
  );

  const onActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastWriteRef.current > WRITE_EVERY_MS) {
      lastWriteRef.current = now;
      writeLastActivity(now);
    }
    schedule(timeout);
  }, [schedule, timeout]);

  useEffect(() => {
    if (!enabled) return;
    writeLastActivity(Date.now());
    lastWriteRef.current = Date.now();
    schedule(timeout);
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, onActivity));
    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity));
      clearTimers();
    };
  }, [enabled, onActivity, schedule, clearTimers, timeout]);
}
