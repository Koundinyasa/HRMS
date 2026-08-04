import { NavLink, useParams } from "react-router-dom";

import { useDashboard } from "../../dashboard/hooks/useDashboard";
import type { MenuItem } from "../../dashboard/types/dashboard.types";

export default function SeparationNavbar() {
  const { domain } = useParams();

  const { menuData } = useDashboard();

  const separationMenu =
    menuData?.data?.[0]?.children?.find(
      (item: MenuItem) => item.menuName === "Separation"
    );

  const tabs = separationMenu?.children ?? [];

  return (
    <div
      className="flex w-full overflow-x-auto border-b"
      style={{
        borderColor: "var(--primary-border)",
      }}
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
              `
                flex-1
                whitespace-nowrap
                border-b-2
                py-4
                text-center
                text-xl
                font-medium
                transition-all
                duration-300
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
                    borderColor: "var(--primary-color)",
                  }
                : {}
            }
          >
            {tab.menuName}
          </NavLink>
        );
      })}
    </div>
  );
}