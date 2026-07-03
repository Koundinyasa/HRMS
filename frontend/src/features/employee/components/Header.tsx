import {
  Menu,
  UsersRound,
} from "lucide-react";

import { useDashboard } from "../dashboard/hooks/useDashboard";

export default function Header() {
  const { profileData, isLoading } = useDashboard();

  return (
    <div className="flex items-center gap-4">
      {/* HRMS Icon */}

      <div
        className="
          w-12
          h-12
          rounded-md
          flex
          items-center
          justify-center
        "
        style={{
          background: "var(--primary-gradient)",
        }}
      >
        <UsersRound
          size={26}
          color="white"
        />
      </div>

      {/* Menu */}

      <button
        type="button"
        className="
          p-1
          rounded-md
          hover:bg-white/10
          transition
        "
      >
        <Menu
          size={22}
          color="white"
        />
      </button>

      {/* Company Name */}

      <h1
        className="
          text-base
          lg:text-lg
          font-semibold
        "
        style={{
          color: "white",
        }}
      >
        {isLoading
          ? "Loading..."
          : profileData?.data?.CompanyName ??
            "Koundinyasa Technology Services Pvt. Ltd"}
      </h1>
    </div>
  );
}