import type { ReactNode } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import DatePicker, { type DatePickerCell } from "@/components/ui/datepicker";

export type Option = { id: string; label: string };

interface DateFieldProps {
  id: string;
  label: string;
  placeholder: string;
  text: string;
  onTextChange: (v: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monthLabel: string;
  weekdayLabels: string[];
  cells: DatePickerCell[];
  onSelectDay: (iso: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onClear: () => void;
  onToday: () => void;
  closeOthers: () => void;
}

export function DateField(p: DateFieldProps) {
  return (
    <div className="flex flex-col w-full min-w-0 font-[Urbanist]">
      <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#131313] mb-2">
        <CalendarDays size={13} strokeWidth={2} />
        {p.label}
      </label>
      <DatePicker
        id={p.id}
        text={p.text}
        onTextChange={p.onTextChange}
        onBlur={() => {}}
        isInvalid={false}
        placeholder={p.placeholder}
        inputClassName="h-9 rounded-md border-[#E2E8F0] bg-[#F8FAFC] px-3 pr-10 text-sm text-[#131313] placeholder:text-gray-400 focus:border-[#7A5BED]"
        open={p.open}
        onOpenChange={(open) => {
          p.onOpenChange(open);
          if (open) p.closeOthers();
        }}
        monthLabel={p.monthLabel}
        weekdayLabels={p.weekdayLabels}
        cells={p.cells}
        onSelectDay={p.onSelectDay}
        onPrevMonth={p.onPrevMonth}
        onNextMonth={p.onNextMonth}
        onClear={p.onClear}
        onToday={p.onToday}
      />
    </div>
  );
}

interface DropdownProps {
  icon: ReactNode;
  label: string;
  value: string;
  options: Option[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function Dropdown(p: DropdownProps) {
  const selectedLabel = p.options.find((o) => o.id === p.value)?.label || p.placeholder || p.label;
  return (
    <div className="w-full min-w-0 font-[Urbanist]">
      <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#131313] mb-2">
        {p.icon}
        {p.label}
      </label>
      <div className="relative w-full min-w-0 max-w-full">
        <button
          type="button"
          onClick={p.onToggle}
          className="flex items-center justify-between w-full max-w-full min-w-0 h-9 px-3 border border-[#E2E8F0] rounded-md text-sm font-normal text-gray-400 outline-none focus:border-[#7A5BED] bg-[#F8FAFC] overflow-hidden"
        >
          <span className="min-w-0 truncate text-left">{selectedLabel}</span>
          <ChevronDown size={14} strokeWidth={2.25} className="ml-1 shrink-0 text-[#626262]" />
        </button>
        {p.open && (
          <div className="absolute left-0 right-0 top-full z-[100] mt-1 w-full max-w-full min-w-0 overflow-hidden rounded-md border border-[#E2E8F0] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            {p.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => p.onSelect(option.id)}
                className="block w-full max-w-full min-w-0 truncate px-2 py-2 text-left text-sm font-normal text-[#626262] hover:bg-[#F6F3FF] hover:text-[#7A5BED]"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}