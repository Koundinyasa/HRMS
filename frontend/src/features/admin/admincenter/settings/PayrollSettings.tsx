







import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  CalendarDays,
  RotateCcw,
  Info,
  Grid3X3,
  FileText,
  ChevronDown,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import DatePicker2, {
  type DatePicker2Cell,
} from "@/components/ui/datepicker2";

import {
  usePayrollSettings,
  toDateOnly,
  isoToDisplay,
  displayToIso,
  todayDateOnly,
} from "./hooks/usePayrollSettings";

const SELECT_ITEM_HEIGHT = 40;
const SELECT_VISIBLE_ROWS = 4;

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Adapts DatePicker2 (text/cells/view) ↔ form value YYYY-MM-DD */
function EffectiveFromPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const iso = toDateOnly(value) || todayDateOnly();
  const [text, setText] = useState(() => isoToDisplay(iso));
  const [open, setOpen] = useState(false);

  const initial = iso.split("-").map(Number);
  const [viewYear, setViewYear] = useState(initial[0] || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(initial[1] || new Date().getMonth() + 1);

  // Keep display in sync when form loads / refetches from API
  useEffect(() => {
    const next = toDateOnly(value);
    if (!next) return;
    setText(isoToDisplay(next));
    const [y, m] = next.split("-").map(Number);
    if (y) setViewYear(y);
    if (m) setViewMonth(m);
  }, [value]);

  const cells: DatePicker2Cell[] = useMemo(() => {
    const y = viewYear;
    const m = viewMonth; // 1–12
    const first = new Date(y, m - 1, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(y, m, 0).getDate();
    const prevDays = new Date(y, m - 1, 0).getDate();
    const selected = toDateOnly(value);
    const list: DatePicker2Cell[] = [];

    for (let i = 0; i < 42; i++) {
      let day: number;
      let inMonth: boolean;
      let cellY = y;
      let cellM = m;

      if (i < startPad) {
        day = prevDays - startPad + i + 1;
        inMonth = false;
        cellM = m === 1 ? 12 : m - 1;
        cellY = m === 1 ? y - 1 : y;
      } else if (i >= startPad + daysInMonth) {
        day = i - startPad - daysInMonth + 1;
        inMonth = false;
        cellM = m === 12 ? 1 : m + 1;
        cellY = m === 12 ? y + 1 : y;
      } else {
        day = i - startPad + 1;
        inMonth = true;
      }

      const cellIso = `${cellY}-${String(cellM).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      list.push({
        iso: cellIso,
        day,
        inMonth,
        selected: selected === cellIso,
      });
    }
    return list;
  }, [viewYear, viewMonth, value]);

  const shiftMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setViewYear(y);
    setViewMonth(m);
  };

  const handleSelectDay = (dayIso: string) => {
    const d = toDateOnly(dayIso);
    if (!d) return;
    setText(isoToDisplay(d));
    onChange(d);
    setOpen(false);
  };

  const handleTextChange = (raw: string) => {
    setText(raw);
  };

  const handleBlur = () => {
    const parsed = displayToIso(text);
    if (parsed) {
      setText(isoToDisplay(parsed));
      onChange(parsed);
      const [y, m] = parsed.split("-").map(Number);
      setViewYear(y);
      setViewMonth(m);
    } else {
      setText(isoToDisplay(toDateOnly(value) || todayDateOnly()));
    }
  };

  const handleClear = () => {
    setText("");
    onChange("");
    setOpen(false);
  };

  const handleToday = () => {
    const t = todayDateOnly();
    setText(isoToDisplay(t));
    onChange(t);
    const [y, m] = t.split("-").map(Number);
    setViewYear(y);
    setViewMonth(m);
    setOpen(false);
  };

  return (
    <DatePicker2
      text={text}
      onTextChange={handleTextChange}
      onBlur={handleBlur}
      open={open}
      onOpenChange={setOpen}
      monthLabel={`${MONTH_NAMES[viewMonth - 1]} ${viewYear}`}
      weekdayLabels={WEEKDAY_LABELS}
      cells={cells}
      onSelectDay={handleSelectDay}
      onPrevMonth={() => shiftMonth(-1)}
      onNextMonth={() => shiftMonth(1)}
      onClear={handleClear}
      onToday={handleToday}
      viewYear={viewYear}
      viewMonth={viewMonth}
      onViewChange={(y, m) => {
        setViewYear(y);
        setViewMonth(m);
      }}
      inputClassName="h-11 w-full rounded-xl border border-[#DDDDDD] bg-white text-[14px]"
    />
  );
}

function ResponsiveSelect({
  value,
  onValueChange,
  options,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pos, setPos] = useState<{
    left: number;
    width: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const wanted =
      SELECT_ITEM_HEIGHT * Math.min(options.length, SELECT_VISIBLE_ROWS) + 10;
    const spaceBelow = vh - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const openUp = spaceBelow < wanted && spaceAbove > spaceBelow;
    const width = Math.min(Math.max(rect.width, 140), vw - 16);
    const left = Math.max(8, Math.min(rect.left, vw - width - 8));
    const room = openUp ? spaceAbove : spaceBelow;
    setPos({
      left,
      width,
      maxHeight: Math.max(Math.min(wanted, room), SELECT_ITEM_HEIGHT + 10),
      ...(openUp ? { bottom: vh - rect.top + 4 } : { top: rect.bottom + 4 }),
    });
  }, [options.length]);

  const openList = () => {
    const idx = options.indexOf(value);
    setActiveIndex(idx >= 0 ? idx : 0);
    place();
    setOpen(true);
  };

  const choose = (option: string) => {
    onValueChange(option);
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onResize = () => place();
    const onScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (listRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open || !pos || !listRef.current) return;
    const top = activeIndex * SELECT_ITEM_HEIGHT;
    const box = listRef.current;
    if (top < box.scrollTop) box.scrollTop = top;
    else if (top + SELECT_ITEM_HEIGHT > box.scrollTop + box.clientHeight - 8) {
      box.scrollTop = top + SELECT_ITEM_HEIGHT - box.clientHeight + 8;
    }
  }, [open, pos, activeIndex]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "Escape" || e.key === "Tab") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (options[activeIndex] !== undefined) choose(options[activeIndex]);
    }
  };

  return (
    <div
      className={`relative h-11 w-full min-w-0 max-w-full rounded-xl text-[14px] ${className}`}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex h-full w-full min-w-0 max-w-full cursor-pointer items-center justify-between gap-2 rounded-[inherit] border bg-[#F9F7FF] px-3 text-left text-[length:inherit] font-medium text-[#131313] outline-none transition-colors ${
          open
            ? "border-[#5932E9] ring-1 ring-[#ECE7FF]"
            : "border-[#2E2E2E] focus:border-[#5932E9] focus:ring-1 focus:ring-[#ECE7FF]"
        }`}
      >
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#626262] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={listRef}
            role="listbox"
            style={{
              position: "fixed",
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              maxHeight: pos.maxHeight,
              zIndex: 2147483000,
              boxSizing: "border-box",
              overflowY: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#C9BDF7 transparent",
              padding: 4,
              background: "#FFFFFF",
              border: "1px solid #DCD3FF",
              borderRadius: 12,
              boxShadow: "0 12px 28px rgba(89, 50, 233, 0.18)",
              fontFamily: "'Urbanist', sans-serif",
            }}
          >
            {options.map((option, index) => {
              const selected = option === value;
              const active = index === activeIndex;
              return (
                <div
                  key={option}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option)}
                  style={{
                    height: SELECT_ITEM_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: selected ? 600 : 500,
                    color: selected ? "#5932E9" : "#2E2E2E",
                    background: active ? "#ECE7FF" : "transparent",
                  }}
                >
                  <span style={{ width: 16, flexShrink: 0, display: "inline-flex" }}>
                    {selected && <Check className="h-4 w-4 text-[#5932E9]" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{option}</span>
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}

const MODULES = [
  { key: "attendance" as const, label: "Time And Attendance", Icon: Calendar },
  { key: "loan" as const, label: "Loan", Icon: FileText },
  { key: "insurance" as const, label: "Insurance", Icon: FileText },
  { key: "advance" as const, label: "Advance", Icon: FileText },
  { key: "arrear" as const, label: "Arrear", Icon: FileText },
  { key: "bonus" as const, label: "Bonus", Icon: FileText },
  { key: "reimbursement" as const, label: "Reimbursement", Icon: FileText },
  { key: "disbursement" as const, label: "Disbursement", Icon: FileText },
  { key: "costCenter" as const, label: "Cost Center", Icon: FileText },
  { key: "additionalSalary" as const, label: "Additional Salary", Icon: FileText },
  {
    key: "attendanceIntegration" as const,
    label: "Attendance Integration",
    Icon: Calendar,
  },
];

export default function PayrollSettings() {
  const {
    formData,
    setFormData,
    isLoading,
    isSaving,
    loadError,
    message,
    toggleModule,
    handleSave,
    handleCancel,
  } = usePayrollSettings();

  if (isLoading) {
    return (
      <div className="p-4 font-['Urbanist',_sans-serif] text-sm text-[#626262] sm:p-6">
        Loading payroll settings…
      </div>
    );
  }

  const payCycleDays = Array.from({ length: 31 }, (_, index) => String(index + 1));

  return (
    <div className="w-full min-w-0 font-['Urbanist',_sans-serif]">
      {message && (
        <div
          role="status"
          className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-[#FAD5D1] bg-[#FAD5D1]/40 text-[#DD3232]"
          }`}
        >
          {message.text}
        </div>
      )}

      {loadError && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-[#FAD5D1] bg-[#FAD5D1]/40 px-3 py-2 text-xs font-medium text-[#DD3232]"
        >
          Could not load payroll settings from the server. Showing default values.
        </div>
      )}

      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:gap-6 xl:grid-cols-2">
        <div className="min-w-0 space-y-3 sm:space-y-5">
          <div
            style={{ border: "1px solid #DDDDDD" }}
            className="flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm sm:px-6 sm:py-5"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECE7FF]">
                <CalendarDays className="h-5 w-5 text-[#5932E9]" />
              </div>
              <span className="min-w-0 break-words text-[14px] font-medium text-[#131313] sm:text-[15px]">
                Pay Cycle Start Date
              </span>
            </div>
            <ResponsiveSelect
              value={formData.payCycleDate}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, payCycleDate: value }))
              }
              options={payCycleDays}
              className="!h-10 !w-20 shrink-0"
            />
          </div>

          <div
            style={{ border: "1px solid #DDDDDD" }}
            className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl bg-white px-3 py-3 shadow-sm sm:px-6 sm:py-5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Checkbox
                checked={formData.companyRoleCreation}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyRoleCreation: checked === true,
                  }))
                }
                className="data-[state=checked]:border-[#10B981] data-[state=checked]:bg-[#10B981]"
              />
              <span className="min-w-0 break-words text-[14px] font-medium text-[#131313] sm:text-[15px]">
                Company-wise Role Creation
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#5932E9] sm:text-sm">
              <Info className="h-4 w-4" />
              <span>Mandatory Setting</span>
            </div>
          </div>

          <div
            style={{ border: "1px solid #DDDDDD" }}
            className="min-w-0 rounded-2xl bg-white shadow-sm"
          >
            <div className="flex items-center gap-3 border-b border-[#DDDDDD] px-4 py-4 sm:px-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ECE7FF]">
                <Grid3X3 className="h-5 w-5 text-[#5932E9]" />
              </div>
              <h2 className="text-[16px] font-semibold text-[#131313]">Enable Modules</h2>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 p-3 min-[400px]:grid-cols-2 sm:gap-y-3 sm:p-6">
              {MODULES.map(({ key, label, Icon }) => (
                <label
                  key={key}
                  className="flex min-h-[36px] min-w-0 cursor-pointer items-center gap-2.5 py-0.5 sm:gap-3"
                >
                  <Checkbox
                    checked={formData.modules[key]}
                    onCheckedChange={() => toggleModule(key)}
                    className="data-[state=checked]:border-[#10B981] data-[state=checked]:bg-[#10B981]"
                  />
                  <Icon className="h-4 w-4 shrink-0 text-[#5932E9]" />
                  <span className="min-w-0 break-words text-[13px] text-[#2E2E2E] sm:text-[14px]">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{ border: "1px solid #DDDDDD" }}
          className="min-w-0 rounded-2xl bg-white shadow-sm"
        >
          <div className="space-y-4 p-3 sm:space-y-6 sm:p-6">
            {/* Effective From — DatePicker2, loads from API, updates form on change */}
            <div className="flex min-w-0 flex-col gap-2 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between sm:gap-3">
              <div className="flex shrink-0 items-center gap-3">
                <Calendar className="h-5 w-5 text-[#5932E9]" />
                <span className="text-[14px] font-medium text-[#2E2E2E]">Effective From</span>
              </div>
              <div className="w-full min-w-0 min-[400px]:w-[220px] min-[400px]:max-w-[60%]">
                <EffectiveFromPicker
                  value={formData.effectiveFrom}
                  onChange={(iso) =>
                    setFormData((prev) => ({
                      ...prev,
                      effectiveFrom: iso || prev.effectiveFrom,
                    }))
                  }
                />
              </div>
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#5932E9]" />
                <Label className="min-w-0 break-words text-[13px] font-semibold text-[#2E2E2E]">
                  Holidays Defined On
                </Label>
              </div>
              <ResponsiveSelect
                value={formData.holidayDefinedOn}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, holidayDefinedOn: value }))
                }
                options={["None", "Company", "Location", "Department"]}
              />
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#5932E9]" />
                <Label className="min-w-0 break-words text-[13px] font-semibold text-[#2E2E2E]">
                  Weekly Holiday Defined On
                </Label>
              </div>
              <ResponsiveSelect
                value={formData.weeklyHoliday}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, weeklyHoliday: value }))
                }
                options={["None", "Company", "Location", "Department"]}
              />
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-[#5932E9]" />
                <Label className="min-w-0 break-words text-[13px] font-semibold text-[#2E2E2E]">
                  Net Salary Round Off
                </Label>
              </div>
              <ResponsiveSelect
                value={formData.salaryRoundOff}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, salaryRoundOff: value }))
                }
                options={["Nearest Amount", "Higher Amount", "Lower Amount"]}
              />
            </div>

            <div className="min-w-0 space-y-2">
              <Label className="min-w-0 break-words text-[13px] font-semibold text-[#2E2E2E]">
                Retirement Age
              </Label>
              <Input
                value={formData.retirementAge}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    retirementAge: e.target.value,
                  }))
                }
                className="h-11 w-full min-w-0 rounded-xl border border-[#DDDDDD] bg-white text-[14px] outline-none transition-colors focus:border-[#5932E9] focus:ring-1 focus:ring-[#ECE7FF]"
              />
            </div>

            <div className="flex min-w-0 items-center gap-3 pt-1 sm:pt-2">
              <Checkbox
                checked={formData.customPayslip}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    customPayslip: checked === true,
                  }))
                }
                className="data-[state=checked]:border-[#10B981] data-[state=checked]:bg-[#10B981]"
              />
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#5932E9]" />
                <span className="min-w-0 break-words text-[14px] font-medium text-[#2E2E2E]">
                  Custom Language Payslip
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2.5 pt-3 sm:flex-row sm:justify-end sm:gap-3 sm:pt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full rounded-xl border-[#DDDDDD] px-6 text-[14px] font-medium text-[#2E2E2E] sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full rounded-xl bg-[#5932E9] px-6 text-[14px] font-semibold text-white hover:bg-[#4726BA] sm:w-auto"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
