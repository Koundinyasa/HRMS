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
  setIsSidebarOpen,
}: SidebarProps) {
  const navigate = useNavigate();
  const { domain } = useParams();

  const { menuData } = useDashboard();

  const [expandedMenu, setExpandedMenu] = useState<number | null>(null);

  const menuItems = menuData?.data?.[0]?.children || [];

  // Handle child menu navigation
  const handleNavigation = (child: MenuItem) => {
    if (!child.routeUrl) return;

    let route = child.routeUrl.replace(
      "/Employee",
      `/${domain}/employee`
    );

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
    setExpandedMenu(null);
  };


  const handleMenuClick = (item: MenuItem) => {
    if (item.menuName === "Dashboard") {
      navigate(`/${domain}/employee/dashboard`);
      setIsSidebarOpen(false);
      setExpandedMenu(null);
      return;
    }

    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      if (item.children && item.children.length > 0) {
        setExpandedMenu(item.menuId);
      }

      return;
    }
    if (item.children && item.children.length > 0) {
      setExpandedMenu(
        expandedMenu === item.menuId ? null : item.menuId
      );
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            setExpandedMenu(null);
          }}
        />
      )}

      <aside
        className={`
          z-50 overflow-y-auto transition-all duration-300 ease-in-out

          /* Desktop */
          lg:relative
          lg:h-[calc(100vh-64px)]
          lg:translate-x-0

          ${isSidebarOpen ? "lg:w-72" : "lg:w-20"}

          /* Mobile */
          max-lg:fixed
          max-lg:left-0
          max-lg:top-16
          max-lg:h-[calc(100vh-64px)]
          max-lg:w-[280px]
          max-lg:max-w-[80vw]
          max-lg:shadow-2xl

          ${
            isSidebarOpen
              ? "max-lg:translate-x-0"
              : "max-lg:-translate-x-full"
          }
        `}
        style={{
          backgroundColor: "var(--primary-color)",
        }}
      >
        <nav className="py-4">
          {menuItems.map((item: MenuItem) => (
            <div key={item.menuId}>
              {/* Parent menu */}
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleMenuClick(item)}
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
                "
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Icon */}
                  <span className="shrink-0">
                    {menuIcons[item.menuName] || (
                      <UserRound size={20} />
                    )}
                  </span>

                  {/* Label */}
                  {isSidebarOpen && (
                    <span className="whitespace-nowrap truncate">
                      {item.menuName}
                    </span>
                  )}
                </div>

                {/* Expand / Collapse icon */}
                {isSidebarOpen &&
                  item.children &&
                  item.children.length > 0 &&
                  (expandedMenu === item.menuId ? (
                    <ChevronDown
                      size={16}
                      className="shrink-0"
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="shrink-0"
                    />
                  ))}
              </Button>

              {/* Submenu */}
              {isSidebarOpen &&
                expandedMenu === item.menuId &&
                item.children &&
                item.children.length > 0 && (
                  <div>
                    {item.children.map((child: MenuItem) => (
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
                        "
                      >
                        {child.menuName}
                      </Button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}