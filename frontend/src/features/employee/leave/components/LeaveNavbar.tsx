import { NavLink, useParams } from "react-router-dom";
import { Plus, Clock, PieChart, History, XCircle,CalendarDays} from "lucide-react";

import { useDashboard } from "../../dashboard/hooks/useDashboard";

import type { MenuItem } from "../../dashboard/types/dashboard.types";

const TAB_ICONS: Record<string, React.ReactNode> = {
  "Apply Leave": <Plus className="h-[1.155rem] w-[1.155rem]" />,
  "Leave Status": <Clock className="h-[1.155rem] w-[1.155rem]" />,
  "Leave Balance": <PieChart className="h-[1.155rem] w-[1.155rem]" />,
  "Leave History": <History className="h-[1.155rem] w-[1.155rem]" />,
  "Holiday List": <CalendarDays className="h-[1.155rem] w-[1.155rem]" />,
};

const TAB_WIDTHS: Record<string, string> = {
  "Apply Leave": "w-[11.95425rem]",
  "Leave Status": "w-[13.2825rem]",
  "Leave Balance": "w-[13.2825rem]",
  "Leave History": "w-[12.618375rem]",
  "Holiday List": "w-[10rem]",
};



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
        w-full
        flex
        items-center
        
        overflow-x-auto
<<<<<<< HEAD
        rounded-2xl
        border-2
        border-[#D9CCFB]
        p-2
=======
        rounded-lg
        border
        border-[#b9a5ff]
        p-[0.3320625rem]
>>>>>>> 3a23add3d72c2312ae9a5b995a6881f59795189f
      "
      // style={{
      //   borderColor: "var(--primary-border)",
      // }}

      style={{
        backgroundColor: "#f7f5ff",
      }}
    >
      <div className="flex w-full min-w-0 justify-between">

        {tabs.map((tab: MenuItem) => {
          // // Get route dynamically from API
          // const route =
          //   tab.routeUrl?.replace(
          //     "/Employee",
          //     `/${domain}/employee`
          //   ) ?? "";

          let route = "";

          
          if (tab.menuName === "Holiday List") {
            route = `/${domain}/employee/leave/holidaylist`;
          } else {
            // Existing dynamic route logic for other tabs
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
                flex-none
                ${TAB_WIDTHS[tab.menuName] ?? "min-w-[8.9rem]"}
                items-center
                justify-center
                gap-1.5
                whitespace-nowrap
                rounded-md
                border
                bg-white
                border-[#c5b0ff]
                h-[2.3244375rem]
                px-[0.9961875rem]
                py-0
                text-[13.2825px]
                font-medium
                leading-[1.32825rem]
                transition-all
                duration-300

                ${isActive
                  ? "text-[#7c3aed]"
                  : "text-black hover:text-slate-700"
                }
                `
              }
              style={({ isActive }) =>
                isActive
                  ? {
                    color: "#7c3aed",
                    borderColor: "#7c3aed",
                  }
                  : {}
              }
            >
              {TAB_ICONS[tab.menuName]}
              {tab.menuName}
            </NavLink>
          );
        })}

      </div>
    </div>
  );
}
