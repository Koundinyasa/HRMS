import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/features/auth/authSlice";
import { useIdleTimer } from "@/hooks/useIdleTimer";

interface ProtectedRouteProps {
  allowedRoles: number[];
}

const IDLE_TIMEOUT = 5 * 60 * 1000;

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { domain } = useParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const roleId = useAppSelector((state) => state.auth.roleId);
  const roleIdNumber = roleId === null ? null : Number(roleId);

  useIdleTimer({
    timeout: IDLE_TIMEOUT,
    enabled: isAuthenticated,
    onIdle: () => {
      dispatch(logout());
      navigate(domain ? `/${domain}/login` : "/", { replace: true });
    },
  });

  if (!isAuthenticated) {
    return <Navigate to={domain ? `/${domain}/login` : "/"} replace />;
  }

  if (roleIdNumber === null || Number.isNaN(roleIdNumber) || !allowedRoles.includes(roleIdNumber)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}