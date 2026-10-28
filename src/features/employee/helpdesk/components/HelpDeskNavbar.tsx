// import { NavLink, useParams } from "react-router-dom";
// import {
//   FileText,
//   ClipboardCheck,
//   BookOpen,
// } from "lucide-react";
 
// import { useDashboard } from "../../dashboard/hooks/useDashboard";
// import type { MenuItem } from "../../dashboard/types/dashboard.types";
 
// import type { HelpDeskNavbarProps } from "../types/helpDesk.types";
 
// export default function HelpDeskNavbar({
//   className = "",
// }: HelpDeskNavbarProps) {
//   const { domain } = useParams();
 
//   const { menuData } = useDashboard();
 
//   /* =====================================================
//      GET HELP DESK MENU
//   ====================================================== */
 
//   const helpDeskMenu = menuData?.data?.[0]?.children?.find(
//     (item: MenuItem) =>
//       item.menuName?.trim().toLowerCase() === "help desk"
//   );
 
//   const tabs = helpDeskMenu?.children ?? [];
 
//   /* =====================================================
//      GET ROUTE
//   ====================================================== */
 
//   const getRoute = (tab: MenuItem) => {
//     return (
//       tab.routeUrl?.replace(
//         "/Employee",
//         `/${domain}/employee`
//       ) ?? ""
//     );
//   };
 
//   /* =====================================================
//      GET ICON
//   ====================================================== */
 
//   const getIcon = (menuName: string) => {
//     const name = menuName.trim().toLowerCase();
 
//     if (name === "raise ticket") {
//       return (
//         <FileText
//           className="shrink-0"
//           size={18}
//           strokeWidth={1.8}
//         />
//       );
//     }
 
//     if (name === "ticket status") {
//       return (
//         <ClipboardCheck
//           className="shrink-0"
//           size={18}
//           strokeWidth={1.8}
//         />
//       );
//     }
 
//     if (name === "knowledge base") {
//       return (
//         <BookOpen
//           className="shrink-0"
//           size={18}
//           strokeWidth={1.8}
//         />
//       );
//     }
 
//     return null;
//   };
 
//   /* =====================================================
//      COMMON BUTTON STYLE
//   ====================================================== */
 
//   const getButtonClass = (
//     isActive: boolean
//   ) => `
//     flex
//     h-[40px]
//     w-[180px]
//     min-w-[180px]
//     shrink-0
//     items-center
//     justify-center
//     gap-[7px]
//     rounded-[6px]
//     border
//     bg-white
//     px-[10px]
//     text-base
//     font-medium
//     leading-none
//     whitespace-nowrap
//     transition-none
//     ${
//       isActive
//         ? "border-[#009447] text-[#009447]"
//         : "border-[#009447] text-[#333333]"
//     }
//   `;
 
//   return (
//     <div
//       className={`
//         mx-[8px]
//         mt-[8px]
//         h-[58px]
//         w-[calc(100%-16px)]
//         overflow-hidden
//         rounded-[8px]
//         border
//         border-[#009447]
//         bg-[#F7FFFB]
//         ${className}
//       `}
//     >
//       {/* =====================================================
//           NAVBAR CONTENT
//       ====================================================== */}
 
//       <div
//         className="
//           flex
//           h-full
//           w-full
//           items-center
//           overflow-x-auto
//           overflow-y-hidden
//           px-[8px]
//           scrollbar-none
//         "
//       >
//         <div
//           className="
//             flex
//             min-w-full
//             items-center
//             justify-between
//             gap-[8px]
//           "
//         >
//           {/* =================================================
//               RAISE TICKET
//           ================================================== */}
 
//           {tabs[0] && (
//             <NavLink
//               to={getRoute(tabs[0])}
//               className={({ isActive }) =>
//                 getButtonClass(isActive)
//               }
//             >
//               {getIcon(tabs[0].menuName)}
 
//               <span className="whitespace-nowrap">
//                 {tabs[0].menuName}
//               </span>
//             </NavLink>
//           )}
 
//           {/* =================================================
//               TICKET STATUS
//           ================================================== */}
 
//           {tabs[1] && (
//             <NavLink
//               to={getRoute(tabs[1])}
//               className={({ isActive }) =>
//                 getButtonClass(isActive)
//               }
//             >
//               {getIcon(tabs[1].menuName)}
 
//               <span className="whitespace-nowrap">
//                 {tabs[1].menuName}
//               </span>
//             </NavLink>
//           )}
 
//           {/* =================================================
//               KNOWLEDGE BASE
//           ================================================== */}
 
//           {tabs[2] && (
//             <NavLink
//               to={getRoute(tabs[2])}
//               className={({ isActive }) =>
//                 getButtonClass(isActive)
//               }
//             >
//               {/* Knowledge Base icon */}
//               <BookOpen
//                 className="shrink-0"
//                 size={18}
//                 strokeWidth={1.8}
//               />
 
//               <span className="whitespace-nowrap">
//                 {tabs[2].menuName}
//               </span>
//             </NavLink>
//           )}
//         </div>
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
    border-black
    bg-white
    px-[10px]
    text-base
    font-medium
    leading-none
    whitespace-nowrap
    font-[Urbanist]
    transition-none
    ${
      isActive
        ? "border-black text-[#009447]"
        : "border-black text-[#333333]"
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
        font-[Urbanist]
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
 

