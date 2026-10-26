import { CalendarDays, ChevronDown } from "lucide-react";

import type { AttendanceTableProps } from "../types/attendanceOverview.types";

import type { AttendanceDay } from "../types/regularization.types";

// ============================================================
// STATUS COLORS
// ============================================================

const statusStyles: Record<string, string> = {
  P: "text-emerald-600",
  AB: "text-red-600",
  WO: "text-slate-400",
  GH: "text-pink-600",
  SL: "text-blue-700 underline decoration-blue-500",
};

// ============================================================
// CHECK HOLIDAY
// ============================================================
//
// Holiday can come from:
// - isHoliday
// - status = GH
// - shift = GH
//
// This is important because backend data may not always
// populate isHoliday as true.
//

function isHolidayDay(day: AttendanceDay): boolean {
  const status = String(day.status ?? "")
    .trim()
    .toUpperCase();

  const shift = String(day.shift ?? "")
    .trim()
    .toUpperCase();

  return (
    day.isHoliday === true ||
    status === "GH" ||
    shift === "GH" ||
    status.includes("GH") ||
    shift.includes("GH")
  );
}

// ============================================================
// CHECK WEEKEND
// ============================================================

function isWeekendDay(day: AttendanceDay): boolean {
  return day.day === "Sat" || day.day === "Sun";
}

// ============================================================
// HEADER BACKGROUND
// ============================================================
//
// 3 COLORS:
//
// BLUE   = normal weekday
// YELLOW = Saturday/Sunday
// PINK   = holiday
//
// Selected date gets a stronger blue.
//

function getDayHeaderBackground(
  day: AttendanceDay,
  selectedDate: number,
): string {
  // Selected date
  if (day.date === selectedDate) {
    return "bg-sky-200 hover:bg-sky-300";
  }

  // ----------------------------------------------------------
  // HOLIDAY = PINK
  // ----------------------------------------------------------

  if (isHolidayDay(day)) {
    return "bg-rose-100 hover:bg-rose-200";
  }

  // ----------------------------------------------------------
  // SATURDAY / SUNDAY = YELLOW
  // ----------------------------------------------------------

  if (isWeekendDay(day)) {
    return "bg-amber-100 hover:bg-amber-200";
  }

  // ----------------------------------------------------------
  // NORMAL WORKING DAY = BLUE
  // ----------------------------------------------------------

  return "bg-sky-100 hover:bg-sky-200";
}

// ============================================================
// BODY BACKGROUND
// ============================================================
//
// The same 3 colors are applied to ALL rows,
// even when there is no data.
//

function getDayBodyBackground(
  day: AttendanceDay,
  selectedDate: number,
): string {
  // Selected date
  if (day.date === selectedDate) {
    return "bg-sky-50";
  }

  // ----------------------------------------------------------
  // HOLIDAY = PINK
  // ----------------------------------------------------------

  if (isHolidayDay(day)) {
    return "bg-rose-50";
  }

  // ----------------------------------------------------------
  // SATURDAY / SUNDAY = YELLOW
  // ----------------------------------------------------------

  if (isWeekendDay(day)) {
    return "bg-amber-50";
  }

  // ----------------------------------------------------------
  // NORMAL WORKING DAY = BLUE
  // ----------------------------------------------------------

  return "bg-sky-50";
}

// ============================================================
// STATUS CELL
// ============================================================

function StatusCell({ record }: { record: AttendanceDay }) {
  if (record.isWeekOff || String(record.status).toUpperCase() === "WO") {
    return (
      <span className="text-xs font-medium text-slate-400 font-[Urbanist]">
        WO
      </span>
    );
  }

  if (isHolidayDay(record)) {
    return (
      <span className="text-xs font-medium text-pink-600 font-[Urbanist]">
        GH
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center leading-tight font-[Urbanist]">
      <span
        className={`text-xs font-medium ${
          statusStyles[record.status] ?? "text-slate-600"
        }`}
      >
        {record.status}
      </span>

      {record.secondaryStatus && (
        <span
          className={`text-xs font-medium ${
            statusStyles[record.secondaryStatus] ?? "text-slate-600"
          }`}
        >
          {record.secondaryStatus}
        </span>
      )}
    </div>
  );
}

// ============================================================
// SHIFT CELL
// ============================================================

function ShiftCell({ record }: { record: AttendanceDay }) {
  if (record.isWeekOff || String(record.shift).toUpperCase() === "WO") {
    return (
      <span className="text-xs font-semibold text-slate-400 font-[Urbanist]">
        WO
      </span>
    );
  }

  if (isHolidayDay(record)) {
    return (
      <span className="text-xs font-semibold text-pink-600 font-[Urbanist]">
        GH
      </span>
    );
  }

  return (
    <span className="text-xs font-semibold text-violet-700 font-[Urbanist]">
      {record.shift}
    </span>
  );
}

// ============================================================
// TABLE ROWS
// ============================================================

const rows = [
  {
    label: "Shift",

    render: (record: AttendanceDay) => <ShiftCell record={record} />,
  },

  {
    label: "Work Status",

    render: (record: AttendanceDay) => <StatusCell record={record} />,
  },

  {
    label: "Check In",

    render: (record: AttendanceDay) => (
      <span className="text-xs text-slate-700 font-[Urbanist]">
        {record.checkIn ?? ""}
      </span>
    ),
  },

  {
    label: "Check Out",

    render: (record: AttendanceDay) => (
      <span className="text-xs text-slate-700 font-[Urbanist]">
        {record.checkOut ?? ""}
      </span>
    ),
  },

  {
    label: "Over Time",

    render: (record: AttendanceDay) => (
      <span className="text-xs text-slate-700 font-[Urbanist]">
        {record.overtime ?? record.overTime ?? ""}
      </span>
    ),
  },

  {
    label: "Gross Work hours",

    render: (record: AttendanceDay) => (
      <span className="text-xs text-slate-700 font-[Urbanist]">
        {record.grossWorkHours ?? ""}
      </span>
    ),
  },

  {
    label: "Work Hours",

    render: (record: AttendanceDay) => (
      <span className="text-xs text-slate-700 font-[Urbanist]">
        {record.workHours ?? ""}
      </span>
    ),
  },

  {
    label: "Break Hours",

    render: (record: AttendanceDay) => (
      <span className="text-xs text-slate-700 font-[Urbanist]">
        {record.breakHours ?? ""}
      </span>
    ),
  },
];

// ============================================================
// ATTENDANCE TABLE
// ============================================================

export default function AttendanceTable({
  days,
  view,
  selectedDate,
  onSelectDate,
  onInfo,
}: AttendanceTableProps) {
  // ==========================================================
  // CALENDAR VIEW
  // ==========================================================

  if (view === "calendar") {
    return (
      <div className="rounded-xl border border-black bg-white p-10 text-center shadow-sm font-[Urbanist]">
        <CalendarDays className="mx-auto h-10 w-10 text-sky-500 font-[Urbanist]" />

        <h3 className="mt-3 text-sm font-semibold text-slate-700 font-[Urbanist]">
          Calendar View
        </h3>

        <p className="mt-1 text-xs text-slate-400 font-[Urbanist]">
          Calendar view is available for attendance planning.
        </p>
      </div>
    );
  }

  // ==========================================================
  // MONTHLY TABLE
  // ==========================================================

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-xl border border-[#dbe3ee] bg-white shadow-sm font-[Urbanist]">
      <table className="w-full min-w-max border-separate border-spacing-0 text-center font-[Urbanist]">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <thead>
          <tr>
            {/* ATTENDANCE LABEL */}

            <th className="sticky left-0 z-20 w-[130px] min-w-[130px] border-b border-r border-[#dbe3ee] bg-[#eaf4fb] px-3 py-2.5 text-left text-xs font-semibold text-[#344054] shadow-[2px_0_4px_-2px_rgba(16,24,40,0.08)] sm:w-[160px] sm:min-w-[160px] sm:px-4 font-[Urbanist]">
              <div className="flex items-center gap-1 text-slate-600 font-[Urbanist]">
                Attendance
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 font-[Urbanist]" />
              </div>

              <button
                type="button"
                onClick={() =>
                  onInfo("Legend / extra rows are a placeholder in this demo")
                }
                className="mt-0.5 flex items-center gap-1 text-[11px] text-sky-700 hover:underline font-[Urbanist]"
              >
                View More
                <ChevronDown className="h-3 w-3 font-[Urbanist]" />
              </button>
            </th>

            {/* DAY HEADERS */}

            {days.map((day) => (
              <th
                key={day.date}
                onClick={() => onSelectDate(day.date)}
                className={`
                    w-[54px]
min-w-[54px]
cursor-pointer
border-b
border-r
border-[#dbe3ee]
px-1
py-2
text-center
align-middle
text-xs
font-medium
transition-colors
                    ${getDayHeaderBackground(day, selectedDate)}
                  `}
              >
                <div className="text-[13px] font-semibold leading-tight text-[#344054] font-[Urbanist]">
                  {day.date}
                </div>

                <div className="text-[10px] font-medium leading-tight text-[#667085] font-[Urbanist]">
                  {day.day}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ====================================================
            BODY
        ==================================================== */}

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="h-11 font-[Urbanist] [&:last-child>td]:border-b-0"
            >
              {/* ROW LABEL */}

              <td className="sticky left-0 z-10 w-[130px] min-w-[130px] border-b border-r border-[#dbe3ee] bg-white px-3 py-2.5 text-left text-xs font-semibold text-[#344054] shadow-[2px_0_4px_-2px_rgba(16,24,40,0.08)] sm:w-[160px] sm:min-w-[160px] sm:px-4 font-[Urbanist]">
                {row.label}
              </td>

              {/* DAY CELLS */}

              {days.map((day) => (
                <td
                  key={`${row.label}-${day.date}`}
                  onClick={() => onSelectDate(day.date)}
                  className={`
                        w-[54px]
min-w-[54px]
cursor-pointer
border-b
border-r
border-[#dbe3ee]
px-1
py-2.5
text-center
align-middle
transition-colors
                        ${getDayBodyBackground(day, selectedDate)}
                      `}
                >
                  {row.render(day)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
