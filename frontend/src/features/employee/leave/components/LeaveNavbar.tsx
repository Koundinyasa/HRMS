// import { NavLink, useParams } from "react-router-dom";

// import { useDashboard } from "../../dashboard/hooks/useDashboard";

// import type { MenuItem } from "../../dashboard/types/dashboard.types";

// export default function LeaveNavbar() {
//   const { domain } = useParams();

//   const { menuData } = useDashboard();

//   const leaveMenu =
//     menuData?.data?.[0]?.children?.find(
//       (item: MenuItem) =>
//         item.menuName === "Leave Management"
//     );

//   const tabs = leaveMenu?.children ?? [];

//   return (
//     <div
//       className="
//         w-full
//         flex
//         overflow-x-auto
//         border-b
//       "
//       style={{
//         borderColor: "var(--primary-border)",
//       }}
//     >
//       {tabs.map((tab: MenuItem) => {
//         let route = "";

//         switch (tab.menuName) {
//           case "Apply Leave":
//             route = `/${domain}/employee/leave/apply`;
//             break;

//           case "Leave Status":
//             route = `/${domain}/employee/leave/status`;
//             break;

//           case "Leave Balance":
//             route = `/${domain}/employee/leave/balance`;
//             break;

//           case "Leave History":
//             route = `/${domain}/employee/leave/history`;
//             break;

//           case "Leave Cancellation":
//             route = `/${domain}/employee/leave/cancel`;
//             break;

//           default:
//             route =
//               tab.routeUrl?.replace(
//                 "/Employee",
//                 `/${domain}/employee`
//               ) ?? "";
//         }

//         return (
//           <NavLink
//             key={tab.menuId}
//             to={route}
//             className={({ isActive }) =>
//               `
//                 shrink-0
//                 min-w-max
//                 px-4
//                 whitespace-nowrap
//                 border-b-2
//                 py-4
//                 text-center
//                 font-medium
//                 transition-all
//                 duration-300
//                 ${isActive
//                 ? ""
//                 : "border-transparent text-slate-500 hover:text-slate-700"
//               }
//               `
//             }
//             style={({ isActive }) =>
//               isActive
//                 ? {
//                   color: "var(--primary-color)",
//                   borderColor: "var(--primary-color)",
//                 }
//                 : {}
//             }
//           >
//             {tab.menuName}
//           </NavLink>
//         );
//       })}
//     </div>
//   );
// }

import { NavLink, useParams } from "react-router-dom";
import { Plus, Clock, PieChart, History, XCircle } from "lucide-react";

import { useDashboard } from "../../dashboard/hooks/useDashboard";

import type { MenuItem } from "../../dashboard/types/dashboard.types";

const TAB_ICONS: Record<string, React.ReactNode> = {
  "Apply Leave": <Plus className="h-[1.155rem] w-[1.155rem]" />,
  "Leave Status": <Clock className="h-[1.155rem] w-[1.155rem]" />,
  "Leave Balance": <PieChart className="h-[1.155rem] w-[1.155rem]" />,
  "Leave History": <History className="h-[1.155rem] w-[1.155rem]" />,
  "Leave Cancellation": <XCircle className="h-[1.155rem] w-[1.155rem]" />,
};

const TAB_WIDTHS: Record<string, string> = {
  "Apply Leave": "w-[11.95425rem]",
  "Leave Status": "w-[13.2825rem]",
  "Leave Balance": "w-[13.2825rem]",
  "Leave History": "w-[12.618375rem]",
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
        rounded-lg
        border
        border-[#b9a5ff]
        p-[0.3320625rem]
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