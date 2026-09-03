import { useEffect, useRef } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "./input";
import { Button } from "./button";
import { cn } from "@/lib/utils";
export interface DatePickerCell {
    iso: string;
    day: number;
    inMonth: boolean;
    disabled: boolean;
    selected: boolean;
}

export interface DatePickerProps {
    id?: string;
    text: string;
    onTextChange: (raw: string) => void;
    onBlur: () => void;
    isInvalid?: boolean;
    placeholder?: string;
    inputClassName?: string;
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
}

export function DatePicker({
    id,
    text,
    onTextChange,
    onBlur,
    isInvalid,
    placeholder = "dd-mm-yyyy",
    inputClassName,
    open,
    onOpenChange,
    monthLabel,
    weekdayLabels,
    cells,
    onSelectDay,
    onPrevMonth,
    onNextMonth,
    onClear,
    onToday,
}: DatePickerProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                // onOpenChange(false);
                onOpenChange?.(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onOpenChange?.(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open, onOpenChange]);

    return (
        <div className="relative" ref={wrapperRef}>
            <Input
                id={id}
                type="text"
                inputMode="numeric"
                placeholder={placeholder}
                value={text}
                aria-invalid={isInvalid}
                onChange={(e) => onTextChange(e.target.value)}
                // onFocus={() => onOpenChange(true)}
                onFocus={() => onOpenChange?.(true)}
                onBlur={onBlur}
                className={cn(
                    "h-12 rounded-xl border-slate-300 bg-white px-4 pr-10 text-sm",
                    inputClassName
                )}
            />

            <Button
                type="button"
                variant="ghost"
                size="sm"
                tabIndex={-1}
                aria-label="Open calendar"
                // onClick={() => onOpenChange(!open)}
                onClick={() => onOpenChange?.(!open)}
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 text-slate-500 hover:text-slate-700"
            >
                <CalendarDays className="h-4 w-4" />
            </Button>

            {open && (
                <div
    className="
        absolute
        z-50
        mt-2
        w-[calc(100vw-2rem)]
        max-w-72
        min-w-0
        rounded-xl
        border
        bg-white
        p-3
        shadow-lg
        sm:w-72
        sm:p-4
    "
    // style={{ borderColor: "var(--primary-border)" }}
>
                   <div className="mb-2 flex items-center justify-between sm:mb-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onPrevMonth}
                            className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="truncate px-1 text-xs font-semibold text-slate-800 sm:text-sm">
                            {monthLabel}
                        </span>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onNextMonth}
                            className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                   <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-medium text-slate-500 sm:text-xs">
                        {weekdayLabels.map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
                        {cells.map((cell) => (
                            <Button
                                type="button"
                                key={cell.iso}
                                variant="ghost"
                                size="sm"
                                disabled={cell.disabled}
                                onClick={() => onSelectDay(cell.iso)}
                                className={`
  mx-auto flex h-8 w-8 items-center justify-center rounded-full p-0 text-xs font-normal transition-colors
  sm:h-9 sm:w-9 sm:text-sm

  ${cell.selected
                                        ? "font-semibold text-white"
                                        : cell.inMonth
                                            ? "text-slate-700 hover:bg-slate-100"
                                            : "text-slate-400"
                                    }

  ${cell.disabled
                                        ? "cursor-not-allowed opacity-60"
                                        : ""
                                    }
`}
                                style={
                                    cell.selected
                                        ? {
                                            background: "var(--primary-color)",
                                        }
                                        : undefined
                                }
                            >
                                {cell.day}
                            </Button>
                        ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onClear}
                            className="h-8 px-2 font-normal text-slate-500 hover:text-slate-700"
                        >
                            Clear
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onToday}
                            className="h-8 px-2 font-medium"
                            style={{ color: "var(--primary-color)" }}
                        >
                            Today
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DatePicker;