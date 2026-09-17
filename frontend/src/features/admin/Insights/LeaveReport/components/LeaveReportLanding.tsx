








// LeaveReportLanding.tsx
import { useNavigate } from "react-router-dom";
import { FileText, CalendarDays, Activity, ClipboardCheck, type LucideIcon } from "lucide-react";
import { LEAVE_REPORT_MENU } from "../constants/leaveReportMenu.constants";

const COLUMN_ICONS: Record<string, LucideIcon> = {
  "Leave Report": FileText,
  "Attendance Report": CalendarDays,
  "Additional Report": Activity,
  "Add. Attendance Report": ClipboardCheck,
};

export default function LeaveReportLanding() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x divide-gray-200">
        {LEAVE_REPORT_MENU.map((column) => {
          const Icon = COLUMN_ICONS[column.title] ?? FileText;
          return (
            <div key={column.title} className="lg:px-4 lg:first:pl-0 lg:last:pr-0">
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-md px-4 py-3 mb-2">
                <Icon size={16} className="text-orange-800 shrink-0" />
                <h3 className="text-sm font-bold text-orange-800">
                  {column.title}
                </h3>
              </div>

              <ul className="space-y-1">
                {column.items.map((item) => (
                  <li key={item.path}>
                    <button
                      type="button"
                      onClick={() => navigate(item.path)}
                      className="w-full text-left px-4 py-2 rounded-md text-sm text-gray-600 hover:text-orange-800 hover:bg-orange-50 transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}