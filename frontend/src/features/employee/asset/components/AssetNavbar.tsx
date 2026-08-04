import { NavLink, useParams } from "react-router-dom";

import { useDashboard } from "../../dashboard/hooks/useDashboard";
import type { MenuItem } from "../../dashboard/types/dashboard.types";

export default function AssetNavbar() {
  const { domain } = useParams();

  const { menuData } = useDashboard();

  const assetMenu =
    menuData?.data?.[0]?.children?.find(
      (item: MenuItem) =>
        item.menuName === "Assets"
    );

  const tabs = assetMenu?.children ?? [];

  return (
    <div
      className="w-full flex overflow-x-auto border-b"
      style={{
        borderColor: "var(--primary-border)",
      }}
    >
      {tabs.map((tab: MenuItem) => {
        let route = "";

        switch (tab.menuName) {
          case "Asset Request":
            route = `/${domain}/employee/assets/request`;
            break;

          case "Asset Status":
            route = `/${domain}/employee/assets/return`;
            break;

          case "History":
            route = `/${domain}/employee/assets/assigned`;
            break;

          default:
            route =
              tab.routeUrl?.replace(
                "/Employee",
                `/${domain}/employee`
              ) ?? "";
        }

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