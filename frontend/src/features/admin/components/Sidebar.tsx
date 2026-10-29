// import { NavLink, useParams } from "react-router-dom";
// import * as Icons from "lucide-react";
// import type { LucideIcon } from "lucide-react";
// import { SIDEBAR_LINKS } from "../dashboard/constants/dashboard.constants";
// import { useSidebar } from "./SidebarContext";

// export default function Sidebar() {
//   const { domain } = useParams();
//   const { isOpen, toggleSidebar } = useSidebar();

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/40 lg:hidden"
//           onClick={toggleSidebar}
//         />
//       )}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex flex-col shrink-0
//           min-h-screen pt-4 border-r border-white/40 overflow-hidden
//           transition-all duration-300 ease-in-out
//           lg:static lg:z-auto
//           ${ isOpen ? "w-[220px] translate-x-0" : "w-[220px] -translate-x-full lg:translate-x-0 lg:w-[72px]"
//           }`}
//         style={{ background: "var(--theme-sidebar, #EAF1FE)" }}
//       >
//         <nav className={`flex flex-col gap-1 px-3 ${isOpen ? "w-[220px]" : "lg:w-[72px] w-[220px]"}`}>
//           {SIDEBAR_LINKS.map((link) => {
//             const Icon = (Icons[link.icon as keyof typeof Icons] ??
//               Icons.Circle) as LucideIcon;

//             return (
//               <NavLink
//                 key={link.path}
//                 to={`/${domain}/admin/${link.path}`}
//                 title={!isOpen ? link.label : undefined}
//                 onClick={() => {
//                   // close drawer on mobile after click
//                   if (window.innerWidth < 1024) toggleSidebar();
//                 }}
//                 className={({ isActive }) =>
//                   `flex items-center rounded-lg text-sm font-medium transition-colors ${isOpen ? "gap-3 px-2.5 py-2" :  "lg:justify-center lg:py-2 gap-3 px-2.5 py-2"
//                   } ${isActive
//                     ? "bg-white shadow-sm text-blue-600 font-semibold"
//                     : "text-slate-600 hover:bg-white/60"
//                   }`
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     <span
//                       className="flex items-center justify-center rounded-lg shrink-0 w-8 h-8"
//                       style={{
//                         background: isActive ? "var(--theme-primary, #2563EB)" : "#FFFFFF",
//                       }}
//                     >
//                       <Icon size={16} className={isActive ? "text-white" : "text-slate-500"} />
//                     </span>
//                     <span
//                       className={`truncate ${isOpen ? "block" : "lg:hidden"}`}
//                     >
//                       {link.label}
//                     </span>
//                   </>
//                 )}
//               </NavLink>
//             );
//           })}
//         </nav>
//       </aside>
//     </>
//   );
// }



import { NavLink, useParams } from "react-router-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SIDEBAR_LINKS } from "../dashboard/constants/dashboard.constants";
import { useSidebar } from "./SidebarContext";

export default function Sidebar() {
  const { domain } = useParams();

  const { sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          z-50 flex shrink-0 flex-col border-r border-white/40
          transition-all duration-300 ease-in-out
          fixed inset-y-0 left-0 overflow-y-auto
          lg:static lg:sticky lg:top-0 lg:z-auto lg:h-full lg:self-stretch
          ${
            sidebarOpen
              ? "w-[220px] translate-x-0"
              : "w-[220px] -translate-x-full lg:w-[72px] lg:translate-x-0"
          }
        `}
        style={{
          background: "var(--theme-sidebar, #EAF1FE)",
        }}
      >
        <nav
          className={`
            flex flex-col gap-1 px-3 pt-4
            ${
              sidebarOpen
                ? "w-[220px]"
                : "w-[220px] lg:w-[72px]"
            }
          `}
        >
          {SIDEBAR_LINKS.map((link) => {
            const Icon = (
              Icons[link.icon as keyof typeof Icons] ?? Icons.Circle
            ) as LucideIcon;

            return (
              <NavLink
                key={link.path}
                to={`/${domain}/admin/${link.path}`}
                title={link.label}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={({ isActive }) =>
                  `
                    flex items-center rounded-lg text-sm font-medium
                    transition-colors
                    ${
                      sidebarOpen
                        ? "gap-3 px-2.5 py-2"
                        : "gap-3 px-2.5 py-2 lg:justify-center lg:py-2"
                    }
                    ${
                      isActive
                        ? "bg-white font-semibold text-blue-600 shadow-sm"
                        : "text-slate-600 hover:bg-white/60"
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: isActive
                          ? "var(--theme-primary, #2563EB)"
                          : "#FFFFFF",
                      }}
                    >
                      <Icon
                        size={16}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-500"
                        }
                      />
                    </span>

                    <span
                      className={`
                        truncate
                        ${
                          sidebarOpen
                            ? "block"
                            : "lg:hidden"
                        }
                      `}
                    >
                      {link.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}