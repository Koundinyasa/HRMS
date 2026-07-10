import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";

interface ProtectedRouteProps {
  allowedRoles: number[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const roleId = useAppSelector((state) => state.auth.roleId);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(roleId as number)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}