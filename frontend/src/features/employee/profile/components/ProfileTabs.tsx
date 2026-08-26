import { NavLink, useParams } from "react-router-dom";
 
import { useDashboard } from "../../dashboard/hooks/useDashboard";
 
import type { MenuItem } from "../../dashboard/types/dashboard.types";
 
export default function ProfileTabs() {
  const { domain } = useParams();
 
  const { menuData } = useDashboard();
 
  // Get "My Profile" dynamically from backend
  const profileMenu =
    menuData?.data?.[0]?.children?.find(
      (item: MenuItem) =>
        item.menuName === "My Profile"
    );
 
  // Get profile submenus dynamically
  const tabs = profileMenu?.children ?? [];
 
  return (
    <div
      className="w-full overflow-x-auto border-b scrollbar-thin"
      style={{
        borderColor: "var(--primary-border)",
      }}
    >
      <div className="flex w-max">
        {tabs.map((tab: MenuItem) => {
 
          let route =
            tab.routeUrl?.replace(
              "/Employee",
              `/${domain}/employee`
            ) ?? "";
 
          // Fix profile document route
          if (tab.menuName === "Uploaded Documents") {
            route = `/${domain}/employee/profile/documents`;
          }
 
          return (
            <NavLink
              key={tab.menuId}
              to={route}
              className={({ isActive }) =>
                `
                  shrink-0
                  px-4
                  py-3
                  text-sm
                  font-medium
                  whitespace-nowrap
                  border-b-2
                  transition-all
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