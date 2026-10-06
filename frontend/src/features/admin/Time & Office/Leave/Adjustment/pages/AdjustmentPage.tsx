import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdjustmentPage: React.FC = () => {
  const location = useLocation();

  if (location.pathname.endsWith("/adjustment") || location.pathname.endsWith("/adjustment/")) {
    return <Navigate to="configuration" replace />;
  }

  return (
    <div className="w-full min-h-full">
      <Outlet />
    </div>
  );
};

export default AdjustmentPage;