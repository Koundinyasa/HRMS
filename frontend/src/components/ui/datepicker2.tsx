import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
 
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "@/lib/utils";
 
export interface DatePicker2Cell {
  iso: string;
  day: number;
  inMonth: boolean;
  disabled?: boolean; // ignored for click — all dates selectable
  selected: boolean;
  isHoliday?: boolean;
  holidayName?: string;
}
 
export interface DatePicker2Holiday {
  date: string;
  name: string;
  isOptional?: boolean;
}
 
export interface DatePicker2Props {
  id?: string;
  text: string;
  align?: "left" | "right";
  onTextChange: (raw: string) => void;
  onBlur: () => void;
  isInvalid?: boolean;
  placeholder?: string;
  inputClassName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
 
  monthLabel: string;
  weekdayLabels: string[];
  cells: DatePicker2Cell[];
 
  onSelectDay: (iso: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onClear: () => void;
  onToday: () => void;
 
  /** Required for smooth month/year jump (no shake) */
  viewYear: number;
  viewMonth: number; // 1–12
  onViewChange: (year: number, month: number) => void;
 
  holidays?: DatePicker2Holiday[];
}
 
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
 
const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear() + 15;
 
type PanelMode = "days" | "months" | "years";
 
function toIsoDateKey(raw: string): string | null {
  if (!raw) return null;
  const m = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
 
function yearPageStart(year: number) {
  const y = Math.min(MAX_YEAR, Math.max(MIN_YEAR, year));
  return Math.floor(y / 12) * 12;
}
 
function todayIso(): string {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
 
export function DatePicker2({
  id,
  text,
  align = "left",
  onTextChange: _onTextChange,
  onBlur,
  isInvalid,
  placeholder = "dd-mm-yyyy",
  inputClassName,
  open,
  onOpenChange,
  monthLabel: _monthLabel,
  weekdayLabels,
  cells,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  onClear,
  onToday,
  viewYear,
  viewMonth,
  onViewChange,
  holidays,
}: DatePicker2Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<PanelMode>("days");
  const [yearPage, setYearPage] = useState(() => yearPageStart(viewYear));
  const [holidayPopup, setHolidayPopup] = useState<{
    name: string;
    iso: string;
    isOptional?: boolean;
  } | null>(null);
 
  const activeYear = viewYear;
  const activeMonth = viewMonth;
  const today = useMemo(() => todayIso(), []);
 
  useEffect(() => {
    if (!open) {
      setPanel("days");
      setHolidayPopup(null);
    }
  }, [open]);
 
  const prevPanel = useRef<PanelMode>("days");
  useEffect(() => {
    if (panel === "years" && prevPanel.current !== "years") {
      setYearPage(yearPageStart(activeYear));
    }
    prevPanel.current = panel;
  }, [panel, activeYear]);
 
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (holidayPopup) {
        setHolidayPopup(null);
        return;
      }
      if (panel !== "days") {
        setPanel("days");
        return;
      }
      onOpenChange(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange, panel, holidayPopup]);
 
  const holidayByIso = useMemo(() => {
    const map = new Map<string, { name: string; isOptional?: boolean }>();
    if (!holidays?.length) return map;
    for (const h of holidays) {
      const key = toIsoDateKey(h.date);
      if (!key) continue;
      map.set(key, { name: h.name, isOptional: h.isOptional });
    }
    return map;
  }, [holidays]);
 
  /** Single state update — no shake */
  const goToMonthYear = (year: number, month: number) => {
    const y = Math.min(MAX_YEAR, Math.max(MIN_YEAR, year));
    const m = Math.min(12, Math.max(1, month));
    onViewChange(y, m);
    setPanel("days");
    setHolidayPopup(null);
  };
 
  const handleSelectDay = (cell: DatePicker2Cell) => {
    // Only current-month days are selectable (prev/next month days are padding only)
    if (!cell.inMonth) return;
    const fromList = holidayByIso.get(cell.iso);
    const holiday = cell.isHoliday
      ? { name: cell.holidayName || "Holiday", isOptional: undefined as boolean | undefined }
      : fromList
        ? { name: fromList.name, isOptional: fromList.isOptional }
        : null;
 
    if (holiday) {
      setHolidayPopup({
        name: holiday.name,
        iso: cell.iso,
        isOptional: holiday.isOptional,
      });
    } else {
      setHolidayPopup(null);
    }
    onSelectDay(cell.iso);
  };
 
  const yearsOnPage = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 12; i++) {
      const y = yearPage + i;
      if (y >= MIN_YEAR && y <= MAX_YEAR) list.push(y);
    }
    return list;
  }, [yearPage]);
 
  return (
    <div className="relative" ref={wrapperRef}>
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={text}
        aria-invalid={isInvalid}
        readOnly
        onClick={() => onOpenChange(true)}
        onBlur={onBlur}
        className={cn(
          "h-12 cursor-pointer rounded-2xl border-slate-300 bg-white px-4 pr-11 text-sm transition-all duration-150 focus:shadow-[0_0_0_4px_rgba(124,58,237,0.12)]",
          inputClassName,
        )}
        style={{
          borderColor: isInvalid
            ? "#ef4444"
            : open
              ? "var(--primary-color)"
              : undefined,
        }}
      />
 
      <Button
        type="button"
        variant="ghost"
        size="sm"
        tabIndex={-1}
        aria-label="Open calendar"
        onClick={() => onOpenChange(!open)}
        className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full p-0 transition-colors"
        style={{
          color: open ? "var(--primary-color)" : "#94A3B8",
          backgroundColor: open ? "rgba(124,58,237,0.1)" : "transparent",
        }}
      >
        <CalendarDays className="h-4 w-4" />
      </Button>
 
      {open && (
        <div
          className={cn(
            "absolute top-full z-[9999] mt-3 w-[min(20rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-[0_20px_50px_-12px_rgba(124,58,237,0.35)] ring-1 ring-black/5",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div
            className="flex items-center justify-between px-3 py-3 sm:px-4"
            style={{
              background:
                "linear-gradient(135deg, var(--primary-color), #A78BFA)",
            }}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (panel === "years") {
                  setYearPage((p) => Math.max(MIN_YEAR, yearPageStart(p - 12)));
                  return;
                }
                if (panel === "months") {
                  goToMonthYear(activeYear - 1, activeMonth);
                  return;
                }
                onPrevMonth();
              }}
              className="h-8 w-8 shrink-0 rounded-full p-0 text-white hover:bg-white/20 hover:text-white"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
 
            <div className="flex min-w-0 flex-1 items-center justify-center gap-1 px-1">
              {panel === "years" ? (
                <span className="truncate text-xs font-bold text-white sm:text-sm">
                  {Math.max(MIN_YEAR, yearPage)} –{" "}
                  {Math.min(MAX_YEAR, yearPage + 11)}
                </span>
              ) : panel === "months" ? (
                <button
                  type="button"
                  className="truncate rounded-full px-2 py-0.5 text-xs font-bold text-white hover:bg-white/20 sm:text-sm"
                  onClick={() => setPanel("years")}
                >
                  {activeYear}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="truncate rounded-full px-2 py-0.5 text-xs font-bold tracking-wide text-white underline-offset-2 hover:bg-white/20 hover:underline sm:text-sm"
                    onClick={() => setPanel("months")}
                  >
                    {MONTH_LONG[activeMonth - 1] ?? "Month"}
                  </button>
                  <button
                    type="button"
                    className="truncate rounded-full px-2 py-0.5 text-xs font-bold tracking-wide text-white underline-offset-2 hover:bg-white/20 hover:underline sm:text-sm"
                    onClick={() => setPanel("years")}
                  >
                    {activeYear}
                  </button>
                </>
              )}
            </div>
 
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (panel === "years") {
                  setYearPage((p) =>
                    Math.min(yearPageStart(MAX_YEAR), yearPageStart(p + 12)),
                  );
                  return;
                }
                if (panel === "months") {
                  goToMonthYear(activeYear + 1, activeMonth);
                  return;
                }
                onNextMonth();
              }}
              className="h-8 w-8 shrink-0 rounded-full p-0 text-white hover:bg-white/20 hover:text-white"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
 
          <div className="relative min-h-[260px] p-3 sm:p-4">
            {panel === "days" && (
              <>
                <div
                  className="mb-2 grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wide sm:text-xs"
                  style={{ color: "var(--primary-color)" }}
                >
                  {weekdayLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
 
                <div className="grid grid-cols-7 gap-x-1 gap-y-1.5 text-center text-sm">
                  {cells.map((cell) => {
                    // Only show current-month dates. Prev/next month slots stay empty for grid alignment.
                    if (!cell.inMonth) {
                      return (
                        <div
                          key={cell.iso}
                          className="mx-auto h-9 w-9 sm:h-10 sm:w-10"
                          aria-hidden
                        />
                      );
                    }
 
                    const hol =
                      holidayByIso.get(cell.iso) ||
                      (cell.isHoliday
                        ? {
                            name: cell.holidayName || "Holiday",
                            isOptional: false,
                          }
                        : null);
                    const isHol = Boolean(hol);
                    const isToday = cell.iso === today;
 
                    return (
                      <Button
                        type="button"
                        key={cell.iso}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectDay(cell)}
                        title={hol?.name}
                        className={cn(
                          "relative mx-auto flex h-9 w-9 items-center justify-center rounded-full p-0 text-xs font-medium transition-colors duration-100 sm:h-10 sm:w-10 sm:text-sm",
                          cell.selected
                            ? "font-bold text-white shadow-[0_6px_16px_-4px_rgba(124,58,237,0.6)]"
                            : isHol
                              ? "font-semibold text-amber-800 hover:bg-amber-50"
                              : isToday
                                ? "font-bold text-[var(--primary-color)] ring-2 ring-[var(--primary-color)] ring-offset-1"
                                : "text-slate-700 hover:bg-purple-50 hover:text-[var(--primary-color)]",
                        )}
                        style={
                          cell.selected
                            ? {
                                background:
                                  "linear-gradient(135deg, var(--primary-color), #A78BFA)",
                              }
                            : isHol && !isToday
                              ? { backgroundColor: "rgba(245, 158, 11, 0.15)" }
                              : isToday && !cell.selected
                                ? { backgroundColor: "rgba(124, 58, 237, 0.12)" }
                                : undefined
                        }
                      >
                        {cell.day}
                        {isHol && (
                          <span
                            className="absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
                            style={{
                              backgroundColor: cell.selected
                                ? "#fff"
                                : hol?.isOptional
                                  ? "#F59E0B"
                                  : "#EF4444",
                            }}
                            aria-hidden
                          />
                        )}
                      </Button>
                    );
                  })}
                </div>
 
                <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setHolidayPopup(null);
                      onClear();
                    }}
                    className="flex h-8 items-center gap-1.5 rounded-full px-3 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setHolidayPopup(null);
                      setPanel("days");
                      onToday();
                    }}
                    className="h-8 rounded-full px-4 font-semibold shadow-sm transition hover:opacity-90"
                    style={{
                      color: "var(--primary-color)",
                      backgroundColor: "rgba(124,58,237,0.1)",
                    }}
                  >
                    Today
                  </Button>
                </div>
              </>
            )}
 
            {panel === "months" && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {MONTH_SHORT.map((label, index) => {
                  const monthNum = index + 1;
                  const selected = monthNum === activeMonth;
                  return (
                    <button
                      key={label}
                      type="button"
                      className={cn(
                        "rounded-xl px-2 py-3 text-sm font-semibold transition-colors",
                        selected
                          ? "text-white shadow-md"
                          : "text-slate-700 hover:bg-purple-50",
                      )}
                      style={
                        selected
                          ? {
                              background:
                                "linear-gradient(135deg, var(--primary-color), #A78BFA)",
                            }
                          : undefined
                      }
                      onClick={() => goToMonthYear(activeYear, monthNum)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
 
            {panel === "years" && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {yearsOnPage.map((year) => {
                  const selected = year === activeYear;
                  return (
                    <button
                      key={year}
                      type="button"
                      className={cn(
                        "rounded-xl px-2 py-3 text-sm font-semibold transition-colors",
                        selected
                          ? "text-white shadow-md"
                          : "text-slate-700 hover:bg-purple-50",
                      )}
                      style={
                        selected
                          ? {
                              background:
                                "linear-gradient(135deg, var(--primary-color), #A78BFA)",
                            }
                          : undefined
                      }
                      onClick={() => {
                        onViewChange(year, activeMonth);
                        setPanel("months");
                      }}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            )}
 
            {holidayPopup && panel === "days" && (
              <div
                className="absolute inset-x-3 bottom-3 z-10 rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-lg sm:inset-x-4"
                role="status"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="m-0 text-xs font-semibold uppercase tracking-wide text-amber-700">
                      {holidayPopup.isOptional
                        ? "Restricted holiday"
                        : "Holiday"}
                    </p>
                    <p className="mt-1 mb-0 truncate text-sm font-bold text-slate-800">
                      {holidayPopup.name}
                    </p>
                    <p className="mt-0.5 mb-0 text-xs text-slate-500">
                      {holidayPopup.iso}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-slate-500 hover:bg-amber-100"
                    onClick={() => setHolidayPopup(null)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
 
export default DatePicker2;