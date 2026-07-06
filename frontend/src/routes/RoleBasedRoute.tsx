import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

function RoleBasedRoute({
  children,
  allowedRoles,
}: Props) {
  const role =useAppSelector((state) => state.auth.user?.role);

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default RoleBasedRoute;