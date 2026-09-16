


 
import { useEffect, useRef } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
 
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
                    // ✅ STYLING CHANGE — rounded-2xl, purple focus ring + border-color transition to match the brand color on focus (was: "h-12 rounded-xl border-slate-300 bg-white px-4 pr-10 text-sm")
                    "h-12 rounded-2xl border-slate-300 bg-white px-4 pr-11 text-sm transition-all duration-150 focus:shadow-[0_0_0_4px_rgba(124,58,237,0.12)]",
                    inputClassName
                )}
                // ✅ STYLING CHANGE — dynamic focus border color using the theme's primary color variable
                style={{
                    borderColor: open ? "var(--primary-color)" : undefined,
                }}
            />
 
            <Button
                type="button"
                variant="ghost"
                size="sm"
                tabIndex={-1}
                aria-label="Open calendar"
                // onClick={() => onOpenChange(!open)}
                onClick={() => onOpenChange?.(!open)}
                // ✅ STYLING CHANGE — icon button now sits inside a soft rounded "chip" that tints purple when the picker is open
                className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full p-0 transition-colors"
                style={{
                    color: open ? "var(--primary-color)" : "#94A3B8",
                    backgroundColor: open ? "rgba(124,58,237,0.1)" : "transparent",
                }}
            >
                <CalendarDays className="h-4 w-4" />
            </Button>
 
            {open && (
  <div
    className="
      absolute
      left-0
      top-full
      z-[9999]
      mt-3
      w-80
      min-w-80
      overflow-hidden
      rounded-[22px]
      border
      border-slate-100
      bg-white
      shadow-[0_20px_50px_-12px_rgba(124,58,237,0.35)]
      ring-1
      ring-black/5
      animate-in
      fade-in
      zoom-in-95
      slide-in-from-top-2
      duration-200
    "
  >
                   {/* ✅ STYLING CHANGE — header is now a full purple gradient band (brand color), white text, replacing the plain flex row */}
                   <div
                       className="flex items-center justify-between px-3 py-3 sm:px-4"
                       style={{
                           background: "linear-gradient(135deg, var(--primary-color), #A78BFA)",
                       }}
                   >
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onPrevMonth}
                            // ✅ STYLING CHANGE — white icon on gradient header, translucent hover
                            className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/20 hover:text-white"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
 
                        {/* ✅ STYLING CHANGE — added a small sparkle icon + bold white month label for extra polish */}
                        <span className="flex items-center gap-1.5 truncate px-1 text-xs font-bold tracking-wide text-white sm:text-sm">
                            <Sparkles className="h-3.5 w-3.5 opacity-80" />
                            {monthLabel}
                        </span>
 
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onNextMonth}
                            className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/20 hover:text-white"
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
 
                    {/* ✅ STYLING CHANGE — body padding wrapper, since header now bleeds edge-to-edge above it */}
                    <div className="p-3 sm:p-4">
 
                       {/* ✅ STYLING CHANGE — weekday row styled as small purple-tinted pill labels */}
                       <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wide sm:text-xs" style={{ color: "var(--primary-color)" }}>
                            {weekdayLabels.map((label) => (
                                <span key={label}>{label}</span>
                            ))}
                        </div>
 
                        {/* ✅ STYLING CHANGE — added horizontal gap + slightly larger row gap for breathing room */}
                        <div className="grid grid-cols-7 gap-x-1 gap-y-1.5 text-center text-sm">
                            {cells.map((cell) => (
                                <Button
                                    type="button"
                                    key={cell.iso}
                                    variant="ghost"
                                    size="sm"
                                    disabled={cell.disabled}
                                    onClick={() => onSelectDay(cell.iso)}
                                    className={`
  mx-auto flex h-9 w-9 items-center justify-center rounded-full p-0 text-xs font-medium transition-all duration-150
  sm:h-10 sm:w-10 sm:text-sm
 
  ${cell.selected
                                            ? "scale-110 font-bold text-white shadow-[0_6px_16px_-4px_rgba(124,58,237,0.6)]"
                                            : cell.inMonth
                                                ? "text-slate-700 hover:scale-110 hover:bg-purple-50 hover:text-[var(--primary-color)] hover:shadow-sm"
                                                : "text-slate-300"
                                        }
 
  ${cell.disabled
                                            ? "cursor-not-allowed opacity-40 hover:scale-100 hover:bg-transparent hover:shadow-none"
                                            : ""
                                        }
`}
                                    // ✅ STYLING CHANGE — selected day now uses a purple gradient fill instead of a flat color
                                    style={
                                        cell.selected
                                            ? {
                                                background: "linear-gradient(135deg, var(--primary-color), #A78BFA)",
                                            }
                                            : undefined
                                    }
                                >
                                    {cell.day}
                                </Button>
                            ))}
                        </div>
 
                        {/* ✅ STYLING CHANGE — footer restyled as two pill buttons with icons, separated by a soft divider, more spacing */}
                        <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-sm">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onClear}
                                className="flex h-8 items-center gap-1.5 rounded-full px-3 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Clear
                            </Button>
 
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onToday}
                                // ✅ STYLING CHANGE — "Today" is now a solid tinted pill (bg + text in brand color) instead of plain ghost text, to stand out as the primary quick-action
                                className="h-8 rounded-full px-4 font-semibold shadow-sm transition hover:opacity-90"
                                style={{
                                    color: "var(--primary-color)",
                                    backgroundColor: "rgba(124,58,237,0.1)",
                                }}
                            >
                                Today
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default DatePicker;
 