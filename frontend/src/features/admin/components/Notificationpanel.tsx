import { X } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "../dashboard/constants/dashboard.constants";

const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-blue-100 text-blue-600",
  Low: "bg-slate-100 text-slate-500",
};

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  return (
    <div className="absolute right-0 top-12 w-[340px] bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">
            Notifications
          </h3>
          <span className="text-[11px] font-semibold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            {MOCK_NOTIFICATIONS.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs text-blue-600 font-medium hover:underline">
            View All
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* List */}
      <ul className="divide-y divide-slate-50 max-h-[340px] overflow-y-auto">
        {MOCK_NOTIFICATIONS.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {item.title}
                </p>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    PRIORITY_STYLES[item.priority]
                  }`}
                >
                  {item.priority}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {item.scheduledFor}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
        <button className="w-full text-xs text-center text-blue-600 font-medium hover:underline">
          Mark all as read
        </button>
      </div>
    </div>
  );
}