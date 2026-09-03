// import {
//   NavLink,
//   useParams,
// } from "react-router-dom";

// import {
//   FileText,
//   ClipboardCheck,
//   BookOpen,
// } from "lucide-react";

// import { useDashboard } from "../../dashboard/hooks/useDashboard";

// import type {
//   MenuItem,
// } from "../../dashboard/types/dashboard.types";

// import type {
//   HelpDeskNavbarProps,
// } from "../types/helpDesk.types";

// export default function HelpDeskNavbar({
//   className = "",
// }: HelpDeskNavbarProps) {

//   const { domain } =
//     useParams();

//   const { menuData } =
//     useDashboard();

//   const helpDeskMenu =
//     menuData?.data?.[0]?.children?.find(
//       (item: MenuItem) =>
//         item.menuName === "Help Desk"
//     );

//   const tabs =
//     helpDeskMenu?.children ?? [];

//   return (
//     <div
//       className={`
 
//         sticky
 
//         top-0
 
//         z-40
 
//         w-full
 
//         max-w-full
 
//         overflow-hidden
 
//         border-b
 
//         bg-white
 
//         ${className}
 
//       `}
//       style={{
//         borderColor:
//           "var(--primary-border)",
//       }}
//     >
//       <div className="flex w-full min-w-0">

//         {tabs.map((tab: MenuItem) => {

//           const route =
//             tab.routeUrl?.replace(
//               "/Employee",
//               `/${domain}/employee`
//             ) ?? "";

//           return (
//             <NavLink
//               key={tab.menuId}
//               to={route}
//         className={({ isActive }) =>
 
//                 `
 
//                 flex
 
//                   min-w-0
 
//                   flex-1
 
//                   items-center
 
//                   justify-center
 
//                   border-b-2
 
//                   px-1
 
//                   py-3
 
//                   text-center
 
//                   text-xs
 
//                   font-medium
 
//                   leading-tight
 
//                   transition-colors
 
//                   duration-200
 
//                   sm:px-2
 
//                   sm:py-3.5
 
//                   sm:text-sm
 
//                   md:px-3
 
//                   md:py-4
 
//                   md:text-base
 
//                   lg:px-4
 
//                   lg:text-lg
 
//                 ${
//                   isActive
//                     ? ""
//                     : "border-transparent text-slate-500 hover:text-slate-700"
//                 }
//                 `
//               }
//               style={({ isActive }) =>
//                 isActive
//                   ? {
//                       color:
//                         "var(--primary-color)",
//                       borderColor:
//                         "var(--primary-color)",
//                     }
//                   : {}
//               }
//             >
//               {tab.menuName}
//             </NavLink>
//           );
//         })}

//       </div>
//     </div>
//   );
// }


import { NavLink, useParams } from "react-router-dom";
import {
  FileText,
  ClipboardCheck,
  BookOpen,
} from "lucide-react";
 
import { useDashboard } from "../../dashboard/hooks/useDashboard";
import type { MenuItem } from "../../dashboard/types/dashboard.types";
 
import type { HelpDeskNavbarProps } from "../types/helpDesk.types";
 
export default function HelpDeskNavbar({
  className = "",
}: HelpDeskNavbarProps) {
  const { domain } = useParams();
 
  const { menuData } = useDashboard();
 
  /* =====================================================
     GET HELP DESK MENU
  ====================================================== */
 
  const helpDeskMenu = menuData?.data?.[0]?.children?.find(
    (item: MenuItem) =>
      item.menuName?.trim().toLowerCase() === "help desk"
  );
 
  const tabs = helpDeskMenu?.children ?? [];
 
  /* =====================================================
     GET ROUTE
  ====================================================== */
 
  const getRoute = (tab: MenuItem) => {
    return (
      tab.routeUrl?.replace(
        "/Employee",
        `/${domain}/employee`
      ) ?? ""
    );
  };
 
  /* =====================================================
     GET ICON
  ====================================================== */
 
  const getIcon = (menuName: string) => {
    const name = menuName.trim().toLowerCase();
 
    if (name === "raise ticket") {
      return (
        <FileText
          className="shrink-0"
          size={18}
          strokeWidth={1.8}
        />
      );
    }
 
    if (name === "ticket status") {
      return (
        <ClipboardCheck
          className="shrink-0"
          size={18}
          strokeWidth={1.8}
        />
      );
    }
 
    if (name === "knowledge base") {
      return (
        <BookOpen
          className="shrink-0"
          size={18}
          strokeWidth={1.8}
        />
      );
    }
 
    return null;
  };
 
  /* =====================================================
     COMMON BUTTON STYLE
  ====================================================== */
 
  const getButtonClass = (
    isActive: boolean
  ) => `
    flex
    h-[40px]
    w-[180px]
    min-w-[180px]
    shrink-0
    items-center
    justify-center
    gap-[7px]
    rounded-[6px]
    border
    bg-white
    px-[10px]
    text-base
    font-medium
    leading-none
    whitespace-nowrap
    transition-none
    ${
      isActive
        ? "border-[#009447] text-[#009447]"
        : "border-[#009447] text-[#333333]"
    }
  `;
 
  return (
    <div
      className={`
        mx-[8px]
        mt-[8px]
        h-[58px]
        w-[calc(100%-16px)]
        overflow-hidden
        rounded-[8px]
        border
        border-[#009447]
        bg-[#F7FFFB]
        ${className}
      `}
    >
      {/* =====================================================
          NAVBAR CONTENT
      ====================================================== */}
 
      <div
        className="
          flex
          h-full
          w-full
          items-center
          overflow-x-auto
          overflow-y-hidden
          px-[8px]
          scrollbar-none
        "
      >
        <div
          className="
            flex
            min-w-full
            items-center
            justify-between
            gap-[8px]
          "
        >
          {/* =================================================
              RAISE TICKET
          ================================================== */}
 
          {tabs[0] && (
            <NavLink
              to={getRoute(tabs[0])}
              className={({ isActive }) =>
                getButtonClass(isActive)
              }
            >
              {getIcon(tabs[0].menuName)}
 
              <span className="whitespace-nowrap">
                {tabs[0].menuName}
              </span>
            </NavLink>
          )}
 
          {/* =================================================
              TICKET STATUS
          ================================================== */}
 
          {tabs[1] && (
            <NavLink
              to={getRoute(tabs[1])}
              className={({ isActive }) =>
                getButtonClass(isActive)
              }
            >
              {getIcon(tabs[1].menuName)}
 
              <span className="whitespace-nowrap">
                {tabs[1].menuName}
              </span>
            </NavLink>
          )}
 
          {/* =================================================
              KNOWLEDGE BASE
          ================================================== */}
 
          {tabs[2] && (
            <NavLink
              to={getRoute(tabs[2])}
              className={({ isActive }) =>
                getButtonClass(isActive)
              }
            >
              {/* Knowledge Base icon */}
              <BookOpen
                className="shrink-0"
                size={18}
                strokeWidth={1.8}
              />
 
              <span className="whitespace-nowrap">
                {tabs[2].menuName}
              </span>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
 
