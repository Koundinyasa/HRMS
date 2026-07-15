import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";

interface ProtectedRouteProps {
  allowedRoles: number[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const roleId = useAppSelector((state) => state.auth.roleId);
  const roleIdNumber = roleId === null ? null : Number(roleId);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (roleIdNumber === null || Number.isNaN(roleIdNumber) || !allowedRoles.includes(roleIdNumber)) {
    return <Navigate to="/unauthorized" replace />;
  }


  
  return <Outlet />;
}
