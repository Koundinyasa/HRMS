import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useGetHolidayListQuery } from "../../employee/api/holidayApi";

export default function CalendarCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  const { data: holidayData } =
    useGetHolidayListQuery();

  const [currentDate, setCurrentDate] =
    useState(new Date());

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

  const presentDays = [
    1, 4, 5, 8, 9, 11, 12, 15, 16, 19,
    22, 23, 24, 25, 26,
  ];

  const absentDays = [3, 10, 17];

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const holidayDays =
    holidayData?.data
      ?.filter((holiday: any) => {
        const holidayDate = new Date(
          holiday.HolidayDate
        );

        return (
          holidayDate.getMonth() === month &&
          holidayDate.getFullYear() === year
        );
      })
      ?.map((holiday: any) =>
        new Date(
          holiday.HolidayDate
        ).getDate()
      ) || [];

  const firstDay =
    new Date(year, month, 1).getDay();

  const totalDays =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const days = [];

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
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const upcomingHoliday =
    holidayData?.data?.find(
      (holiday: any) =>
        new Date(
          holiday.HolidayDate
        ) > new Date()
    );

  return (
    <div
      className="
        bg-white
        rounded-3xl
        p-6
        shadow-sm
        border
        border-slate-100
        h-full
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium text-slate-800">
          {monthNames[month]} {year}
        </h3>

        <div className="flex gap-3">
          <button
            onClick={previousMonth}
          >
            <ChevronLeft
              size={20}
              className="text-slate-500"
            />
          </button>

          <button
            onClick={nextMonth}
          >
            <ChevronRight
              size={20}
              className="text-slate-500"
            />
          </button>
        </div>
      </div>

      <div
        className="h-[2px] mt-3 mb-4"
        style={{
          backgroundColor:
            `${themeColor}70`,
        }}
      />

      {/* Upcoming Holiday */}

      <div className="mb-5">
        <p className="text-sm text-slate-500">
          Upcoming Holiday
        </p>

        <p className="font-medium text-slate-700">
          {upcomingHoliday?.HolidayName ||
            "No Upcoming Holiday"}
        </p>
      </div>

      {/* Week Days */}

      <div className="grid grid-cols-7 text-center text-lg text-slate-700 mb-4">
        {weekDays.map((day) => (
          <div key={day}>
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}

      <div className="grid grid-cols-7 gap-y-5">
        {days.map(
          (day, index) => {
            if (!day) {
              return (
                <div
                  key={index}
                />
              );
            }

            let bgColor = "";
            let textColor =
              "text-slate-800";

            if (
              presentDays.includes(
                day
              )
            ) {
              textColor =
                "text-green-600";
            }

            if (
              absentDays.includes(
                day
              )
            ) {
              bgColor =
                "bg-red-100";
              textColor =
                "text-red-500";
            }

            if (
              holidayDays.includes(
                day
              )
            ) {
              bgColor =
                "bg-blue-100";
              textColor =
                "text-blue-500";
            }

            const today =
              new Date();

            if (
              day === today.getDate() &&
              month ===
                today.getMonth() &&
              year ===
                today.getFullYear()
            ) {
              bgColor =
                "bg-green-100";
            }

            return (
              <div
                key={day}
                className="
                  flex
                  justify-center
                "
              >
                <div
                  className={`
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xl
                    font-medium
                    ${bgColor}
                    ${textColor}
                  `}
                >
                  {day}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Legend */}

      <div className="flex gap-6 mt-10 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-600" />
          <span className="text-slate-500">
            Present
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-slate-500">
            Absent
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-slate-500">
            Holidays
          </span>
        </div>
      </div>
    </div>
  );
}