import { useEffect, useRef } from "react";
import { getLastActivity, markActivity, startActivityTracking } from "@/app/activity";

interface UseIdleTimerOptions {
  /** Milliseconds without any user action before onIdle runs. */
  timeout: number;
  /** If set, onWarning runs once when this many milliseconds are left. */
  warningTime?: number;
  onIdle: () => void;
  onWarning?: () => void;
  enabled: boolean;
}

/**
 * Signs the user out after `timeout` of inactivity.
 *
 * It checks the clock once a second instead of trusting one long timer, so a
 * sleeping laptop or a throttled background tab cannot make it late: the check
 * simply compares "now" with the user's last action (shared by every tab of the
 * browser, see app/activity.ts). Any mouse, click, key, scroll or touch resets
 * it. It does not depend on, and is not extended by, the 30-minute session
 * limit.
 */
export function useIdleTimer({ timeout, warningTime, onIdle, onWarning, enabled }: UseIdleTimerOptions) {
  // Keep the latest callbacks without restarting the timer on every render.
  const onIdleRef = useRef(onIdle);
  const onWarningRef = useRef(onWarning);
  useEffect(() => {
    onIdleRef.current = onIdle;
    onWarningRef.current = onWarning;
  });

  useEffect(() => {
    if (!enabled) return;

    markActivity();
    const stopTracking = startActivityTracking();
    let fired = false;
    let warned = false;

    const check = () => {
      if (fired) return;
      const idleFor = Date.now() - getLastActivity();

      if (idleFor >= timeout) {
        fired = true;
        onIdleRef.current();
        return;
      }

      if (warningTime) {
        const inWarning = idleFor >= timeout - warningTime;
        if (inWarning && !warned) {
          warned = true;
          onWarningRef.current?.();
        } else if (!inWarning) {
          warned = false;
        }
      }
    };

    const timer = window.setInterval(check, 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      stopTracking();
    };
  }, [enabled, timeout, warningTime]);
}
