import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isValid,
  isWeekend,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { DatePicker, type DatePickerCell } from "@/components/ui/datepicker";

const ISO_FORMAT = "yyyy-MM-dd";
const TEXT_FORMAT = "dd-MM-yyyy";
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * State + calendar-grid generation for the headless DatePicker. `value`/`onChange`
 * are ISO ("yyyy-MM-dd"), matching what backends and <input type="date"> both use.
 */
function useDatePicker(value: string, onChange: (iso: string) => void) {
  const selected = value ? parse(value, ISO_FORMAT, new Date()) : undefined;
  const validSelected = selected && isValid(selected) ? selected : undefined;

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(validSelected ?? new Date());
  const [text, setText] = useState(validSelected ? format(validSelected, TEXT_FORMAT) : "");
  const [previousValue, setPreviousValue] = useState(value);

  // Stay in sync when `value` changes from outside the picker (e.g. a reset).
  if (value !== previousValue) {
    setPreviousValue(value);
    setText(validSelected ? format(validSelected, TEXT_FORMAT) : "");
    if (validSelected) setViewMonth(validSelected);
  }

  const cells = useMemo<DatePickerCell[]>(() => {
    const gridStart = startOfWeek(startOfMonth(viewMonth));
    const gridEnd = endOfWeek(endOfMonth(viewMonth));
    return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((day) => ({
      iso: format(day, ISO_FORMAT),
      day: day.getDate(),
      inMonth: isSameMonth(day, viewMonth),
      disabled: false,
      isweekend: isWeekend(day),
      selected: validSelected ? isSameDay(day, validSelected) : false,
    }));
  }, [viewMonth, validSelected]);

  const commit = (date: Date) => {
    onChange(format(date, ISO_FORMAT));
    setViewMonth(date);
    setText(format(date, TEXT_FORMAT));
  };

  return {
    text,
    onTextChange: (raw: string) => {
      setText(raw);
      const parsed = parse(raw, TEXT_FORMAT, new Date());
      if (raw.length === TEXT_FORMAT.length && isValid(parsed)) commit(parsed);
    },
    onBlur: () => setText(validSelected ? format(validSelected, TEXT_FORMAT) : ""),
    isInvalid: text.length > 0 && !isValid(parse(text, TEXT_FORMAT, new Date())),
    placeholder: "dd-mm-yyyy",

    open,
    onOpenChange: setOpen,

    monthLabel: format(viewMonth, "MMMM yyyy"),
    weekdayLabels: WEEKDAY_LABELS,
    cells,

    onSelectDay: (iso: string) => {
      commit(parse(iso, ISO_FORMAT, new Date()));
      setOpen(false);
    },
    onPrevMonth: () => setViewMonth((month) => subMonths(month, 1)),
    onNextMonth: () => setViewMonth((month) => addMonths(month, 1)),
    onClear: () => {
      onChange("");
      setText("");
    },
    onToday: () => {
      commit(new Date());
      setOpen(false);
    },
  };
}

interface DateFieldProps {
  label?: string;
  value: string;
  onChange: (iso: string) => void;
  className?: string;
  inputClassName?: string;
  align?: "left" | "right";
  /** Called when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Use fixed positioning so the calendar is not clipped by a scrolling parent. */
  fixedCalendarPosition?: boolean;
}

/** Wraps the shared DatePicker + useDatePicker so callers just pass an ISO value/onChange, like a native date input. */
export default function DateField({
  label,
  value,
  onChange,
  className,
  inputClassName,
  align,
  onOpenChange,
  fixedCalendarPosition,
}: DateFieldProps) {
  const picker = useDatePicker(value, onChange);

  return (
    <label className={className ?? "flex items-center gap-2 text-sm text-slate-600"}>
      {label}
      <DatePicker
        {...picker}
        align={align}
        inputClassName={inputClassName}
        fixedPosition={fixedCalendarPosition}
        onOpenChange={(open) => {
          picker.onOpenChange(open);
          onOpenChange?.(open);
        }}
      />
    </label>
  );
}
