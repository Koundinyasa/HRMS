import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar, Clock3, ChevronLeft, ChevronRight } from "lucide-react";
 
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];
 
interface MonthPickerProps {
  value: string; // e.g. "Feb/2026", or "" if unset
  onChange: (value: string) => void;
  className?: string;
}
 
export function MonthPicker({ value, onChange, className = "" }: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);
 
  const [selectedMonth, selectedYear] = value ? value.split("/") : [null, null];
 
  const [viewYear, setViewYear] = React.useState(() =>
    selectedYear ? Number(selectedYear) : new Date().getFullYear()
  );
 
  React.useEffect(() => {
    if (selectedYear) setViewYear(Number(selectedYear));
  }, [selectedYear]);
 
  const handlePick = (month: string) => {
    onChange(`${month}/${viewYear}`);
    setOpen(false);
  };
 
  const handleClear = () => {
    onChange("");
    setOpen(false);
  };
 
  const handleThisMonth = () => {
    const now = new Date();
    const month = MONTHS[now.getMonth()];
    const year = now.getFullYear();
    setViewYear(year);
    onChange(`${month}/${year}`);
    setOpen(false);
  };
 
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={`relative h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-3 pr-14 text-left text-sm text-gray-800 outline-none focus:border-violet-500 data-[state=open]:border-violet-500 ${className}`}
        >
          {value || <span className="text-gray-400">Select month</span>}
          <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <Clock3 className="h-4 w-4 text-gray-400" />
          </span>
        </button>
      </PopoverPrimitive.Trigger>
 
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={6}
          className="z-50 w-64 rounded-xl border border-gray-100 bg-white p-3 shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between rounded-lg bg-gray-50 px-2 py-1.5">
            <button
              type="button"
              onClick={() => setViewYear((y) => y - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-gray-800">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
 
          <div className="grid grid-cols-4 gap-1.5">
            {MONTHS.map((month) => {
              const isSelected =
                selectedMonth === month && Number(selectedYear) === viewYear;
              return (
                <button
                  key={month}
                  type="button"
                  onClick={() => handlePick(month)}
                  className={`rounded-lg py-2 text-sm font-medium outline-none ${
                    isSelected
                      ? "bg-violet-600 text-white"
                      : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  {month}
                </button>
              );
            })}
          </div>
 
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleThisMonth}
              className="text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              This month
            </button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}