import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle, KeyRound, LogOut } from "lucide-react";
import { useDashboard } from "../dashboard/hooks/useDashboard";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { baseApi } from "@/app/baseApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import ChangePasswordModal from "./ChangePasswordModal";
import { logout } from "@/features/auth/authSlice";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const navigate = useNavigate();
  const { domain } = useParams();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const { profileData } = useDashboard();
  const profile = profileData?.data.profile;
  const lastLogin = profile?.LastLoginDateTime ?? "--";

  // =========================
  // Profile Menu Reference
  // =========================

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // =========================
  // Close Menu On Outside Click
  // =========================

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  // =========================
  // Sign Out
  // =========================

  const handleSignOut = async () => {
    setOpen(false);
    try {
      await logoutUser().unwrap();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      navigate(`/${domain}/login`, { replace: true });
    }
  };

  return (
    <div ref={profileMenuRef} className="relative">
      {/* =========================
          Profile Button
      ========================= */}

      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex
          max-w-[44px]
          shrink-0
          items-center
          gap-1
          rounded-full
          border-[#D0E8F8]
          bg-white
          px-1
          py-1
          transition
          hover:bg-white
          hover:shadow-md
          sm:max-w-[180px]
          sm:gap-2
          sm:px-2
          sm:py-2
          lg:max-w-none
          lg:px-3
          lg:py-2.5
        "
      >
        {/* Profile Initials */}

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            text-xs
            font-semibold
            text-white
            sm:h-9
            sm:w-9
          "
          style={{
            backgroundColor: "#2563EB",
          }}
        >
          {profile?.ShortName}
        </div>

        {/* Profile Details */}

        <div className="hidden min-w-0 text-left sm:block">
          <p className="max-w-[130px] truncate text-xs font-medium text-[#1E3A5F] lg:max-w-[220px]">
            {profile?.Email}
          </p>

          <p className="max-w-[130px] truncate text-[10px] text-slate-500 lg:max-w-[220px]">
            Last logged in on {lastLogin}
          </p>
        </div>
      </Button>

      {/* =========================
          Profile Popup
      ========================= */}

      {open && (
        <div
          className="
            absolute
            right-0
            top-14
            z-[100]
            w-[calc(100vw-1rem)]
            max-w-[320px]
            rounded-xl
            border
            bg-white
            shadow-xl
            sm:w-80
          "
        >
          {/* User */}

          <div className="flex gap-3 p-4">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                text-sm
                font-semibold
                text-white
              "
              style={{
                backgroundColor: "#2563EB",
              }}
            >
              {profile?.ShortName}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-[#1E3A5F]">
                {profile?.FullName}
              </h3>

              <p className="text-xs text-slate-500">{profile?.Email}</p>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0]" />

          {/* =========================
              Change Password
          ========================= */}

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setChangePasswordOpen(true);
              }}
              className="
                w-full
                justify-start
                gap-3
                px-4
                py-6
                text-[#1E3A5F]
                hover:bg-[#EAF5FE]
                hover:text-[#1E3A5F]
              "
          >
            <KeyRound size={16} strokeWidth={2} />
            Change Password
          </Button>

          {/* =========================
              Help
          ========================= */}

          <Button
            type="button"
            variant="ghost"
            className="
              w-full
              justify-start
              gap-3
              px-4
              py-6
              text-[#1E3A5F]
              hover:bg-[#EAF5FE]
              hover:text-[#1E3A5F]
            "
          >
            <HelpCircle size={16} strokeWidth={2} />
            Help
          </Button>

          {/* =========================
              Sign Out
          ========================= */}

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-2.5
              text-sm
              text-slate-700
              transition-colors
              hover:bg-[#EAF5FE]
              disabled:opacity-50
            "
          >
            <LogOut size={17} strokeWidth={2} className="text-[#64748B]" />

            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      )}

      {/* =========================
          Change Password Modal
      ========================= */}

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </div>
  );
}
