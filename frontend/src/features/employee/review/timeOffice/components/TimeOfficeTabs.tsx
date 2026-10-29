import { NavLink, useParams } from "react-router-dom";
import { useGetMenusQuery } from "../../../dashboard/api/dashboardApi";
import type { MenuItem } from "../../../dashboard/types/dashboard.types";

interface TimeOfficeTabsProps {
  className?: string;
  compact?: boolean;
}

export default function TimeOfficeTabs({
  className = "",
  compact = false,
}: TimeOfficeTabsProps) {
  const { domain } = useParams();
  const employeePath = domain ? `/${domain}/employee` : "/employee";
  const { data: menuData } = useGetMenusQuery();
  const reviewMenu = menuData?.data?.[0]?.children?.find(
    (item: MenuItem) => item.menuName?.trim().toLowerCase() === "review",
  );
  const timeOfficeMenu = reviewMenu?.children?.find(
    (item: MenuItem) => item.menuName?.trim().toLowerCase() === "time office",
  );
  const regularizationMenu = timeOfficeMenu?.children?.find(
    (item: MenuItem) => item.menuName?.trim().toLowerCase() === "regularization",
  );
  const tabs = (regularizationMenu?.children ?? []).filter(
    (item): item is MenuItem & { routeUrl: string } =>
      typeof item.routeUrl === "string" && item.routeUrl.trim().length > 0,
  );

  return (
    <nav
      aria-label="Time office navigation"
      className={`punch-horizontal-scroll flex min-w-0 items-center overflow-x-auto ${
        compact ? "gap-3" : "gap-4 sm:gap-6"
      } ${className}`}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.menuId}
          to={tab.routeUrl.trim().replace(/^\/?Employee/i, employeePath)}
          className={({ isActive }) =>
            `shrink-0 whitespace-nowrap border-b-2 font-semibold ${
              compact
                ? "px-1 py-2 text-[13px]"
                : "px-1 py-2.5 text-[12px] sm:py-3 sm:text-[15px]"
            } ${
              isActive
                ? "border-[#1997e8] text-[#1997e8]"
                : "border-transparent text-[#68758a]"
            }`
          }
        >
          {tab.menuName}
        </NavLink>
      ))}
    </nav>
  );
}
