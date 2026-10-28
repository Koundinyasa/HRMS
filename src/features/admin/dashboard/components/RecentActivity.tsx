import { useState } from "react";
import { MOCK_NOTIFICATIONS } from "../constants/dashboard.constants";

const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-blue-100 text-blue-600",
  Low: "bg-slate-100 text-slate-500",
};

export default function RecentActivity() {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    "1": true,
  });

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between border-b border-red-200 pb-2 mb-1">
        <h3 className="text-sm font-semibold text-slate-800">
          Notifications
        </h3>
        <button className="text-xs font-medium text-blue-600 border border-slate-200 rounded-md px-2 py-1 hover:bg-slate-50">
          View All
        </button>
      </div>

      <ul className="divide-y divide-slate-100">
        {MOCK_NOTIFICATIONS.map((item) => (
          <li key={item.id} className="flex items-start gap-3 py-3">
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={() => toggle(item.id)}
              className="mt-1 h-4 w-4 rounded border-slate-300 accent-indigo-600 cursor-pointer"
            />
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
              <p className="text-xs text-slate-400 mt-0.5">
                {item.scheduledFor}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}