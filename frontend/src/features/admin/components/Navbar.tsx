// import { useState, useRef, useEffect } from "react";
// import { Menu, Search, Info, Palette, Calendar, Bell, ChevronDown, X } from "lucide-react";
// import { useAppSelector } from "@/hooks/useAppSelector";
// import NotificationPanel from "./Notificationpanel";

// export default function Navbar() {
//   const employeeId = useAppSelector((state) => state.auth.employeeId);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const notifRef = useRef<HTMLDivElement>(null);

//   // Current month badge — e.g. "JUN/2026"
//   const now = new Date();
//   const monthBadge =
//     now.toLocaleString("en-US", { month: "short" }).toUpperCase() +
//     "/" +
//     now.getFullYear();

//   // Close notification panel on outside click
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
//         setNotifOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const initial = employeeId ? employeeId.charAt(0).toUpperCase() : "A";

//   return (
//     <header className="h-16 w-full flex items-center justify-between px-4 lg:px-6 bg-white border-b border-slate-100 sticky top-0 z-30">

//       {/* ── Left: Logo + company name ── */}
//       <div className="flex items-center gap-3 min-w-0">
//         <div className="flex items-center gap-2 shrink-0">
//           <div
//             className="flex items-center justify-center rounded-lg shrink-0"
//             style={{ width: 34, height: 34, background: "linear-gradient(135deg,#1D4ED8,#3B82F6)" }}
//           >
//             <span className="text-white text-xs font-bold">H</span>
//           </div>
//           <span className="text-[11px] font-bold tracking-[0.2em] text-slate-700 hidden sm:block">
//             HRMS
//           </span>
//         </div>

//         <button className="text-slate-400 hover:text-slate-600 transition-colors">
//           <Menu size={18} />
//         </button>

//         <span className="hidden md:block text-sm font-semibold text-slate-700 truncate max-w-[260px]">
//           Koundinyasa Technology Services Pvt. Ltd.
//         </span>
//       </div>

//       {/* ── Center: Search ── */}
//       <div className="hidden md:flex flex-1 max-w-md mx-6">
//         <div className="flex items-center gap-2 w-full h-10 px-4 rounded-full border border-slate-200 bg-slate-50 focus-within:border-blue-300 transition-colors">
//           <Search size={15} className="text-slate-400 shrink-0" />
//           <input
//             type="text"
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             placeholder="Search employees, payroll..."
//             className="w-full bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400"
//           />
//           {searchValue && (
//             <button onClick={() => setSearchValue("")}>
//               <X size={13} className="text-slate-400 hover:text-slate-600" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Right: Month badge + icons + user ── */}
//       <div className="flex items-center gap-1.5 shrink-0">

//         {/* Month badge */}
//         <button className="hidden sm:flex items-center h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
//           <span className="text-white text-xs font-semibold tracking-wide">
//             {monthBadge}
//           </span>
//         </button>

//         {/* Info */}
//         <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
//           <Info size={17} />
//         </button>

//         {/* Theme preset */}
//         <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
//           <Palette size={17} />
//         </button>

//         {/* Calendar */}
//         <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
//           <Calendar size={17} />
//         </button>

//         {/* Bell with notification panel */}
//         <div className="relative" ref={notifRef}>
//           <button
//             onClick={() => setNotifOpen((p) => !p)}
//             className="relative flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
//           >
//             <Bell size={17} />
//             <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
//           </button>

//           {notifOpen && (
//             <NotificationPanel onClose={() => setNotifOpen(false)} />
//           )}
//         </div>

//         {/* Divider */}
//         <div className="w-px h-6 bg-slate-200 mx-1" />

//         {/* Admin user pill */}
//         <button className="flex items-center gap-2 h-9 pl-1 pr-3 rounded-full hover:bg-slate-50 transition-colors">
//           <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 shrink-0">
//             {initial}
//           </div>
//           <span className="hidden sm:block text-sm font-medium text-slate-700">
//             Admin User
//           </span>
//           <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
//         </button>
//       </div>
//     </header>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { Menu, Search, Info, Calendar, Bell, ChevronDown, X } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import NotificationPanel from "./Notificationpanel";
import ThemePreset from "./ThemePreset";

export default function Navbar() {
  const employeeId = useAppSelector((state) => state.auth.employeeId);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const monthBadge =
    now.toLocaleString("en-US", { month: "short" }).toUpperCase() +
    "/" +
    now.getFullYear();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = employeeId ? employeeId.charAt(0).toUpperCase() : "A";

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 lg:px-6 bg-white border-b border-slate-100 sticky top-0 z-30">

      {/* ── Left: Logo + company name ── */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{ width: 34, height: 34, background: "var(--theme-gradient, linear-gradient(135deg,#1D4ED8,#3B82F6))" }}
          >
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-slate-700 hidden sm:block">
            HRMS
          </span>
        </div>

        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <Menu size={18} />
        </button>

        <span className="hidden md:block text-sm font-semibold text-slate-700 truncate max-w-[260px]">
          Koundinyasa Technology Services Pvt. Ltd.
        </span>
      </div>

      {/* ── Center: Search ── */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
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

      {/* ── Right: Month badge + icons + user ── */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Month badge */}
        <button
          className="hidden sm:flex items-center h-8 px-3 rounded-lg transition-colors hover:opacity-90"
          style={{ background: "var(--theme-primary, #2563EB)" }}
        >
          <span className="text-white text-xs font-semibold tracking-wide">
            {monthBadge}
          </span>
        </button>

        {/* Info */}
        <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <Info size={17} />
        </button>

        {/* Theme preset — the Palette icon lives inside ThemePreset */}
        <ThemePreset />

        {/* Calendar */}
        <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <Calendar size={17} />
        </button>

        {/* Bell with notification panel */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </button>

          {notifOpen && (
            <NotificationPanel onClose={() => setNotifOpen(false)} />
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Admin user pill */}
        <button className="flex items-center gap-2 h-9 pl-1 pr-3 rounded-full hover:bg-slate-50 transition-colors">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
            style={{ background: "var(--theme-primary, #2563EB)" }}
          >
            {initial}
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700">
            Admin User
          </span>
          <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}