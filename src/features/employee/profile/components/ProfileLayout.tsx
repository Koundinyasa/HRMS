import { Outlet } from "react-router-dom";
import ProfileTabs from "./ProfileTabs";

export default function ProfileLayout() {
  return (
    <div className="module-shell w-full min-w-0 max-w-full overflow-x-hidden space-y-4 p-2 sm:space-y-6 sm:p-3">

      {/* Tabs Card */}
      <div className="w-full min-w-0 max-w-full rounded-xl bg-white p-2 sm:p-3">
        <ProfileTabs />
      </div>
      {/* Current Tab Content */}
      <div className="module-content-shell w-full min-w-0 max-w-full overflow-x-hidden p-3 sm:p-4">
        <Outlet />
      </div>
    </div>
  );
}