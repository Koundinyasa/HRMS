import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
 
import { useDashboard } from "../hooks/useDashboard";
// ⬇️ CHANGED
import { useGetMonthlyLeaveCalendarQuery } from "../api/dashboardApi";
// ⬆️ END CHANGED
 
const getHolidayDate = (dateString: string) => {
  const [datePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  return { year, month: month - 1, day };
};
 
// =========================================================
// ⬇️ CHANGED — Distinct colours for each status
// Present=green | Absent=red | Week Off=amber | Holiday=purple
// =========================================================
const STATUS_STYLE: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  P: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Present",
  },
  A: {
    bg: "bg-red-100",
    text: "text-red-600",
    label: "Absent",
  },
  AB: {
    bg: "bg-red-100",
    text: "text-red-600",
    label: "Absent",
  },
  W: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    label: "Week Off",
  },
  WO: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    label: "Week Off",
  },
  H: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    label: "Holiday",
  },
  GH: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    label: "Gazetted Holiday",
  },
  HD: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    label: "Half Day",
  },
  CL: {
    bg: "bg-sky-100",
    text: "text-sky-700",
    label: "Casual Leave",
  },
  SL: {
    bg: "bg-fuchsia-100",
    text: "text-fuchsia-700",
    label: "Sick Leave",
  },
  PL: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    label: "Privilege Leave",
  },
  "AB/CL": {
    bg: "bg-red-50",
    text: "text-red-600",
    label: "Absent / Casual Leave",
  },
  "SL/AB": {
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    label: "Sick Leave / Absent",
  },
  PN: {
    bg: "bg-teal-100",
    text: "text-teal-700",
    label: "Present (Night)",
  },
};
 
const getStatusStyle = (status?: string) => {
  if (!status) return null;
  const code = status.trim().toUpperCase();
  if (!code || code === "-") return null;
  return (
    STATUS_STYLE[code] ?? {
      bg: "bg-slate-100",
      text: "text-slate-600",
      label: code,
    }
  );
};
// =========================================================
// ⬆️ END CHANGED
// =========================================================
 
export default function CalendarCard() {
  const { holidayData } = useDashboard();
 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentHolidayIndex, setCurrentHolidayIndex] = useState(0);
 
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0–11
  const apiMonth = month + 1; // API expects 1–12
 
  // =========================================================
  // ⬇️ CHANGED — NEW API: GET with year & month query params
  // Response shape: { success, statusCode, message, data: rows[] }
  // =========================================================
  const { data: leaveCalendarResponse } = useGetMonthlyLeaveCalendarQuery(
    {
      year,
      month: apiMonth,
    },
    { refetchOnMountOrArgChange: true }
  );
 
  // Backend returns only the logged-in employee (from JWT)
  // data is the array of rows
  const myAttendance = useMemo(() => {
    const rows = leaveCalendarResponse?.data;
    if (!rows || rows.length === 0) return null;
    // Usually only one row for the current employee
    return rows[0];
  }, [leaveCalendarResponse]);
 
  // day number → status code  (API keys: "1 Thu", "2 Fri", …)
  const dayStatusMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (!myAttendance) return map;
 
    Object.entries(myAttendance).forEach(([key, value]) => {
      // Only day keys like "1 Thu", "28 Wed"
      if (/^\d{1,2}\s+/.test(key) && value != null && value !== "") {
        const dayNum = Number(key.split(" ")[0]);
        if (!Number.isNaN(dayNum)) {
          map[dayNum] = String(value).trim();
        }
      }
    });
    return map;
  }, [myAttendance]);
  // =========================================================
  // ⬆️ END CHANGED
  // =========================================================
 
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
 
  const holidays =
    holidayData?.data?.filter((holiday) => {
      const { year: holidayYear, month: holidayMonth } = getHolidayDate(
        holiday.HolidayDate
      );
      return holidayMonth === month && holidayYear === year;
    }) || [];
 
  const holidayDays = holidays.map(
    (holiday) => getHolidayDate(holiday.HolidayDate).day
  );
 
  const holidayMap = holidays.reduce(
    (acc: Record<number, string>, holiday) => {
      const { day } = getHolidayDate(holiday.HolidayDate);
      acc[day] = holiday.HolidayName;
      return acc;
    },
    {}
  );
 
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }
 
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
 
  const upcomingHolidays = useMemo(() => {
    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return (
      holidayData?.data
        ?.filter((holiday) => {
          const {
            year: holidayYear,
            month: holidayMonth,
            day: holidayDay,
          } = getHolidayDate(holiday.HolidayDate);
          const holidayDate = new Date(
            holidayYear,
            holidayMonth,
            holidayDay
          );
          return holidayDate >= todayDate;
        })
        .sort((a, b) => {
          const dateA = getHolidayDate(a.HolidayDate);
          const dateB = getHolidayDate(b.HolidayDate);
          return (
            new Date(dateA.year, dateA.month, dateA.day).getTime() -
            new Date(dateB.year, dateB.month, dateB.day).getTime()
          );
        }) || []
    );
  }, [holidayData?.data]);
 
  const upcomingHoliday = upcomingHolidays[currentHolidayIndex];
 
  useEffect(() => {
    if (upcomingHolidays.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHolidayIndex(
        (prev) => (prev + 1) % upcomingHolidays.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [upcomingHolidays]);
 
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
 
  return (
    <div
      className="
        rounded-2xl
        border
        shadow-sm
        p-3 sm:p-4 lg:p-5
        h-auto
      "
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--primary-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="font-semibold text-base sm:text-lg"
          style={{ color: "var(--primary-color)" }}
        >
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button onClick={previousMonth} type="button">
            <ChevronLeft size={18} color="var(--primary-color)" />
          </button>
          <button onClick={nextMonth} type="button">
            <ChevronRight size={18} color="var(--primary-color)" />
          </button>
        </div>
      </div>
 
      {/* Divider */}
      <div
        className="h-[2px] mt-3 mb-4"
        style={{ backgroundColor: "var(--primary-border)" }}
      />
 
      {/* Week Days */}
      <div className="grid grid-cols-7 text-center text-[10px] sm:text-xs mb-2 text-slate-500 font-medium">
        {weekDays.map((day, i) => (
          <div key={`${day}-${i}`}>{day}</div>
        ))}
      </div>
 
      {/* =========================================================
          ⬇️ CHANGED — Calendar grid: date + status code under it
          ========================================================= */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} />;
          }
 
          const status = dayStatusMap[day];
          const style = getStatusStyle(status);
          const isHoliday = holidayDays.includes(day);
          const isToday = isCurrentMonth && day === today.getDate();
 
          let cellBg = "bg-slate-50";
          let numberColor = "text-slate-700";
          let codeColor = "text-slate-500";
 
          if (style) {
            cellBg = style.bg;
            numberColor = style.text;
            codeColor = style.text;
          } else {
            const weekDay = index % 7;
            if (weekDay === 0 || weekDay === 6) {
              cellBg = "bg-amber-50";
              numberColor = "text-amber-600";
              codeColor = "text-amber-500";
            }
            if (isHoliday) {
              cellBg = "bg-violet-100";
              numberColor = "text-violet-700";
              codeColor = "text-violet-600";
            }
          }
 
          const title =
            holidayMap[day] ||
            (style ? style.label : status) ||
            "";
 
          const displayCode = status
            ? status.trim().toUpperCase()
            : isHoliday
              ? "H"
              : "";
 
          return (
            <div
              key={`${year}-${month}-${day}-${index}`}
              className="flex justify-center"
            >
              <div
                title={title}
                className={`
                  w-full aspect-square max-w-[40px] sm:max-w-[44px]
                  rounded-lg
                  flex flex-col
                  items-center
                  justify-center
                  gap-0.5
                  ${cellBg}
                  ${isToday ? "ring-2 ring-blue-400 ring-offset-1" : ""}
                `}
              >
                {/* Date number */}
                <span
                  className={`
                    text-xs sm:text-sm font-semibold leading-none
                    ${numberColor}
                  `}
                >
                  {day}
                </span>
 
                {/* Status code under date — P / AB / WO / H / GH */}
                {displayCode ? (
                  <span
                    className={`
                      text-[9px] sm:text-[10px] font-medium leading-none
                      ${codeColor}
                    `}
                  >
                    {displayCode}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {/* =========================================================
          ⬆️ END CHANGED
          ========================================================= */}
 
      {/* =========================================================
          ⬇️ CHANGED — Legend with DISTINCT colours
          ========================================================= */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mt-4 sm:mt-5 text-[10px] sm:text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-slate-600">Present (P)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-slate-600">Absent (AB)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-slate-600">Week Off (WO)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
          <span className="text-slate-600">Holiday (GH/H)</span>
        </div>
      </div>
      {/* =========================================================
          ⬆️ END CHANGED
          ========================================================= */}
 
      {/* Upcoming Holiday */}
      <div
        className="
          mt-4 sm:mt-5
          rounded-xl
          border
          p-3 sm:p-4
        "
        style={{
          background:
            "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
          borderColor: "var(--primary-border)",
        }}
      >
        <p
          className="text-xs font-medium"
          style={{ color: "var(--primary-color)" }}
        >
          Upcoming Holiday
        </p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="font-semibold text-sm sm:text-base text-slate-800">
              {upcomingHoliday?.HolidayName ?? "No Upcoming Holiday"}
            </p>
            {upcomingHoliday && (
              <p className="text-xs text-slate-500 mt-1">
                {(() => {
                  const { year, month, day } = getHolidayDate(
                    upcomingHoliday.HolidayDate
                  );
                  return new Date(year, month, day).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  );
                })()}
              </p>
            )}
          </div>
          <div
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              text-xl
            "
            style={{ backgroundColor: "var(--primary-light)" }}
          >
            📅
          </div>
        </div>
      </div>
    </div>
  );
}
 