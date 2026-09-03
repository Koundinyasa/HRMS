import { Outlet } from "react-router-dom";

import DashboardTabs from "../components/DashboardTabs";

export default function PreEnrollmentLayout() {
  return (
    <div className="w-full min-w-0 bg-[#F8FAFC]">
      {/* Navigation Tabs */}
      <div className="w-full min-w-0 px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4">
        <DashboardTabs />
      </div>

      {/* Page Content */}
      <div className="w-full min-w-0 px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
        <Outlet />
      </div>
    </div>
  );
}
