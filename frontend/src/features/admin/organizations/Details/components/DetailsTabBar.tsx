// import { NavLink, Outlet, useLocation } from "react-router-dom";
// import { MOCK_COMPANY } from "../constants/details.constants";

// const TABS = [
//   { label: "Dashboard", path: "dashboard" },
//   { label: "Compliance Overview", path: "compliance-overview" },
//   { label: "Consolidated Salary", path: "consolidated-salary" },
// ];

// export default function DetailsTabBar() {
//   const { pathname } = useLocation();
//   const isDashboard = pathname.includes("/details/dashboard");

//   return (
//     <div className="flex w-full min-w-0 flex-col gap-4">
//       <div
//         className="
//           flex flex-wrap items-center justify-between gap-3
//           rounded-2xl border border-slate-100 bg-white
//           px-4 py-2
//           shadow-[0_2px_8px_rgba(15,23,42,0.06)]
//         "
//       >
//         <div className="flex flex-wrap items-center gap-1">
//           {TABS.map((tab) => (
//             <NavLink
//               key={tab.path}
//               to={tab.path}
//               end={tab.path === "consolidated-salary"}
//               className={({ isActive }) =>
//                 `relative px-4 py-2.5 text-sm font-medium transition-colors ${
//                   isActive
//                     ? "text-[#2563EB] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-[#2563EB]"
//                     : "text-slate-500 hover:text-slate-700"
//                 }`
//               }
//             >
//               {tab.label}
//             </NavLink>
//           ))}
//         </div>

//         {/* Company List only on Dashboard */}
//         {isDashboard && (
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-slate-500">Company List</span>
//             <select
//               defaultValue="1"
//               className="h-9 min-w-[140px] rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-400"
//             >
//               <option value="1">{MOCK_COMPANY.name}</option>
//             </select>
//           </div>
//         )}
//       </div>

//       <Outlet />
//     </div>
//   );
// }












// import { NavLink, Outlet } from "react-router-dom";
// import { LayoutDashboard, CheckCircle2, IndianRupee, Search, History } from "lucide-react";

// const TABS = [
//   { label: "Dashboard", path: "dashboard", icon: LayoutDashboard },
//   { label: "Compliance Overview", path: "compliance-overview", icon: CheckCircle2 },
//   { label: "Consolidated Salary", path: "consolidated-salary", icon: IndianRupee },
// ];

// export default function DetailsTabBar() {
//   return (
//     <div className="flex w-full min-w-0 flex-col gap-4">
//       <div
//         className="
//           flex flex-wrap items-center justify-between gap-3
//           rounded-2xl border border-[#B8D9F2] bg-[#EAF5FE]
//           p-2
//         "
//       >
//         <div className="flex flex-wrap items-center gap-2">
//           {TABS.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <NavLink
//                 key={tab.path}
//                 to={tab.path}
//                 end={tab.path === "consolidated-salary"}
//                 className={({ isActive }) =>
//                   `
//                     inline-flex h-10 shrink-0 items-center gap-2 rounded-xl
//                     border bg-white px-4 text-sm font-medium
//                     transition-colors
//                     ${
//                       isActive
//                         ? "border-[#2563EB] text-[#2563EB]"
//                         : "border-slate-200 text-slate-600 hover:border-slate-300"
//                     }
//                   `
//                 }
//               >
//                 <Icon size={16} strokeWidth={2} />
//                 {tab.label}
//               </NavLink>
//             );
//           })}
//         </div>

//         <div className="flex items-center gap-2">
//           <div
//             className="
//               flex h-10 items-center gap-2 rounded-xl border border-slate-200
//               bg-white px-3 text-sm text-slate-400
//             "
//           >
//             <Search size={15} strokeWidth={2} />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-32 bg-transparent text-slate-700 outline-none placeholder:text-slate-400 sm:w-48"
//             />
//           </div>

//           <button
//             type="button"
//             title="Recent activity"
//             className="
//               flex h-10 w-10 shrink-0 items-center justify-center
//               rounded-xl border border-slate-200 bg-white
//               text-slate-500 hover:bg-slate-50
//             "
//           >
//             <History size={16} strokeWidth={2} />
//           </button>
//         </div>
//       </div>

//       <Outlet />
//     </div>
//   );
// }






// import { Search, History } from "lucide-react";
// import { NavLink, Outlet } from "react-router-dom";

// const TABS = [
//   {
//     label: "Dashboard",
//     path: "dashboard",
//   },
//   {
//     label: "Compliance Overview",
//     path: "compliance-overview",
//   },
//   {
//     label: "Consolidated Salary",
//     path: "consolidated-salary",
//   },
// ];

// export default function DetailsTabBar() {
//   return (
//     <div className="flex w-full min-w-0 flex-col gap-4">
//       {/* Top navigation */}
//       <div
//         className="
//           flex
//           w-full
//           min-w-0
//           items-center
//           justify-between
//           gap-3
//           rounded-[20px]
//           border
//           border-[#B9DDFB]
//           bg-[#EAF6FF]
//           px-[10px]
//           py-[9px]
//           shadow-none
//         "
//       >
//         {/* Tabs */}
//         <div
//           className="
//             flex
//             min-w-0
//             items-center
//             gap-[8px]
//             overflow-x-auto
//             scrollbar-none
//           "
//         >
//           {TABS.map((tab) => (
//             <NavLink
//               key={tab.path}
//               to={tab.path}
//               end
//               className={({ isActive }) =>
//                 `
//                 flex
//                 h-[46px]
//                 shrink-0
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-[16px]
//                 border
//                 px-[20px]
//                 text-[16px]
//                 font-medium
//                 leading-none
//                 transition-none
//                 ${
//                   isActive
//                     ? "border-[#2563EB] bg-white text-[#2563EB]"
//                     : "border-[#E0E8F0] bg-white text-[#334155]"
//                 }
//                 `
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   {tab.path === "dashboard" && (
//                     <span className="text-[17px] leading-none">
//                       ▦
//                     </span>
//                   )}

//                   {tab.path === "compliance-overview" && (
//                     <span
//                       className={`
//                         flex
//                         h-[17px]
//                         w-[17px]
//                         items-center
//                         justify-center
//                         rounded-full
//                         border-[1.5px]
//                         text-[10px]
//                         ${
//                           isActive
//                             ? "border-[#2563EB] text-[#2563EB]"
//                             : "border-[#475569] text-[#475569]"
//                         }
//                       `}
//                     >
//                       ✓
//                     </span>
//                   )}

//                   {tab.path === "consolidated-salary" && (
//                     <span className="text-[18px] leading-none">₹</span>
//                   )}

//                   <span>{tab.label}</span>
//                 </>
//               )}
//             </NavLink>
//           ))}
//         </div>

//         {/* Search + History */}
//         <div className="flex shrink-0 items-center gap-[10px]">
//           <div
//             className="
//               flex
//               h-[46px]
//               w-[272px]
//               items-center
//               gap-2
//               rounded-[16px]
//               border
//               border-[#DCE4EC]
//               bg-white
//               px-[16px]
//             "
//           >
//             <Search
//               size={19}
//               strokeWidth={1.7}
//               className="shrink-0 text-[#94A3B8]"
//             />

//             <input
//               type="text"
//               placeholder="Search..."
//               className="
//                 min-w-0
//                 flex-1
//                 bg-transparent
//                 text-[15px]
//                 text-[#334155]
//                 outline-none
//                 placeholder:text-[#94A3B8]
//               "
//             />
//           </div>

//           <button
//             type="button"
//             className="
//               flex
//               h-[46px]
//               w-[46px]
//               shrink-0
//               items-center
//               justify-center
//               rounded-[16px]
//               border
//               border-[#DCE4EC]
//               bg-white
//             "
//             aria-label="History"
//           >
//             <History
//               size={20}
//               strokeWidth={1.7}
//               className="text-[#64748B]"
//             />
//           </button>
//         </div>
//       </div>

//       <Outlet />
//     </div>
//   );
// }




import { Search, History } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const TABS = [
  {
    label: "Dashboard",
    path: "dashboard",
  },
  {
    label: "Compliance Overview",
    path: "compliance-overview",
  },
  {
    label: "Consolidated Salary",
    path: "consolidated-salary",
  },
];

export default function DetailsTabBar() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      {/* Top navigation */}
      <div
        className="
          flex
          w-full
          min-w-0
          items-center
          justify-between
          gap-3
          rounded-[20px]
          border-[2px]
          border-[#8CCBFF]
          bg-[#E4F3FF]
          px-[10px]
          py-[9px]
          shadow-none
        "
      >
        {/* Tabs */}
        <div
          className="
            flex
            min-w-0
            items-center
            gap-[8px]
            overflow-x-auto
            scrollbar-none
          "
        >
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end
              className={({ isActive }) =>
                `
                flex
                h-[46px]
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-[16px]
                border-[1.5px]
                px-[20px]
                text-[16px]
                font-medium
                leading-none
                transition-none
                ${
                  isActive
                    ? "border-[#2563EB] bg-white text-[#2563EB]"
                    : "border-[#CBDCEB] bg-white text-[#334155]"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {tab.path === "dashboard" && (
                    <span className="text-[17px] leading-none">
                      ▦
                    </span>
                  )}

                  {tab.path === "compliance-overview" && (
                    <span
                      className={`
                        flex
                        h-[17px]
                        w-[17px]
                        items-center
                        justify-center
                        rounded-full
                        border-[1.5px]
                        text-[10px]
                        ${
                          isActive
                            ? "border-[#2563EB] text-[#2563EB]"
                            : "border-[#475569] text-[#475569]"
                        }
                      `}
                    >
                      ✓
                    </span>
                  )}

                  {tab.path === "consolidated-salary" && (
                    <span className="text-[18px] leading-none">
                      ₹
                    </span>
                  )}

                  <span>{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Search + History */}
        <div className="flex shrink-0 items-center gap-[10px]">
          <div
            className="
              flex
              h-[46px]
              w-[272px]
              items-center
              gap-2
              rounded-[16px]
              border-[1.5px]
              border-[#CBDCEB]
              bg-white
              px-[16px]
            "
          >
            <Search
              size={19}
              strokeWidth={1.7}
              className="shrink-0 text-[#94A3B8]"
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                min-w-0
                flex-1
                bg-transparent
                text-[15px]
                text-[#334155]
                outline-none
                placeholder:text-[#94A3B8]
              "
            />
          </div>

          <button
            type="button"
            className="
              flex
              h-[46px]
              w-[46px]
              shrink-0
              items-center
              justify-center
              rounded-[16px]
              border-[1.5px]
              border-[#CBDCEB]
              bg-white
            "
            aria-label="History"
          >
            <History
              size={20}
              strokeWidth={1.7}
              className="text-[#64748B]"
            />
          </button>
        </div>
      </div>

      <Outlet />
    </div>
  );
}