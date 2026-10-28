import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay(); // 0 = Sunday

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

interface CalendarPanelProps {
  onClose: () => void;
}

export default function CalendarPanel({ onClose }: CalendarPanelProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = getMonthMatrix(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  return (
    <div className="absolute right-0 top-12 w-[300px] bg-white rounded-2xl border border-slate-100 shadow-xl z-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goPrev}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-500"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-slate-800">{monthLabel}</span>
        <button
          onClick={goNext}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-500"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday row — Sun (0) and Sat (6) in red */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((wd, i) => (
          <div
            key={wd}
            className={`text-center text-[11px] font-medium py-1 ${
              i === 0 || i === 6 ? "text-red-500" : "text-slate-400"
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          const weekday = i % 7;
          const isWeekend = weekday === 0 || weekday === 6;
          return (
            <div key={i} className="flex items-center justify-center h-8">
              {day !== null && (
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs
                    ${isToday(day) ? "text-white font-semibold" : isWeekend ? "text-red-500 font-medium" : "text-slate-600"}
                  `}
                  style={isToday(day) ? { background: "var(--theme-primary, #2563EB)" } : {}}
                >
                  {day}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 mt-3 pt-2">
        <button
          onClick={onClose}
          className="w-full text-xs text-center text-slate-500 hover:text-slate-700 py-1"
        >
          Close
        </button>
      </div>
    </div>
  );
}