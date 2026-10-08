import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import DatePicker, {
  type DatePickerCell,
} from "@/components/ui/datepicker";

import TimeOfficeNavbar from "../../components/TimeOfficeNavbar";
import { isWeekendIso } from "@/features/employee/leave/constants/leave.constants";
import { useBlockedHolidays } from "@/features/employee/leave/hooks/useBlockedHolidays";

import type {
  MissedPunchNavbarProps,
} from "../types/missedPunch.types";

const WEEKDAY_LABELS = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
];

const pad = (n: number) => `${n}`.padStart(2, "0");

const toIsoFromParts = (
  year: number,
  monthIndex: number,
  day: number,
) => `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

const toDisplay = (iso: string) => {
  if (!iso) return "";

  const [year, month, day] = iso.split("-");

  if (!year || !month || !day) return "";

  return `${day}-${month}-${year}`;
};

const toMonthStart = (
  value: string,
  initialMonth?: string,
) => {
  const base = value
    ? new Date(`${value}T00:00:00`)
    : initialMonth
      ? new Date(`${initialMonth}T00:00:00`)
      : new Date();

  return new Date(
    base.getFullYear(),
    base.getMonth(),
    1,
  );
};

interface HolidayTip {
  iso: string;
  name: string;
  isOptional: boolean;
  x: number;
  top: number;
  bottom: number;
}

const formatTipDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

interface MissedPunchDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  align?: "left" | "right";
  onOpenStateChange?: (open: boolean) => void;
}

function MissedPunchDatePicker({
  value,
  onChange,
  align = "left",
  onOpenStateChange,
}: MissedPunchDatePickerProps) {
  const { blockedHolidayIsos, holidayInfo } =
    useBlockedHolidays();

  const [text, setText] = useState(() =>
    toDisplay(value),
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
  onOpenStateChange?.(open);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [open]);

  const [viewDate, setViewDate] = useState(() =>
    toMonthStart(value),
  );

  const [tip, setTip] =
    useState<HolidayTip | null>(null);

  const lastIsoRef = useRef("");

  /*
   * Keep the displayed value synchronized when
   * the parent changes the selected date.
   */
  const [lastSync, setLastSync] = useState(value);

  if (lastSync !== value) {
    setLastSync(value);
    setText(toDisplay(value));
    setViewDate(toMonthStart(value));
  }

  /*
   * Disable:
   * - weekends
   * - blocked holidays
   * - non-optional holidays
   */
  const isDisabled = (iso: string) => {
    if (isWeekendIso(iso)) {
      return true;
    }

    if (blockedHolidayIsos.has(iso)) {
      return true;
    }

    const holiday = holidayInfo.get(iso);

    if (holiday && !holiday.isOptional) {
      return true;
    }

    return false;
  };

  /*
   * Date text is read-only in the shared DatePicker,
   * so dates can only be selected through the calendar.
   */
  const handleSelectDay = (iso: string) => {
    if (isDisabled(iso)) return;

    onChange(iso);
    setText(toDisplay(iso));
    setOpen(false);
    hideTip();
  };

  const handleClear = () => {
    onChange("");
    setText("");
    setOpen(false);
    hideTip();
  };

  const handleToday = () => {
    const today = new Date();

    const iso = toIsoFromParts(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    if (isDisabled(iso)) return;

    setViewDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    );

    handleSelectDay(iso);
  };

  const handlePrevMonth = () => {
    setViewDate(
      (date) =>
        new Date(
          date.getFullYear(),
          date.getMonth() - 1,
          1,
        ),
    );
  };

  const handleNextMonth = () => {
    setViewDate(
      (date) =>
        new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          1,
        ),
    );
  };

  /*
   * Build calendar cells.
   */
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstOfMonth = new Date(
    year,
    month,
    1,
  );

  const startOffset = firstOfMonth.getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const daysInPrevMonth = new Date(
    year,
    month,
    0,
  ).getDate();

  const cells: DatePickerCell[] = [];

  // Previous month cells
  for (
    let i = startOffset - 1;
    i >= 0;
    i--
  ) {
    const day = daysInPrevMonth - i;

    const prevMonthIndex =
      month === 0 ? 11 : month - 1;

    const prevYear =
      month === 0 ? year - 1 : year;

    const iso = toIsoFromParts(
      prevYear,
      prevMonthIndex,
      day,
    );

    cells.push({
      iso,
      day,
      inMonth: false,
      disabled: isDisabled(iso),
      selected: iso === value,
    });
  }

  // Current month cells
  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    const iso = toIsoFromParts(
      year,
      month,
      day,
    );

    cells.push({
      iso,
      day,
      inMonth: true,
      disabled: isDisabled(iso),
      selected: iso === value,
    });
  }

  // Next month cells
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1];

    const nextDate = new Date(
      `${last.iso}T00:00:00`,
    );

    nextDate.setDate(
      nextDate.getDate() + 1,
    );

    const iso = toIsoFromParts(
      nextDate.getFullYear(),
      nextDate.getMonth(),
      nextDate.getDate(),
    );

    cells.push({
      iso,
      day: nextDate.getDate(),
      inMonth: false,
      disabled: isDisabled(iso),
      selected: iso === value,
    });
  }

  const monthLabel =
    viewDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  /*
   * Holiday helpers
   */
  const getHoliday = (iso: string) =>
    holidayInfo.get(iso);

  const hideTip = () => {
    lastIsoRef.current = "";
    setTip(null);
  };

  const handleOpenChange = (
    nextOpen: boolean,
  ) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      hideTip();
    }
  };

  /*
   * Find the date button under the mouse.
   */
  const findCellButton = (
    target: HTMLElement,
    x: number,
    y: number,
  ): HTMLElement | null => {
    const direct =
      target.closest("button");

    if (
      direct &&
      direct.parentElement?.children
        .length === cells.length
    ) {
      return direct as HTMLElement;
    }

    const grid = target;

    if (grid.children.length === cells.length) {
      const match = Array.from(
        grid.children,
      ).find((child) => {
        const rect =
          child.getBoundingClientRect();

        return (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        );
      });

      return (
        (match as HTMLElement | undefined) ??
        null
      );
    }

    return null;
  };

  /*
   * Show holiday information when hovering
   * over a holiday date.
   */
  const handleCellHover = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!open) return;

    const button = findCellButton(
      event.target as HTMLElement,
      event.clientX,
      event.clientY,
    );

    if (!button || !button.parentElement) {
      if (lastIsoRef.current) {
        hideTip();
      }

      return;
    }

    const index = Array.prototype.indexOf.call(
      button.parentElement.children,
      button,
    );

    const iso = cells[index]?.iso;

    const holiday = iso
      ? getHoliday(iso)
      : undefined;

    if (!iso || !holiday) {
      if (lastIsoRef.current) {
        hideTip();
      }

      return;
    }

    if (lastIsoRef.current === iso) {
      return;
    }

    lastIsoRef.current = iso;

    const rect =
      button.getBoundingClientRect();

    setTip({
      iso,
      name: holiday.name,
      isOptional: holiday.isOptional,
      x: rect.left + rect.width / 2,
      top: rect.top,
      bottom: rect.bottom,
    });
  };

  /*
   * Render holiday tooltip outside the calendar
   * so it doesn't get clipped.
   */
  const renderTip = () => {
    if (!open || !tip) {
      return null;
    }

    const HALF_W = 120;

    const clampedX = Math.min(
      Math.max(tip.x, HALF_W + 8),
      window.innerWidth - HALF_W - 8,
    );

    const showBelow = tip.top < 110;

    const arrowLeft =
      `calc(50% + ${tip.x - clampedX}px)`;

    return createPortal(
      <div
        style={{
          position: "fixed",
          left: clampedX,
          top: showBelow
            ? tip.bottom + 10
            : tip.top - 10,
          transform: showBelow
            ? "translate(-50%, 0)"
            : "translate(-50%, -100%)",
          zIndex: 99999,
          pointerEvents: "none",
        }}
      >
        <style>
          {`
            @keyframes holidayTipIn {
              from {
                opacity: 0;
                transform:
                  translateY(6px)
                  scale(.96);
              }
              to {
                opacity: 1;
                transform:
                  translateY(0)
                  scale(1);
              }
            }
          `}
        </style>

        <div
          className="relative w-60"
          style={{
            animation:
              "holidayTipIn .16s ease-out",
          }}
        >
          <div className="overflow-hidden rounded-xl border border-violet-200 bg-white shadow-[0_12px_32px_rgba(76,29,149,0.25)]">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-violet-400" />

            <div className="flex items-start gap-3 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg">
                🎉
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-500">
                  {tip.isOptional
                    ? "Optional Holiday"
                    : "Holiday"}
                </p>

                <p className="text-sm font-semibold leading-snug text-slate-800">
                  {tip.name}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {formatTipDate(tip.iso)}
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    tip.isOptional
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {tip.isOptional
                    ? "Leave can be applied"
                    : "Leave cannot be applied"}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`absolute h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-white ${
              showBelow
                ? "-top-[5px] border-l border-t border-violet-200"
                : "-bottom-[5px] border-b border-r border-violet-200"
            }`}
            style={{
              left: arrowLeft,
            }}
          />
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <div
      onMouseMove={handleCellHover}
      onMouseLeave={hideTip}
    >
      <DatePicker
        text={text}
        readOnly
        align={align}
        onTextChange={() => {
          // Intentionally disabled.
          // Dates are selected only from the calendar.
        }}
        onBlur={() => {
          setText(toDisplay(value));
        }}
        open={open}
        onOpenChange={handleOpenChange}
        monthLabel={monthLabel}
        weekdayLabels={WEEKDAY_LABELS}
        cells={cells}
        onSelectDay={handleSelectDay}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onClear={handleClear}
        onToday={handleToday}
      />

      {renderTip()}
    </div>
  );
}

export default function MissedPunchNavbar({
  filters,
  onFromDateChange,
  onToDateChange,
  onRefresh,
}: MissedPunchNavbarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pickerOpenRef = useRef(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [offset, setOffset] = useState(0);

  // Remember the scroll position when a calendar opens
  const handlePickerOpen = (isOpen: boolean) => {
    if (isOpen && !pickerOpenRef.current) {
      setOffset(scrollRef.current?.scrollLeft ?? 0);
    }
    pickerOpenRef.current = isOpen;
    setPickerOpen(isOpen);
  };

  // Restore the scroll position when the calendar closes
  useLayoutEffect(() => {
    if (!pickerOpen && scrollRef.current) {
      scrollRef.current.scrollLeft = offset;
    }
  }, [pickerOpen, offset]);

  return (
    <TimeOfficeNavbar allowVerticalOverflow className="mb-3">
      <div
        ref={scrollRef}
        className={`punch-horizontal-scroll max-w-[calc(100vw-5.5rem)] pb-1 sm:max-w-none sm:overflow-visible ${
          pickerOpen ? "overflow-visible" : "overflow-x-auto"
        }`}
      >
        <div
          className="flex w-max items-center gap-3"
          style={
            pickerOpen
              ? { transform: `translateX(-${offset}px)` }
              : undefined
          }
        >
          <label className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-[#1f2937]">
            From
            <MissedPunchDatePicker
              value={filters.fromDate}
              onChange={onFromDateChange}
              align="left"
              onOpenStateChange={handlePickerOpen}
            />
          </label>

          <label className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-[#1f2937]">
            To
            <MissedPunchDatePicker
              value={filters.toDate}
              onChange={onToDateChange}
              align="right"
              onOpenStateChange={handlePickerOpen}
            />
          </label>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Refresh"
            onClick={onRefresh}
            className="shrink-0 text-[#7f94b5] hover:bg-[#f3f6fa]"
          >
            <RefreshCw size={20} />
          </Button>
        </div>
      </div>
    </TimeOfficeNavbar>
  );
}