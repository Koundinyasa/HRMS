





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
    <div className="p-3 sm:p-4 space-y-3 font-['Urbanist']">
      <div className="bg-white rounded-lg shadow-sm border border-[#EDEDED] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
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

 