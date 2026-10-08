import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

import DatePicker, {
  type DatePickerCell,
} from "@/components/ui/datepicker";

import { useBlockedHolidays } from "@/features/employee/leave/hooks/useBlockedHolidays";
import { isWeekendIso } from "@/features/employee/leave/constants/leave.constants";

const ISO_FORMAT = "yyyy-MM-dd";
const TEXT_FORMAT = "dd-MM-yyyy";

const WEEKDAY_LABELS = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
];

interface TAInsightsDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  align?: "left" | "right";
}

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

export default function TAInsightsDatePicker({
  value,
  onChange,
  align = "left",
}: TAInsightsDatePickerProps) {
  const { blockedHolidayIsos, holidayInfo } =
    useBlockedHolidays();

  const selectedDate =
    value &&
    !Number.isNaN(
      parse(value, ISO_FORMAT, new Date()).getTime(),
    )
      ? parse(value, ISO_FORMAT, new Date())
      : undefined;

  const [open, setOpen] = useState(false);

  const [viewMonth, setViewMonth] = useState(
    selectedDate ?? new Date(),
  );

  const [tip, setTip] =
    useState<HolidayTip | null>(null);

  const lastIsoRef = useRef("");

  useEffect(() => {
    if (selectedDate) {
      setViewMonth(selectedDate);
    }
  }, [value]);

  /*
   * Same holiday/weekend logic as PunchDatePicker
   */
  const isDisabled = (iso: string) => {
    // Weekend
    if (isWeekendIso(iso)) {
      return true;
    }

    // Blocked holiday
    if (blockedHolidayIsos.has(iso)) {
      return true;
    }

    const holiday = holidayInfo.get(iso);

    // Non-optional holiday
    if (holiday && !holiday.isOptional) {
      return true;
    }

    // Optional holiday can be selected
    return false;
  };

  const cells = useMemo<DatePickerCell[]>(() => {
    const gridStart = startOfWeek(
      startOfMonth(viewMonth),
    );

    const gridEnd = endOfWeek(
      endOfMonth(viewMonth),
    );

    return eachDayOfInterval({
      start: gridStart,
      end: gridEnd,
    }).map((day) => {
      const iso = format(day, ISO_FORMAT);

      return {
        iso,
        day: day.getDate(),
        inMonth: isSameMonth(day, viewMonth),
        disabled: isDisabled(iso),
        selected: selectedDate
          ? isSameDay(day, selectedDate)
          : false,
      };
    });
  }, [
    viewMonth,
    value,
    blockedHolidayIsos,
    holidayInfo,
  ]);

  /*
   * Never allow disabled holiday/weekend selection
   */
  const handleSelectDay = (iso: string) => {
    if (isDisabled(iso)) {
      return;
    }

    onChange(iso);

    setViewMonth(
      parse(iso, ISO_FORMAT, new Date()),
    );

    setOpen(false);
    hideTip();
  };

  const hideTip = () => {
    lastIsoRef.current = "";
    setTip(null);
  };

  const getHoliday = (iso: string) => {
    return holidayInfo.get(iso);
  };

  /*
   * Find calendar button under mouse
   */
  const findCellButton = (
    target: HTMLElement,
    x: number,
    y: number,
  ): HTMLElement | null => {
    const direct = target.closest("button");

    if (
      direct &&
      direct.parentElement?.children.length ===
        cells.length
    ) {
      return direct as HTMLElement;
    }

    if (target.children.length === cells.length) {
      const match = Array.from(
        target.children,
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
   * Holiday hover
   */
  const handleCellHover = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
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
   * Holiday tooltip
   */
  const renderTip = () => {
    if (!open || !tip) {
      return null;
    }

    const tooltip = (
      <div
        className="pointer-events-none fixed z-[10000] w-max max-w-[240px]
          -translate-x-1/2 rounded-xl border border-violet-200
          bg-white shadow-[0_12px_32px_rgba(76,29,149,0.25)]"
        style={{
          left: tip.x,
          top:
            tip.top > 120
              ? tip.top - 10
              : tip.bottom + 10,
          transform:
            tip.top > 120
              ? "translate(-50%, -100%)"
              : "translateX(-50%)",
        }}
      >
        <div className="h-1 rounded-t-xl bg-gradient-to-r from-blue-500 to-violet-400" />

        <div className="flex items-start gap-3 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg">
            🎉
          </div>

          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-500">
              {tip.isOptional
                ? "Optional Holiday"
                : "Holiday"}
            </div>

            <div className="text-sm font-semibold text-slate-800">
              {tip.name}
            </div>

            <div className="mt-0.5 text-xs text-slate-500">
              {formatTipDate(tip.iso)}
            </div>

            <div
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                tip.isOptional
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {tip.isOptional
                ? "Date can be selected"
                : "Date cannot be selected"}
            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(
      tooltip,
      document.body,
    );
  };

  const text = selectedDate
    ? format(selectedDate, TEXT_FORMAT)
    : "";

  return (
    <>
      <div
        onMouseMove={handleCellHover}
        onMouseLeave={hideTip}
      >
        <DatePicker
          text={text}
          align={align}
          onTextChange={() => {
            // Manual typing disabled.
          }}
          onBlur={() => {}}
          placeholder="dd-mm-yyyy"
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);

            if (!nextOpen) {
              hideTip();
            }
          }}
          monthLabel={format(
            viewMonth,
            "MMMM yyyy",
          )}
          weekdayLabels={WEEKDAY_LABELS}
          cells={cells}
          onSelectDay={handleSelectDay}
          onPrevMonth={() =>
            setViewMonth((month) =>
              subMonths(month, 1),
            )
          }
          onNextMonth={() =>
            setViewMonth((month) =>
              addMonths(month, 1),
            )
          }
          onClear={() => {
            onChange("");
            hideTip();
          }}
          onToday={() => {
            const today = new Date();

            const iso = format(
              today,
              ISO_FORMAT,
            );

            if (!isDisabled(iso)) {
              handleSelectDay(iso);
            }
          }}
        />
      </div>

      {renderTip()}
    </>
  );
}