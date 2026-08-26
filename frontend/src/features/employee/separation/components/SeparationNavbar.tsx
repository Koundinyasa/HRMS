import { NavLink, useParams } from "react-router-dom";

import { useDashboard } from "../../dashboard/hooks/useDashboard";
import type { MenuItem } from "../../dashboard/types/dashboard.types";

export default function SeparationNavbar() {
  const { domain } = useParams();
  const { menuData } = useDashboard();

  const separationMenu = menuData?.data?.[0]?.children?.find(
    (item: MenuItem) => item.menuName === "Separation"
  );

  const tabs = separationMenu?.children ?? [];

  return (
    <nav
      aria-label="Separation navigation"
      className="
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        border-b
        bg-white
      "
      style={{ borderColor: "var(--primary-border)" }}
    >
      <div
        className="
          grid
          w-full
          min-w-0
          max-w-full
          grid-cols-3
        "
      >
        {tabs.map((tab: MenuItem) => {
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
                [
                  "flex min-w-0 items-center justify-center",
                  "min-h-10 sm:min-h-11 md:min-h-12 lg:min-h-14",
                  "border-b-2 px-1 py-2 text-center",
                  "text-[9px] font-medium",
                  "sm:px-2 sm:text-[10px]",
                  "md:px-3 md:text-xs",
                  "lg:px-5 lg:text-sm",
                  "xl:text-base",
                  "leading-tight break-words",

                  isActive
                    ? "text-[var(--primary-color)]"
                    : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                ].join(" ")
              }
              style={({ isActive }) =>
                isActive
                  ? {
                    color: "var(--primary-color)",
                    borderColor: "var(--primary-color)",
                  }
                  : undefined
              }
            >
              <span
                className="
  block
  min-w-0
  max-w-full
  px-0.5
  text-center
  whitespace-normal
  break-words
"
                title={tab.menuName}
              >
                {tab.menuName}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
