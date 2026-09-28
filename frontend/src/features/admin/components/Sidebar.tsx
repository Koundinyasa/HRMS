import { NavLink, useParams } from "react-router-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SIDEBAR_LINKS } from "../dashboard/constants/dashboard.constants";
import { useSidebar } from "./SidebarContext";
 
export default function Sidebar() {
  const { domain } = useParams();
  const { isOpen, toggleSidebar } = useSidebar();
 
  return (
    <>
      {isOpen && (
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
            isOpen
              ? "w-[220px] translate-x-0"
              : "w-[220px] -translate-x-full lg:w-[72px] lg:translate-x-0"
          }
        `}
        style={{ background: "var(--theme-sidebar, #EAF1FE)" }}
      >
        <nav
          className={`flex flex-col gap-1 px-3 pt-4 ${
            isOpen ? "w-[220px]" : "w-[220px] lg:w-[72px]"
          }`}
        >
          {SIDEBAR_LINKS.map((link) => {
            const Icon = (Icons[link.icon as keyof typeof Icons] ??
              Icons.Circle) as LucideIcon;
 
            return (
              <NavLink
                key={link.path}
                to={`/${domain}/admin/${link.path}`}
                title={!isOpen ? link.label : undefined}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center rounded-lg text-sm font-medium transition-colors ${
                    isOpen
                      ? "gap-3 px-2.5 py-2"
                      : "gap-3 px-2.5 py-2 lg:justify-center lg:py-2"
                  } ${
                    isActive
                      ? "bg-white font-semibold text-blue-600 shadow-sm"
                      : "text-slate-600 hover:bg-white/60"
                  }`
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
                        className={isActive ? "text-white" : "text-slate-500"}
                      />
                    </span>
                    <span
                      className={`truncate ${isOpen ? "block" : "lg:hidden"}`}
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