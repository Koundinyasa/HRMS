import { NavLink, useParams } from "react-router-dom";
 
import { useDashboard } from "../../dashboard/hooks/useDashboard";
 
import type { MenuItem } from "../../dashboard/types/dashboard.types";
 
export default function LeaveNavbar() {
  const { domain } = useParams();
 
  const { menuData } = useDashboard();
 
  // Get Leave Management menu from API
  const leaveMenu =
    menuData?.data?.[0]?.children?.find(
      (item: MenuItem) =>
        item.menuName === "Leave Management"
    );
 
  // Get Leave Management submenus dynamically from API
  const tabs = leaveMenu?.children ?? [];
 
  return (
    <div
      className="
        sticky
        top-0
        z-40
        w-full
        max-w-full
        overflow-hidden
        border-b
        bg-white
      "
      style={{
        borderColor: "var(--primary-border)",
      }}
    >
      <div className="flex w-full min-w-0">
 
        {tabs.map((tab: MenuItem) => {
          // Get route dynamically from API
          const route =
            tab.routeUrl?.replace(
              "/Employee",
              `/${domain}/employee`
            ) ?? "";
 
          return (
            <NavLink
              key={tab.menuId}
              to={route}
              className={({ isActive }) =>
                `
                flex
                min-w-0
                flex-1
                items-center
                justify-center
                border-b-2
                px-1
                py-3
                text-center
                text-xs
                font-medium
                leading-tight
                transition-colors
                duration-200
 
                sm:px-2
                sm:py-3.5
                sm:text-sm
 
                md:px-3
                md:py-4
                md:text-base
 
                lg:px-4
                lg:text-lg
 
                ${
                  isActive
                    ? ""
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }
                `
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "var(--primary-color)",
                      borderColor:
                        "var(--primary-color)",
                    }
                  : {}
              }
            >
              {tab.menuName}
            </NavLink>
          );
        })}
 
      </div>
    </div>
  );
}