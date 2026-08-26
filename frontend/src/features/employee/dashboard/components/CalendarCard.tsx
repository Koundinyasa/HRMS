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
 
  const getHolidayDate = (dateString: string) => {
    const [datePart] = dateString.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
 
    return {
      year,
      month: month - 1,
      day,
    };
  };
 
 
 
  const year =
    currentDate.getFullYear();
 
  const month =
    currentDate.getMonth();
 
  const holidays =
    holidayData?.data?.filter((holiday) => {
      const {
        year: holidayYear,
        month: holidayMonth,
      } = getHolidayDate(holiday.HolidayDate);
 
      return (
        holidayMonth === month &&
        holidayYear === year
      );
    }) || [];
 
  const holidayDays = holidays.map(
    (holiday) =>
      getHolidayDate(holiday.HolidayDate).day
  );
 
  const holidayMap = holidays.reduce(
    (
      acc: Record<number, string>,
      holiday
    ) => {
      const { day } =
        getHolidayDate(holiday.HolidayDate);
 
      acc[day] = holiday.HolidayName;
 
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
 
  const today = new Date();
 
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
 
  const upcomingHolidays =
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
        const dateA = getHolidayDate(
          a.HolidayDate
        );
 
        const dateB = getHolidayDate(
          b.HolidayDate
        );
 
        return (
          new Date(
            dateA.year,
            dateA.month,
            dateA.day
          ).getTime() -
          new Date(
            dateB.year,
            dateB.month,
            dateB.day
          ).getTime()
        );
      }) || [];
 
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
        p-3 sm:p-4 lg:p-5
        h-auto
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
          className="font-semibold text-base sm:text-lg"
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
 
      <div className="grid grid-cols-7 text-center text-[10px] sm:text-xs mb-2 text-slate-600">
        {weekDays.map((day) => (
          <div key={day}>
            {day}
          </div>
        ))}
      </div>
 
      {/* Calendar */}
 
      <div className="grid grid-cols-7 gap-y-1 sm:gap-y-2">
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
                    w-7 h-7 sm:w-8 sm:h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs sm:text-sm
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
          mt-4 sm:mt-5
rounded-xl
border
p-3 sm:p-4
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
            <p className="font-semibold text-sm sm:text-base text-slate-800">
              {upcomingHoliday?.HolidayName ??
                "No Upcoming Holiday"}
            </p>
 
            {upcomingHoliday && (
              <p className="text-xs text-slate-500 mt-1">
                {(() => {
                  const {
                    year,
                    month,
                    day,
                  } = getHolidayDate(
                    upcomingHoliday.HolidayDate
                  );
 
                  return new Date(
                    year,
                    month,
                    day
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  });
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