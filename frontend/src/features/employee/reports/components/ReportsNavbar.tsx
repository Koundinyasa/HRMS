// import { NavLink, useParams } from "react-router-dom";

// import { useDashboard } from "../../dashboard/hooks/useDashboard";

// import type { MenuItem } from "../../dashboard/types/dashboard.types";

// import {
//   ReceiptText,
//   FileText,
//   ClipboardList,
//   BarChart3,
//   type LucideIcon,
// } from "lucide-react";

// import "@fontsource-variable/urbanist";

// const REPORT_COLOR = "#61D5CE";

// const TAB_ICONS: Record<string, LucideIcon> = {
//   Payslip: ReceiptText,
//   "Payslip Report": ReceiptText,
//   "Form 16": FileText,
//   Form16: FileText,
//   Summary: ClipboardList,
//   STI: BarChart3,
//   "STI Report": BarChart3,
//   "STI Reports": BarChart3,
// };

// export default function ReportsNavbar() {
//   const { domain } = useParams();

//   const { menuData } = useDashboard();

//   /*
//    * Get Reports menu from backend menu data
//    */
//   const reportsMenu = menuData?.data?.[0]?.children?.find(
//     (item: MenuItem) => item.menuName === "Reports",
//   );

//   /*
//    * Get Reports child menus
//    */
//   const backendTabs = reportsMenu?.children ?? [];

//   /*
//    * Fixed order required for Reports navbar.
//    *
//    * Payslip | Form 16 | Summary | STI
//    */
//   const reportOrder = [
//     "Payslip",
//     "Form 16",
//     "Summary",
//     "STI",
//   ];

//   /*
//    * Match backend menu items with the required order.
//    */
//   const tabs = reportOrder.map((name) => {
//     const backendTab = backendTabs.find(
//       (item: MenuItem) =>
//         item.menuName === name ||
//         (name === "Payslip" &&
//           item.menuName === "Payslip Report") ||
//         (name === "Form 16" &&
//           item.menuName === "Form16") ||
//         (name === "STI" &&
//           (item.menuName === "STI Report" ||
//             item.menuName === "STI Reports")),
//     );

//     return {
//       menuItem: backendTab,
//       displayName: name,
//     };
//   });

//   /*
//    * Convert each report into the frontend route.
//    */
//   const getReportRoute = (
//     displayName: string,
//     tab?: MenuItem,
//   ) => {
//     /*
//      * If backend route exists, use it first.
//      */
//     if (tab?.routeUrl) {
//       const backendRoute = tab.routeUrl
//         .replace(
//           "/Employee",
//           `/${domain}/employee`,
//         )
//         .replace(
//           /^\/employee/i,
//           `/${domain}/employee`,
//         );

//       /*
//        * Normalize report routes so they match
//        * EmployeeRoutes.tsx.
//        */
//       if (/reports\/payslip/i.test(backendRoute)) {
//         return `/${domain}/employee/reports/payslip`;
//       }

//       if (/reports\/form[-_ ]?16/i.test(backendRoute)) {
//         return `/${domain}/employee/reports/form-16`;
//       }

//       if (/reports\/summary/i.test(backendRoute)) {
//         return `/${domain}/employee/reports/summary`;
//       }

//       if (/reports\/sti/i.test(backendRoute)) {
//         return `/${domain}/employee/reports/sti`;
//       }
//     }

//     /*
//      * Fallback routes.
//      */
//     switch (displayName) {
//       case "Payslip":
//         return `/${domain}/employee/reports/payslip`;

//       case "Form 16":
//         return `/${domain}/employee/reports/form-16`;

//       case "Summary":
//         return `/${domain}/employee/reports/summary`;

//       case "STI":
//         return `/${domain}/employee/reports/sti`;

//       default:
//         return `/${domain}/employee/reports`;
//     }
//   };

//   return (
//     <nav
//       aria-label="Reports navigation"
//       className="
//         w-full
//         min-w-0
//         max-w-full
//         overflow-hidden
//         rounded-lg
//         border
//         border-[#61D5CE]
//         bg-[#61D5CE]/10
//         p-2.5
//       "
//       style={{
//         fontFamily:
//           "Urbanist Variable, Urbanist, sans-serif",
//       }}
//     >
//       <div
//         className="
//           flex
//           w-full
//           min-w-0
//           max-w-full
//           items-center
//           justify-between
//           gap-3
//           overflow-x-auto
//         "
//       >
//         {tabs.map(
//           ({
//             menuItem,
//             displayName,
//           }) => {
//             const route = getReportRoute(
//               displayName,
//               menuItem,
//             );

//             const Icon =
//               TAB_ICONS[displayName] ?? FileText;

//             return (
//               <NavLink
//                 key={
//                   menuItem?.menuId ??
//                   displayName
//                 }
//                 to={route}
//                 className={({ isActive }) =>
//                   [
//                     "inline-flex items-center justify-center gap-2 shrink-0",
//                     "h-11 rounded-lg border px-5",
//                     "text-sm font-medium whitespace-nowrap",
//                     "transition-colors",

//                     isActive
//                       ? "border-[#61D5CE] bg-white text-[#61D5CE]"
//                       : "border-slate-200 bg-white text-slate-500 hover:bg-[#61D5CE]/10 hover:text-[#61D5CE]",
//                   ].join(" ")
//                 }
//               >
//                 <Icon className="h-4 w-4 shrink-0" />

//                 <span
//                   className="
//                     block
//                     min-w-0
//                     max-w-full
//                     px-0.5
//                     text-center
//                     whitespace-normal
//                     break-words
//                   "
//                   title={displayName}
//                 >
//                   {displayName}
//                 </span>
//               </NavLink>
//             );
//           },
//         )}
//       </div>
//     </nav>
//   );
// }

import { NavLink, useLocation, useParams } from "react-router-dom";

import { useDashboard } from "../../dashboard/hooks/useDashboard";

import type { MenuItem } from "../../dashboard/types/dashboard.types";

import {
  ReceiptText,
  FileText,
  ClipboardList,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

const TAB_ICONS: Record<string, LucideIcon> = {
  Payslip: ReceiptText,
  "Payslip Report": ReceiptText,

  "Form 16": FileText,
  Form16: FileText,

  Summary: ClipboardList,

  STI: BarChart3,
  "STI Report": BarChart3,
  "STI Reports": BarChart3,
};

export default function ReportsNavbar() {
  const { domain } = useParams();
  const location = useLocation();

  const { menuData } = useDashboard();
  const isReportsLanding = location.pathname.endsWith("/employee/reports");

  const reportsMenu = menuData?.data?.[0]?.children?.find(
    (item: MenuItem) => item.menuName === "Reports",
  );

  const backendTabs = reportsMenu?.children ?? [];

  const reportOrder = [
    "Payslip",
    "Form 16",
    "Summary",
    "STI",
  ];

  const tabs = reportOrder.map((name) => {
    const backendTab = backendTabs.find(
      (item: MenuItem) =>
        item.menuName === name ||
        (name === "Payslip" &&
          item.menuName === "Payslip Report") ||
        (name === "Form 16" &&
          item.menuName === "Form16") ||
        (name === "STI" &&
          (item.menuName === "STI Report" ||
            item.menuName === "STI Reports")),
    );

    return {
      menuItem: backendTab,
      displayName: name,
    };
  });

  const getReportRoute = (
    displayName: string,
    tab?: MenuItem,
  ) => {
    if (tab?.routeUrl) {
      const backendRoute = tab.routeUrl
        .replace(
          "/Employee",
          `/${domain}/employee`,
        )
        .replace(
          /^\/employee/i,
          `/${domain}/employee`,
        );

      if (/reports\/payslip/i.test(backendRoute)) {
        return `/${domain}/employee/reports/payslip`;
      }

      if (/reports\/form[-_ ]?16/i.test(backendRoute)) {
        return `/${domain}/employee/reports/form-16`;
      }

      if (/reports\/summary/i.test(backendRoute)) {
        return `/${domain}/employee/reports/summary`;
      }

      if (/reports\/sti/i.test(backendRoute)) {
        return `/${domain}/employee/reports/sti`;
      }
    }

    switch (displayName) {
      case "Payslip":
        return `/${domain}/employee/reports/payslip`;

      case "Form 16":
        return `/${domain}/employee/reports/form-16`;

      case "Summary":
        return `/${domain}/employee/reports/summary`;

      case "STI":
        return `/${domain}/employee/reports/sti`;

      default:
        return `/${domain}/employee/reports`;
    }
  };

  return (
    <nav
      aria-label="Reports navigation"
      className="
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-lg
        border
        border-[#61D5CE]
        bg-[#61D5CE]/10
        p-2.5
      "
      style={{
        fontFamily:
          "Urbanist Variable, Urbanist, sans-serif",
      }}
    >
      <div
        className="
          flex
          w-full
          min-w-0
          max-w-full
          items-center
          justify-between
          gap-3
          overflow-x-auto
        "
      >
        {tabs.map(
          ({
            menuItem,
            displayName,
          }) => {
            const route = getReportRoute(
              displayName,
              menuItem,
            );

            const Icon =
              TAB_ICONS[displayName] ?? FileText;

            return (
              <NavLink
                key={
                  menuItem?.menuId ??
                  displayName
                }
                to={route}
                className={({ isActive }) => {
                  const active =
                    isActive ||
                    (isReportsLanding && displayName === "Summary");

                  return [
                    "inline-flex items-center justify-center gap-2 shrink-0",
                    "h-11 rounded-lg border px-5",
                    "text-sm font-medium whitespace-nowrap",
                    "transition-colors",
                    active
                      ? "border-[#61D5CE] bg-white text-[#61D5CE]"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-[#61D5CE]/10 hover:text-[#61D5CE]",
                  ].join(" ");
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />

                <span
                  className="
                    block
                    min-w-0
                    max-w-full
                    px-0.5
                    text-center
                    whitespace-normal
                    break-words
                  "
                  title={displayName}
                >
                  {displayName}
                </span>
              </NavLink>
            );
          },
        )}
      </div>
    </nav>
  );
}