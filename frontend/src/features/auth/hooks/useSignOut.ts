import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { baseApi } from "@/app/baseApi";
import { broadcastSignedOut } from "@/app/crossTab";
import { clearSessionTiming } from "@/app/sessionClock";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useLogoutMutation } from "../api/authApi";
import { logout } from "../authSlice";

/**
 * Signs the user out: tells the server to end the session (so the cookies stop
 * working everywhere), then clears the app state and goes to the login page.
 * If the server cannot be reached the screen is still cleared, so the user is
 * never stuck on a page they tried to leave.
 * Finishes with a full page load so no signed-in data stays in memory.
 */
export function useSignOut() {
  const dispatch = useAppDispatch();
  const { domain: domainParam } = useParams();
  const domainFromStore = useAppSelector((state) => state.domain.domain);
  const [logoutRequest, { isLoading }] = useLogoutMutation();

  const signOut = useCallback(async () => {
    const domain = domainParam || domainFromStore;
    try {
      await logoutRequest().unwrap();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      dispatch(logout());
      clearSessionTiming();
      dispatch(baseApi.util.resetApiState());
      broadcastSignedOut();
      // A full page load (not an in-app route change) so nothing from the
      // signed-in session is left in memory, and the browser starts the login
      // page with a fresh network log.
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      window.location.replace(domain ? `${base}/${domain}/login` : `${base}/`);
    }
  }, [dispatch, domainParam, domainFromStore, logoutRequest]);

  return { signOut, isSigningOut: isLoading };
}
