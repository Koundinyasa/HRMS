







import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCog,
  UserCheck2,
  Tags,
  Users2,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { EMPLOYEE_REPORT_MENU } from "../constants/employeeReportMenu.constants";

const GROUP_ICONS: Record<string, LucideIcon> = {
  "Employee Report": Users,
  "Login Report": UserCog,
  "Reporting Authority": UserCheck2,
  "Classification Report": Tags,
  "Employee HR Category Report": Users2,
};

export default function EmployeeReportLanding() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {EMPLOYEE_REPORT_MENU.map((group) => {
        const Icon = GROUP_ICONS[group.title] ?? Users;
        return (
          <div
            key={group.title}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-colors hover:border-[#FFD9BF]" /* COLOR CHANGE: orange card hover border */
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <Icon size={16} className="text-[#FF6200] shrink-0" /> {/* COLOR CHANGE: orange icon */}
              <span className="text-sm font-semibold text-[#131313]">{group.title}</span>
            </div>

            <div className="py-1">
              {group.items.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-sm text-gray-600 group hover:bg-[#FFF5EE] hover:text-[#FF6200] transition-colors" /* COLOR CHANGE: orange row hover */
                >
                  <span className="truncate">{item.label}</span>
                  <ChevronRight size={14} className="text-gray-300 shrink-0 group-hover:text-[#FF6200]" />
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}