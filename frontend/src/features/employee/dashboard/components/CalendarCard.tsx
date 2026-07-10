import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
 
import { useDashboard } from "../hooks/useDashboard";
 
export default function CalendarCard() {
  const { holidayData } = useDashboard();
 
  const [currentDate, setCurrentDate] =
    useState(new Date());
 
  const [
    currentHolidayIndex,
    setCurrentHolidayIndex,
  ] = useState(0);
 
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
 
  const weekDays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
 
 
 
  const year =
    currentDate.getFullYear();
 
  const month =
    currentDate.getMonth();
 
  const holidays =
    holidayData?.data?.filter(
      (holiday) => {
        const holidayDate =
          new Date(
            holiday.HolidayDate
          );
 
        return (
          holidayDate.getMonth() ===
          month &&
          holidayDate.getFullYear() ===
          year
        );
      }
    ) || [];
 
  const holidayDays =
    holidays.map((holiday) =>
      new Date(
        holiday.HolidayDate
      ).getDate()
    );
 
  const holidayMap =
    holidays.reduce(
      (
        acc: Record<number, string>,
        holiday
      ) => {
        acc[
          new Date(
            holiday.HolidayDate
          ).getDate()
        ] = holiday.HolidayName;
 
        return acc;
      },
      {}
    );
 
  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();
 
  const totalDays =
    new Date(
      year,
      month + 1,
      0
    ).getDate();
 
  const days: (
    | number
    | null
  )[] = [];
 
  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    days.push(null);
  }
 
  for (
    let i = 1;
    i <= totalDays;
    i++
  ) {
    days.push(i);
  }
 
  const previousMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };
 
  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };
 
  const upcomingHolidays =
    holidayData?.data
      ?.filter(
        (holiday) =>
          new Date(
            holiday.HolidayDate
          ) > new Date()
      )
      .sort(
        (a, b) =>
          new Date(
            a.HolidayDate
          ).getTime() -
          new Date(
            b.HolidayDate
          ).getTime()
      ) || [];
 
  const upcomingHoliday =
    upcomingHolidays[
    currentHolidayIndex
    ];
 
  useEffect(() => {
    if (
      upcomingHolidays.length <=
      1
    )
      return;
 
    const interval =
      setInterval(() => {
        setCurrentHolidayIndex(
          (prev) =>
            (prev + 1) %
            upcomingHolidays.length
        );
      }, 3000);
 
    return () =>
      clearInterval(interval);
  }, [upcomingHolidays]);
 
  return (
    <div
      className="
        rounded-2xl
        border
        shadow-sm
        p-5
        h-full
      "
      style={{
        backgroundColor:
          "var(--card-bg)",
        borderColor:
          "var(--primary-border)",
      }}
    >
      {/* Header */}
 
      <div className="flex items-center justify-between">
        <h3
          className="font-semibold text-lg"
          style={{
            color:
              "var(--primary-color)",
          }}
        >
          {monthNames[month]}{" "}
          {year}
        </h3>
 
        <div className="flex gap-2">
          <button
            onClick={
              previousMonth
            }
          >
            <ChevronLeft
              size={18}
              color="var(--primary-color)"
            />
          </button>
 
          <button
            onClick={
              nextMonth
            }
          >
            <ChevronRight
              size={18}
              color="var(--primary-color)"
            />
          </button>
        </div>
      </div>
 
      {/* Divider */}
 
      <div
        className="h-[2px] mt-3 mb-4"
        style={{
          backgroundColor:
            "var(--primary-border)",
        }}
      />
 
      {/* Week Days */}
 
      <div className="grid grid-cols-7 text-center text-xs mb-2 text-slate-600">
        {weekDays.map((day) => (
          <div key={day}>
            {day}
          </div>
        ))}
      </div>
 
      {/* Calendar */}
 
      <div className="grid grid-cols-7 gap-y-2">
        {days.map(
          (
            day,
            index
          ) => {
            if (!day) {
              return (
                <div
                  key={
                    index
                  }
                />
              );
            }
 
            let bg = "";
            let text = "text-slate-700";
 
            // Find actual weekday in the calendar grid
            const weekDay = index % 7;
 
            // Sunday (0) or Saturday (6)
            if (weekDay === 0 || weekDay === 6) {
              bg = "bg-red-100";
              text = "text-red-500";
            }
 
            // Holiday overrides week off
            if (holidayDays.includes(day)) {
              bg = "";
              text = "text-white";
            }
            return (
              <div
                key={`${year}-${month}-${day}-${index}`}
                className="flex justify-center"
              >
                <div
                  title={
                    holidayMap[
                    day
                    ] || ""
                  }
                  className={`
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-medium
                    ${bg}
                    ${text}
                  `}
                  style={
                    holidayDays.includes(
                      day
                    )
                      ? {
                        backgroundColor:
                          "var(--primary-color)",
                      }
                      : {}
                  }
                >
                  {day}
                </div>
              </div>
            );
          }
        )}
      </div>
 
      {/* Legend */}
 
      <div className="flex justify-center gap-5 mt-5 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-slate-600">
            Week Off
          </span>
        </div>
 
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: "var(--primary-color)",
            }}
          />
          <span className="text-slate-600">
            Holiday
          </span>
        </div>
      </div>
 
      {/* Upcoming Holiday */}
 
      <div
        className="
          mt-5
          rounded-xl
          border
          p-4
        "
        style={{
          background:
            "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
          borderColor:
            "var(--primary-border)",
        }}
      >
        <p
          className="text-xs font-medium"
          style={{
            color:
              "var(--primary-color)",
          }}
        >
          Upcoming Holiday
        </p>
 
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="font-semibold text-slate-800">
              {upcomingHoliday?.HolidayName ??
                "No Upcoming Holiday"}
            </p>
 
            {upcomingHoliday && (
              <p className="text-xs text-slate-500 mt-1">
                {new Date(
                  upcomingHoliday.HolidayDate
                ).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
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
            style={{
              backgroundColor:
                "var(--primary-light)",
            }}
          >
            📅
          </div>
        </div>
      </div>
    </div>
  );
}