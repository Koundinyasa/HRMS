import { useEffect, useMemo, useState } from "react";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
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

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

const MONTH_NAME_MAP: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function parseDate(value: string): Date | null {
  const normalized = value.trim();
  if (!normalized) return null;

  const makeDate = (year: number, month: number, day: number) => {
    // Date normalizes out-of-range values (e.g. month 55) instead of rejecting
    // them, so verify the resulting components match the user's input.
    if (!Number.isInteger(year) || year < 1000 || year > 9999) return null;
    if (!Number.isInteger(month) || month < 1 || month > 12) return null;
    if (!Number.isInteger(day) || day < 1 || day > 31) return null;

    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
      ? date
      : null;
  };

  const slashParts = normalized.split("/");
  const dashParts = normalized.split("-");

  if (slashParts.length === 3) {
    const [left, middle, right] = slashParts;
    const day = Number(left);
    const year = Number(right);

    if (!Number.isNaN(day) && !Number.isNaN(year)) {
      const monthFromNumber = Number(middle);
      if (!Number.isNaN(monthFromNumber)) {
        return makeDate(year, monthFromNumber, day);
      }

      const monthFromName = MONTH_NAME_MAP[middle.charAt(0).toUpperCase() + middle.slice(1)];
      if (monthFromName !== undefined) {
        return makeDate(year, monthFromName + 1, day);
      }
    }
  }

  if (dashParts.length === 3) {
    const parts = dashParts.map((part) => Number(part));
    if (dashParts[0].length === 4) {
      const [year, month, day] = parts;
      return makeDate(year, month, day);
    }
    const [day, month, year] = parts;
    return makeDate(year, month, day);
  }

  return null;
}

function formatDate(date: Date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatInput(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function formatIso(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseIso(iso: string): Date | null {
  const parts = iso.split("-");
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map((part) => Number(part));
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  copy.setDate(copy.getDate() - day);
  return copy;
}

export interface DatePickerCell {
  iso: string;
  day: number;
  inMonth: boolean;
  disabled: boolean;
  isWeekend: boolean;
  selected: boolean;
}

export interface UseDatePickerResult {
  text: string;
  open: boolean;
  monthLabel: string;
  weekdayLabels: string[];
  cells: DatePickerCell[];
  onTextChange: (raw: string) => void;
  onBlur: () => void;
  onOpenChange: (value: boolean) => void;
  onSelectDay: (iso: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onClear: () => void;
  onToday: () => void;
}

function normalizeIso(raw: string): string | undefined {
  const date = parseDate(raw);
  return date ? formatIso(date) : undefined;
}

export function useDatePicker(initialValue: string, onValueChange: (value: string) => void): UseDatePickerResult {
  const [text, setText] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [selectedIso, setSelectedIso] = useState<string | undefined>(() => normalizeIso(initialValue));
  const [monthStart, setMonthStart] = useState(() => {
    const date = parseDate(initialValue) ?? new Date();
    return startOfMonth(date);
  });

  useEffect(() => {
    setText(initialValue);
    const iso = normalizeIso(initialValue);
    setSelectedIso(iso);
    if (iso) {
      const date = parseIso(iso);
      if (date) {
        setMonthStart(startOfMonth(date));
      }
    }
  }, [initialValue]);

  const monthLabel = `${MONTH_LABELS[monthStart.getMonth()]} ${monthStart.getFullYear()}`;

  const cells = useMemo(() => {
    const start = startOfWeek(monthStart);
    const end = addMonths(monthStart, 1);
    end.setDate(0);
    const endOfGrid = new Date(start);
    endOfGrid.setDate(start.getDate() + 41);

    return Array.from({ length: 42 }, (_, index) => {
      const cellDate = new Date(start);
      cellDate.setDate(start.getDate() + index);
      const iso = formatIso(cellDate);
      const inMonth = cellDate.getMonth() === monthStart.getMonth();
      return {
        iso,
        day: cellDate.getDate(),
        inMonth,
        disabled: false,
        isWeekend: cellDate.getDay() === 0 || cellDate.getDay() === 6,
        selected: selectedIso === iso,
      };
    });
  }, [monthStart, selectedIso]);

  const handleTextChange = (raw: string) => {
    const formattedInput = formatInput(raw);
    setText(formattedInput);
    const validIso = normalizeIso(formattedInput);
    if (validIso) {
      const validDate = parseIso(validIso);
      if (validDate) {
        setSelectedIso(validIso);
        setMonthStart(startOfMonth(validDate));
      }
    } else {
      setSelectedIso(undefined);
    }
    onValueChange(formattedInput);
  };

  const handleBlur = () => {
    const iso = normalizeIso(text);
    if (iso) {
      const date = parseIso(iso);
      if (date) {
        const formatted = formatDate(date);
        setSelectedIso(iso);
        setMonthStart(startOfMonth(date));
        onValueChange(formatted);
        setText(formatted);
      }
    } else if (text) {
      // Do not retain malformed values such as 20/26/5757 after leaving the field.
      setText("");
      setSelectedIso(undefined);
      onValueChange("");
    }
  };

  const handleSelectDay = (iso: string) => {
    const date = parseIso(iso);
    if (!date) return;
    const formatted = formatDate(date);
    setSelectedIso(iso);
    setText(formatted);
    setOpen(false);
    onValueChange(formatted);
  };

  const handlePrevMonth = () => setMonthStart((current) => addMonths(current, -1));
  const handleNextMonth = () => setMonthStart((current) => addMonths(current, 1));
  const handleClear = () => {
    setText("");
    setSelectedIso(undefined);
    onValueChange("");
  };
  const handleToday = () => {
    const today = new Date();
    const iso = formatIso(today);
    setText(formatDate(today));
    setSelectedIso(iso);
    setMonthStart(startOfMonth(today));
    onValueChange(formatDate(today));
  };

  return {
    text,
    open,
    monthLabel,
    weekdayLabels: WEEKDAY_LABELS,
    cells,
    onTextChange: handleTextChange,
    onBlur: handleBlur,
    onOpenChange: setOpen,
    onSelectDay: handleSelectDay,
    onPrevMonth: handlePrevMonth,
    onNextMonth: handleNextMonth,
    onClear: handleClear,
    onToday: handleToday,
  };
}

