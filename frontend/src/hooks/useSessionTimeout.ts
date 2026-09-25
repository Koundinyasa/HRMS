import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { logout } from "@/features/auth/authSlice";

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
// const SESSION_TIMEOUT = 30 * 1000; // 30 seconds

export default function useSessionTimeout() {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Stop the timer when the user is not logged in
    if (!isAuthenticated) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      return;
    }

    const logoutUser = () => {
      dispatch(logout());

      // Redirect to login page
      window.location.replace("/");
    };

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        logoutUser();
      }, SESSION_TIMEOUT);
    };

    const events = [
      "mousemove",
      "mousedown",
      "click",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Start the 5-minute timer
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, dispatch]);
}