import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { useGetSessionQuery } from "@/features/auth/api/authApi";
import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { useTabLock } from "@/features/auth/hooks/useTabLock";
import { useSessionHeartbeat } from "@/features/auth/hooks/useSessionHeartbeat";
import { useSilentRefresh } from "@/features/auth/hooks/useSilentRefresh";
import { useSessionExpiry } from "@/features/auth/hooks/useSessionExpiry";
import SessionExpiryWarning from "@/features/auth/components/SessionExpiryWarning";
import TabBlockedScreen from "@/features/auth/components/TabBlockedScreen";
import { IDLE_TIMEOUT_MS } from "@/shared/constants/session";

interface ProtectedRouteProps {
  allowedRoles: readonly number[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { domain: domainParam } = useParams();
  const location = useLocation();
  const domainFromStore = useAppSelector((state) => state.domain.domain);
  const domain = domainParam || domainFromStore;

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked);
  const mustChangePassword = useAppSelector((state) => state.auth.mustChangePassword);
  const roleId = useAppSelector((state) => state.auth.roleId);
  const roleIdNumber = roleId === null ? null : Number(roleId);

  const { signOut } = useSignOut();

  // After a page reload the browser has cookies but the app does not know the
  // user yet. Ask the server once. (After a normal login this is skipped.)
  const { isError, refetch } = useGetSessionQuery(undefined, {
    skip: sessionChecked,
  });

  // Only one tab may use the app; the tab in use also keeps the server
  // informed that the login is still open.
  const { status: tabStatus, takeOver } = useTabLock(sessionChecked && isAuthenticated);
  useSessionHeartbeat(isAuthenticated && tabStatus === "active");
  // Renews the login quietly, but only while the user is active (never past
  // the session's 30-minute limit, which the server enforces).
  useSilentRefresh(isAuthenticated && tabStatus === "active");
  // Signs out when the 30-minute limit is reached, even if the user is busy.
  useSessionExpiry(isAuthenticated);

  useIdleTimer({
    timeout: IDLE_TIMEOUT_MS,
    enabled: isAuthenticated,
    onIdle: () => {
      toast.info("You were signed out because of inactivity.");
      void signOut();
    },
  });

  if (!sessionChecked) {
    if (isError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-3 text-sm text-slate-600">
          <p>We could not reach the server.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50"
          >
            Try again
          </button>
        </div>
      );
    }
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={domain ? `/${domain}/login` : "/"} replace />;
  }

  if (mustChangePassword) {
    return (
      <Navigate
        to={domain ? `/${domain}/first-login-reset-password` : "/"}
        replace
      />
    );
  }

  if (roleIdNumber === null || Number.isNaN(roleIdNumber) || !allowedRoles.includes(roleIdNumber)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Pages build their links from the domain in the URL. Both /admin/... and
  // /<domain>/admin/... exist, so a visit without the domain (typed address,
  // old bookmark) would make every link /undefined/.... Put the domain back
  // into the URL, or ask for it if this tab does not know it.
  if (!domainParam) {
    return domainFromStore ? (
      <Navigate
        to={`/${domainFromStore}${location.pathname}${location.search}${location.hash}`}
        replace
      />
    ) : (
      <Navigate to="/" replace />
    );
  }

  if (tabStatus === "blocked") {
    return <TabBlockedScreen onUseHere={takeOver} />;
  }
  if (tabStatus === "checking") {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <SessionExpiryWarning />
    </>
  );
}
