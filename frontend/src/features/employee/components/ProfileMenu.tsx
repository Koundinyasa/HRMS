import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  HelpCircle,
  KeyRound,
  LogOut,
} from "lucide-react";

import { useDashboard } from "../dashboard/hooks/useDashboard";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { profileData } = useDashboard();

  const profile = profileData?.data;

  const lastLogin = profile?.LastLoginDateTime
    ? new Date(profile.LastLoginDateTime).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      )
    : "--";

  const handleSignOut = () => {
    // Clear storage if required
    localStorage.clear();
    sessionStorage.clear();

    // Navigate to Domain Verification
    navigate("/");
  };

  return (
    <div className="relative">
      {/* Profile Button */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-3
          border
          rounded-full
          px-3
          py-1
          bg-white
          hover:shadow-md
          transition
        "
      >
        <div
          className="
            w-9
            h-9
            rounded-full
            text-white
            flex
            items-center
            justify-center
            font-semibold
          "
          style={{
            backgroundColor: "var(--primary-color)",
          }}
        >
          {profile?.ShortName}
        </div>

        <div className="text-left">
          <p className="text-xs font-medium">
            {profile?.Email}
          </p>

          <p className="text-[10px] text-slate-500">
            Last logged in at {lastLogin}
          </p>
        </div>
      </button>

      {/* Popup */}

      {open && (
        <div
          className="
            absolute
            right-0
            top-14
            w-80
            rounded-xl
            bg-white
            border
            shadow-xl
            z-50
          "
        >
          {/* User */}

          <div className="flex gap-3 p-4">
            <div
              className="
                w-10
                h-10
                rounded-full
                text-white
                flex
                items-center
                justify-center
                font-semibold
              "
              style={{
                backgroundColor: "var(--primary-color)",
              }}
            >
              {profile?.ShortName}
            </div>

            <div>
              <h3 className="font-semibold text-sm">
                {profile?.Email}
              </h3>

              <p className="text-xs text-slate-500">
                {profile?.Email}
              </p>
            </div>
          </div>

          <div className="border-t" />

          {/* Change Password */}

          <button
            type="button"
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              hover:bg-slate-50
              transition
            "
          >
            <KeyRound
              size={16}
              style={{
                color: "var(--primary-color)",
              }}
            />

            Change Password
          </button>

          {/* Help */}

          <button
            type="button"
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              hover:bg-slate-50
              transition
            "
          >
            <HelpCircle
              size={16}
              style={{
                color: "var(--primary-color)",
              }}
            />

            Help
          </button>

          {/* Sign Out */}

          <button
            type="button"
            onClick={handleSignOut}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              text-red-600
              hover:bg-red-50
              transition
            "
          >
            <LogOut size={16} />

            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}