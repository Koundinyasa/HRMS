import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { KeyRound, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { baseApi } from "@/app/baseApi";
import ChangePasswordModal from "../../employee/components/ChangePasswordModal";

interface UserMenuProps {
  fullName?: string;
  email?: string;
  profilePhoto?: string | null;
}

interface MenuPosition {
  top: number;
  right: number;
}

export default function UserMenu({
  fullName,
  email,
  profilePhoto,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
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
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const bounds = ref.current?.getBoundingClientRect();
      if (!bounds) return;
      setMenuPosition({
        top: bounds.bottom + 8,
        right: Math.max(8, window.innerWidth - bounds.right),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

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
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-2 px-1 transition-colors hover:bg-slate-50"
      >
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={displayName}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ background: "var(--theme-primary, #2563EB)" }}
          >
            {initial}
          </div>
        )}
        <span className="hidden whitespace-nowrap text-sm font-medium text-slate-700 sm:block">
          {displayName}
        </span>
        <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
      </button>

      {open &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: menuPosition.top, right: menuPosition.right }}
            className="fixed z-[1000] w-64 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl"
          >
            <div className="flex min-h-16 items-center gap-3 px-3.5 py-3">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={displayName}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ background: "var(--theme-primary, #2563EB)" }}
                >
                  {initial}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {displayName}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  {displayEmail}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            <div className="py-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  setChangePasswordOpen(true);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                <KeyRound size={15} strokeWidth={2} className="text-slate-500" />
                Change Password
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                <HelpCircle size={15} className="text-slate-500" />
                Help
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                <LogOut size={15} className="text-slate-500" />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>,
          document.body,
        )}

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </div>
  );
}
