import { useEffect, useRef, useCallback } from "react";

interface UseIdleTimerOptions {
  timeout: number;       
  warningTime?: number;   
  onIdle: () => void;
  onWarning?: () => void;
  enabled: boolean;
}

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];

export function useIdleTimer({ timeout, warningTime, onIdle, onWarning, enabled }: UseIdleTimerOptions) {
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const warningTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const resetTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (!enabled) return;

    if (warningTime) {
      warningTimerRef.current = setTimeout(() => onWarning?.(), timeout - warningTime);
    }
    idleTimerRef.current = setTimeout(onIdle, timeout);
  }, [timeout, warningTime, onIdle, onWarning, enabled]);

  useEffect(() => {
    if (!enabled) return;
    resetTimer();
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetTimer));
    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [enabled, resetTimer]);
}