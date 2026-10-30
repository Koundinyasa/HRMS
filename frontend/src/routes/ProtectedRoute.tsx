import { Navigate, Outlet, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { useGetSessionQuery } from "@/features/auth/api/authApi";
import { useSignOut } from "@/features/auth/hooks/useSignOut";

interface ProtectedRouteProps {
  allowedRoles: number[];
}

const IDLE_TIMEOUT = 5 * 60 * 1000;

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { domain: domainParam } = useParams();
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

  useIdleTimer({
    timeout: IDLE_TIMEOUT,
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
  return <Outlet />;
}
