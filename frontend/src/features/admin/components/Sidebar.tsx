import { NavLink, useParams } from "react-router-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SIDEBAR_LINKS } from "../dashboard/constants/dashboard.constants";
import { useSidebar } from "./SidebarContext";

export default function Sidebar() {
  const { domain } = useParams();
  const { isOpen } = useSidebar();

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 min-h-screen pt-4 border-r border-white/40 overflow-hidden transition-all duration-300 ${
        isOpen ? "w-[220px]" : "w-0 pt-0 border-none"
      }`}
      style={{ background: "var(--theme-sidebar, #EAF1FE)" }}
    >
      <nav className="flex flex-col gap-1 px-3 w-[220px]">
        {SIDEBAR_LINKS.map((link) => {
          const Icon = (Icons[link.icon as keyof typeof Icons] ??
            Icons.Circle) as LucideIcon;

          return (
            <NavLink
              key={link.path}
              to={`/${domain}/admin/${link.path}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white shadow-sm text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-white/60"
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}