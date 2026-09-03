import { NavLink, useParams } from "react-router-dom";
import {
  FileText,
  Package,
  CheckCircle2,
  History as HistoryIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useDashboard } from "../../dashboard/hooks/useDashboard";
import type { MenuItem } from "../../dashboard/types/dashboard.types";

function getTabIcon(menuName: string): LucideIcon {
  const name = menuName.toLowerCase();

  if (name.includes("request")) return FileText;
  if (name.includes("history")) return HistoryIcon;
  if (name.includes("status")) return CheckCircle2;

  return Package;
}

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
      className="
        mb-4
        flex
        w-full
        min-w-0
        items-center
        justify-between
        gap-2
        overflow-x-auto
        overflow-y-hidden
        rounded-lg
        border
        border-blue-300
        bg-[#E8F3FE]
        p-1.5
        sm:mb-4
        sm:rounded-xl
        sm:p-2
      "
    // style={{
    //   borderColor: "var(--primary-border)",
    // }}
    >
      <div className="flex min-w-max gap-35">
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

          const Icon = getTabIcon(tab.menuName);

          return (
            <NavLink
              key={tab.menuId}
              to={route}
              className={({ isActive }) =>
                `
                flex
              h-9
              w-[110px]
              shrink-0
              items-center
              justify-center
              gap-2
              whitespace-nowrap
              rounded-md
              bg-white
              px-2
              text-xs
              font-medium
              transition-all
             
              sm:h-10
              sm:w-[130px]
              sm:px-3
              sm:text-sm
             
              md:w-[400px]
              md:px-1
                ${isActive
                  ? "border border-blue-500 text-blue-600"
                  : "border border-transparent text-slate-500 hover:text-slate-700"
                }
            `}

            // style={({ isActive }) =>
            //   isActive
            //     ? {
            //         color: "var(--primary-color)",
            //         borderColor: "var(--primary-color)",
            //       }
            //     : {}
            // }
            >

              <Icon
                size={14}
                className="shrink-0 sm:h-4 sm:w-4"
              />
              <span className="truncate">
                {tab.menuName}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}