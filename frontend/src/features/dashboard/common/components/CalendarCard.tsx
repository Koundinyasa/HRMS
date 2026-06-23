import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAppSelector } from "../../../../hooks/useAppSelector";

const holidays = [
  {
    date: "2026-06-15",
    name: "Bakrid",
  },
  {
    date: "2026-06-21",
    name: "International Yoga Day",
  },
  {
    date: "2026-08-15",
    name: "Independence Day",
  },
  {
    date: "2026-10-02",
    name: "Gandhi Jayanti",
  },
  {
    date: "2026-12-25",
    name: "Christmas",
  },
];

export default function CalendarCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const totalDays = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const monthName =
    currentDate.toLocaleString(
      "default",
      {
        month: "long",
      }
    );

  const prevMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= totalDays;
    day++
  ) {
    calendarDays.push(day);
  }

  const today = new Date();

  const currentMonthHolidays =
    holidays
      .filter((holiday) => {
        const holidayDate =
          new Date(holiday.date);

        return (
          holidayDate >= today
        );
      })
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      )
      .slice(0, 5);

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        p-5
        shadow-sm
      "
      style={{
        backgroundColor:
          `${themeColor}15`,
      }}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
        >
          <ChevronLeft
            size={18}
            style={{
              color: themeColor,
            }}
          />
        </button>

        <h3
          className="font-semibold"
          style={{
            color: themeColor,
          }}
        >
          {monthName} {year}
        </h3>

        <button
          onClick={nextMonth}
        >
          <ChevronRight
            size={18}
            style={{
              color: themeColor,
            }}
          />
        </button>
      </div>

      {/* WEEK NAMES */}

      <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-500 mb-2">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>

      {/* CALENDAR */}

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(
          (day, index) => {
            const formattedDate =
              day
                ? `${year}-${String(
                  month + 1
                ).padStart(
                  2,
                  "0"
                )}-${String(
                  day
                ).padStart(
                  2,
                  "0"
                )}`
                : "";

            const isHoliday =
              holidays.some(
                (holiday) =>
                  holiday.date ===
                  formattedDate
              );

            return (
              <div
                key={index}
                className="
                  h-8
                  rounded-md
                  flex
                  items-center
                  justify-center
                  text-xs
                "
                style={{
                  backgroundColor:
                    isHoliday
                      ? themeColor
                      : "transparent",

                  color:
                    isHoliday
                      ? "white"
                      : "#475569",
                }}
              >
                {day}
              </div>
            );
          }
        )}
      </div>

      {/* HOLIDAY LIST */}

      <div className="mt-5">
        <h4
          className="text-sm font-medium mb-2"
          style={{
            color: themeColor,
          }}
        >
          Upcoming Holidays
        </h4>

        {currentMonthHolidays
          .length === 0 ? (
          <p className="text-xs text-slate-500">
            No holidays this
            month
          </p>
        ) : (
          <div className="space-y-2">
            {currentMonthHolidays.map(
              (holiday) => (
                <div
                  key={
                    holiday.date
                  }
                  className="
                    flex
                    items-center
                    justify-between
                    text-xs
                    bg-white
                    rounded-lg
                    px-3
                    py-2
                  "
                >
                  <span>
                    {
                      holiday.name
                    }
                  </span>

                  <span
                    style={{
                      color:
                        themeColor,
                    }}
                  >
                    {new Date(
                      holiday.date
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month:
                          "short",
                      }
                    )}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}