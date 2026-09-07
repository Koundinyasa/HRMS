import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  ChevronDown,
  ChevronUp,
  Megaphone,
  FileText,
  Bell,
  Zap,
  Headphones,
  BarChart3,
  Rss,
  Image,
  Award,
} from "lucide-react";

// =====================================================
// ESS MENU
// =====================================================

const essMenuItems = [
  { name: "Circular", route: "circular", icon: Megaphone },
  { name: "Policy", route: "policy", icon: FileText },
  { name: "Notification", route: "notification", icon: Bell },
  { name: "Flash News", route: "flash-news", icon: Zap },
  { name: "Help Desk", route: "help-desk", icon: Headphones },
  { name: "Poll", route: "poll", icon: BarChart3 },
  { name: "Feeds", route: "feeds", icon: Rss },
  { name: "Memories", route: "memories", icon: Image },
  { name: "Wall Of Fame", route: "wall-of-fame", icon: Award },
];

// =====================================================
// COMPANY MENU (declarative so it's easy to extend/validate)
// =====================================================

const companyMenuItems = [
  { name: "Settings", route: "admin-center/settings" },
  { name: "Classifications", route: "admin-center/classifications" },
  { name: "User Management", route: "admin-center/user-management" },
  { name: "Workflows", route: "admin-center/workflows" },
];

// =====================================================
// SUB SIDEBAR
// =====================================================

interface SubSideBarProps {
  /** Optional: lets a parent (e.g. a mobile drawer) close this panel after navigation */
  onNavigate?: () => void;
}

export default function SubSideBar({ onNavigate }: SubSideBarProps) {
  const navigate = useNavigate();
  const { domain } = useParams();
  const location = useLocation();

  const [essOpen, setEssOpen] = useState(true);
  const [companyOpen, setCompanyOpen] = useState(true);

  // ===================================================
  // NAVIGATION
  // ===================================================

  const navigateTo = (route: string) => {
    // Guard against a missing domain param instead of navigating to "/undefined/..."
    if (!domain) return;

    navigate(`/${domain}/admin/${route}`);
    onNavigate?.();
  };

  // ===================================================
  // ACTIVE STATE HELPERS
  // ===================================================

  const isRouteActive = (route: string) =>
    location.pathname.includes(`/admin/${route}`);

  const isEssActive = (route: string) =>
    location.pathname.includes(`/admin/ess/${route}`);

  // ===================================================
  // SHARED CLASSNAMES
  // ===================================================

  const itemBaseClasses =
    "w-full flex items-center gap-2 text-left px-4 py-2.5 min-h-[40px] text-[13px] leading-snug transition-colors truncate";

  const itemActiveClasses = "bg-[#7C4DFF] text-white";
  const itemInactiveClasses = "text-gray-800 hover:bg-purple-100";

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <aside
      role="navigation"
      aria-label="Admin sub navigation"
      className="
        w-full max-w-[280px] sm:w-64 sm:max-w-none
        h-full sm:h-[calc(100vh-64px)]
        shrink-0
        overflow-y-auto overscroll-contain
        border-r border-gray-200
        bg-[#f7f3ff]
        [scrollbar-width:thin]
      "
    >
      {/* ================================================= */}
      {/* COMPANY / TENANT NAME */}
      {/* ================================================= */}

      <div
        className="
          sticky top-0 z-10
          w-full flex items-center justify-between gap-2
          px-4 py-3
          text-[13px] font-medium text-gray-800
          bg-[#f7f3ff]
        "
      >
        <span className="truncate">Koundinyasa Tech</span>
        <ChevronDown size={13} strokeWidth={1.8} className="shrink-0 text-gray-700" />
      </div>

      {/* ================================================= */}
      {/* COMPANY */}
      {/* ================================================= */}

      <button
        type="button"
        onClick={() => setCompanyOpen((prev) => !prev)}
        aria-expanded={companyOpen}
        aria-controls="company-menu"
        className="
          w-full flex items-center justify-between gap-2
          px-4 py-2 min-h-[36px]
          text-left text-[13px] font-medium text-gray-800
          hover:bg-purple-100/50 transition-colors
        "
      >
        <span className="truncate">Company</span>
        {companyOpen ? (
          <ChevronUp size={13} strokeWidth={1.8} className="shrink-0 text-gray-700" />
        ) : (
          <ChevronDown size={13} strokeWidth={1.8} className="shrink-0 text-gray-700" />
        )}
      </button>

      {/* ================================================= */}
      {/* COMPANY MENU */}
      {/* ================================================= */}

      {companyOpen && (
        <div id="company-menu">
          {companyMenuItems.map((item) => {
            const active = isRouteActive(item.route);

            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigateTo(item.route)}
                aria-current={active ? "page" : undefined}
                title={item.name}
                className={`${itemBaseClasses} ${
                  active ? itemActiveClasses : itemInactiveClasses
                }`}
              >
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ================================================= */}
      {/* ESS HEADER */}
      {/* ================================================= */}

      <button
        type="button"
        onClick={() => setEssOpen((prev) => !prev)}
        aria-expanded={essOpen}
        aria-controls="ess-menu"
        className="
          w-full flex items-center justify-between gap-2
          px-4 py-2.5 min-h-[36px]
          text-left text-[13px] font-medium text-gray-800
          hover:bg-purple-100/50 transition-colors
        "
      >
        <span className="truncate">ESS</span>
        {essOpen ? (
          <ChevronUp size={13} strokeWidth={1.8} className="shrink-0 text-gray-700" />
        ) : (
          <ChevronDown size={13} strokeWidth={1.8} className="shrink-0 text-gray-700" />
        )}
      </button>

      {/* ================================================= */}
      {/* ESS MENU */}
      {/* ================================================= */}

      {essOpen && (
        <div id="ess-menu">
          {essMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isEssActive(item.route);

            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigateTo(`ess/${item.route}`)}
                aria-current={active ? "page" : undefined}
                title={item.name}
                className={`${itemBaseClasses} pl-5 ${
                  active ? itemActiveClasses : itemInactiveClasses
                }`}
              >
                <Icon
                  size={13}
                  strokeWidth={1.7}
                  className={`shrink-0 ${active ? "text-white" : "text-gray-700"}`}
                />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ================================================= */}
      {/* OTHER CONFIG (static, no dropdown) */}
      {/* ================================================= */}

      <div className="w-full px-4 py-3 text-[13px] text-gray-800 truncate">
        Other Config
      </div>

      {/* ================================================= */}
      {/* API SOURCE (static, no dropdown) */}
      {/* ================================================= */}

      <div className="w-full px-4 py-3 pb-6 text-[13px] text-gray-800 truncate">
        API Source
      </div>
    </aside>
  );
}
