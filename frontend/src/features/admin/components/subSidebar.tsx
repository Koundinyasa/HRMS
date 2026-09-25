// import { useState } from "react";
// import { NavLink, useLocation, useParams } from "react-router-dom";
// import { ChevronDown, ChevronRight, X } from "lucide-react";
// import type { SubNavItem } from "./sidebar.types";
// import { useSidebar } from "./SidebarContext";

// interface SubSidebarProps {
//   sectionPath: string;
//   items: SubNavItem[];
// }

// export default function SubSidebar({ sectionPath, items }: SubSidebarProps) {
//   const { domain } = useParams();
//   const location = useLocation();
//   const basePath = `/${domain}/admin/${sectionPath}`;
//   const { isOpen, toggleSidebar } = useSidebar();

//   const [openKeys, setOpenKeys] = useState<Set<string>>(
//     () =>
//       new Set(
//         items
//           .filter((i) => i.children?.some((c) => location.pathname.includes(c.path)))
//           .map((i) => i.path)
//       )
//   );

//   const toggle = (key: string) =>
//     setOpenKeys((prev) => {
//       const next = new Set(prev);
//       next.has(key) ? next.delete(key) : next.add(key);
//       return next;
//     });

//   return (
//     <>
//       {/* Desktop / tablet: fixed column */}
//       <aside className="hidden md:flex flex-col w-[220px] lg:w-[240px] shrink-0 min-h-full bg-[#EDEBFB] pt-4 px-3">
//         <nav className="flex flex-col gap-1">
//           {items.map((item) => (
//             <NavItem key={item.path} item={item} basePath={basePath} isOpen={openKeys.has(item.path)} onToggle={toggle} />
//           ))}
//         </nav>
//       </aside>

//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/40 md:hidden"
//           onClick={toggleSidebar}
//         />
//       )}

//       <aside
//         className={`
//           fixed inset-y-0 left-0 z-50 flex flex-col
//           w-[260px] bg-[#EDEBFB] pt-4 px-3
//           transition-transform duration-300 ease-in-out
//           md:hidden
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >

//         <div className="flex items-center justify-between px-2 mb-4">
//           <span className="text-sm font-semibold text-slate-700 capitalize">
//             {sectionPath.replace("-", " ")}
//           </span>
//           <button
//             onClick={toggleSidebar}
//             className="p-1.5 rounded-lg text-slate-500 hover:bg-white/60"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Mobile: horizontal scroll strip */}
//         <nav className="flex flex-col gap-1 overflow-y-auto">
//           {items.map((item) =>
//             item.children?.length ? (
//               <div key={item.path}>
//                 <button
//                   onClick={() => toggle(item.path)}
//                   className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${openKeys.has(item.path)
//                       ? "bg-indigo-600 text-white"
//                       : "text-slate-700 hover:bg-white/60"
//                     }`}
//                 >
//                   <span>{item.label}</span>
//                   {openKeys.has(item.path) ? (
//                     <ChevronDown size={15} />
//                   ) : (
//                     <ChevronRight size={15} />
//                   )}
//                 </button>

//                 {openKeys.has(item.path) && (
//                   <div className="mt-1 flex flex-col gap-0.5">
//                     {item.children.map((child) => (
//                       <NavLink
//                         key={child.path}
//                         to={`${basePath}/${item.path}/${child.path}`}
//                         onClick={toggleSidebar}
//                         className={({ isActive }) =>
//                           `flex items-center gap-2 pl-6 pr-2 py-2 text-sm rounded-lg transition-colors ${isActive
//                             ? "text-indigo-600 font-semibold"
//                             : "text-slate-500 hover:bg-white/50"
//                           }`
//                         }
//                       >
//                         <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
//                         {child.label}
//                       </NavLink>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <NavLink
//                 key={item.path}
//                 to={`${basePath}/${item.path}`}
//                 onClick={toggleSidebar}
//                 className={({ isActive }) =>
//                   `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
//                     ? "bg-indigo-600 text-white"
//                     : "text-slate-700 hover:bg-white/60"
//                   }`
//                 }
//               >
//                 {item.label}
//               </NavLink>
//             )
//           )}
//         </nav>
//       </aside>
//     </>
//   );
// }

// function NavItem({
//   item,
//   basePath,
//   isOpen,
//   onToggle,
// }: {
//   item: SubNavItem;
//   basePath: string;
//   isOpen: boolean;
//   onToggle: (key: string) => void;
// }) {
//   if (!item.children?.length) {
//     return (
//       <NavLink
//         to={`${basePath}/${item.path}`}
//         className={({ isActive }) =>
//           `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
//             ? "text-indigo-600"
//             : "text-slate-700 hover:bg-white/60"
//           }`
//         }
//       >
//         {item.label}
//       </NavLink>
//     );
//   }

//   return (
//     <div>
//       <button
//         onClick={() => onToggle(item.path)}
//         className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isOpen
//             ? "bg-indigo-600 text-white"
//             : "text-slate-700 hover:bg-white/60"
//           }`}
//       >
//         <span className="truncate">{item.label}</span>
//         {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
//       </button>

//       {isOpen && (
//         <div className="mt-1 flex flex-col gap-0.5">
//           {item.children.map((child) => (
//             <NavLink
//               key={child.path}
//               to={`${basePath}/${item.path}/${child.path}`}
//               className={({ isActive }) =>
//                 `flex items-center gap-2 pl-6 pr-2 py-1.5 text-sm rounded-lg transition-colors ${isActive
//                   ? "text-indigo-600 font-semibold"
//                   : "text-slate-500 hover:bg-white/50"
//                 }`
//               }
//             >
//               <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
//               <span className="truncate">{child.label}</span>
//             </NavLink>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import {
  NavLink,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

import type { SubNavItem } from "./sidebar.types";
import { useSidebar } from "./SidebarContext";

interface SubSidebarProps {
  sectionPath: string;
  items: SubNavItem[];
}

export default function SubSidebar({
  sectionPath,
  items,
}: SubSidebarProps) {
  const { domain } = useParams();
  const location = useLocation();

  const basePath = `/${domain}/admin/${sectionPath}`;

  const {
    subSidebarOpen,
    closeSubSidebar,
  } = useSidebar();

  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () =>
      new Set(
        items
          .filter((item) =>
            item.children?.some((child) =>
              location.pathname.includes(child.path)
            )
          )
          .map((item) => item.path)
      )
  );

  const toggle = (key: string) => {
    setOpenKeys((previous) => {
      const next = new Set(previous);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  return (
    <>
      {/* Desktop and tablet */}
      <aside className="hidden md:flex flex-col w-[220px] lg:w-[240px] shrink-0 min-h-full bg-[#EDEBFB] pt-4 px-3">
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              basePath={basePath}
              isOpen={openKeys.has(item.path)}
              onToggle={toggle}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {subSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeSubSidebar}
        />
      )}

      {/* Mobile sub-sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          w-[260px]
          bg-[#EDEBFB]
          pt-4 px-3
          shadow-xl
          transition-transform duration-300 ease-in-out
          md:hidden
          ${
            subSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex items-center justify-between px-2 mb-4">
          <span className="text-sm font-semibold text-slate-700 capitalize">
            {sectionPath.replace("-", " ")}
          </span>

          <button
            type="button"
            onClick={closeSubSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-white/60"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto">
          {items.map((item) =>
            item.children?.length ? (
              <div key={item.path}>
                <button
                  type="button"
                  onClick={() => toggle(item.path)}
                  className={`
                    w-full flex items-center justify-between
                    rounded-lg px-3 py-2.5
                    text-sm font-semibold
                    transition-colors
                    ${
                      openKeys.has(item.path)
                        ? "bg-indigo-600 text-white"
                        : "text-slate-700 hover:bg-white/60"
                    }
                  `}
                >
                  <span>{item.label}</span>

                  {openKeys.has(item.path) ? (
                    <ChevronDown size={15} />
                  ) : (
                    <ChevronRight size={15} />
                  )}
                </button>

                {openKeys.has(item.path) && (
                  <div className="mt-1 flex flex-col gap-0.5">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={`${basePath}/${item.path}/${child.path}`}
                        onClick={closeSubSidebar}
                        className={({ isActive }) =>
                          `
                            flex items-center gap-2
                            pl-6 pr-2 py-2
                            text-sm rounded-lg
                            transition-colors
                            ${
                              isActive
                                ? "text-indigo-600 font-semibold"
                                : "text-slate-500 hover:bg-white/50"
                            }
                          `
                        }
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={`${basePath}/${item.path}`}
                onClick={closeSubSidebar}
                className={({ isActive }) =>
                  `
                    rounded-lg px-3 py-2.5
                    text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-slate-700 hover:bg-white/60"
                    }
                  `
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>
      </aside>
    </>
  );
}

function NavItem({
  item,
  basePath,
  isOpen,
  onToggle,
}: {
  item: SubNavItem;
  basePath: string;
  isOpen: boolean;
  onToggle: (key: string) => void;
}) {
  if (!item.children?.length) {
    return (
      <NavLink
        to={`${basePath}/${item.path}`}
        className={({ isActive }) =>
          `
            rounded-lg px-3 py-2
            text-sm font-medium
            transition-colors
            ${
              isActive
                ? "text-indigo-600"
                : "text-slate-700 hover:bg-white/60"
            }
          `
        }
      >
        {item.label}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(item.path)}
        className={`
          w-full flex items-center justify-between
          rounded-lg px-3 py-2
          text-sm font-semibold
          transition-colors
          ${
            isOpen
              ? "bg-indigo-600 text-white"
              : "text-slate-700 hover:bg-white/60"
          }
        `}
      >
        <span className="truncate">{item.label}</span>

        {isOpen ? (
          <ChevronDown size={15} />
        ) : (
          <ChevronRight size={15} />
        )}
      </button>

      {isOpen && (
        <div className="mt-1 flex flex-col gap-0.5">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              to={`${basePath}/${item.path}/${child.path}`}
              className={({ isActive }) =>
                `
                  flex items-center gap-2
                  pl-6 pr-2 py-1.5
                  text-sm rounded-lg
                  transition-colors
                  ${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-slate-500 hover:bg-white/50"
                  }
                `
              }
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
              <span className="truncate">{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}