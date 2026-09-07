import { Outlet } from "react-router-dom";
import ProfileTabs from "./ProfileTabs";

export default function ProfileLayout() {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden space-y-4 sm:space-y-6">

      {/* Tabs Card */}
      <div className="w-full min-w-0 max-w-full rounded-xl bg-white shadow-sm p-2 sm:p-3">
        <ProfileTabs />
      </div>
      {/* Current Tab Content */}
      <div className="w-full min-w-0 max-w-full overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}