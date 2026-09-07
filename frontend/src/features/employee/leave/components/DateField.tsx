import {  useState } from "react";

import DatePicker, { type DatePickerCell } from "@/components/ui/datepicker";

import { isWeekendIso } from "../constants/leave.constants";

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
    if (isWeekendIso(iso)) return true;
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

  const handleCellHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const button = (event.target as HTMLElement).closest("button");
    const grid = button?.parentElement;
 
    if (!button || !grid || grid.children.length !== cells.length) return;
 
    const index = Array.prototype.indexOf.call(grid.children, button);
    const iso = cells[index]?.iso;
 
    button.title = (iso && holidays?.get(iso)?.name) || "";
  };

  return (
    <div onMouseOver={handleCellHover}>
    <DatePicker
      id={id}
      text={text}
      onTextChange={handleTextChange}
      onBlur={handleBlur}
      isInvalid={isInvalid}
      inputClassName={inputClassName}
      open={open}
      onOpenChange={setOpen}
      monthLabel={monthLabel}
      weekdayLabels={WEEKDAY_LABELS}
      cells={cells}
      onSelectDay={handleSelectDay}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      onClear={handleClear}
      onToday={handleToday}
    />
    </div>
  );
}
