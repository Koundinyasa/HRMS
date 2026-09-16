


 
import {
  Clock3,
  ArrowUpRight,
  CircleCheck,
  ArrowDownLeft,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
 
import { useDashboard } from "../hooks/useDashboard";
import type { Holiday } from "../types/dashboard.types";
 
export default function StatsLeaveCard() {
  const navigate = useNavigate();
  const { domain } = useParams();
 
  const { profileData, holidayData } = useDashboard();
 
  const attendance = profileData?.data?.attendanceSummary;
 
  // ---------- Real holiday counts ----------
  const { restrictedCount, upcomingCount } = useMemo(() => {
    const list = holidayData?.data;
    if (!Array.isArray(list)) {
      return { restrictedCount: 0, upcomingCount: 0 };
    }
 
    const today = new Date();
    today.setHours(0, 0, 0, 0);
 
    // Restricted = total from backend (IsOptional === true)
    const restricted = list.filter(
      (h: Holiday) => h.IsOptional === true
    ).length;
 
    // Upcoming = future holidays only
    const upcoming = list.filter((h: Holiday) => {
      const d = new Date(h.HolidayDate);
      d.setHours(0, 0, 0, 0);
      return d >= today;
    }).length;
 
    return {
      restrictedCount: restricted,
      upcomingCount: upcoming,
    };
  }, [holidayData]);
 
  const handleApplyLeave = () => {
    navigate(`/${domain}/employee/leave/apply`);
  };
 
  return (
    <div className="flex flex-col gap-4">
      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Average Hours */}
        <div
          className="rounded-2xl p-3 sm:p-4 border shadow-sm min-w-0"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--primary-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--primary-light)" }}
          >
            <Clock3 size={18} color="var(--primary-color)" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-tight">
            Average hours
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold mt-1 text-slate-800">
            {attendance?.AverageHours ?? "--"}
          </h3>
        </div>
 
        {/* Average Check In */}
        <div
          className="rounded-2xl p-3 sm:p-4 border shadow-sm min-w-0"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--primary-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#ECFDF5" }}
          >
            <ArrowUpRight size={18} color="#22C55E" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-tight">
            Average check-in
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold mt-1 text-slate-800">
            {attendance?.["AverageCheck-In"] ?? "--"}
          </h3>
        </div>
 
        {/* On Time Arrival */}
        <div
          className="rounded-2xl p-3 sm:p-4 border shadow-sm min-w-0"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--primary-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#EFF6FF" }}
          >
            <CircleCheck size={18} color="#3B82F6" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-tight">
            On-time arrival
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold mt-1 text-slate-800">
            {attendance?.["On-TimeArrival"] ?? "--"}
          </h3>
        </div>
 
        {/* Average Check Out */}
        <div
          className="rounded-2xl p-3 sm:p-4 border shadow-sm min-w-0"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--primary-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#FEF2F2" }}
          >
            <ArrowDownLeft size={18} color="#EF4444" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-tight">
            Average check-out
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold mt-1 text-slate-800">
            {attendance?.["AverageCheck-Out"] ?? "--"}
          </h3>
        </div>
      </div>
 
      {/* My Leaves Card */}
      <div
        className="rounded-2xl border p-4 sm:p-5 shadow-sm"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--primary-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-base sm:text-lg font-medium"
            style={{ color: "var(--primary-color)" }}
          >
            My Leaves
          </h3>
 
          <button
            onClick={handleApplyLeave}
            className="
              px-2 sm:px-3
              py-1
              rounded-lg
              text-xs sm:text-sm
              font-medium
              text-white
              whitespace-nowrap
              hover:opacity-90
              transition
            "
            style={{ background: "var(--primary-gradient)" }}
          >
            Apply Leave +
          </button>
        </div>
 
        {/* Divider */}
        <div
          className="h-[2px] mt-4"
          style={{ backgroundColor: "var(--primary-border)" }}
        />
 
        {/* Restricted Holiday */}
        <div
          className="
            mt-5 sm:mt-8
            rounded-xl
            px-3 sm:px-5
            py-3 sm:py-4
            flex
            items-center
            justify-between
            gap-3
          "
          style={{
            background:
              "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-300" />
            <span className="text-sm sm:text-xl text-slate-700">
              Restricted Holiday
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-medium text-slate-800">
            {restrictedCount}
          </span>
        </div>
 
        {/* Upcoming Holiday */}
        <div
          className="
            mt-5 sm:mt-8
            rounded-xl
            px-3 sm:px-5
            py-3 sm:py-4
            flex
            items-center
            justify-between
            gap-3
          "
          style={{
            background:
              "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-sm sm:text-xl text-slate-700">
              Upcoming Holiday
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-medium text-slate-800">
            {upcomingCount}
          </span>
        </div>
      </div>
    </div>
  );
}
 