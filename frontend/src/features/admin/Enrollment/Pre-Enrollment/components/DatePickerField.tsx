import { useMemo } from "react";
import DatePicker from "@/components/ui/datepicker";
import type { DatePickerCell } from "@/components/ui/datepicker";
import type { UseDatePickerResult } from "../hooks/useDatePicker";

interface DatePickerFieldProps {
  id?: string;
  label: string;
  datePicker: UseDatePickerResult;
}

export default function DatePickerField({
  id,
  label,
  datePicker,
}: DatePickerFieldProps) {
  const placeholder = useMemo(() => "DD/MM/YYYY", []);

  return (
    <label className="flex w-full min-w-0 flex-col gap-2 text-sm text-slate-700">
      {label && <span className="whitespace-nowrap">{label}</span>}

      <div className="w-full min-w-0">
        <DatePicker
          id={id}
          text={datePicker.text}
          onTextChange={datePicker.onTextChange}
          onBlur={datePicker.onBlur}
          open={datePicker.open}
          onOpenChange={datePicker.onOpenChange}
          monthLabel={datePicker.monthLabel}
          weekdayLabels={datePicker.weekdayLabels}
          cells={datePicker.cells as DatePickerCell[]}
          onSelectDay={datePicker.onSelectDay}
          onPrevMonth={datePicker.onPrevMonth}
          onNextMonth={datePicker.onNextMonth}
          onClear={datePicker.onClear}
          onToday={datePicker.onToday}
          placeholder={placeholder}
          isInvalid={false}
          align={id === "to-month" ? "right" : "left"}
        />
      </div>
    </label>
  );
}
