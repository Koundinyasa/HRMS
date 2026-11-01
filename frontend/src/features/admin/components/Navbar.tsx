import { useState, useRef, useEffect } from "react";
import { Menu, Search, Calendar, Bell, X, Users } from "lucide-react";
import NotificationPanel from "./Notificationpanel";
import UserMenu from "./UserMenu";
import CalendarPanel from "./CalendarPanel";
import SessionCountdown from "@/features/auth/components/SessionCountdown";
import { useDashboard } from "../dashboard/hooks/useDashboard";
import { useSidebar } from "./SidebarContext";
import { useNavigate, useParams } from "react-router-dom";
 
export default function Navbar() {
 
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
 
  const { isOpen, toggleSidebar } = useSidebar();
  const { welcome } = useDashboard();
  const navigate = useNavigate();
  const { domain } = useParams();
  const adminBasePath = domain ? `/${domain}/admin` : "/admin";
 
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  return (
    <header className="relative z-30 flex h-16 w-full shrink-0 border-b border-slate-100 bg-white">
      <div className="h-full w-full overflow-x-auto overflow-y-hidden [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
      <div className="flex h-full min-w-0 items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4 lg:px-6">
      {/* ── Left: Logo + company name ── */}
      <div className="flex min-w-0 shrink items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`${adminBasePath}/dashboard`)}
          className="flex flex-col items-center gap-0.5 shrink-0 hover:opacity-80 transition-opacity"
          title="Go to Dashboard"
          aria-label="Go to Dashboard"
        >
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{ width: 34, height: 34, background: "var(--theme-gradient, linear-gradient(135deg,#1D4ED8,#3B82F6))" }}
          >
            <Users size={18} className="text-white" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-slate-700 hidden sm:block">
            KTS-PEOPLE
          </span>
        </button>
 
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={isOpen}
          className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
        >
          <Menu size={18} />
        </button>
 
        <span className="min-w-0 truncate whitespace-nowrap text-[11px] font-semibold leading-tight text-slate-700 sm:text-sm">
          Koundinyasa Technology Services Pvt. Ltd.
        </span>
      </div>
 
      {/* ── Center: Search ── */}
      <div className="hidden min-w-0 flex-1 max-w-md mx-3 md:flex lg:mx-6">
        <div className="flex items-center gap-2 w-full h-10 px-4 rounded-full border border-slate-200 bg-slate-50 focus-within:border-blue-300 transition-colors">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search employees, payroll..."
            className="w-full bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400"
          />
          {searchValue && (
            <button onClick={() => setSearchValue("")}>
              <X size={13} className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
      </div>
 
 
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            aria-label="Open calendar"
            onClick={() => setCalendarOpen((p) => !p)}
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <Calendar size={17} />
          </button>
          {calendarOpen && <CalendarPanel onClose={() => setCalendarOpen(false)} />}
        </div>
 
        <SessionCountdown />

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setNotifOpen((p) => !p)}
            className="relative flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <Bell size={17} />
          </button>
          {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
        </div>
 
        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
 
        <UserMenu
          fullName={welcome?.fullName}
          email={welcome?.email}
          profilePhoto={welcome?.profilePhoto}
        />
      </div>
      </div>
      </div>
    </header>
  );
}