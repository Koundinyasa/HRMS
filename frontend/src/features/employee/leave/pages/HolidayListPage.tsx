import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
 
import { useDashboard } from "@/features/employee/dashboard/hooks/useDashboard";
import type { Holiday } from "@/features/employee/dashboard/types/dashboard.types";
 
const formatHolidayDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
 
const getHolidayDay = (dateString: string): number => {
  const dateOnly = dateString.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  const date = dateOnly
    ? new Date(`${dateOnly}T00:00:00`)
    : new Date(dateString);
 
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};
 
export default function HolidayListPage() {
  const navigate = useNavigate();
  const { domain } = useParams();
 
  // ✅ Using existing LIST data (same as Calendar)
  const { holidayData, holidayLoading, holidayError } = useDashboard();
 
  const holidays = useMemo<Holiday[]>(() => {
    const list = holidayData?.data;
    if (!Array.isArray(list)) return [];
 
    return [...list].sort(
      (a, b) =>
        new Date(a.HolidayDate).getTime() -
        new Date(b.HolidayDate).getTime()
    );
  }, [holidayData]);
 
  const handleApplyLeave = () => {
    navigate(`/${domain}/employee/leave/apply`);
  };
 
  return (
    <div
      className="rounded-3xl border border-[#1F2937] p-5 sm:p-8"
      style={{ backgroundColor: "var(--card-bg)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl sm:text-2xl font-semibold tracking-tight"
            style={{ color: "var(--primary-color)" }}
          >
            Holiday Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Company holidays and restricted holidays
          </p>
        </div>
 
        {!holidayLoading && !holidayError && (
          <span className="text-sm text-slate-500 tabular-nums">
            {holidays.length} {holidays.length === 1 ? "day" : "days"}
          </span>
        )}
      </div>
 
      {/* Loading */}
      {holidayLoading && (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500">Loading holidays...</p>
        </div>
      )}
 
      {/* Error */}
      {holidayError && (
        <div className="py-12 text-center">
          <p className="text-sm text-red-500">Failed to load holiday list.</p>
        </div>
      )}
 
      {/* Empty */}
      {!holidayLoading && !holidayError && holidays.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500">No holidays found.</p>
        </div>
      )}
 
      {/* Holiday List */}
      {!holidayLoading && !holidayError && holidays.length > 0 && (
        <div className="flex flex-col gap-3">
          {holidays.map((holiday) => {
            const restricted = holiday.IsOptional === true;
            const isUpcoming = getHolidayDay(holiday.HolidayDate) >=
              new Date(new Date().setHours(0, 0, 0, 0)).getTime();
 
            return (
              <div
                key={holiday.HolidayId}
                className="
                  flex items-center justify-between
                  rounded-xl border
                  px-4 py-3 sm:px-5 sm:py-4
                  transition
                  hover:shadow-sm
                "
                style={{ borderColor: "#E5E7EB" }}
              >
                <div>
                  <p className="text-sm sm:text-base font-medium text-slate-800">
                    {holiday.HolidayName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CalendarDays size={13} className="text-slate-400" />
                    <span className="text-xs sm:text-sm text-slate-500">
                      Holiday Date : {formatHolidayDate(holiday.HolidayDate)}
                    </span>
                  </div>
                </div>
 
                <div className="flex items-center gap-3">
                  {restricted && (
                    <button
                      type="button"
                      onClick={handleApplyLeave}
                      disabled={!isUpcoming}
                      className="
                        px-2.5 py-1
                        rounded-full
                        text-[11px] font-medium
                        border
                        hover:bg-slate-50
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                      style={{
                        color: "#6D28D9",
                        borderColor: "#D9CCFB",
                      }}
                    >
                      Apply Leave
                    </button>
                  )}
 
                  <span
                    className="
                      px-3 py-1
                      rounded-full
                      text-xs font-medium text-white
                      whitespace-nowrap
                    "
                    style={{
                      backgroundColor: restricted ? "#F59E0B" : "#22C55E",
                    }}
                  >
                    {restricted ? "Restricted Holiday" : "National Holiday"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
