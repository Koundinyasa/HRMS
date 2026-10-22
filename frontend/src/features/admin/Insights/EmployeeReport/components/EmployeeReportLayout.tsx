





// EmployeeReportLayout.tsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Filter, Users, ChevronLeft } from "lucide-react";

export default function EmployeeReportLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/^(.*\/employee-report)(\/.+)?$/);
  const landingPath = match ? match[1] : location.pathname;
  const isOnLandingPage = !match || !match[2] || match[2] === "/";

  const handleBack = () => navigate(landingPath);

  return (
    <div className="min-w-0 space-y-3 p-2 font-['Urbanist'] sm:p-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-[#EDEDED] bg-white px-3 py-3 shadow-sm sm:px-6">
        {/* COLOR CHANGE: tab chip purple -> orange, with orange hover */}
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#FFD9BF] bg-[#FFF5EE] text-sm font-semibold text-[#FF6200] whitespace-nowrap transition-colors hover:bg-[#FFE5D6] hover:border-[#FF6200]">
          <Users size={16} />
          Employee Report
        </span>

        <div className="flex items-center gap-3">
          {!isOnLandingPage && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-[#FF6200] rounded-md hover:bg-[#E55600] transition-colors shrink-0" /* COLOR CHANGE: Back button purple -> orange */
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          <Filter size={18} className="text-[#BFBFBF] shrink-0 cursor-pointer transition-colors hover:text-[#FF6200]" /> {/* COLOR CHANGE: orange hover */}
        </div>
      </div>

      <Outlet />
    </div>
  );
}

 