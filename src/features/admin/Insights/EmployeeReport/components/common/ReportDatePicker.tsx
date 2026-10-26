import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface ReportDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

interface CalendarDay {
  date: Date;
  inMonth: boolean;
}

function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
    ? date
    : null;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month, index - firstWeekday + 1);
    return { date, inMonth: date.getMonth() === month };
  });
}

export default function ReportDatePicker({
  value,
  onChange,
  ariaLabel,
  className = "",
}: ReportDatePickerProps) {
  const selectedDate = parseDate(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => selectedDate ?? new Date()
  );
  const [position, setPosition] = useState({
    left: 8,
    top: 8,
    width: 288,
    maxHeight: undefined as number | undefined,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    const positionPanel = () => {
      const trigger = triggerRef.current?.getBoundingClientRect();
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const padding = 8;
      const gap = 6;
      const report = triggerRef.current?.closest("main")?.getBoundingClientRect();
      const leftBoundary = Math.max(padding, report?.left ?? padding);
      const rightBoundary = Math.min(
        window.innerWidth - padding,
        report?.right ?? window.innerWidth - padding
      );
      const topBoundary = Math.max(padding, report?.top ?? padding);
      const bottomBoundary = Math.min(
        window.innerHeight - padding,
        report?.bottom ?? window.innerHeight - padding
      );
      const width = Math.max(
        0,
        Math.min(288, rightBoundary - leftBoundary - padding * 2)
      );

      panel.style.width = `${width}px`;
      panel.style.maxHeight = `${Math.max(0, bottomBoundary - topBoundary)}px`;
      const panelHeight = panel.getBoundingClientRect().height;
      const roomBelow = Math.max(0, bottomBoundary - trigger.bottom - gap);
      const roomAbove = Math.max(0, trigger.top - gap - topBoundary);
      const placeBelow = roomBelow >= panelHeight || roomBelow >= roomAbove;
      const maxHeight = placeBelow ? roomBelow : roomAbove;
      const left = Math.min(
        Math.max(trigger.left, leftBoundary + padding),
        rightBoundary - width - padding
      );
      const top = placeBelow
        ? trigger.bottom + gap
        : Math.max(
            topBoundary,
            trigger.top - Math.min(panelHeight, roomAbove) - gap
          );

      setPosition({ left, top, width, maxHeight });
    };

    positionPanel();
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, true);
    return () => {
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener("scroll", positionPanel, true);
    };
  }, [open]);

  const days = getCalendarDays(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth()
  );
  const monthLabel = visibleMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString()
    : "";

  const openCalendar = () => {
    setVisibleMonth(selectedDate ?? new Date());
    setOpen((current) => !current);
  };

  const selectDate = (date: Date) => {
    onChange(toIsoDate(date));
    setOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openCalendar}
        className={`relative flex min-w-0 items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-700 outline-none focus:border-brand-300 ${className}`}
      >
        <span className="truncate">{displayValue || "Select date"}</span>
        <CalendarDays size={14} className="shrink-0 text-gray-500" />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label={`${ariaLabel} calendar`}
            className="fixed z-[70] overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 shadow-xl"
            style={{
              left: position.left,
              top: position.top,
              width: position.width,
              maxHeight: position.maxHeight ?? "calc(100dvh - 1rem)",
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() =>
                  setVisibleMonth(
                    (month) =>
                      new Date(
                        month.getFullYear(),
                        month.getMonth() - 1,
                        1
                      )
                  )
                }
                className="rounded p-1 text-gray-600 hover:bg-gray-100"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold text-gray-800">
                {monthLabel}
              </span>
              <button
                type="button"
                aria-label="Next month"
                onClick={() =>
                  setVisibleMonth(
                    (month) =>
                      new Date(
                        month.getFullYear(),
                        month.getMonth() + 1,
                        1
                      )
                  )
                }
                className="rounded p-1 text-gray-600 hover:bg-gray-100"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-gray-500">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span key={day} className="py-1">
                  {day}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map(({ date, inMonth }) => {
                const isoDate = toIsoDate(date);
                const isSelected = isoDate === value;
                return (
                  <button
                    key={isoDate}
                    type="button"
                    disabled={!inMonth}
                    aria-pressed={isSelected}
                    onClick={() => selectDate(date)}
                    className={`h-8 rounded text-xs ${
                      isSelected
                        ? "bg-brand-700 font-semibold text-white"
                        : inMonth
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-gray-300"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex justify-between border-t border-gray-100 pt-2">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="text-xs font-medium text-brand-700 hover:underline"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => selectDate(new Date())}
                className="text-xs font-medium text-brand-700 hover:underline"
              >
                Today
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
