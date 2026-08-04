import { Outlet } from "react-router-dom";

import LeaveNavbar from "./LeaveNavbar";

export default function LeaveLayout() {
  return (
    <div className="space-y-6">
      <LeaveNavbar />
      <Outlet />
    </div>
  );
}