import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { KeyRound, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useLogoutMutation } from "@/features/auth/api/authApi";

interface UserMenuProps {
  fullName?: string;
  email?: string;
  profilePhoto?: string | null;
}

export default function UserMenu({ fullName, email, profilePhoto }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { domain } = useParams();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();

  const employeeId = useAppSelector((state) => state.auth.employeeId);
  const displayName = fullName ?? "Admin User";
  const displayEmail = email ?? "user@koundinyasatech.com";
  const initial = (fullName ?? employeeId ?? "A").charAt(0).toUpperCase();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    try {
      await logoutUser().unwrap();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      navigate(`/${domain}/login`);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 h-9 pl-1 pr-3 rounded-full hover:bg-slate-50 transition-colors"
      >
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
            style={{ background: "var(--theme-primary, #2563EB)" }}
          >
            {initial}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-slate-700">
          {displayName}
        </span>
        <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[280px] bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden">
          {/* Profile header */}
          <div className="flex items-center gap-3 px-4 py-4">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                style={{ background: "var(--theme-primary, #2563EB)" }}
              >
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Menu items */}
          <div className="py-2">
            <button
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <KeyRound size={17} className="text-slate-500" />
              Change Password
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle size={17} className="text-slate-500" />
              Help
            </button>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <LogOut size={17} className="text-slate-500" />
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}