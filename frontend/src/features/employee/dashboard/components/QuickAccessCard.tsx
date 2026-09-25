

 
// import { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
 
// import {
//   CheckCheck,
//   MessageSquareMore,
//   ReceiptText,
//   BarChart3,
//   CalendarDays,
//   ChevronDown,
//   ChevronRight,
//   Calendar,
//   LifeBuoy,
//   LogOut,
//   Package, // ADDED: Icon for Asset Requests
// } from "lucide-react";
 
// import { useDashboard } from "../hooks/useDashboard";
 
// type RequestTypeConfig = {
//   icon: typeof CheckCheck;
//   bg: string;
//   color: string;
//   path: (domain?: string) => string;
// };
 
// const REQUEST_TYPE_CONFIG: Record<string, RequestTypeConfig> = {
//   "Leave Requests": {
//     icon: Calendar,
//     bg: "#f3f0ff",
//     color: "#8b5cf6",
//     path: (domain) => `/${domain}/employee/review/requisition`,
//   },
 
//   // ADDED: Asset Requests configuration
//   "Asset Requests": {
//     icon: Package,
//     bg: "#eff6ff",
//     color: "#3b82f6",
//     path: (domain) => `/${domain}/employee/assets/return`,
//   },
 
//   "Helpdesk Tickets": {
//     icon: LifeBuoy,
//     bg: "#ecfdf5",
//     color: "#10b981",
//     path: (domain) => `/${domain}/employee/helpdesk/status`,
//   },
 
//   "Separation Requests": {
//     icon: LogOut,
//     bg: "#fff7ed",
//     color: "#f59e0b",
//     path: (domain) => `/${domain}/employee/separation/status`,
//   },
// };
 
// const DEFAULT_CONFIG: RequestTypeConfig = {
//   icon: ReceiptText,
//   bg: "#f1f5f9",
//   color: "#64748b",
//   path: (domain) => `/${domain}/employee`,
// };
 
// type SubItem = {
//   label: string;
//   count: number;
//   description: string;
//   icon: typeof CheckCheck;
//   path: string;
//   bg: string;
//   color: string;
// };
 
// type QuickLink = {
//   title: string;
//   subtitle: string;
//   icon: typeof CheckCheck;
//   count: number;
//   subItems: SubItem[];
// };
 
// function buildSubItems(
//   details:
//     | {
//         RequestType: string;
//         RequestCount: number;
//       }[]
//     | undefined,
//   domain?: string
// ): SubItem[] {
//   if (!details) {
//     return [];
//   }
 
//   return details
//     .filter((item) => item.RequestCount > 0)
//     .map((item) => {
//       const config =
//         REQUEST_TYPE_CONFIG[item.RequestType] ?? DEFAULT_CONFIG;
 
//       const Icon = config.icon;
 
//       let description = "Awaiting approval workflow";
 
//       if (item.RequestType === "Leave Requests") {
//         description = `${item.RequestCount} application${
//           item.RequestCount === 1 ? "" : "s"
//         } awaiting approval`;
//       } else if (item.RequestType === "Helpdesk Tickets") {
//         description = `${item.RequestCount} ticket${
//           item.RequestCount === 1 ? "" : "s"
//         } awaiting response`;
//       }
 
//       return {
//         label: item.RequestType,
//         count: item.RequestCount,
//         description,
//         icon: Icon,
//         path: config.path(domain),
//         bg: config.bg,
//         color: config.color,
//       };
//     });
// }
 
// export default function QuickAccessCard() {
//   const navigate = useNavigate();
//   const { domain } = useParams();
 
//   const cardRef = useRef<HTMLDivElement>(null);
 
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
 
//   // API data comes through the dashboard hook.
//   const { approvalSummary } = useDashboard();
 
//   const pendingApprovals =
//     approvalSummary?.PendingApprovals ?? 0;
 
//   const myRequests =
//     approvalSummary?.MyRequests ?? 0;
 
//   const approvalSubItems = buildSubItems(
//     approvalSummary?.MyApprovalsDetails,
//     domain
//   );
 
//   const requestSubItems = buildSubItems(
//     approvalSummary?.MyRequestsDetails,
//     domain
//   );
 
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         cardRef.current &&
//         !cardRef.current.contains(event.target as Node)
//       ) {
//         setOpenDropdown(null);
//       }
//     };
 
//     document.addEventListener(
//       "mousedown",
//       handleClickOutside
//     );
 
//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );
//     };
//   }, []);
 
//   const handleItemClick = (item: QuickLink) => {
//     if (item.count === 0) {
//       return;
//     }
 
//     if (
//       item.count === 1 &&
//       item.subItems.length === 1
//     ) {
//       navigate(item.subItems[0].path);
//       return;
//     }
 
//     setOpenDropdown((previous) =>
//       previous === item.title
//         ? null
//         : item.title
//     );
//   };
 
//   const staticLinks: {
//     title: string;
//     subtitle: string;
//     icon: typeof CheckCheck;
//     path?: string;
//   }[] = [
//     {
//       title: "Payslip Report",
//       subtitle: "View Payslip",
//       icon: ReceiptText,
//     },
//     {
//       title: "STI Reports",
//       subtitle: "Performance & Statistics",
//       icon: BarChart3,
//     },
//     {
//       title: "Holiday List",
//       subtitle: "View List",
//       icon: CalendarDays,
 
//       // Backend menu route is /Employee/leave/holidaylist
//       // Therefore frontend route is /employee/leave/holidaylist
//       path: `/${domain}/employee/leave/holidaylist`,
//     },
//   ];
 
//   const quickLinks: QuickLink[] = [
//     {
//       title: "My Approvals",
//       subtitle: `${pendingApprovals} pending`,
//       icon: CheckCheck,
//       count: pendingApprovals,
//       subItems: approvalSubItems,
//     },
//     {
//       title: "My Requests",
//       subtitle: `${myRequests} pending`,
//       icon: MessageSquareMore,
//       count: myRequests,
//       subItems: requestSubItems,
//     },
//   ];
 
//   return (
//     <div
//       ref={cardRef}
//       className="rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm border h-auto relative"
//       style={{
//         backgroundColor: "var(--card-bg)",
//         borderColor: "var(--primary-border)",
//       }}
//     >
//       <h3
//         className="text-base sm:text-lg font-medium"
//         style={{
//           color: "var(--primary-color)",
//         }}
//       >
//         Quick Access
//       </h3>
 
//       <div
//         className="h-[2px] mt-3 mb-4 sm:mb-5"
//         style={{
//           backgroundColor: "var(--primary-border)",
//         }}
//       />
 
//       <div className="space-y-3 sm:space-y-4">
//         {quickLinks.map((item, index) => {
//           const Icon = item.icon;
 
//           const isClickable =
//             item.count > 0;
 
//           const hasDropdown =
//             item.count > 1;
 
//           const isOpen =
//             openDropdown === item.title;
 
//           return (
//             <div
//               key={index}
//               className="relative"
//             >
//               <div
//                 onClick={() =>
//                   handleItemClick(item)
//                 }
//                 className="rounded-xl p-3 flex items-center gap-3 sm:gap-4 hover:shadow-sm transition"
//                 style={{
//                   background:
//                     "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
//                   cursor: isClickable
//                     ? "pointer"
//                     : "default",
//                   opacity: isClickable
//                     ? 1
//                     : 0.85,
//                 }}
//               >
//                 <div
//                   className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
//                   style={{
//                     backgroundColor:
//                       "var(--primary-light)",
//                   }}
//                 >
//                   <Icon
//                     size={20}
//                     className="sm:w-[22px] sm:h-[22px]"
//                     color="var(--primary-color)"
//                   />
//                 </div>
 
//                 <div className="flex-1">
//                   <h4 className="text-sm sm:text-base font-medium text-slate-800">
//                     {item.title}
//                   </h4>
 
//                   <p className="text-xs sm:text-sm text-slate-500">
//                     {item.subtitle}
//                   </p>
//                 </div>
 
//                 {hasDropdown && (
//                   <ChevronDown
//                     size={18}
//                     color="var(--primary-color)"
//                     style={{
//                       transform: isOpen
//                         ? "rotate(180deg)"
//                         : "rotate(0deg)",
//                       transition:
//                         "transform 0.15s ease",
//                     }}
//                   />
//                 )}
//               </div>
 
//               {hasDropdown && isOpen && (
//                 <div
//                   className="mt-2 rounded-xl border overflow-hidden"
//                   style={{
//                     backgroundColor:
//                       "var(--card-bg)",
//                     borderColor:
//                       "var(--primary-border)",
//                   }}
//                 >
//                   <div className="px-4 py-2.5 flex items-center justify-between">
//                     <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
//                       Pending{" "}
//                       {item.title ===
//                       "My Approvals"
//                         ? "Approvals"
//                         : "Requests"}
//                     </span>
 
//                     <span
//                       className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center text-white"
//                       style={{
//                         backgroundColor:
//                           "#3b82f6",
//                       }}
//                     >
//                       {item.count}
//                     </span>
//                   </div>
 
//                   <div>
//                     {item.subItems.map(
//                       (sub) => {
//                         const SubIcon =
//                           sub.icon;
 
//                         return (
//                           <div
//                             key={sub.label}
//                             onClick={(event) => {
//                               event.stopPropagation();
 
//                               setOpenDropdown(
//                                 null
//                               );
 
//                               navigate(
//                                 sub.path
//                               );
//                             }}
//                             className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition"
//                           >
//                             <div
//                               className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
//                               style={{
//                                 backgroundColor:
//                                   sub.bg,
//                               }}
//                             >
//                               <SubIcon
//                                 size={18}
//                                 color={
//                                   sub.color
//                                 }
//                               />
//                             </div>
 
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-medium text-slate-800">
//                                 {sub.label}
//                               </p>
 
//                               <p className="text-xs text-slate-500 truncate">
//                                 {sub.description}
//                               </p>
//                             </div>
 
//                             <span
//                               className="text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center shrink-0"
//                               style={{
//                                 backgroundColor:
//                                   sub.bg,
//                                 color:
//                                   sub.color,
//                               }}
//                             >
//                               {sub.count}
//                             </span>
 
//                             <ChevronRight
//                               size={16}
//                               className="text-slate-300 shrink-0"
//                             />
//                           </div>
//                         );
//                       }
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
 
//         {staticLinks.map(
//           (item, index) => {
//             const Icon = item.icon;
 
//             const isClickable =
//               Boolean(item.path);
 
//             return (
//               <div
//                 key={`static-${index}`}
//                 onClick={() => {
//                   if (item.path) {
//                     navigate(item.path);
//                   }
//                 }}
//                 className="rounded-xl p-3 flex items-center gap-3 sm:gap-4 hover:shadow-sm transition"
//                 style={{
//                   background:
//                     "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
//                   cursor: isClickable
//                     ? "pointer"
//                     : "default",
//                 }}
//               >
//                 <div
//                   className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
//                   style={{
//                     backgroundColor:
//                       "var(--primary-light)",
//                   }}
//                 >
//                   <Icon
//                     size={20}
//                     className="sm:w-[22px] sm:h-[22px]"
//                     color="var(--primary-color)"
//                   />
//                 </div>
 
//                 <div className="flex-1">
//                   <h4 className="text-sm sm:text-base font-medium text-slate-800">
//                     {item.title}
//                   </h4>
 
//                   <p className="text-xs sm:text-sm text-slate-500">
//                     {item.subtitle}
//                   </p>
//                 </div>
//               </div>
//             );
//           }
//         )}
//       </div>
//     </div>
//   );
// }
 


 
 
 
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
 
import {
  CheckCheck,
  MessageSquareMore,
  ReceiptText,
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Calendar,
  LifeBuoy,
  LogOut,
  Package, // ADDED: Icon for Asset Requests
} from "lucide-react";
 
import { useDashboard } from "../hooks/useDashboard";
 
type RequestTypeConfig = {
  icon: typeof CheckCheck;
  bg: string;
  color: string;
  path: (domain?: string) => string;
};
 
const REQUEST_TYPE_CONFIG: Record<string, RequestTypeConfig> = {
  "Leave Requests": {
    icon: Calendar,
    bg: "#f3f0ff",
    color: "#8b5cf6",
    path: (domain) => `/${domain}/employee/review/requisition/appliedleave`,
  },
 
  // ADDED: Asset Requests configuration
  "Asset Requests": {
    icon: Package,
    bg: "#eff6ff",
    color: "#3b82f6",
    path: (domain) => `/${domain}/employee/assets/return`,
  },
 
  "Helpdesk Tickets": {
    icon: LifeBuoy,
    bg: "#ecfdf5",
    color: "#10b981",
    path: (domain) => `/${domain}/employee/helpdesk/status`,
  },
 
  "Separation Requests": {
    icon: LogOut,
    bg: "#fff7ed",
    color: "#f59e0b",
    path: (domain) => `/${domain}/employee/separation/status`,
  },
};
 
const DEFAULT_CONFIG: RequestTypeConfig = {
  icon: ReceiptText,
  bg: "#f1f5f9",
  color: "#64748b",
  path: (domain) => `/${domain}/employee`,
};
 
type SubItem = {
  label: string;
  count: number;
  description: string;
  icon: typeof CheckCheck;
  path: string;
  bg: string;
  color: string;
};
 
type QuickLink = {
  title: string;
  subtitle: string;
  icon: typeof CheckCheck;
  count: number;
  subItems: SubItem[];
};
 
function buildSubItems(
  details:
    | {
        RequestType: string;
        RequestCount: number;
      }[]
    | undefined,
  domain?: string
): SubItem[] {
  if (!details) {
    return [];
  }
 
  return details
    .filter((item) => item.RequestCount > 0)
    .map((item) => {
      const config =
        REQUEST_TYPE_CONFIG[item.RequestType] ?? DEFAULT_CONFIG;
 
      const Icon = config.icon;
 
      let description = "Awaiting approval workflow";
 
      if (item.RequestType === "Leave Requests") {
        description = `${item.RequestCount} application${
          item.RequestCount === 1 ? "" : "s"
        } awaiting approval`;
      } else if (item.RequestType === "Helpdesk Tickets") {
        description = `${item.RequestCount} ticket${
          item.RequestCount === 1 ? "" : "s"
        } awaiting response`;
      }
 
      return {
        label: item.RequestType,
        count: item.RequestCount,
        description,
        icon: Icon,
        path: config.path(domain),
        bg: config.bg,
        color: config.color,
      };
    });
}
 
export default function QuickAccessCard() {
  const navigate = useNavigate();
  const { domain } = useParams();
 
  const cardRef = useRef<HTMLDivElement>(null);
 
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
 
  // API data comes through the dashboard hook.
  const { approvalSummary } = useDashboard();
 
  const pendingApprovals =
    approvalSummary?.PendingApprovals ?? 0;
 
  const myRequests =
    approvalSummary?.MyRequests ?? 0;
 
  const approvalSubItems = buildSubItems(
    approvalSummary?.MyApprovalsDetails,
    domain
  );
 
  const requestSubItems = buildSubItems(
    approvalSummary?.MyRequestsDetails,
    domain
  );
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
 
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
 
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);
 
  const handleItemClick = (item: QuickLink) => {
    if (item.count === 0) {
      return;
    }
 
    if (
      item.count === 1 &&
      item.subItems.length === 1
    ) {
      navigate(item.subItems[0].path);
      return;
    }
 
    setOpenDropdown((previous) =>
      previous === item.title
        ? null
        : item.title
    );
  };
 
  const staticLinks: {
    title: string;
    subtitle: string;
    icon: typeof CheckCheck;
    path?: string;
  }[] = [
    {
      title: "Payslip Report",
      subtitle: "View Payslip",
      icon: ReceiptText,
    },
    {
      title: "STI Reports",
      subtitle: "Performance & Statistics",
      icon: BarChart3,
    },
    {
      title: "Holiday List",
      subtitle: "View List",
      icon: CalendarDays,
 
      // Backend menu route is /Employee/leave/holidaylist
      // Therefore frontend route is /employee/leave/holidaylist
      path: `/${domain}/employee/leave/holidaylist`,
    },
  ];
 
  const quickLinks: QuickLink[] = [
    {
      title: "My Approvals",
      subtitle: `${pendingApprovals} pending`,
      icon: CheckCheck,
      count: pendingApprovals,
      subItems: approvalSubItems,
    },
    {
      title: "My Requests",
      subtitle: `${myRequests} pending`,
      icon: MessageSquareMore,
      count: myRequests,
      subItems: requestSubItems,
    },
  ];
 
  return (
    <div
      ref={cardRef}
      className="rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm border h-auto relative"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--primary-border)",
      }}
    >
      <h3
        className="text-base sm:text-lg font-medium"
        style={{
          color: "var(--primary-color)",
        }}
      >
        Quick Access
      </h3>
 
      <div
        className="h-[2px] mt-3 mb-4 sm:mb-5"
        style={{
          backgroundColor: "var(--primary-border)",
        }}
      />
 
      <div className="space-y-3 sm:space-y-4">
        {quickLinks.map((item, index) => {
          const Icon = item.icon;
 
          const isClickable =
            item.count > 0;
 
          const hasDropdown =
            item.count > 1;
 
          const isOpen =
            openDropdown === item.title;
 
          return (
            <div
              key={index}
              className="relative"
            >
              <div
                onClick={() =>
                  handleItemClick(item)
                }
                className="rounded-xl p-3 flex items-center gap-3 sm:gap-4 hover:shadow-sm transition"
                style={{
                  background:
                    "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
                  cursor: isClickable
                    ? "pointer"
                    : "default",
                  opacity: isClickable
                    ? 1
                    : 0.85,
                }}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor:
                      "var(--primary-light)",
                  }}
                >
                  <Icon
                    size={20}
                    className="sm:w-[22px] sm:h-[22px]"
                    color="var(--primary-color)"
                  />
                </div>
 
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-medium text-slate-800">
                    {item.title}
                  </h4>
 
                  <p className="text-xs sm:text-sm text-slate-500">
                    {item.subtitle}
                  </p>
                </div>
 
                {hasDropdown && (
                  <ChevronDown
                    size={18}
                    color="var(--primary-color)"
                    style={{
                      transform: isOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition:
                        "transform 0.15s ease",
                    }}
                  />
                )}
              </div>
 
              {hasDropdown && isOpen && (
                <div
                  className="mt-2 rounded-xl border overflow-hidden"
                  style={{
                    backgroundColor:
                      "var(--card-bg)",
                    borderColor:
                      "var(--primary-border)",
                  }}
                >
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Pending{" "}
                      {item.title ===
                      "My Approvals"
                        ? "Approvals"
                        : "Requests"}
                    </span>
 
                    <span
                      className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center text-white"
                      style={{
                        backgroundColor:
                          "#3b82f6",
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
 
                  <div>
                    {item.subItems.map(
                      (sub) => {
                        const SubIcon =
                          sub.icon;
 
                        return (
                          <div
                            key={sub.label}
                            onClick={(event) => {
                              event.stopPropagation();
 
                              setOpenDropdown(
                                null
                              );
 
                              navigate(
                                sub.path
                              );
                            }}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition"
                          >
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor:
                                  sub.bg,
                              }}
                            >
                              <SubIcon
                                size={18}
                                color={
                                  sub.color
                                }
                              />
                            </div>
 
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800">
                                {sub.label}
                              </p>
 
                              <p className="text-xs text-slate-500 truncate">
                                {sub.description}
                              </p>
                            </div>
 
                            <span
                              className="text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor:
                                  sub.bg,
                                color:
                                  sub.color,
                              }}
                            >
                              {sub.count}
                            </span>
 
                            <ChevronRight
                              size={16}
                              className="text-slate-300 shrink-0"
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
 
        {staticLinks.map(
          (item, index) => {
            const Icon = item.icon;
 
            const isClickable =
              Boolean(item.path);
 
            return (
              <div
                key={`static-${index}`}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
                className="rounded-xl p-3 flex items-center gap-3 sm:gap-4 hover:shadow-sm transition"
                style={{
                  background:
                    "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
                  cursor: isClickable
                    ? "pointer"
                    : "default",
                }}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor:
                      "var(--primary-light)",
                  }}
                >
                  <Icon
                    size={20}
                    className="sm:w-[22px] sm:h-[22px]"
                    color="var(--primary-color)"
                  />
                </div>
 
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-medium text-slate-800">
                    {item.title}
                  </h4>
 
                  <p className="text-xs sm:text-sm text-slate-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
 
 
 