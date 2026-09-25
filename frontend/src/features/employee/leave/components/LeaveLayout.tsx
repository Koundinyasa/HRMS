import { Outlet, useLocation } from "react-router-dom";
 
import LeaveNavbar from "./LeaveNavbar";
 
export default function LeaveLayout() {
  const location = useLocation();
  const hideNavbar = Boolean(
    (location.state as { forceApplyForEmployee?: boolean } | null)
      ?.forceApplyForEmployee
  );
 
  return (
    <div className="module-shell mx-auto w-full max-w-[1600px] space-y-6 p-3 sm:p-4">
      {!hideNavbar && <LeaveNavbar />}
      <div className="module-content-shell p-3 sm:p-4">
        <Outlet />
      </div>
    </div>
  );
}

