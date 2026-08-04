import { Outlet } from "react-router-dom";

import ProfileTabs from "./ProfileTabs";

import { useProfile } from "../hooks/useProfile";

export default function ProfileLayout() {
  const { profileTabs } = useProfile();

  return (
    <div className="w-full space-y-6">

      {/* Tabs Card */}

      <div
        className="
          w-full
          rounded-xl
          bg-white
          shadow-sm
          p-6
        "
      >
        <ProfileTabs tabs={profileTabs} />
      </div>

      {/* Current Tab Content */}

      <div className="w-full">
        <Outlet />
      </div>

    </div>
  );
}