import { NavLink, useParams } from "react-router-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SIDEBAR_LINKS } from "../dashboard/constants/dashboard.constants";

export default function Sidebar() {
  const { domain } = useParams();

  return (
    <aside
      className="hidden lg:flex flex-col w-[220px] shrink-0 min-h-screen pt-4 border-r border-white/40"
      style={{ background: "var(--theme-sidebar, #EAF1FE)" }}
    >
      <nav className="flex flex-col gap-1 px-3">
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
                    ? "bg-white shadow-sm"
                    : "text-slate-600 hover:bg-white/60"
                }`
              }
              style={({ isActive }) =>
                isActive ? { color: "var(--theme-primary, #2563EB)" } : {}
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