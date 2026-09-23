// import {
//   NavLink,
//   useLocation,
//   useNavigate,
//   useParams,
//   useSearchParams,
// } from "react-router-dom";

// import type { ChangeEvent } from "react";
// import { useState } from "react";

// import {
//   ClockFading,
//   Grid3X3,
//   Plus,
//   Check,
//   LogOut,
//   Search,
//   Settings,
//   Download,
// } from "lucide-react";

// import AuditLogModal from "../pages/AuditLog";

// const tabs = [
//   {
//     label: "Dashboard",
//     path: "dashboard",
//     icon: Grid3X3,
//   },
//   {
//     label: "Add Candidates",
//     path: "add-candidate",
//     icon: Plus,
//   },
//   {
//     label: "Completed Candidate",
//     path: "completed-candidate",
//     icon: Check,
//   },
//   {
//     label: "Offboarded Candidate",
//     path: "offboarded-candidate",
//     icon: LogOut,
//   },
//   {
//     label: "Settings",
//     path: "settings",
//     icon: Settings,
//   },
//   {
//     label: "Import",
//     path: "import",
//     icon: Download,
//   },
// ];

// export default function DashboardTabs() {
//   const { domain } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);

//   const [searchParams, setSearchParams] =
//     useSearchParams();

//   const basePath = domain
//     ? `/${domain}/admin/enrollment/pre-enrollment`
//     : "/admin/enrollment/pre-enrollment";

//   const isAddCandidatePage =
//     location.pathname.startsWith(
//       `${basePath}/add-candidate`,
//     );

//   const searchValue =
//     searchParams.get("q") ?? "";

//   const handleSearchChange = (
//     event: ChangeEvent<HTMLInputElement>,
//   ) => {
//     const nextValue = event.target.value;

//     const nextParams =
//       new URLSearchParams(searchParams);

//     if (nextValue.trim()) {
//       nextParams.set("q", nextValue);
//     } else {
//       nextParams.delete("q");
//     }

//     setSearchParams(nextParams, {
//       replace: true,
//     });
//   };

//   return (
//     <div className="relative z-0 w-full min-w-0 rounded-xl border border-orange-400 bg-[#fffaf5] px-2 py-2 md:-mt-4 sm:px-3">

//       <div className="flex w-full min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">

//         {/* =====================================================
//             PRIMARY NAVIGATION
//         ===================================================== */}
//         <div className="flex w-full min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 lg:pb-0">

//           {tabs.map((tab) => {
//             const Icon = tab.icon;

//             const to = `${basePath}/${tab.path}`;

//             const isActive =
//               tab.path === "dashboard"
//                 ? location.pathname === basePath ||
//                   location.pathname ===
//                     `${basePath}/dashboard`
//                 : location.pathname.startsWith(to);

//             return (
//               <NavLink
//                 key={tab.path}
//                 to={to}
//                 className={`
//                   inline-flex
//                   h-10
//                   shrink-0
//                   items-center
//                   gap-2
//                   rounded-lg
//                   border
//                   px-4
//                   text-sm
//                   font-medium
//                   whitespace-nowrap
//                   transition-all
//                   duration-200

//                   ${
//                     isActive
//                       ? "border-orange-500 bg-white text-orange-500 shadow-sm"
//                       : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-orange-400 hover:bg-orange-50 hover:text-orange-500 hover:shadow-sm"
//                   }
//                 `}
//               >

//                 {/* Dashboard / Tab Icon */}
//                 <Icon
//                   size={16}
//                   strokeWidth={2}
//                   className={
//                     tab.path === "dashboard" &&
//                     isActive
//                       ? "text-orange-500"
//                       : ""
//                   }
//                 />

//                 <span>
//                   {tab.label}
//                 </span>

//               </NavLink>
//             );
//           })}

//         </div>

//         {/* =====================================================
//             ADD CANDIDATE CONTROLS
//         ===================================================== */}
//         {isAddCandidatePage && (
//           <div className="flex w-full items-center gap-2 sm:w-auto lg:ml-auto lg:shrink-0">

//             {/* Search */}
//             <div
//               className="
//                 flex
//                 h-10
//                 min-w-0
//                 flex-1
//                 sm:w-[150px]
//                 sm:flex-none
//                 items-center
//                 rounded-lg
//                 border
//                 border-slate-200
//                 bg-white
//                 px-3
//                 text-slate-500
//                 shadow-sm
//                 transition-all
//                 duration-200
//                 hover:border-orange-400
//                 hover:bg-orange-50
//                 hover:text-orange-500
//                 focus-within:border-orange-400
//                 focus-within:bg-orange-50
//               "
//             >

//               <Search
//                 size={16}
//                 className="shrink-0"
//               />

//               <input
//                 type="search"
//                 value={searchValue}
//                 onChange={handleSearchChange}
//                 placeholder="Search..."
//                 aria-label="Search candidates"
//                 className="
//                   ml-2
//                   min-w-0
//                   flex-1
//                   bg-transparent
//                   text-xs
//                   text-slate-700
//                   placeholder:text-slate-400
//                   focus:outline-none
//                 "
//               />

//             </div>

//             {/* Settings */}
//             <button
//               type="button"
//               onClick={() =>
//                 navigate(
//                   `${basePath}/settings`,
//                 )
//               }
//               title="Settings"
//               aria-label="Settings"
//               className="
//                 flex
//                 h-10
//                 w-10
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-lg
//                 border
//                 border-slate-200
//                 bg-white
//                 text-slate-600
//                 shadow-sm
//                 transition-all
//                 duration-200
//                 hover:border-orange-400
//                 hover:bg-orange-50
//                 hover:text-orange-500
//                 hover:shadow-sm
//               "
//             >

//               <Settings
//                 size={18}
//                 strokeWidth={2}
//               />

//             </button>

//             {/* Audit Log */}
//             <button
//               type="button"
//               onClick={() => setIsAuditLogOpen(true)}
//               title="Audit Log"
//               aria-label="Audit Log"
//               className="
//                 flex
//                 h-10
//                 w-10
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-lg
//                 border
//                 border-slate-200
//                 bg-white
//                 text-slate-500
//                 shadow-sm
//                 transition-all
//                 duration-200
//                 hover:border-orange-400
//                 hover:bg-orange-50
//                 hover:text-orange-500
//                 hover:shadow-sm
//               "
//             >

//               <ClockFading
//                 size={19}
//                 strokeWidth={2}
//               />

//             </button>

//           </div>
//         )}

//       </div>

//       {isAuditLogOpen && (
//         <AuditLogModal onClose={() => setIsAuditLogOpen(false)} />
//       )}
//     </div>
//   );
// }


import {
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import type { ChangeEvent } from "react";
import { useState } from "react";

import {
  ClockFading,
  Grid3X3,
  Plus,
  Check,
  LogOut,
  Search,
  Settings,
  Download,
} from "lucide-react";

import AuditLogModal from "../pages/AuditLog";

const tabs = [
  {
    label: "Dashboard",
    path: "dashboard",
    icon: Grid3X3,
  },
  {
    label: "Add Candidates",
    path: "add-candidate",
    icon: Plus,
  },
  {
    label: "Completed Candidate",
    path: "completed-candidate",
    icon: Check,
  },
  {
    label: "Offboarded Candidate",
    path: "offboarded-candidate",
    icon: LogOut,
  },
  {
    label: "Settings",
    path: "settings",
    icon: Settings,
  },
  {
    label: "Import",
    path: "import",
    icon: Download,
  },
];

export default function DashboardTabs() {
  const { domain } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);

  const [searchParams, setSearchParams] =
    useSearchParams();

  const basePath = domain
    ? `/${domain}/admin/enrollment/pre-Enrollment`
    : "/admin/enrollment/pre-Enrollment";

  const isAddCandidatePage =
    location.pathname.startsWith(
      `${basePath}/add-candidate`,
    );

  const searchValue =
    searchParams.get("q") ?? "";

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = event.target.value;

    const nextParams =
      new URLSearchParams(searchParams);

    if (nextValue.trim()) {
      nextParams.set("q", nextValue);
    } else {
      nextParams.delete("q");
    }

    setSearchParams(nextParams, {
      replace: true,
    });
  };

  return (
    <div className="relative z-0 w-full min-w-0 overflow-hidden rounded-xl border border-orange-400 bg-[#fffaf5] px-2 py-2 md:-mt-4 sm:px-3">
      <div className="flex w-full min-w-0 flex-nowrap items-center gap-3 lg:gap-4">

        {/* PRIMARY NAVIGATION */}
        <div className="flex min-w-0 flex-1 items-center gap-4 pb-1 lg:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            const to = `${basePath}/${tab.path}`;

            const isActive =
              tab.path === "dashboard"
                ? location.pathname === basePath ||
                  location.pathname ===
                    `${basePath}/dashboard`
                : location.pathname.startsWith(to);

            return (
              <NavLink
                key={tab.path}
                to={to}
                className={`
                  inline-flex
                  h-10
                  shrink-0
                  items-center
                  gap-1
                  rounded-lg
                  border
                  px-2
                  whitespace-nowrap
                  font-urbanist
                  text-[13px]
                  font-semibold
                  leading-5
                  tracking-normal
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "border-orange-500 bg-white text-orange-500 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-orange-400 hover:bg-orange-50 hover:text-orange-500 hover:shadow-sm"
                  }
                `}
              >
                <Icon
                  size={15}
                  strokeWidth={2}
                  className={
                    tab.path === "dashboard" &&
                    isActive
                      ? "text-orange-500"
                      : ""
                  }
                />

                <span className="font-urbanist">
                  {tab.label}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* ADD CANDIDATE CONTROLS */}
        {isAddCandidatePage && (
          <div className="flex shrink-0 items-center gap-1">

            {/* Search */}
            <div
              className="
                flex
                h-10
                min-w-0
                flex-1
                w-[130px]
                sm:flex-none
                items-center
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                text-slate-500
                shadow-sm
                transition-all
                duration-200
                hover:border-orange-400
                hover:bg-orange-50
                hover:text-orange-500
                focus-within:border-orange-400
                focus-within:bg-orange-50
              "
            >
              <Search
                size={16}
                className="shrink-0"
              />

              <input
                type="search"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search..."
                aria-label="Search candidates"
                className="
                  ml-2
                  min-w-0
                  flex-1
                  bg-transparent
                  font-urbanist
                  text-sm
                  font-medium
                  leading-5
                  text-slate-700
                  placeholder:text-slate-400
                  focus:outline-none
                "
              />
            </div>

            {/* Settings */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  `${basePath}/settings`,
                )
              }
              title="Settings"
              aria-label="Settings"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                bg-white
                text-slate-600
                shadow-sm
                transition-all
                duration-200
                hover:border-orange-400
                hover:bg-orange-50
                hover:text-orange-500
                hover:shadow-sm
              "
            >
              <Settings
                size={18}
                strokeWidth={2}
              />
            </button>

            {/* Audit Log */}
            <button
              type="button"
              onClick={() => setIsAuditLogOpen(true)}
              title="Audit Log"
              aria-label="Audit Log"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                bg-white
                text-slate-500
                shadow-sm
                transition-all
                duration-200
                hover:border-orange-400
                hover:bg-orange-50
                hover:text-orange-500
                hover:shadow-sm
              "
            >
              <ClockFading
                size={19}
                strokeWidth={2}
              />
            </button>
          </div>
        )}
      </div>

      {isAuditLogOpen && (
        <AuditLogModal
          onClose={() => setIsAuditLogOpen(false)}
        />
      )}
    </div>
  );
}