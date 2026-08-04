import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
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

import type { MenuItem } from "../dashboard/types/dashboard.types";

const menuIcons: Record<string, React.ReactNode> = {
  "My Profile": <UserRound size={20} />,
  "Leave Management": <CalendarDays size={20} />,
  Assets: <Package size={20} />,
  "Help Desk": <LifeBuoy size={20} />,
  "Learning & Development": <GraduationCap size={20} />,
  Separation: <LogOut size={20} />,
};

export default function Sidebar({
  isSidebarOpen,
}: SidebarProps) {
  const navigate = useNavigate();
  const { domain } = useParams();

  const { menuData } = useDashboard();

  const [expandedMenu, setExpandedMenu] =
    useState<number | null>(null);

  const menuItems =
    menuData?.data?.[0]?.children || [];

  const handleNavigation = (child: MenuItem) => {
    if (!child.routeUrl) return;

    let route = child.routeUrl.replace(
      "/Employee",
      `/${domain}/employee`
    );

    // Profile menu routes
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

    console.log("Menu:", child.menuName);
    console.log("Route URL:", child.routeUrl);
    console.log("Final Route:", route);

    navigate(route);
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
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (item.menuName === "Dashboard") {
                  navigate(`/${domain}/employee/dashboard`);
                  return;
                }

                setExpandedMenu(
                  expandedMenu === item.menuId
                    ? null
                    : item.menuId
                );
              }}
              className="
    w-full
    h-auto
    flex
    items-center
    justify-between
    px-4
    py-3
    text-white
    hover:bg-white/10
    hover:text-white
    rounded-none
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
                item.children &&
                item.children.length > 0 &&
                (expandedMenu === item.menuId ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </Button>

            {isSidebarOpen &&
              expandedMenu === item.menuId &&
              item.children?.map((child: MenuItem) => (
                <Button
                  key={child.menuId}
                  type="button"
                  variant="ghost"
                  onClick={() => handleNavigation(child)}
                  className="
    w-full
    h-auto
    justify-start
    pl-14
    pr-4
    py-2
    text-white/90
    hover:bg-white/10
    hover:text-white
    rounded-none
    transition
  "
                >
                  {child.menuName}
                </Button>
              ))}
          </div>
        ))}
      </nav>
    </aside >
  );
}