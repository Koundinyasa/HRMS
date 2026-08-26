import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
 
import {
  HelpCircle,
  KeyRound,
  LogOut,
} from "lucide-react";
 
import { useDashboard } from "../dashboard/hooks/useDashboard";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { baseApi } from "@/app/baseApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
 
export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
 
  const navigate = useNavigate();
  const { domain } = useParams();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useAppDispatch();
 
 
  const { profileData } = useDashboard();
 
  const profile = profileData?.data.profile;
 
  const lastLogin =
    profile?.LastLoginDateTime ?? "--";
 
  const handleSignOut = async () => {
    setOpen(false);
    try {
      await logoutUser().unwrap();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      dispatch(baseApi.util.resetApiState());
      navigate(`/${domain}/login`);
    }
  };
 
  return (
    <div className="relative">
      {/* Profile Button */}
 
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(!open)}
        className="
    flex
    items-center
    gap-1
    sm:gap-2
    rounded-full
    px-1
    sm:px-2
    lg:px-3
    py-1
    sm:py-2
    lg:py-3
    bg-white
    hover:shadow-md
    transition
    shrink-0
    max-w-[44px]
    sm:max-w-[180px]
    lg:max-w-none
  "
      >
        <div
          className="
    w-8
    h-8
    sm:w-9
    sm:h-9
    shrink-0
    rounded-full
    text-white
    flex
    items-center
    justify-center
    font-semibold
    text-xs
  "
          style={{
            backgroundColor: "var(--primary-color)",
          }}
        >
          {profile?.ShortName}
        </div>
 
        <div className="hidden sm:block min-w-0 text-left">
          <p className="text-xs font-medium truncate max-w-[130px] lg:max-w-[220px]">
            {profile?.Email}
          </p>
 
          <p className="text-[10px] text-slate-500 truncate max-w-[130px] lg:max-w-[220px]">
            Last logged in on {lastLogin}
          </p>
        </div>
      </Button>
 
      {/* Popup */}
 
      {
        open && (
          <div
            className="
            absolute
            right-0
            top-14
            w-[calc(100vw-1rem)]
             sm:w-80
            max-w-[320px]
            rounded-xl
            bg-white
            border
            shadow-xl
            z-[100]
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
                  {profile?.FullName}
                </h3>
 
                <p className="text-xs text-slate-500">
                  {profile?.Email}
                </p>
              </div>
            </div>
 
            <div className="border-t" />
 
            {/* Change Password */}
 
            <Button
              type="button"
              variant="ghost"
              className="
    w-full
    justify-start
    gap-3
    px-4
    py-6
  "
            >
              <KeyRound
                size={16}
                style={{
                  color: "var(--primary-color)",
                }}
              />
 
              Change Password
            </Button>
 
            {/* Help */}
 
            <Button
              type="button"
              variant="ghost"
              className="
    w-full
    justify-start
    gap-3
    px-4
    py-6
  "
            >
              <HelpCircle
                size={16}
                style={{
                  color: "var(--primary-color)",
                }}
              />
 
              Help
            </Button>
 
            {/* Sign Out */}
 
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <LogOut size={17} className="text-slate-500" />
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        )
      }
    </div >
  );
}