// import { NavLink, useParams } from "react-router-dom";
// import { useDashboard } from "../../dashboard/hooks/useDashboard";
// import type { MenuItem } from "../../dashboard/types/dashboard.types";
// import { FileText, ClipboardList, LogOut, type LucideIcon } from "lucide-react";
 
// const TAB_ICONS: Record<string, LucideIcon> = {
//   "Resignation Request": FileText,
//   "Status": ClipboardList,
//   "Withdraw": LogOut,
// };
 
// export default function SeparationNavbar() {
//   const { domain } = useParams();
//   const { menuData } = useDashboard();
 
//   const separationMenu = menuData?.data?.[0]?.children?.find(
//     (item: MenuItem) => item.menuName === "Separation"
//   );
 
//   const tabs = separationMenu?.children ?? [];
 
//   return (
//     <nav
//       aria-label="Separation navigation"
//       className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-orange-300 bg-orange-50/40 p-2.5"
//       style={{ fontFamily: "Urbanist, sans-serif" }}
//       // style={{ borderColor: "var(--primary-border)" }}
//     >
//       <div className="flex w-full min-w-0 max-w-full items-center justify-between gap-3">
//         {tabs.map((tab: MenuItem) => {
//           const route =
//             tab.routeUrl?.replace(
//               "/Employee",
//               `/${domain}/employee`
//             ).replace(
//               /\/separation\/status\/?$/i,
//               "/separation/status"
//             ) ?? "";
 
//             const Icon = TAB_ICONS[tab.menuName] ?? FileText;
 
//           return (
//             <NavLink
//               key={tab.menuId}
//               to={route}
//               className={({ isActive }) =>
//                 [
//                   "inline-flex items-center justify-center gap-2 shrink-0",
//                   "h-11 rounded-lg border px-25",
//                   "text-sm font-medium whitespace-nowrap",
//                   "transition-colors",
 
//                   isActive
//                     ? "border-orange-400 bg-white text-orange-600"
//                     : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700",
//                 ].join(" ")
//               }
//               // style={({ isActive }) =>
//               //   isActive
//               //     ? {
//               //       color: "var(--primary-color)",
//               //       borderColor: "var(--primary-color)",
//               //     }
//               //     : undefined
//               // }
//             >
 
//               <Icon className="h-4 w-4 shrink-0" />
//               <span
//                 className="
//   block whitespace-normal
  
// "
//                 title={tab.menuName}
//               >
//                 {tab.menuName}
//               </span>
//             </NavLink>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }
 
 

import { NavLink, useParams } from "react-router-dom";
import { useDashboard } from "../../dashboard/hooks/useDashboard";
import type { MenuItem } from "../../dashboard/types/dashboard.types";
import { FileText, ClipboardList, LogOut, type LucideIcon } from "lucide-react";
//import "@fontsource-variable/urbanist";
 
const TAB_ICONS: Record<string, LucideIcon> = {
  "Resignation Request": FileText,
  "Status": ClipboardList,
  "Withdraw": LogOut,
};
 
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
      className="w-full min-w-0 max-w-full overflow-x-auto overflow-y-hidden rounded-lg border border-orange-300 bg-orange-50/40 p-2.5"
      style={{ fontFamily: "Urbanist Variable, Urbanist, sans-serif" }}
      // style={{ borderColor: "var(--primary-border)" }}
    >
      <div className="flex w-full min-w-[680px] items-center gap-2 sm:min-w-0">
        {tabs.map((tab: MenuItem) => {
          const route =
            tab.routeUrl?.replace(
              "/Employee",
              `/${domain}/employee`
            ).replace(
              /\/separation\/status\/?$/i,
              "/separation/status"
            ) ?? "";
 
            const Icon = TAB_ICONS[tab.menuName] ?? FileText;
 
          return (
            <NavLink
              key={tab.menuId}
              to={route}
              className={({ isActive }) =>
                [
                  "inline-flex h-11 min-w-0 flex-1 shrink-0 items-center justify-center gap-2",
                  "rounded-lg border px-3 text-center text-sm font-medium whitespace-nowrap",
                  "transition-colors",
 
                  isActive
                    ? "border-orange-400 bg-white text-orange-600"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                ].join(" ")
              }
              // style={({ isActive }) =>
              //   isActive
              //     ? {
              //       color: "var(--primary-color)",
              //       borderColor: "var(--primary-color)",
              //     }
              //     : undefined
              // }
            >
 
              <Icon className="h-4 w-4 shrink-0" />
              <span
                className="
  block whitespace-nowrap
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
 
 
 