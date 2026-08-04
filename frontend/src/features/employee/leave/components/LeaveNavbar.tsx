import { NavLink, useParams } from "react-router-dom";

import { useDashboard } from "../../dashboard/hooks/useDashboard";

import type { MenuItem } from "../../dashboard/types/dashboard.types";

export default function LeaveNavbar() {
  const { domain } = useParams();

  const { menuData } = useDashboard();

  const leaveMenu =
    menuData?.data?.[0]?.children?.find(
      (item: MenuItem) =>
        item.menuName === "Leave Management"
    );

  const tabs = leaveMenu?.children ?? [];

  return (
    <div
      className="
        w-full
        flex
        overflow-x-auto
        border-b
      "
      style={{
        borderColor: "var(--primary-border)",
      }}
    >
      {tabs.map((tab: MenuItem) => {
        let route = "";

        switch (tab.menuName) {
          case "Apply Leave":
            route = `/${domain}/employee/leave/apply`;
            break;

          case "Leave Status":
            route = `/${domain}/employee/leave/status`;
            break;

          case "Leave Balance":
            route = `/${domain}/employee/leave/balance`;
            break;

          case "Leave History":
            route = `/${domain}/employee/leave/history`;
            break;

          case "Leave Cancellation":
            route = `/${domain}/employee/leave/cancel`;
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
                font-medium
                transition-all
                duration-300
                ${isActive
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