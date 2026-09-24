// import {  useState } from "react";

// import DatePicker, { type DatePickerCell } from "@/components/ui/datepicker";

// import { isWeekendIso } from "../constants/leave.constants";

// import type { DateFieldProps } from "../types/leave.types";

// const toDisplay = (iso: string) => {
//   if (!iso) return "";

//   const [year, month, day] = iso.split("-");

//   return `${day}-${month}-${year}`;
// };

// // Formats digits as the user types: 12062026 -> 12-06-2026
// const maskDigits = (digits: string) => {
//   const parts = [
//     digits.slice(0, 2),
//     digits.slice(2, 4),
//     digits.slice(4, 8),
//   ].filter(Boolean);

//   return parts.join("-");
// };

// // Returns "" unless the 8 digits form a real calendar date.
// const digitstoIso = (digits: string) => {
//   if (digits.length !== 8) return "";

//   const day = Number(digits.slice(0, 2));
//   const month = Number(digits.slice(2, 4));
//   const year = Number(digits.slice(4, 8));

//   const parsed = new Date(year, month - 1, day);

//   // Rejects 31-02-2026 and friends, which Date silently rolls over.
//   const isRealDate =
//     parsed.getFullYear() === year &&
//     parsed.getMonth() === month - 1 &&
//     parsed.getDate() === day;

//   if (!isRealDate) return "";

//   return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
// };

// const isWithinRange = (
//   iso: string,
//   min?: string,
//   max?: string
// ) => {
//   if (min && iso < min) return false;
//   if (max && iso > max) return false;

//   return true;
// };

// const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// const pad = (n: number) => `${n}`.padStart(2, "0");

// const toIsoFromParts = (year: number, monthIndex: number, day: number) =>
//   `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

// // The month the calendar should open on: the selected value, else the
// // caller's hint, else today.
// const toMonthStart = (value: string, initialMonth?: string) => {
//   const base = value
//     ? new Date(`${value}T00:00:00`)
//     : initialMonth
//       ? new Date(`${initialMonth}T00:00:00`)
//       : new Date();
 
//   return new Date(base.getFullYear(), base.getMonth(), 1);
// };

// export default function DateField({
//   value,
//   onChange,
//   min,
//   max,
//   id,
//   isInvalid,
//   initialMonth,
//   holidays,
//   inputClassName,

// }: DateFieldProps) {
//   const [text, setText] = useState(() => toDisplay(value));

//   const [open, setOpen] = useState(false);

//   const [viewDate, setViewDate] = useState(() =>
//     toMonthStart(value, initialMonth)
//   );
 
//   const [lastSync, setLastSync] = useState(`${value}|${initialMonth ?? ""}`);
 
//   if (lastSync !== `${value}|${initialMonth ?? ""}`) {
//     setLastSync(`${value}|${initialMonth ?? ""}`);
//     setText(toDisplay(value));
//     setViewDate(toMonthStart(value, initialMonth));
//   }

//   const isDisabled = (iso: string) => {
//     if (!isWithinRange(iso, min, max)) return true;
//     if (isWeekendIso(iso)) return true;
//     return false;
//   }; const handleTextChange = (raw: string) => {
//     const digits = raw.replace(/\D/g, "").slice(0, 8);

//     // Validate day
//     if (digits.length >= 2) {
//       const day = Number(digits.slice(0, 2));
//       if (day < 1 || day > 31) return;
//     }

//     // Validate month
//     if (digits.length >= 4) {
//       const month = Number(digits.slice(2, 4));
//       if (month < 1 || month > 12) return;
//     }

//     setText(maskDigits(digits));

//     if (digits.length === 0) {
//       onChange("");
//       return;
//     }

//     const iso = digitstoIso(digits);

//     if (!iso) {
//       return;
//     }

//     if (isDisabled(iso)) {
//       // Reject the typed date
//       setText(toDisplay(value));
//       return;
//     }

//     onChange(iso);

//   };
//   // Snap back to the last committed value if the user leaves the field
//   // holding something incomplete, impossible, or out of range.
//   const handleBlur = () => {
//     const digits = text.replace(/\D/g, "");

//     if (digits.length === 0) return;

//     const iso = digitstoIso(digits);

//     if (!iso || !isDisabled(iso)) {
//       setText(toDisplay(value));
//     }
//   };

//   const handleSelectDay = (iso: string) => {
//     if (isDisabled(iso)) return;
//     onChange(iso);
//     setText(toDisplay(iso));
//     setOpen(false);
//   };

//   const handleClear = () => {
//     onChange("");
//     setText("");
//     setOpen(false);
//   };

//   const handleToday = () => {
//     const today = new Date();
//     const iso = toIsoFromParts(today.getFullYear(), today.getMonth(), today.getDate());
//     if (isDisabled(iso)) return;
//     setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
//     handleSelectDay(iso);
//   };

//   const handlePrevMonth = () => {
//     setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
//   };

//   const handleNextMonth = () => {
//     setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
//   };

//   const year = viewDate.getFullYear();
//   const month = viewDate.getMonth();
//   const firstOfMonth = new Date(year, month, 1);
//   const startOffset = firstOfMonth.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const daysInPrevMonth = new Date(year, month, 0).getDate();

//   const cells: DatePickerCell[] = [];

//   for (let i = startOffset - 1; i >= 0; i--) {
//     const day = daysInPrevMonth - i;
//     const prevMonthIndex = month === 0 ? 11 : month - 1;
//     const prevYear = month === 0 ? year - 1 : year;
//     const iso = toIsoFromParts(prevYear, prevMonthIndex, day);
//     cells.push({ iso, day, inMonth: false, disabled: isDisabled(iso), selected: iso === value });
//   }

//   for (let day = 1; day <= daysInMonth; day++) {
//     const iso = toIsoFromParts(year, month, day);
//     cells.push({ iso, day, inMonth: true, disabled: isDisabled(iso), selected: iso === value });
//   }

//   while (cells.length % 7 !== 0) {
//     const last = cells[cells.length - 1];
//     const nextDate = new Date(`${last.iso}T00:00:00`);
//     nextDate.setDate(nextDate.getDate() + 1);
//     const iso = toIsoFromParts(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
//     cells.push({
//       iso,
//       day: nextDate.getDate(),
//       inMonth: false,
//       disabled: isDisabled(iso),
//       selected: iso === value,
//     });
//   }

//   const monthLabel = viewDate.toLocaleDateString("en-US", {
//     month: "long",
//     year: "numeric",
//   });

//   const handleCellHover = (event: React.MouseEvent<HTMLDivElement>) => {
//     const button = (event.target as HTMLElement).closest("button");
//     const grid = button?.parentElement;
 
//     if (!button || !grid || grid.children.length !== cells.length) return;
 
//     const index = Array.prototype.indexOf.call(grid.children, button);
//     const iso = cells[index]?.iso;
 
//     button.title = (iso && holidays?.get(iso)?.name) || "";
//   };

//   return (
//     <div onMouseOver={handleCellHover}>
//     <DatePicker
//       id={id}
//       text={text}
//       onTextChange={handleTextChange}
//       onBlur={handleBlur}
//       isInvalid={isInvalid}
//       inputClassName={inputClassName}
//       open={open}
//       onOpenChange={setOpen}
//       monthLabel={monthLabel}
//       weekdayLabels={WEEKDAY_LABELS}
//       cells={cells}
//       onSelectDay={handleSelectDay}
//       onPrevMonth={handlePrevMonth}
//       onNextMonth={handleNextMonth}
//       onClear={handleClear}
//       onToday={handleToday}
//     />
//     </div>
//   );
// }












 
// 🔴 CHANGED: added useRef + createPortal for the holiday hover popup
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
 
import DatePicker, { type DatePickerCell } from "@/components/ui/datepicker";
 
import { isWeekendIso } from "../constants/leave.constants";
import { useBlockedHolidays } from "../hooks/useBlockedHolidays"; // 🔴 CHANGED (1 of 3): import hook
 
import type { DateFieldProps } from "../types/leave.types";
 
const toDisplay = (iso: string) => {
  if (!iso) return "";
 
  const [year, month, day] = iso.split("-");
 
  return `${day}-${month}-${year}`;
};
 
// Formats digits as the user types: 12062026 -> 12-06-2026
const maskDigits = (digits: string) => {
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 4),
    digits.slice(4, 8),
  ].filter(Boolean);
 
  return parts.join("-");
};
 
// Returns "" unless the 8 digits form a real calendar date.
const digitstoIso = (digits: string) => {
  if (digits.length !== 8) return "";
 
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
 
  const parsed = new Date(year, month - 1, day);
 
  // Rejects 31-02-2026 and friends, which Date silently rolls over.
  const isRealDate =
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day;
 
  if (!isRealDate) return "";
 
  return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
};
 
const isWithinRange = (
  iso: string,
  min?: string,
  max?: string
) => {
  if (min && iso < min) return false;
  if (max && iso > max) return false;
 
  return true;
};
 
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
 
const pad = (n: number) => `${n}`.padStart(2, "0");
 
const toIsoFromParts = (year: number, monthIndex: number, day: number) =>
  `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
 
// The month the calendar should open on: the selected value, else the
// caller's hint, else today.
const toMonthStart = (value: string, initialMonth?: string) => {
  const base = value
    ? new Date(`${value}T00:00:00`)
    : initialMonth
      ? new Date(`${initialMonth}T00:00:00`)
      : new Date();
 
  return new Date(base.getFullYear(), base.getMonth(), 1);
};
 
// 🔴🔴🔴 CHANGED (START): data for the holiday hover popup
interface HolidayTip {
  iso: string;
  name: string;
  isOptional: boolean;
  x: number; // center of the hovered date cell
  top: number;
  bottom: number;
}
 
const formatTipDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
// 🔴🔴🔴 CHANGED (END)
 
export default function DateField({
  value,
  onChange,
  min,
  max,
  id,
  isInvalid,
  initialMonth,
  holidays,
  inputClassName,
 
}: DateFieldProps) {
  const { blockedHolidayIsos, holidayInfo } = useBlockedHolidays(); // 🔴 CHANGED (2 of 3): holiday dates + names from hook
 
  const [text, setText] = useState(() => toDisplay(value));
 
  const [open, setOpen] = useState(false);
 
  const [viewDate, setViewDate] = useState(() =>
    toMonthStart(value, initialMonth)
  );
 
  const [lastSync, setLastSync] = useState(`${value}|${initialMonth ?? ""}`);
 
  if (lastSync !== `${value}|${initialMonth ?? ""}`) {
    setLastSync(`${value}|${initialMonth ?? ""}`);
    setText(toDisplay(value));
    setViewDate(toMonthStart(value, initialMonth));
  }
 
  const isDisabled = (iso: string) => {
    if (!isWithinRange(iso, min, max)) return true;
    // if (isWeekendIso(iso)) return true;
    // return false;
 
        if (isWeekendIso(iso)) return true;
 
    if (blockedHolidayIsos.has(iso)) return true; // 🔴 CHANGED (3 of 3): holidays disabled like weekends
 
    // 🔴 CHANGED: block holidays (optional holidays stay selectable)
    const holiday = holidays?.get(iso);
    if (holiday && !holiday.isOptional) return true;
 
    return false;
  }; const handleTextChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
 
    // Validate day
    if (digits.length >= 2) {
      const day = Number(digits.slice(0, 2));
      if (day < 1 || day > 31) return;
    }
 
    // Validate month
    if (digits.length >= 4) {
      const month = Number(digits.slice(2, 4));
      if (month < 1 || month > 12) return;
    }
 
    setText(maskDigits(digits));
 
    if (digits.length === 0) {
      onChange("");
      return;
    }
 
    const iso = digitstoIso(digits);
 
    if (!iso) {
      return;
    }
 
    if (isDisabled(iso)) {
      // Reject the typed date
      setText(toDisplay(value));
      return;
    }
 
    onChange(iso);
 
  };
  // Snap back to the last committed value if the user leaves the field
  // holding something incomplete, impossible, or out of range.
  const handleBlur = () => {
    const digits = text.replace(/\D/g, "");
 
    if (digits.length === 0) return;
 
    const iso = digitstoIso(digits);
 
    if (!iso || !isDisabled(iso)) {
      setText(toDisplay(value));
    }
  };
 
  const handleSelectDay = (iso: string) => {
    if (isDisabled(iso)) return;
    onChange(iso);
    setText(toDisplay(iso));
    setOpen(false);
  };
 
  const handleClear = () => {
    onChange("");
    setText("");
    setOpen(false);
  };
 
  const handleToday = () => {
    const today = new Date();
    const iso = toIsoFromParts(today.getFullYear(), today.getMonth(), today.getDate());
    if (isDisabled(iso)) return;
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    handleSelectDay(iso);
  };
 
  const handlePrevMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
 
  const handleNextMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };
 
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
 
  const cells: DatePickerCell[] = [];
 
  for (let i = startOffset - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthIndex = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const iso = toIsoFromParts(prevYear, prevMonthIndex, day);
    cells.push({ iso, day, inMonth: false, disabled: isDisabled(iso), selected: iso === value });
  }
 
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = toIsoFromParts(year, month, day);
    cells.push({ iso, day, inMonth: true, disabled: isDisabled(iso), selected: iso === value });
  }
 
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1];
    const nextDate = new Date(`${last.iso}T00:00:00`);
    nextDate.setDate(nextDate.getDate() + 1);
    const iso = toIsoFromParts(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
    cells.push({
      iso,
      day: nextDate.getDate(),
      inMonth: false,
      disabled: isDisabled(iso),
      selected: iso === value,
    });
  }
 
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
 
  // ======================================================
  // 🔴🔴🔴 CHANGED (START): HOLIDAY HOVER POPUP
  // Hover a holiday date in the calendar -> a small card shows the
  // holiday name (replaces the old plain browser "title" tooltip).
  // ======================================================
 
  const [tip, setTip] = useState<HolidayTip | null>(null);
  const lastIsoRef = useRef("");
 
  // name comes from the holiday API (hook); falls back to the `holidays` prop
  const getHoliday = (iso: string) => holidayInfo.get(iso) ?? holidays?.get(iso);
 
  const hideTip = () => {
    lastIsoRef.current = "";
    setTip(null);
  };
 
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) hideTip();
  };
 
  // Finds the date-cell button under the mouse. If the calendar disables
  // pointer events on disabled cells, the grid itself is the event target,
  // so fall back to hit-testing by mouse position.
  const findCellButton = (
    target: HTMLElement,
    x: number,
    y: number
  ): HTMLElement | null => {
    const direct = target.closest("button");
 
    if (direct && direct.parentElement?.children.length === cells.length) {
      return direct as HTMLElement;
    }
 
    if (target.children.length === cells.length) {
      const match = Array.from(target.children).find((child) => {
        const r = child.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      });
 
      return (match as HTMLElement | undefined) ?? null;
    }
 
    return null;
  };
 
  const handleCellHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const button = findCellButton(
      event.target as HTMLElement,
      event.clientX,
      event.clientY
    );
 
    if (!button || !button.parentElement) {
      if (lastIsoRef.current) hideTip();
      return;
    }
 
    const index = Array.prototype.indexOf.call(
      button.parentElement.children,
      button
    );
    const iso = cells[index]?.iso;
    const holiday = iso ? getHoliday(iso) : undefined;
 
    if (!iso || !holiday) {
      if (lastIsoRef.current) hideTip();
      return;
    }
 
    if (lastIsoRef.current === iso) return; // already showing this one
 
    lastIsoRef.current = iso;
 
    const rect = button.getBoundingClientRect();
 
    setTip({
      iso,
      name: holiday.name,
      isOptional: holiday.isOptional,
      x: rect.left + rect.width / 2,
      top: rect.top,
      bottom: rect.bottom,
    });
  };
 
  // The popup is drawn in <body> so the calendar never clips it.
  const renderTip = () => {
    if (!open || !tip) return null;
 
    const HALF_W = 120;
    const clampedX = Math.min(
      Math.max(tip.x, HALF_W + 8),
      window.innerWidth - HALF_W - 8
    );
    const showBelow = tip.top < 110; // no room above -> open below the date
    const arrowLeft = `calc(50% + ${tip.x - clampedX}px)`;
 
    return createPortal(
      <div
        style={{
          position: "fixed",
          left: clampedX,
          top: showBelow ? tip.bottom + 10 : tip.top - 10,
          transform: showBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)",
          zIndex: 99999,
          pointerEvents: "none",
        }}
      >
        <style>{`@keyframes holidayTipIn{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
 
        <div
          className="relative w-60"
          style={{ animation: "holidayTipIn .16s ease-out" }}
        >
          <div className="overflow-hidden rounded-xl border border-violet-200 bg-white shadow-[0_12px_32px_rgba(76,29,149,0.25)]">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-violet-400" />
 
            <div className="flex items-start gap-3 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg">
                🎉
              </div>
 
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-500">
                  {tip.isOptional ? "Optional Holiday" : "Holiday"}
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
 
          {/* little arrow pointing at the hovered date */}
          <div
            className={`absolute h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-white ${
              showBelow
                ? "-top-[5px] border-l border-t border-violet-200"
                : "-bottom-[5px] border-b border-r border-violet-200"
            }`}
            style={{ left: arrowLeft }}
          />
        </div>
      </div>,
      document.body
    );
  };
 
  // 🔴🔴🔴 CHANGED (END)
 
  return (
    // 🔴 CHANGED: onMouseOver -> onMouseMove (+ onMouseLeave) for the holiday popup
    <div onMouseMove={handleCellHover} onMouseLeave={hideTip}>
    <DatePicker
      id={id}
      text={text}
      onTextChange={handleTextChange}
      onBlur={handleBlur}
      isInvalid={isInvalid}
      inputClassName={inputClassName}
      open={open}
      onOpenChange={handleOpenChange} // 🔴 CHANGED: also hides the popup when the calendar closes
      monthLabel={monthLabel}
      weekdayLabels={WEEKDAY_LABELS}
      cells={cells}
      onSelectDay={handleSelectDay}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      onClear={handleClear}
      onToday={handleToday}
    />
    {renderTip() /* 🔴 CHANGED: the holiday popup */}
    </div>
  );
}
 