import  { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
 
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
 
function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
 
/** "31-03-2026" -> Date, or null if empty/invalid */
function parseDDMMYYYY(value: string): Date | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value || "");
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const d = new Date(year, month - 1, day);
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null; // e.g. 31-02-2026 rolls over — reject
  }
  return d;
}
 
function formatDDMMYYYY(d: Date): string {
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
}
 
interface DateFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}
 
export default function DateField({
  label,
  required,
  value,
  onChange,
  error,
  minDate,
  maxDate,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseDDMMYYYY(value);
  const [viewDate, setViewDate] = useState<Date>(parsed || new Date());
  const wrapRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
 
  const openPicker = () => {
    setViewDate(parsed || new Date());
    setOpen((prev) => !prev);
  };
 
  const pickDay = (day: number) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (minDate && d < minDate) return;
    if (maxDate && d > maxDate) return;
    onChange(formatDDMMYYYY(d));
    setOpen(false);
  };
 
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
 
  const inputCls =
    "border border-gray-300 rounded px-2.5 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#90CAF9] focus:border-[#2196F3] w-full";
  const errorBorderCls = "border-red-400 focus:border-red-500 focus:ring-red-200";
 
  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-[12px] text-gray-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          className={`${inputCls} pr-7 ${error ? errorBorderCls : ""}`}
          value={value}
          placeholder="DD-MM-YYYY"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <button
          type="button"
          onClick={openPicker}
          aria-label={`Open ${label} calendar`}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#2196F3]"
        >
          <Calendar size={13} />
        </button>
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
 
      {open && (
        <div className="absolute z-20 mt-1 w-[230px] bg-white border border-gray-200 rounded-md shadow-lg p-2.5">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="p-1 text-gray-500 hover:text-[#2196F3]"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[12px] font-medium text-gray-700">
              {viewDate.toLocaleString("default", { month: "long" })} {year}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="p-1 text-gray-500 hover:text-[#2196F3]"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="text-[10px] text-gray-400">
                {w}
              </span>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <span key={`e${i}`} />;
              const d = new Date(year, month, day);
              const isSelected =
                parsed &&
                parsed.getFullYear() === year &&
                parsed.getMonth() === month &&
                parsed.getDate() === day;
              const disabled =
                (minDate && d < minDate) || (maxDate && d > maxDate);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={!!disabled}
                  onClick={() => pickDay(day)}
                  className={`text-[11px] w-6 h-6 rounded-full mx-auto flex items-center justify-center
                    ${isSelected ? "bg-[#2196F3] text-white" : "text-gray-700 hover:bg-gray-100"}
                    ${disabled ? "text-gray-300 cursor-not-allowed hover:bg-transparent" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
 
export { parseDDMMYYYY, formatDDMMYYYY };