import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
 */
export function useSignOut() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      navigate(domain ? `/${domain}/login` : "/", { replace: true });
    }
  }, [dispatch, navigate, domainParam, domainFromStore, logoutRequest]);

  return { signOut, isSigningOut: isLoading };
}
