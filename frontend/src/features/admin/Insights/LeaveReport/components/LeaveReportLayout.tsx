



// LeaveReportLayout.tsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Filter, ClipboardList, ChevronLeft } from "lucide-react";

export default function LeaveReportLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Find the "leave-report" segment in the current URL and capture
  // anything after it. If there's nothing after it, we're on the
  // landing/menu page itself — no "back" destination makes sense there.
  const match = location.pathname.match(/^(.*\/leave-report)(\/.+)?$/);
  const landingPath = match ? match[1] : location.pathname;
  const isOnLandingPage = !match || !match[2] || match[2] === "/";

  const handleBack = () => navigate(landingPath);

  return (
    <div className="p-3 sm:p-4 space-y-3">
      {/* Top strip: section tab (left) + Back + filter icon (right, where marked) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-orange-200 bg-orange-50 text-sm font-semibold text-orange-800 whitespace-nowrap">
          <ClipboardList size={16} />
          Leave Report
        </span>

        <div className="flex items-center gap-3">
          {!isOnLandingPage && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-orange-800 rounded-md hover:bg-orange-900 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          <Filter size={18} className="text-gray-400 shrink-0" />
        </div>
      </div>

      {/* Page-specific content (header, filters, table, pagination) */}
      <Outlet />
    </div>
  );
}