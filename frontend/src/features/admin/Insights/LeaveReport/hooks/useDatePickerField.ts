// LeaveReport/hooks/useDatePickerField.ts
import { useMemo, useRef, useState } from "react";
import type { DatePickerCell } from "@/components/ui/datepicker";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad2 = (n: number) => String(n).padStart(2, "0");

/** yyyy-mm-dd -> dd-mm-yyyy (for the text box) */
function isoToText(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}-${m}-${y}`;
}

/** dd-mm-yyyy -> yyyy-mm-dd. Returns "" if incomplete/invalid (e.g. 31-02-2026). */
function textToIso(text: string): string {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(text.trim());
  if (!match) return "";
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(year, month - 1, day);
  const valid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return valid ? `${yyyy}-${pad2(month)}-${pad2(day)}` : "";
}

function buildCells(
  viewYear: number,
  viewMonth: number,
  selectedIso: string,
  minIso?: string,
  maxIso?: string
): DatePickerCell[] {
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const gridStart = new Date(viewYear, viewMonth, 1 - firstOfMonth.getDay());

  const cells: DatePickerCell[] = [];
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + i);
    const iso = `${cellDate.getFullYear()}-${pad2(cellDate.getMonth() + 1)}-${pad2(cellDate.getDate())}`;
    cells.push({
      iso,
      day: cellDate.getDate(),
      inMonth: cellDate.getMonth() === viewMonth,
      disabled: (!!minIso && iso < minIso) || (!!maxIso && iso > maxIso),
      selected: iso === selectedIso,
    });
  }
  return cells;
}

export interface UseDatePickerFieldOptions {
  /** Selected date as yyyy-mm-dd, "" if unset — this is what you send to the API. */
  value: string;
  onChange: (iso: string) => void;
  /** Optional bounds as yyyy-mm-dd, e.g. wire toDate's minDate to fromDate. */
  minDate?: string;
  maxDate?: string;
}

export function useDatePickerField({ value, onChange, minDate, maxDate }: UseDatePickerFieldOptions) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => isoToText(value));
  const [isInvalid, setIsInvalid] = useState(false);

  const initial = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  // Keep the text box in sync if `value` changes from outside (e.g. a "Clear All" filter reset).
  const lastSyncedValue = useRef(value);
  if (lastSyncedValue.current !== value) {
    lastSyncedValue.current = value;
    setText(isoToText(value));
    setIsInvalid(false);
  }

  const monthLabel = `${MONTH_LABELS[viewMonth]} ${viewYear}`;

  const cells = useMemo(
    () => buildCells(viewYear, viewMonth, value, minDate, maxDate),
    [viewYear, viewMonth, value, minDate, maxDate]
  );

  const commitIso = (iso: string) => {
    onChange(iso);
    setText(isoToText(iso));
    setIsInvalid(false);
    if (iso) {
      const d = new Date(iso);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  };

  const handleBlur = () => {
    if (text.trim() === "") {
      onChange("");
      setIsInvalid(false);
      return;
    }
    const iso = textToIso(text);
    if (!iso || (minDate && iso < minDate) || (maxDate && iso > maxDate)) {
      setIsInvalid(true);
      return;
    }
    commitIso(iso);
  };

  const handlePrevMonth = () =>
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });

  const handleNextMonth = () =>
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });

  const handleToday = () => {
    const now = new Date();
    commitIso(`${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`);
  };

  return {
    value,
    pickerProps: {
      text,
      onTextChange: setText,
      onBlur: handleBlur,
      isInvalid,
      open,
      onOpenChange: setOpen,
      monthLabel,
      weekdayLabels: WEEKDAY_LABELS,
      cells,
      onSelectDay: (iso: string) => { commitIso(iso); setOpen(false); },
      onPrevMonth: handlePrevMonth,
      onNextMonth: handleNextMonth,
      onClear: () => commitIso(""),
      onToday: handleToday,
    },
  };
}