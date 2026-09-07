import { Outlet, useLocation } from "react-router-dom";
 
import LeaveNavbar from "./LeaveNavbar";
 
export default function LeaveLayout() {
  const location = useLocation();
  const hideNavbar = Boolean(
    (location.state as { forceApplyForEmployee?: boolean } | null)
      ?.forceApplyForEmployee
  );
 
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      {!hideNavbar && <LeaveNavbar />}
      <Outlet />
    </div>
  );
}

