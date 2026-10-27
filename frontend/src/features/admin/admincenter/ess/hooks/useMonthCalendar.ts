import { useMemo, useState } from "react";
import type { DatePickerCell } from "@/components/ui/datepicker";

// =====================================================
// useMonthCalendar
// -----------------------------------------------------
// Shared date-grid logic for every ESS "Date" field that
// uses the "@/components/ui/datepicker" DatePicker. Keeps
// the DD-MM-YYYY <-> Date <-> ISO conversions and the
// 35/42-cell month grid in one place instead of duplicating
// this math in every module's form.
// =====================================================

export const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

export function formatISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDate(value: string): Date | null {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length !== 3) return null;

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);
  if (!day || !month || !year || String(year).length !== 4) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function useMonthCalendar(dateText: string) {
  const [calendarDate, setCalendarDate] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const monthLabel = calendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells: DatePickerCell[] = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const selectedDate = parseDate(dateText);
    const result: DatePickerCell[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      result.push({ iso: formatISO(date), day, inMonth: false, disabled: false, selected: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const selected =
        selectedDate !== null &&
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === day;
      result.push({ iso: formatISO(date), day, inMonth: true, disabled: false, selected });
    }

    // keep the grid compact: 5 weeks unless the month needs 6
    let nextDay = 1;
    const maxCells = firstDay + daysInMonth > 35 ? 42 : 35;
    while (result.length < maxCells) {
      const date = new Date(year, month + 1, nextDay);
      result.push({ iso: formatISO(date), day: nextDay, inMonth: false, disabled: false, selected: false });
      nextDay++;
    }

    return result;
  }, [calendarDate, dateText]);

  const goToMonthOf = (date: Date) =>
    setCalendarDate(new Date(date.getFullYear(), date.getMonth(), 1));

  const goPrevMonth = () =>
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const goNextMonth = () =>
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const resetToToday = () => goToMonthOf(new Date());

  return {
    calendarDate,
    monthLabel,
    weekdayLabels: WEEKDAY_LABELS,
    cells,
    goToMonthOf,
    goPrevMonth,
    goNextMonth,
    resetToToday,
  };
}

export default useMonthCalendar;