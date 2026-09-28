import { NavLink } from "react-router-dom";
import { INSIGHTS_SUB_NAV } from "../constants/reports.constants";
import { Users, DollarSign, Percent, ShieldCheck, CalendarDays, Clock3, BarChart2, Grid3x3, PenTool, UserPlus, LogOut, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "employee-report": Users,
  salary: DollarSign,
  "tds-report": Percent,
  "statutory-report": ShieldCheck,
  "leave-report": CalendarDays,
  "time-office": Clock3,
  "general-report": BarChart2,
  Others: Grid3x3,
  "craft-report": PenTool,
  onboard: UserPlus,
  "exit-module": LogOut,
};

export default function ReportTypesSidebar() {
  return (
    <aside className="w-full sm:w-60 shrink-0 bg-[#F1F5F8] rounded-lg p-3">
      <h3 className="px-2 pt-1 pb-3 text-xs font-bold tracking-wide text-gray-500">REPORT TYPES</h3>
      <nav className="flex flex-col gap-1">
        {INSIGHTS_SUB_NAV.map((item) => {
          const Icon = ICONS[item.path] ?? Grid3x3;
          return (
            <NavLink
              key={item.path}
              to={`/insights/${item.path}`}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-white text-brand-800 font-semibold shadow-sm border-l-4 border-brand-800 pl-2"
                    : "text-gray-600 hover:bg-white/70 hover:text-gray-800"
                }`
              }
            >
              <Icon size={16} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}