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
      className="
        mb-4
        w-full
        min-w-0
        overflow-x-auto
        overflow-y-hidden
        rounded-lg
        border
        bg-white
        sm:mb-5
        sm:rounded-xl
      "
      style={{
        borderColor: "var(--primary-border)",
      }}
    >
      <div className="flex min-w-max">
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
                flex
                  min-w-[110px]
                  flex-1
                  items-center
                  justify-center
                  whitespace-nowrap
                  border-b-2
                  px-3
                  py-3
                  text-xs
                  font-medium
                  transition-all
                  sm:min-w-[130px]
                  sm:px-4
                  sm:py-3
                  sm:text-sm                  md:min-w-[150px]
                  md:px-5
                  md:py-4
                  md:text-base
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
    </div>
  );
}