import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

import { useDashboard } from "../dashboard/hooks/useDashboard";

import type { MenuItem, } from "../dashboard/types/dashboard.types";
const menuIcons: Record<string, React.ReactNode> = {
  "My Profile": <UserRound size={20} />,

  "Leave Management": <CalendarDays size={20} />,

  Assets: <Package size={20} />,

  "Help Desk": <LifeBuoy size={20} />,

  "Learning & Development": (
    <GraduationCap size={20} />
  ),

  Separation: <LogOut size={20} />,
};

export default function Sidebar({
  isSidebarOpen,
}: SidebarProps) {
  const navigate = useNavigate();

  const { menuData } = useDashboard();

  const [expandedMenu, setExpandedMenu] =
    useState<number | null>(null);

  const menuItems =
    menuData?.data?.[0]?.children || [];

  const handleNavigation = (
    child: MenuItem
  ) => {
    if (child.routeUrl) {
      navigate(child.routeUrl);
    }
  };

  return (
    <aside
      className={`
    ${isSidebarOpen ? "w-72" : "w-20"}
    h-[calc(100vh-64px)]
    overflow-y-auto
    transition-all
    duration-300
  `}
      style={{
        backgroundColor: "var(--primary-color)",
      }}
    >
      <nav className="py-4">
        {menuItems.map((item: MenuItem) => (
          <div key={item.menuId}>
            <button
              type="button"
              onClick={() =>
                setExpandedMenu(
                  expandedMenu === item.menuId
                    ? null
                    : item.menuId
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3
                text-white
                hover:bg-white/10
                transition
              "
            >
              <div className="flex items-center gap-3 flex-1">
                {menuIcons[item.menuName]}

                {isSidebarOpen && (
                  <span className="whitespace-nowrap">
                    {item.menuName}
                  </span>
                )}
              </div>

              {isSidebarOpen &&
                (expandedMenu === item.menuId ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </button>

            {isSidebarOpen &&
              expandedMenu === item.menuId &&
              item.children?.map(
                (child: MenuItem) => (
                  <button
                    key={child.menuId}
                    type="button"
                    onClick={() =>
                      handleNavigation(child)
                    }
                    className="
                      w-full
                      text-left
                      pl-14
                      pr-4
                      py-2
                      text-white/90
                      hover:bg-white/10
                      transition
                    "
                  >
                    {child.menuName}
                  </button>
                )
              )}
          </div>
        ))}
      </nav>
    </aside>
  );
}