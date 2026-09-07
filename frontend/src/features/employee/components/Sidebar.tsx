import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { SidebarProps } from "../dashboard/types/dashboard.types";

import {
  UserRound,
  CalendarDays,
  Package,
  LifeBuoy,
  GraduationCap,
  LogOut,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

import { useDashboard } from "../dashboard/hooks/useDashboard";
import type { MenuItem } from "../dashboard/types/dashboard.types";

const MODULE_COLORS: Record<string, string> = {
  profile: "#2563EB", // blue
  leave: "#8B5CF6", // purple
  asset: "#3B82F6", // blue
  helpdesk: "#16A34A", // green
  separation: "#EA580C", // orange
  learning: "#06B6D4", // cyan
  dashboard: "#0F172A", // black
};


 
const DEFAULT_ICON_COLOR = "#0F172A"; // black by default
 
/* Detect which module the current page belongs to */
const getActiveModuleKey = (pathname: string): string | null => {
  const path = pathname.toLowerCase();
 
  if (path.includes("/profile")) return "profile";
  if (path.includes("/leave")) return "leave";
  if (path.includes("/asset")) return "asset"; // matches /asset and /assets
  if (path.includes("/helpdesk") || path.includes("/help-desk"))
    return "helpdesk";
  if (path.includes("/separation")) return "separation";
  if (path.includes("/learning") || path.includes("/lnd")) return "learning";
  if (path.includes("/dashboard")) return "dashboard";
 
  return null;
};

const menuIcons: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard size={20} strokeWidth={2.2} />,
  "My Profile": <UserRound size={20} strokeWidth={2.2} />,
  "Leave Management": <CalendarDays size={20} strokeWidth={2.2} />,
  Assets: <Package size={20}  strokeWidth={2.2}/>,
  "Help Desk": <LifeBuoy size={20} strokeWidth={2.2}/>,
  "Learning & Development": <GraduationCap size={20} strokeWidth={2.2} />,
  Separation: <LogOut size={20} strokeWidth={2.2} />,
};

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const navigate = useNavigate();
  const { domain } = useParams();
  const location = useLocation();
  const { menuData } = useDashboard();
  const [expandedMenu, setExpandedMenu] = useState<number | null>(null);

  const menuItems = menuData?.data?.[0]?.children || [];

    const activeModule = getActiveModuleKey(location.pathname);
  const iconColor = activeModule
    ? MODULE_COLORS[activeModule] || DEFAULT_ICON_COLOR
    : DEFAULT_ICON_COLOR;


  const handleNavigation = (child: MenuItem) => {
    if (!child.routeUrl) return;

    let route = child.routeUrl.replace("/Employee", `/${domain}/employee`);

    switch (child.menuName) {
      case "Personal Information":
        route = `/${domain}/employee/profile/personal`;
        break;
      case "Family Details":
        route = `/${domain}/employee/profile/family`;
        break;
      case "Education Details":
        route = `/${domain}/employee/profile/education`;
        break;
      case "Experience Details":
        route = `/${domain}/employee/profile/experience`;
        break;
      case "Bank Information":
        route = `/${domain}/employee/profile/bank`;
        break;
      case "Uploaded Documents":
        route = `/${domain}/employee/profile/documents`;
        break;
      default:
        break;
    }

    navigate(route);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          z-50 overflow-y-auto border-r border-[#B8E0F5]
          transition-all duration-300 ease-in-out
 
          /* Desktop */
          lg:relative lg:h-[calc(100vh-64px)] lg:translate-x-0
          ${isSidebarOpen ? "lg:w-72" : "lg:w-20"}
 
          /* Mobile - slide in/out */
          max-lg:fixed max-lg:left-0 max-lg:top-16
          max-lg:h-[calc(100vh-64px)] max-lg:w-[280px] max-lg:max-w-[80vw]
          max-lg:shadow-2xl
          ${isSidebarOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"}
        `}
        // style={{ backgroundColor: "var(--primary-color)" }}

        style={{ backgroundColor: "#E8F6FF", 
          borderRightColor: iconColor,
        }}
      >

        <nav className="py-4">
          {menuItems.map((item: MenuItem) => (
            <div key={item.menuId}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  // Dashboard always navigates
                  if (item.menuName === "Dashboard") {
                    navigate(`/${domain}/employee/dashboard`);
                    setIsSidebarOpen(false);
                    return;
                  }

                  // Sidebar is collapsed → clicking icon navigates
                  if (!isSidebarOpen) {
                    const firstChild = item.children?.[0];

                    if (firstChild?.routeUrl) {
                      const route = firstChild.routeUrl.replace(
                        "/Employee",
                        `/${domain}/employee`
                      );

                      navigate(route);
                      setIsSidebarOpen(false);
                    }

                    return;
                  }

                  // Sidebar is open → expand/collapse submenu
                  if (item.children && item.children.length > 0) {
                    setExpandedMenu(
                      expandedMenu === item.menuId ? null : item.menuId
                    );
                  }
                }}
                className="
                  flex h-auto w-full items-center justify-between rounded-none
                  px-4 py-3 text-[#1E3A5F]
                  hover:bg-white/70 hover:text-[#1E3A5F]
                "
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Icon always visible */}
                  <span
                    className="shrink-0 transition-colors duration-200"
                    style={{ color: iconColor }}
                  >
                    {menuIcons[item.menuName] || <UserRound size={20}  strokeWidth={2.2}style={{ color: iconColor }}/>}
                  </span>

                  {/* Label only when sidebar is open */}
                  {isSidebarOpen && (
                    <span className="truncate whitespace-nowrap">
                      {item.menuName}
                    </span>
                  )}
                </div>

                {isSidebarOpen &&
                  item.children &&
                  item.children.length > 0 &&
                  (expandedMenu === item.menuId ? (
                    <ChevronDown size={16} strokeWidth={2.2} className="shrink-0 transition-colors duration-200"
                      style={{ color: iconColor }}/>
                  ) : (
                    <ChevronRight size={16} strokeWidth={2.2} className="shrink-0 transition-colors duration-200"
                      style={{ color: iconColor }} />
                  ))}
              </Button>

              {/* Sub menu */}
              {isSidebarOpen &&
                expandedMenu === item.menuId &&
                item.children?.map((child: MenuItem) => (
                  <Button
                    key={child.menuId}
                    type="button"
                    variant="ghost"
                    onClick={() => handleNavigation(child)}
                    className="
                      h-auto w-full justify-start rounded-none
                      py-2 pl-14 pr-4 text-[#334155]
                      hover:bg-white/70 hover:text-[#1E3A5F]
                    "
                  >
                    {child.menuName}
                  </Button>
                ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}