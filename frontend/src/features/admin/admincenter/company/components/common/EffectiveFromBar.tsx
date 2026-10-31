import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DatePicker, type DatePickerCell } from "@/components/ui/datepicker";

type EffectiveFromBarProps = {
  /** Full date in "YYYY-MM-DD" format (as returned by the configuration GET). */
  value: string;
  onChange: (value: string) => void;
  id?: string;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** "2026-09-19" -> "19-09-2026" */
function isoToDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}-${m}-${y}`;
}

function toIso(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function getDateCells(
  year: number,
  month: number,
  selectedIso: string,
): DatePickerCell[] {
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells: DatePickerCell[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const iso = toIso(new Date(year, month - 1, day));
    cells.push({ iso, day, inMonth: false, disabled: false, selected: iso === selectedIso });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${pad2(month + 1)}-${pad2(day)}`;
    cells.push({ iso, day, inMonth: true, disabled: false, selected: iso === selectedIso });
  }
  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const iso = toIso(new Date(year, month + 1, day));
    cells.push({ iso, day, inMonth: false, disabled: false, selected: iso === selectedIso });
  }
  return cells;
}

export function EffectiveFromBar({
  value,
  onChange,
  id = "effectiveFrom",
}: EffectiveFromBarProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Open the calendar on the month of the date coming from the DB
  useEffect(() => {
    const [y, m] = value.split("-");
    if (y && m) {
      setViewYear(Number(y));
      setViewMonth(Number(m) - 1);
    }
  }, [value]);

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleSelectDay(iso: string) {
    onChange(iso);
    setOpen(false);
  }

  function handleToday() {
    onChange(toIso(new Date()));
    setOpen(false);
  }

  function handleClear() {
    onChange("");
    setOpen(false);
  }

  return (
    <div className="mb-6 rounded-xl bg-[#ECE7FF] p-3 sm:mb-8 sm:p-4">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-3">
        {/* Label */}
        <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ECE7FF] bg-white sm:h-12 sm:w-12">
            <CalendarDays className="h-5 w-5 text-[#7A5BED]" />
          </div>
          <Label
            htmlFor={id}
            className="whitespace-nowrap text-[13px] font-medium leading-5 text-[#2E2E2E]"
          >
            Effective From
          </Label>
        </div>

        {/* Date picker: centered on desktop, full width below the label on mobile */}
        <div className="col-span-2 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
          <div className="mx-auto w-full sm:max-w-[12rem]">
            <DatePicker
              id={id}
              text={isoToDisplay(value)}
              onTextChange={() => {}}
              onBlur={() => {}}
              open={open}
              onOpenChange={setOpen}
              monthLabel={`${MONTH_NAMES[viewMonth]} ${viewYear}`}
              weekdayLabels={WEEKDAY_LABELS}
              cells={getDateCells(viewYear, viewMonth, value)}
              onSelectDay={handleSelectDay}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onClear={handleClear}
              onToday={handleToday}
              inputClassName="h-10"
            />
          </div>
        </div>

        {/* Clock icon */}
        <div className="col-start-2 row-start-1 flex justify-end sm:col-start-3">
          <Clock className="h-5 w-5 text-[#626262]" />
        </div>
      </div>
    </div>
  );
}

export default EffectiveFromBar;