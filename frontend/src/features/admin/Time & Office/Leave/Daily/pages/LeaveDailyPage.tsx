import {
  CalendarDays,
  CalendarRange,
  Check,
  ClipboardClock,
  Eye,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClockFading,
  FileSpreadsheet,
  FileText,
  Lock,
  MoreVertical,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import * as XLSX from "xlsx";
import noDataImage from "@/assets/images/no-data.png";
import {
  useLeaveDailyFilterOptions,
  useMonthlyLeaveCalendar,
  useEmployeeLeaveBalance,
  useLeaveCodeOptions,
  useDailyMonths,
  useDailyPolicies,
} from "../hooks/useLeaveDaily";
import { LEAVE_DAILY_PAGE_SIZE_OPTIONS } from "../constants/leaveDaily.constants";
import {
  getBulkLeaveFailedEmployeeIds,
  getBulkLeaveFailures,
  getLeaveDailyErrorMessage,
  useBulkLeaveRequestDownloadMutation,
  type ReprocessItem,
  type ReprocessResultItem,
  useReprocessDailyLeaveMutation,
} from "../api";
import LeaveDailyTabs from "../components/LeaveDailyTabs";
import {
  addToReprocessQueue,
  buildReprocessItems,
  removeFromReprocessQueue,
  useReprocessQueue,
} from "../utils/leaveDailyReprocessQueue";
import { useLeaveDailyToast } from "../components/LeaveDailyToast";
import LeaveSummaryModal, {
  type LeaveSummaryTarget,
} from "../components/LeaveSummaryModal";
import LeaveFormModal, {
  type LeaveFormTarget,
} from "../components/LeaveFormModal";

/* ======================= Types & constants ======================= */

interface SelectOption {
  label: string;
  value: string;
  /** Shown greyed out and cannot be picked */
  disabled?: boolean;
  /** Tooltip shown on a disabled option */
  disabledReason?: string;
}

/** Value of the "All Policies" choice: nothing is sent, so every employee is returned */
const ALL_POLICIES_VALUE = "";


type LeaveDailyFilterKey =
  | "branch"
  | "salaryStructure"
  | "leave"
  | "attendance"
  | "designation"
  | "empStatus";

const LEAVE_DAILY_FILTER_CHIPS: { key: LeaveDailyFilterKey; label: string }[] = [
  { key: "branch", label: "Branch" },
  { key: "salaryStructure", label: "Salary Structure" },
  { key: "leave", label: "Leave" },
  { key: "attendance", label: "Attendance" },
  { key: "designation", label: "Designation" },
  { key: "empStatus", label: "Emp Status" },
];

/**
 * Options for the filter dropdowns.
 * Empty list => the dropdown shows "No options available."
 * Fill these from your API (or pass `filterOptions` to <LeaveDailyPage />).
 */
const LEAVE_DAILY_FILTER_OPTIONS: Record<LeaveDailyFilterKey, SelectOption[]> = {
  branch: [],
  salaryStructure: [],
  leave: [],
  attendance: [],
  designation: [],
  empStatus: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ],
};

const EMPTY_FILTER_SELECTION: Record<LeaveDailyFilterKey, string[]> = {
  branch: [],
  salaryStructure: [],
  leave: [],
  attendance: [],
  designation: [],
  empStatus: [],
};

/* ======================= Calendar helpers ======================= */

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

interface LeaveDailyDay {
  day: number;
  weekday: string;
  isWeekend: boolean;
}

/** "Sep/2026" */
const formatMonthValue = (year: number, monthIndex: number) =>
  `${MONTH_LABELS[monthIndex]}/${year}`;

const getCurrentMonthValue = () => {
  const now = new Date();
  return formatMonthValue(now.getFullYear(), now.getMonth());
};

/**
 * Months that can be selected: this month and the previous 2 months.
 * Future months and months older than that are shown but disabled.
 */
const SELECTABLE_PAST_MONTHS = 2;
const MONTH_DISABLED_REASON = "Only this month and the previous 2 months can be selected";

const parseMonthValue = (value: string) => {
  const [label, yearText] = value.split("/");
  const monthIndex = MONTH_LABELS.findIndex((item) => item === label);
  const year = Number(yearText);

  if (monthIndex === -1 || Number.isNaN(year)) {
    const now = new Date();
    return { year: now.getFullYear(), monthIndex: now.getMonth() };
  }
  return { year, monthIndex };
};

/** true for this month and the previous SELECTABLE_PAST_MONTHS months; false for future / older months */
const isSelectableMonth = (value: string, now: Date = new Date()) => {
  const { year, monthIndex } = parseMonthValue(value);
  const monthsAgo = (now.getFullYear() - year) * 12 + (now.getMonth() - monthIndex);
  return monthsAgo >= 0 && monthsAgo <= SELECTABLE_PAST_MONTHS;
};

const getDaysInMonth = (value: string) => {
  const { year, monthIndex } = parseMonthValue(value);
  return new Date(year, monthIndex + 1, 0).getDate();
};

/** Real calendar days (with correct weekdays) for the selected month. */
const getMonthDays = (value: string): LeaveDailyDay[] => {
  const { year, monthIndex } = parseMonthValue(value);
  const total = new Date(year, monthIndex + 1, 0).getDate();

  return Array.from({ length: total }, (_, index) => {
    const day = index + 1;
    const weekdayIndex = new Date(year, monthIndex, day).getDay();
    return {
      day,
      weekday: WEEKDAY_LABELS[weekdayIndex],
      isWeekend: weekdayIndex === 0 || weekdayIndex === 6,
    };
  });
};

/* ======================= Excel export ======================= */

/** Exports the day grid of the Leave Daily page (month, range, weekdays). */
function exportDailyAttendanceExcel(
  month: string,
  dateRange: number,
  days: LeaveDailyDay[],
) {
  const pad = (value: number) => String(value).padStart(2, "0");

  const worksheet = XLSX.utils.aoa_to_sheet([
    ["Daily Attendance", month],
    ["Date Range", `01-${pad(dateRange)}`],
    ["Field", ...days.map(({ day }) => pad(day))],
    ["Weekday", ...days.map(({ weekday }) => weekday)],
    ["Selected", ...days.map(({ day }) => (day <= dateRange ? "Yes" : "No"))],
  ]);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Attendance");
  XLSX.writeFile(
    workbook,
    `daily-attendance-${month.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.xlsx`,
  );
}

/* ======================= Dropdown positioning hook ======================= */

const VIEWPORT_MARGIN = 12;
const GAP = 4;

interface FloatingMenuPosition {
  left: number;
  width: number;
  maxHeight: number;
  /** Set when the menu opens downwards */
  top?: number;
  /** Set when the menu opens upwards (not enough room below) */
  bottom?: number;
}

interface UseFloatingMenuOptions {
  /** Preferred menu width in px (clamped to the viewport) */
  width?: number;
  /** Use the trigger width when it is wider than `width` */
  matchTriggerWidth?: boolean;
  /** Menu never grows taller than this */
  maxMenuHeight?: number;
}

/**
 * Positions a dropdown menu (rendered in a portal) next to its trigger.
 * - stays inside the viewport (mobile friendly)
 * - flips upwards when there is no room below
 * - closes on outside click / Escape / trigger leaving the screen
 * - follows the trigger while the page or a scroll container scrolls
 */
const useFloatingMenu = ({
  width = 260,
  matchTriggerWidth = false,
  maxMenuHeight = 320,
}: UseFloatingMenuOptions = {}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<FloatingMenuPosition | null>(null);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Trigger scrolled out of view -> close instead of floating in space
    if (rect.bottom < 0 || rect.top > vh || rect.right < 0 || rect.left > vw) {
      setOpen(false);
      return;
    }

    const preferred = matchTriggerWidth ? Math.max(rect.width, width) : width;
    const menuWidth = Math.min(preferred, vw - VIEWPORT_MARGIN * 2);
    const left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(rect.left, vw - menuWidth - VIEWPORT_MARGIN),
    );

    const spaceBelow = vh - rect.bottom - VIEWPORT_MARGIN - GAP;
    const spaceAbove = rect.top - VIEWPORT_MARGIN - GAP;
    const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
    const room = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(140, Math.min(maxMenuHeight, room));

    setPosition(
      openUp
        ? { left, width: menuWidth, maxHeight, bottom: vh - rect.top + GAP }
        : { left, width: menuWidth, maxHeight, top: rect.bottom + GAP },
    );
  }, [matchTriggerWidth, maxMenuHeight, width]);

  const toggle = useCallback(() => {
    if (open) {
      setOpen(false);
      return;
    }
    updatePosition();
    setOpen(true);
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onScroll = (event: Event) => {
      // ignore scrolling inside the menu itself
      if (menuRef.current && event.target instanceof Node && menuRef.current.contains(event.target)) {
        return;
      }
      updatePosition();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, close, updatePosition]);

  return { triggerRef, menuRef, open, position, toggle, close };
};

/* ======================= SelectDropdown (single select, scrollable) ======================= */

interface SelectDropdownProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  /** Text shown when `value` matches no option */
  placeholder?: string;
  /** Classes for the trigger button (width / height etc.) */
  className?: string;
  /** Menu width in px. Defaults to the trigger width */
  menuWidth?: number;
  disabled?: boolean;
  /** Small icon shown before the selected label */
  leadingIcon?: ReactNode;
}

const MENU_SCROLLBAR =
  "[scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f]";

/**
 * Single-select dropdown. The list scrolls (visible scrollbar) so any number
 * of options - e.g. every month - stays reachable on any screen size.
 */
const SelectDropdown = ({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = "Select",
  className = "",
  menuWidth,
  disabled = false,
  leadingIcon,
}: SelectDropdownProps) => {
  const { triggerRef, menuRef, open, position, toggle, close } = useFloatingMenu({
    width: menuWidth ?? 200,
    matchTriggerWidth: menuWidth === undefined,
    maxMenuHeight: 280,
  });
  const selectedRef = useRef<HTMLButtonElement>(null);
  // Tooltip for a disabled option (same look as the grid tooltips)
  const [optionTip, setOptionTip] = useState<{ x: number; y: number; text: string } | null>(null);

  const selected = options.find((option) => option.value === value);

  // Bring the selected option into view when the list opens
  useEffect(() => {
    if (open) selectedRef.current?.scrollIntoView({ block: "center" });
    else setOptionTip(null);
  }, [open]);

  const moveFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]:not(:disabled)') ?? [],
    );
    const index = items.findIndex((item) => item === document.activeElement);
    const next = event.key === "ArrowDown" ? index + 1 : index - 1;
    items[(next + items.length) % items.length]?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            toggle();
          }
        }}
        className={`flex h-11 min-w-0 items-center justify-between gap-2 rounded-lg border border-[#e3e7ee] bg-white px-3 text-left text-sm font-semibold text-[#303746] shadow-[0_1px_1px_rgba(16,24,40,0.04)] outline-none transition hover:border-[#df8d7c] focus-visible:ring-2 focus-visible:ring-[#f0c9c0] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-base ${open ? "border-[#df8d7c] ring-2 ring-[#f6dcd5]" : ""} ${className}`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {leadingIcon && <span className="shrink-0 text-[#914f3f]">{leadingIcon}</span>}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[#707887] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label={ariaLabel}
            onKeyDown={moveFocus}
            onScroll={() => setOptionTip(null)}
            className={`fixed z-[1001] overflow-y-auto rounded-lg border border-[#e3e7ee] bg-white py-1 shadow-[0_10px_28px_rgba(16,24,40,0.18)] ${MENU_SCROLLBAR}`}
            style={{
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              width: position.width,
              maxHeight: position.maxHeight,
            }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              // Disabled: greyed out, cannot be picked, shows a styled tooltip on hover
              if (option.disabled) {
                return (
                  <div
                    key={option.value}
                    onMouseEnter={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect();
                      setOptionTip({
                        x: Math.min(Math.max(rect.left + rect.width / 2, 120), window.innerWidth - 120),
                        y: rect.top,
                        text: option.disabledReason ?? "This option is not available",
                      });
                    }}
                    onMouseLeave={() => setOptionTip(null)}
                    className="cursor-not-allowed"
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      aria-disabled="true"
                      disabled
                      className="pointer-events-none flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm font-medium text-[#b9bfcb]"
                    >
                      <span className="truncate">{option.label}</span>
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={option.value}
                  ref={isSelected ? selectedRef : undefined}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    close(true);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm font-medium outline-none transition hover:bg-[#fff1ed] focus-visible:bg-[#fff1ed] ${
                    isSelected ? "bg-[#fff7f5] text-[#914f3f]" : "text-[#303746]"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check size={15} className="shrink-0" />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}

      {open &&
        optionTip &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[3000] font-[Urbanist]"
            style={{ left: optionTip.x, top: optionTip.y - 8, transform: "translate(-50%, -100%)" }}
          >
            <div className="relative w-max max-w-[220px] overflow-hidden rounded-md border border-[#f0d4cc] bg-white shadow-[0_4px_12px_rgba(145,79,63,0.16)]">
              <div className="h-0.5 w-full bg-gradient-to-r from-[#914f3f] to-[#e8a090]" />
              <div className="flex items-start gap-2 px-2.5 py-2">
                <span className="mt-px grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#fff1ed] text-[#914f3f]">
                  <Lock size={12} strokeWidth={2.5} />
                </span>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold leading-tight text-[#182237]">
                    Not available
                  </div>
                  <div className="mt-0.5 text-[10px] font-medium leading-snug text-[#738096]">
                    {optionTip.text}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

/* ======================= FilterDropdown (checkbox multi-select chip) ======================= */

interface FilterDropdownProps {
  label: string;
  options: SelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  emptyText?: string;
}

const SEARCH_THRESHOLD = 8;

/**
 * Filter chip + checkbox dropdown:
 *   [ ] Branch            <- select all
 *   [ ] option 1 ...      <- scrollable list
 *   x Clear               <- footer
 * Shows "No options available." when there is nothing to pick.
 */
const FilterDropdown = ({
  label,
  options,
  selected,
  onChange,
  emptyText = "No options available.",
}: FilterDropdownProps) => {
  const { triggerRef, menuRef, open, position, toggle } = useFloatingMenu({
    width: 260,
    maxMenuHeight: 340,
  });
  const [query, setQuery] = useState("");
  const selectAllRef = useRef<HTMLInputElement>(null);

  const hasOptions = options.length > 0;
  const allSelected = hasOptions && selected.length === options.length;
  const someSelected = selected.length > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected, open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const visibleOptions = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? options.filter((option) => option.label.toLowerCase().includes(term))
      : options;
  }, [options, query]);

  const toggleOption = (value: string) =>
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );

  const toggleAll = () =>
    onChange(allSelected ? [] : options.map((option) => option.value));

  const active = selected.length > 0;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className={`inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-[14px] font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-[#f0c9c0] ${
          active || open
            ? "border-[#df8d7c] bg-[#fff7f5] text-[#914f3f]"
            : "border-[#e3e7ee] bg-white text-[#4b5565] shadow-[0_1px_1px_rgba(16,24,40,0.04)] hover:border-[#df8d7c] hover:text-[#914f3f]"
        }`}
      >
        {label}
        {active && (
          <span className="rounded-full bg-[#914f3f] px-1.5 text-[11px] leading-[18px] text-white">
            {selected.length}
          </span>
        )}
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[1001] flex flex-col overflow-hidden rounded-xl border border-[#e3e7ee] bg-white shadow-[0_10px_28px_rgba(16,24,40,0.18)]"
            style={{
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              width: position.width,
              maxHeight: position.maxHeight,
            }}
          >
            {/* Select all */}
            <label
              className={`flex shrink-0 items-center gap-3 border-b border-[#f3dcd6] bg-[#fdeceb] px-4 py-3 text-[15px] font-semibold text-[#182237] ${
                hasOptions ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                disabled={!hasOptions}
                onChange={toggleAll}
                className="h-4 w-4 accent-[#914f3f]"
              />
              {label}
            </label>

            {hasOptions && options.length > SEARCH_THRESHOLD && (
              <div className="flex shrink-0 items-center gap-2 border-b border-[#eef1f5] px-3 py-2 text-[#9aa6b9]">
                <Search size={15} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-sm text-[#303746] outline-none placeholder:text-[#b5bccb]"
                />
              </div>
            )}

            {/* Options */}
            <div className={`min-h-0 flex-1 overflow-y-auto ${MENU_SCROLLBAR}`}>
              {!hasOptions && (
                <p className="px-4 py-5 text-center text-sm text-[#8a94ad]">{emptyText}</p>
              )}
              {hasOptions && visibleOptions.length === 0 && (
                <p className="px-4 py-5 text-center text-sm text-[#8a94ad]">No matches found.</p>
              )}
              {visibleOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm font-medium text-[#303746] hover:bg-[#fff7f5]"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    className="h-4 w-4 shrink-0 accent-[#914f3f]"
                  />
                  <span className="truncate">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Footer */}
            <button
              type="button"
              onClick={() => onChange([])}
              disabled={!active}
              className="flex shrink-0 items-center justify-center gap-2 border-t border-[#e3e7ee] bg-[#f6f8fb] py-2.5 text-sm font-medium text-[#707887] transition hover:text-[#e33c4b] disabled:cursor-default disabled:opacity-70 disabled:hover:text-[#707887]"
            >
              <X size={14} /> Clear
            </button>
          </div>,
          document.body,
        )}
    </>
  );
};

/* ======================= Toolbar ======================= */

interface LeaveDailyToolbarProps {
  leavePolicy: string;
  policyOptions: SelectOption[];
  onLeavePolicyChange: (value: string) => void;
  month: string;
  monthOptions: SelectOption[];
  onMonthChange: (value: string) => void;
  onExport: () => void;
  /** Recalculate leave / attendance for the selected policy + month */
  onReprocess: () => void;
  /** True while the reprocess request is running */
  reprocessing?: boolean;
  /** Disable the button */
  reprocessDisabled?: boolean;
  /** How many employee/date pairs a click on Reprocess would send */
  reprocessCount?: number;
}

const iconButton =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-[#e3e7ee] transition hover:ring-[#df8d7c]";

const LeaveDailyToolbar = ({
  leavePolicy,
  policyOptions,
  onLeavePolicyChange,
  month,
  monthOptions,
  onMonthChange,
  onExport,
  onReprocess,
  reprocessing = false,
  reprocessDisabled = false,
  reprocessCount = 0,
}: LeaveDailyToolbarProps) => (
  <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-xl border border-[#f0cbc1] bg-gradient-to-r from-[#fff3ef] to-[#fffaf8] px-3 py-3 shadow-[0_1px_2px_rgba(145,79,63,0.08)] sm:px-5">
    {/* Tabs (shared with Import page) */}
    <LeaveDailyTabs />

    {/* Controls */}
    <div className="flex w-full min-w-0 flex-wrap items-center gap-2 lg:w-auto lg:flex-nowrap">
      <SelectDropdown
        ariaLabel="Leave policy"
        value={leavePolicy}
        options={policyOptions}
        onChange={onLeavePolicyChange}
        leadingIcon={<FileText size={17} />}
        className="w-full min-w-[190px] flex-1 sm:w-[260px] sm:flex-none"
      />
      <SelectDropdown
        ariaLabel="Month"
        value={month}
        options={monthOptions}
        onChange={onMonthChange}
        leadingIcon={<CalendarDays size={17} />}
        className="min-w-[150px] flex-1 sm:w-[184px] sm:flex-none"
      />
      <button
        type="button"
        onClick={onReprocess}
        disabled={reprocessDisabled || reprocessing}
        aria-busy={reprocessing}
        title={
          reprocessCount > 0
            ? `Recalculate attendance for ${reprocessCount} employee-day(s)`
            : "Select employees in the table (or save a leave), then click Reprocess"
        }
        className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-white px-4 text-[15px] font-semibold text-[#914f3f] ring-1 ring-[#e3e7ee] transition hover:bg-[#fff1ed] hover:ring-[#df8d7c] disabled:cursor-not-allowed disabled:bg-[#eceef2] disabled:text-[#a3a6ac] disabled:ring-0 disabled:hover:bg-[#eceef2]"
      >
        <RefreshCw size={16} className={reprocessing ? "animate-spin" : ""} />
        {reprocessing ? "Reprocessing…" : "Reprocess"}
        {!reprocessing && reprocessCount > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#914f3f] px-1.5 text-[11px] font-bold leading-none text-white">
            {reprocessCount > 99 ? "99+" : reprocessCount}
          </span>
        )}
      </button>

      <div className="ml-auto flex items-center gap-2 lg:ml-1">
        <button
          type="button"
          aria-label="Export to Excel"
          title="Export to Excel"
          onClick={onExport}
          className={`${iconButton} text-[#168b4c]`}
        >
          <FileSpreadsheet size={21} />
        </button>
        <button
          type="button"
          aria-label="History"
          title="History"
          className={`${iconButton} text-[#7e91ad] hover:text-[#914f3f]`}
        >
          <ClockFading size={21} />
        </button>
      </div>
    </div>
  </div>
);
/* ======================= Reprocess confirm dialog ======================= */

/** "2026-10-10" -> "Sat, 10 Oct 2026" */
const formatIsoDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/** How many employee/date pairs go to the server in one request */
const REPROCESS_BATCH_SIZE = 25;

interface ReprocessConfirmModalProps {
  open: boolean;
  /** "selection" = employees ticked in the table x the selected dates; "saved" = days saved after earlier leave */
  source: "selection" | "saved";
  itemCount: number;
  employeeCount: number;
  dayCount: number;
  /** e.g. "01-14 Oct 2026" (selection only) */
  rangeLabel: string;
  /** Saved days that are NOT part of this run because employees are selected */
  skippedSavedCount: number;
  loading: boolean;
  progress: { done: number; total: number } | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ReprocessConfirmModal = ({
  open,
  source,
  itemCount,
  employeeCount,
  dayCount,
  rangeLabel,
  skippedSavedCount,
  loading,
  progress,
  onCancel,
  onConfirm,
}: ReprocessConfirmModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const employees = `${employeeCount} employee${employeeCount === 1 ? "" : "s"}`;
  const days = `${dayCount} day${dayCount === 1 ? "" : "s"}`;
  const percent = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 p-4 font-[Urbanist]"
      onClick={() => !loading && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reprocess-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[440px] rounded-xl bg-white p-5 shadow-[0_20px_48px_rgba(16,24,40,0.25)]"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fff1ed] text-[#914f3f]">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </span>
          <div className="min-w-0">
            <h2 id="reprocess-title" className="text-[17px] font-bold text-[#182237]">
              Reprocess attendance?
            </h2>
            {source === "selection" ? (
              <p className="mt-1 text-[14px] leading-relaxed text-[#5f6d85]">
                Recalculate attendance for{" "}
                <span className="font-semibold text-[#303746]">{employees}</span> selected in the
                table, for{" "}
                <span className="font-semibold text-[#303746]">{days}</span> ({rangeLabel}).{" "}
                <span className="font-semibold text-[#303746]">{itemCount}</span> recalculation
                {itemCount === 1 ? "" : "s"} in total.
              </p>
            ) : (
              <p className="mt-1 text-[14px] leading-relaxed text-[#5f6d85]">
                Recalculate attendance for the leave you saved:{" "}
                <span className="font-semibold text-[#303746]">{employees}</span>,{" "}
                <span className="font-semibold text-[#303746]">{days}</span>.
              </p>
            )}
            {source === "selection" && skippedSavedCount > 0 && (
              <p className="mt-2 text-[12.5px] leading-snug text-[#8a5a00]">
                {skippedSavedCount} saved day{skippedSavedCount === 1 ? " is" : "s are"} not included.
                Clear the selection to reprocess those instead.
              </p>
            )}
          </div>
        </div>

        {loading && progress && (
          <div className="mt-4" role="status" aria-live="polite">
            <div className="flex items-center justify-between text-[12.5px] font-semibold text-[#5f6d85]">
              <span>Processing…</span>
              <span>
                {progress.done} of {progress.total}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#f3e3de]">
              <div
                className="h-full rounded-full bg-[#914f3f] transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-[13px] font-semibold text-[#303746] hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#914f3f] px-5 text-[13px] font-semibold text-white hover:bg-[#7f4234] disabled:opacity-60"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Reprocessing…" : "Yes, reprocess"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* ======================= Reprocess result window ======================= */

interface ReprocessResultModalProps {
  /** null = closed */
  results: ReprocessResultItem[] | null;
  /** EmployeeID -> full name (for the table rows) */
  nameById: Record<string, string>;
  retrying: boolean;
  onRetryFailed: () => void;
  onClose: () => void;
}

/** Shows what the server answered for every employee/date: success or failed + its message */
const ReprocessResultModal = ({
  results,
  nameById,
  retrying,
  onRetryFailed,
  onClose,
}: ReprocessResultModalProps) => {
  const [failedOnly, setFailedOnly] = useState(false);
  const open = results !== null;

  useEffect(() => {
    if (open) setFailedOnly(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !retrying) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, retrying, onClose]);

  const groups = useMemo(() => {
    const byEmployee = new Map<string, ReprocessResultItem[]>();
    for (const result of results ?? []) {
      const list = byEmployee.get(result.employeeId) ?? [];
      list.push(result);
      byEmployee.set(result.employeeId, list);
    }
    return Array.from(byEmployee.entries()).map(([employeeId, rows]) => ({
      employeeId,
      rows: [...rows].sort((a, b) => a.date.localeCompare(b.date)),
    }));
  }, [results]);

  if (!results) return null;

  const failedCount = results.filter((result) => !result.success).length;
  const okCount = results.length - failedCount;

  return createPortal(
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 p-4 font-[Urbanist]"
      onClick={() => !retrying && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reprocess-result-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-[640px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_48px_rgba(16,24,40,0.25)]"
      >
        <div className="flex items-start gap-3 px-5 pb-3 pt-5">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
              failedCount === 0 ? "bg-[#e7f6ee] text-[#16794a]" : "bg-[#fff1ed] text-[#914f3f]"
            }`}
          >
            {failedCount === 0 ? <Check size={20} strokeWidth={2.5} /> : <X size={20} strokeWidth={2.5} />}
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="reprocess-result-title" className="text-[17px] font-bold text-[#182237]">
              {failedCount === 0 ? "Reprocess completed" : "Reprocess finished with errors"}
            </h2>
            <p className="mt-0.5 text-[13.5px] text-[#5f6d85]">
              <span className="font-semibold text-[#16794a]">{okCount} succeeded</span>
              {" · "}
              <span className={`font-semibold ${failedCount > 0 ? "text-[#c0392b]" : "text-[#5f6d85]"}`}>
                {failedCount} failed
              </span>
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={retrying}
            className="grid h-8 w-8 place-items-center rounded-md text-[#707887] hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {failedCount > 0 && (
          <label className="flex cursor-pointer items-center gap-2 px-5 pb-2 text-[13px] font-semibold text-[#303746]">
            <input
              type="checkbox"
              checked={failedOnly}
              onChange={(event) => setFailedOnly(event.target.checked)}
              className="h-[15px] w-[15px] accent-[#914f3f]"
            />
            Show failed only
          </label>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto border-y border-[#f3e3de] bg-[#fffaf8]">
          {groups.map(({ employeeId, rows }) => {
            const visible = failedOnly ? rows.filter((row) => !row.success) : rows;
            if (visible.length === 0) return null;
            const failedHere = rows.filter((row) => !row.success).length;
            const name = nameById[employeeId];
            return (
              <div key={employeeId} className="border-b border-[#f3e3de] last:border-b-0">
                <div className="flex items-center justify-between gap-3 bg-[#fff1ed] px-5 py-2">
                  <div className="min-w-0 truncate text-[13px] font-bold text-[#182237]">
                    {name || employeeId}
                    {name && <span className="ml-1.5 font-medium text-[#8a94ad]">{employeeId}</span>}
                  </div>
                  <div
                    className={`shrink-0 text-[12px] font-bold ${
                      failedHere > 0 ? "text-[#c0392b]" : "text-[#16794a]"
                    }`}
                  >
                    {failedHere > 0 ? `${failedHere} failed` : `${rows.length} succeeded`}
                  </div>
                </div>
                <ul>
                  {visible.map((row) => (
                    <li
                      key={`${row.employeeId}-${row.date}`}
                      className="flex items-start gap-3 border-t border-[#f6ebe7] bg-white px-5 py-2 text-[13px]"
                    >
                      <span className="w-[116px] shrink-0 font-semibold text-[#303746]">
                        {formatIsoDate(row.date)}
                      </span>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-bold ${
                          row.success ? "bg-[#e7f6ee] text-[#16794a]" : "bg-[#fde8e8] text-[#c0392b]"
                        }`}
                      >
                        {row.success ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                        {row.success ? "Success" : "Failed"}
                      </span>
                      <span className="min-w-0 flex-1 break-words text-[#5f6d85]">
                        {row.message || (row.success ? "Done" : "No message from the server")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3">
          {failedCount > 0 && (
            <button
              type="button"
              onClick={onRetryFailed}
              disabled={retrying}
              className="flex h-10 items-center gap-2 rounded-lg border border-[#914f3f] bg-white px-4 text-[13px] font-semibold text-[#914f3f] hover:bg-[#fff1ed] disabled:opacity-60"
            >
              <RefreshCw size={14} className={retrying ? "animate-spin" : ""} />
              {retrying ? "Retrying…" : `Retry failed (${failedCount})`}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={retrying}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#914f3f] px-6 text-[13px] font-semibold text-white hover:bg-[#7f4234] disabled:opacity-60"
          >
            <Check size={15} /> OK
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* ======================= Rows per page buttons ======================= */

interface RowsPerPageButtonsProps {
  value: number;
  options: readonly number[];
  onChange: (value: number) => void;
}

/** "Rows per page": a small row of buttons (10 | 25 | 50 | 100) - click one, no dropdown. */
const RowsPerPageButtons = ({ value, options, onChange }: RowsPerPageButtonsProps) => (
  <div
    role="radiogroup"
    aria-label="Rows per page"
    className="flex items-center gap-0.5 rounded-lg bg-[#f4f6fa] p-0.5"
  >
    {options.map((size) => {
      const isSelected = size === value;
      return (
        <button
          key={size}
          type="button"
          role="radio"
          aria-checked={isSelected}
          onClick={() => onChange(size)}
          className={`h-7 min-w-[38px] rounded-md px-2.5 text-[12.5px] font-semibold transition ${
            isSelected
              ? "bg-[#914f3f] text-white shadow-[0_2px_5px_rgba(145,79,63,0.35)]"
              : "text-[#5f6d85] hover:bg-white hover:text-[#914f3f]"
          }`}
        >
          {size}
        </button>
      );
    })}
  </div>
);

/* ======================= Filter bar ======================= */

interface LeaveDailyFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  options: Record<LeaveDailyFilterKey, SelectOption[]>;
  selected: Record<LeaveDailyFilterKey, string[]>;
  onSelectedChange: (key: LeaveDailyFilterKey, values: string[]) => void;
  /** Clears every selected filter (bar stays open) */
  onClearAll: () => void;
  /** Clears every filter and hides the bar */
  onClose: () => void;
}

const LeaveDailyFilterBar = ({
  search,
  onSearchChange,
  options,
  selected,
  onSelectedChange,
  onClearAll,
  onClose,
}: LeaveDailyFilterBarProps) => {
  const appliedTags = LEAVE_DAILY_FILTER_CHIPS.flatMap(({ key, label }) =>
    selected[key].map((value) => ({
      key,
      value,
      label,
      text: options[key].find((option) => option.value === value)?.label ?? value,
    })),
  );

  return (
    <div className="min-w-0 rounded-xl border border-[#e6eaf0] bg-white px-3 py-3 shadow-[0_1px_3px_rgba(16,24,40,0.05)] sm:px-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <label className="flex h-10 min-w-0 basis-full items-center gap-2 rounded-lg border border-transparent bg-[#f3f5f9] px-3 text-[#9aa6b9] transition focus-within:border-[#df8d7c] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#f6dcd5] sm:max-w-[250px] sm:flex-1 sm:basis-[190px]">
          <Search size={17} className="shrink-0" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Start typing..."
            className="w-full min-w-0 bg-transparent text-[14px] font-medium text-[#303746] outline-none placeholder:text-[#a9b1c1]"
          />
        </label>

        {LEAVE_DAILY_FILTER_CHIPS.map(({ key, label }) => (
          <FilterDropdown
            key={key}
            label={label}
            options={options[key]}
            selected={selected[key]}
            onChange={(values) => onSelectedChange(key, values)}
          />
        ))}

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="More filters"
            className="flex h-10 w-9 items-center justify-center rounded-lg text-[#8795ab] transition hover:bg-[#f3f5f9] hover:text-[#5f6d85]"
          >
            <MoreVertical size={20} />
          </button>
          <button
            type="button"
            aria-label="Clear search and filters"
            title="Clear search and filters"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#e33c4b] transition hover:bg-[#fff1f2]"
          >
            <X size={21} />
          </button>
        </div>
      </div>

      {appliedTags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-[#e3e7ee] pt-3">
          <span className="text-[13px] font-semibold text-[#738096]">Applied</span>
          {appliedTags.map((tag) => (
            <span
              key={`${tag.key}-${tag.value}`}
              className="inline-flex items-center gap-1 rounded-full bg-[#fff1ed] py-1 pl-3 pr-1.5 text-[13px] font-semibold text-[#914f3f]"
            >
              {tag.label}: {tag.text}
              <button
                type="button"
                aria-label={`Remove ${tag.label} ${tag.text}`}
                onClick={() =>
                  onSelectedChange(
                    tag.key,
                    selected[tag.key].filter((item) => item !== tag.value),
                  )
                }
                className="flex h-5 w-5 items-center justify-center rounded-full transition hover:bg-[#f6d5cc]"
              >
                <X size={13} />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="ml-1 text-[13px] font-semibold text-[#e33c4b] hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
/* ======================= Date grid ======================= */

interface LeaveDailyDateGridProps {
  month: string;
  days: LeaveDailyDay[];
  /** Day-of-month of today when the selected month is the current month */
  todayDay?: number;
  dateRange: number;
  onDateRangeChange: (value: number) => void;
  attendanceCode: string;
  attendanceOptions: SelectOption[];
  onAttendanceCodeChange: (value: string) => void;
  onApply?: () => void;
  /** Rows from POST monthly-leave-calendar */
  employees?: Record<string, unknown>[];
  search?: string;
  loading?: boolean;
  /** Employees ticked in the table (kept in the page so Reprocess can use them too) */
  selectedEmpIds: Set<string>;
  onSelectedEmpIdsChange: Dispatch<SetStateAction<Set<string>>>;
}

/** API keys look like "1 Thu", "2 Fri" → code for that day number */
function getDayCodeFromRow(row: Record<string, unknown>, day: number): string {
  for (const [key, value] of Object.entries(row)) {
    const match = key.match(/^(\d+)\b/);
    if (match && Number(match[1]) === day) {
      const code = value == null || value === "" ? "-" : String(value);
      return code;
    }
  }
  return "-";
}

const BALANCE_COLUMNS = [
  "Opening", "Accrued", "Availed", "Lapsed", "Encashed", "Adjusted", "Closing",
] as const;
const DEFAULT_LEAVE_TYPES = ["CL", "SL", "ML", "LOP", "RH"];

interface LeaveBalanceRow {
  leaveType: string;
  [column: string]: string | number | null | undefined;
}

/**
 * Leave balances for the eye panel. Reads row.leaveBalances / row.LeaveBalances
 * if the API sends it; otherwise shows the leave types with "-" until the
 * balance endpoint is connected.
 */
function getLeaveBalances(row: Record<string, unknown>): LeaveBalanceRow[] {
  const raw = row.leaveBalances ?? row.LeaveBalances;
  if (Array.isArray(raw) && raw.length) {
    return raw.map((item) => {
      const r = item as Record<string, unknown>;
      const out: LeaveBalanceRow = {
        leaveType: String(r.leaveType ?? r.LeaveType ?? r.code ?? r.Code ?? ""),
      };
      for (const col of BALANCE_COLUMNS) {
        const v = r[col] ?? r[col.toLowerCase()];
        out[col] = v == null ? null : (v as string | number);
      }
      return out;
    });
  }
  return DEFAULT_LEAVE_TYPES.map((leaveType) => ({ leaveType }));
}

/** Hover info for each day code (names match the leave types in the database) */
const DAY_CODE_INFO: Record<string, { title: string; desc: string }> = {
  P: { title: "Present", desc: "Full day present" },
  AB: { title: "Absent", desc: "No leave applied" },
  PN: { title: "Pending", desc: "Waiting for approval" },
  W: { title: "Weekly Off", desc: "Non-working day" },
  WO: { title: "Weekly Off", desc: "Non-working day" },
  H: { title: "Holiday", desc: "Company holiday" },
  CL: { title: "Casual Leave", desc: "Approved leave" },
  SL: { title: "Sick Leave", desc: "Approved leave" },
  EL: { title: "Earned Leave", desc: "Approved leave" },
  ML: { title: "Maternity Leave", desc: "Approved leave" },
  PL: { title: "Paternity Leave", desc: "Approved leave" },
  CO: { title: "Compensatory Off", desc: "Day off for extra work" },
  LOP: { title: "Loss of Pay", desc: "Leave without pay" },
  MRL: { title: "Marriage Leave", desc: "Approved leave" },
  BL: { title: "Bereavement Leave", desc: "Approved leave" },
  WFH: { title: "Work From Home", desc: "Working from home" },
  OL: { title: "Optional Leave", desc: "Optional holiday taken" },
  RH: { title: "Restricted Holiday", desc: "Restricted holiday taken" },
  "-": { title: "No record", desc: "Nothing recorded" },
};

function getCodeInfo(code: string): { title: string; desc: string } {
  const c = code.toUpperCase();
  const known = DAY_CODE_INFO[c];
  if (known) return known;
  // half-day codes such as "P/AB" or "CL/P" → first half / second half
  if (c.includes("/")) {
    const [first, second] = c.split("/");
    const f = DAY_CODE_INFO[first]?.title ?? first;
    const sec = DAY_CODE_INFO[second]?.title ?? second;
    return { title: `${f} / ${sec}`, desc: `First half: ${f} · Second half: ${sec}` };
  }
  return { title: c, desc: "" };
}

/**
 * The Leave Form opens for EVERY cell except these:
 *   W, WO = weekly off      H = holiday      PN = pending
 */
const NO_LEAVE_FORM_CODES = ["W", "WO", "H", "PN"];

/** Circle colours for each day code (matches the Apply Leave design) */
function getCodeBadgeClass(code: string): string {
  switch (code.toUpperCase()) {
    case "P":
      return "bg-[#eceff4] text-[#303746]";
    case "W":
    case "WO":
    case "H":
      return "bg-[#fde8c8] text-[#303746]";
    case "V":
      return "bg-[#e6d4f3] text-[#303746]";
    case "-":
      return "bg-transparent text-slate-400";
    default: // LOP, CL, SL, RH, ML ...
      return "bg-[#fbdcdc] text-[#303746]";
  }
}

const SCROLL_X =
  "[&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-corner]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e3c6c0] hover:[&::-webkit-scrollbar-thumb]:bg-[#c9928a] " +
  "[@supports(-moz-appearance:none)]:[scrollbar-width:thin] [@supports(-moz-appearance:none)]:[scrollbar-color:#dcb9b1_transparent]";

const THUMB = 18; // px - must match the thumb size in SLIDER

const SLIDER =
  "absolute top-[8px] z-10 h-5 cursor-pointer appearance-none bg-transparent outline-none " +
  "[&::-webkit-slider-runnable-track]:h-5 [&::-webkit-slider-runnable-track]:bg-transparent " +
  "[&::-webkit-slider-thumb]:mt-[1px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#914f3f] [&::-webkit-slider-thumb]:shadow-[0_1px_5px_rgba(145,79,63,0.55)] " +
  "[&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#914f3f] " +
  "focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-[#f6dcd5]";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Column widths live in CSS variables so the layout is defined in ONE place:
 *   --c1  Dates / Emp Id column     --c2  Actions column (eye + summary icons)
 *   --dw  width of a single day
 * Both left columns are sticky, the days scroll horizontally.
 */
const gridVars =
  "[--c1:132px] [--c2:92px] [--dw:42px] sm:[--c1:160px] sm:[--c2:100px] sm:[--dw:44px]";

const LeaveDailyDateGrid = ({
  month,
  days,
  todayDay,
  dateRange,
  onDateRangeChange,
  attendanceCode,
  attendanceOptions,
  onAttendanceCodeChange,
  onApply,
  employees = [],
  search = "",
  loading = false,
  selectedEmpIds,
  onSelectedEmpIdsChange: setSelectedEmpIds,
}: LeaveDailyDateGridProps) => {
  const count = days.length;
  const [formTarget, setFormTarget] = useState<LeaveFormTarget | null>(null);
  const [summaryTarget, setSummaryTarget] = useState<LeaveSummaryTarget | null>(null);
  // which employee's summary icon is active (open) right now
  const [summaryEmpId, setSummaryEmpId] = useState<string | null>(null);
  const { showToast, toastNode } = useLeaveDailyToast();
  // Multi-select apply -> POST .../bulk-leave-request/download (returns the result Excel)
  const [bulkLeaveRequestDownload, { isLoading: downloading }] =
    useBulkLeaveRequestDownloadMutation();
  const applying = downloading;
  // ===== CHANGED: confirm before apply leave =====
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Lock page: no scroll, no background keys while confirm is open
  useEffect(() => {
    if (!confirmOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      // Block all page shortcuts; only allow Tab inside dialog, Esc = Cancel
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        if (!applying) setConfirmOpen(false);
        return;
      }
      // Stop other keys from reaching the page (except Tab for accessibility)
      if (event.key !== "Tab") {
        event.stopPropagation();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [confirmOpen, applying]);
  // ===== END CHANGED =====
  const [tip, setTip] = useState<{
    code: string;
    title: string;
    who: string;
    when: string;
    x: number;
    y: number;
  } | null>(null);
  const showTip = (
    event: ReactMouseEvent<HTMLElement>,
    code: string,
    who = "",
    day?: number,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const info = getCodeInfo(code);
    let when = "";
    if (day) {
      const date = new Date(formYear, formMonthIndex, day);
      when = date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    setTip({
      code,
      title: info.title,
      who,
      when,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };
  const hideTip = () => setTip(null);
  useEffect(() => {
    if (!tip) return;
    window.addEventListener("scroll", hideTip, true);
    return () => window.removeEventListener("scroll", hideTip, true);
  }, [tip]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleExpanded = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // ===== CHANGED: load leave balance from backend when eye is opened =====
  // GET /admin/ta/leave/daily/employee-leave-balance?employeeId=
  const [balanceEmpId, setBalanceEmpId] = useState<string | undefined>();
  const { rows: apiBalanceRows, loading: balanceLoading } =
    useEmployeeLeaveBalance(balanceEmpId);

  // ===== CHANGED: map backend leave-balance fields → UI columns =====
  // API: Opening / OpeningBalance, Accrued, Availed, Encashed, Adjusted, Closing / ClosingBalance, lapsed
  // UI:  Opening, Accrued, Availed, Lapsed, Encashed, Adjusted, Closing  (same names as backend)
  // LeaveType can be string OR ["CL","Casual Leave"]
  const mapApiBalanceRows = (
    rows: Array<Record<string, unknown>>,
  ): LeaveBalanceRow[] => {
    if (!rows.length) return [];

    const num = (v: unknown): number | null => {
      if (v === undefined || v === null || v === "") return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const leaveTypeLabel = (raw: unknown): string => {
      if (Array.isArray(raw)) {
        // e.g. ["CL", "Casual Leave"] → "CL"
        const code = raw[0] != null ? String(raw[0]) : "";
        const name = raw[1] != null ? String(raw[1]) : "";
        return code && name ? `${code}` : code || name || "";
      }
      if (raw == null) return "";
      return String(raw);
    };

    return rows.map((rec) => {
      const leaveType = leaveTypeLabel(
        rec.LeaveType ?? rec.leaveType ?? rec.LeaveTypeName ?? rec.leaveTypeName,
      );

      // Explicit map from API field names → BALANCE_COLUMNS (UI names = backend names)
      const values: Record<string, number | null> = {
        Opening: num(rec.OpeningBalance ?? rec.openingBalance ?? rec.Opening ?? rec.opening),
        Accrued: num(rec.Accrued ?? rec.accrued ?? rec.Allotted ?? rec.allotted),
        Availed: num(rec.Availed ?? rec.availed),
        Lapsed: num(rec.lapsed ?? rec.Lapsed ?? rec.LapsedBalance),
        Encashed: num(rec.Encashed ?? rec.encashed),
        Adjusted: num(rec.Adjusted ?? rec.adjusted),
        Closing: num(rec.ClosingBalance ?? rec.closingBalance ?? rec.Closing ?? rec.closing),
      };

      const out: LeaveBalanceRow = { leaveType };
      for (const col of BALANCE_COLUMNS) {
        out[col] = values[col] ?? null;
      }
      return out;
    });
  };
  // ===== END CHANGED =====
  // ===== END CHANGED =====
  const { year: formYear, monthIndex: formMonthIndex } = parseMonthValue(month);

  // ----- Sort by employee name: null = API order, "asc" = A→Z, "desc" = Z→A -----
  const [nameSort, setNameSort] = useState<"asc" | "desc" | null>(null);
  const toggleNameSort = () =>
    setNameSort((current) => (current === "asc" ? "desc" : "asc"));

  const visibleEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? employees.filter((row) => {
          const id = String(row.EmployeeID ?? row.employeeId ?? "").toLowerCase();
          const name = String(row.FullName ?? row.fullName ?? "").toLowerCase();
          return id.includes(q) || name.includes(q);
        })
      : employees;

    if (!nameSort) return filtered;

    const nameOf = (row: Record<string, unknown>) =>
      String(row.FullName ?? row.fullName ?? "").trim();
    const idOf = (row: Record<string, unknown>) =>
      String(row.EmployeeID ?? row.employeeId ?? "");

    return [...filtered].sort((a, b) => {
      const byName = nameOf(a).localeCompare(nameOf(b), undefined, {
        sensitivity: "base",
        numeric: true,
      });
      // same name (e.g. many "Arun Kumar") -> order by Emp Id
      const result =
        byName !== 0 ? byName : idOf(a).localeCompare(idOf(b), undefined, { numeric: true });
      return nameSort === "asc" ? result : -result;
    });
  }, [employees, search, nameSort]);
  // ----- client-side paging (Rows per page / 1 to 10 of N) -----
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const totalRows = visibleEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagedEmployees = useMemo(
    () => visibleEmployees.slice(pageStart, pageStart + pageSize),
    [visibleEmployees, pageStart, pageSize],
  );
  useEffect(() => setPage(1), [search, employees, pageSize, nameSort]);

  const pageNumbers = useMemo(() => {
    const out: (number | "…")[] = [];
    for (let n = 1; n <= totalPages; n += 1) {
      if (n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1) out.push(n);
      else if (out[out.length - 1] !== "…") out.push("…");
    }
    return out;
  }, [totalPages, currentPage]);

  const daysWidth: CSSProperties = { width: `calc(var(--dw) * ${count})` };
  const leftWidth: CSSProperties = { width: "calc(var(--c1) + var(--c2))" };

  const presets = [
    { label: "1–7", value: Math.min(7, count) },
    { label: "1–15", value: Math.min(15, count) },
    { label: "Full month", value: count },
  ];

  const hasRows = !loading && visibleEmployees.length > 0;

  // Filters / month change can hide employees: drop them from the selection so
  // leave is never applied to someone who is not on screen.
  useEffect(() => {
    if (loading) return;
    setSelectedEmpIds((current) => {
      if (current.size === 0) return current;
      const present = new Set(
        employees.map((row) => String(row.EmployeeID ?? row.employeeId ?? "")),
      );
      const next = new Set(Array.from(current).filter((id) => present.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [employees, loading]);

  const toggleEmployee = (id: string) =>
    setSelectedEmpIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const allEmployeeIds = visibleEmployees.map((row) =>
    String(row.EmployeeID ?? row.employeeId ?? ""),
  );
  const allEmployeesSelected =
    allEmployeeIds.length > 0 && allEmployeeIds.every((id) => selectedEmpIds.has(id));
  const toggleAllEmployees = () =>
    setSelectedEmpIds(allEmployeesSelected ? new Set() : new Set(allEmployeeIds));

  // ===== CHANGED: skip weekly offs / holidays when applying leave =====
  const OFF_DAY_CODES = ["W", "WO", "H"];

  /**
   * For one employee: day numbers (1..dateRange) that are NOT a weekly off or
   * holiday, grouped into runs of consecutive days.  e.g. [[1,2],[5]]
   */
  const getWorkingDayRuns = (empId: string): number[][] => {
    const row = employees.find(
      (r) => String(r.EmployeeID ?? r.employeeId ?? "") === empId,
    );
    const runs: number[][] = [];
    let current: number[] = [];
    for (const d of days) {
      if (d.day > dateRange) break;
      const code = row ? getDayCodeFromRow(row, d.day).toUpperCase() : "-";
      if (OFF_DAY_CODES.includes(code)) {
        if (current.length) runs.push(current);
        current = [];
      } else {
        current.push(d.day);
      }
    }
    if (current.length) runs.push(current);
    return runs;
  };

  const toIsoDate = (day: number) => `${formYear}-${pad(formMonthIndex + 1)}-${pad(day)}`;

  /** Employees with the same working-day runs are sent together in one request */
  const buildApplyBatches = (empIds: string[]) => {
    const groups = new Map<string, { employeeList: string[]; runs: number[][] }>();
    for (const id of empIds) {
      const runs = getWorkingDayRuns(id);
      if (runs.length === 0) continue;
      const key = runs.map((r) => `${r[0]}-${r[r.length - 1]}`).join(",");
      const group = groups.get(key);
      if (group) group.employeeList.push(id);
      else groups.set(key, { employeeList: [id], runs });
    }
    return Array.from(groups.values());
  };
  // ===== END CHANGED =====

  // ===== CHANGED: confirm popup then bulk-leave-request =====
  const openApplyConfirm = () => {
    const employeeList = Array.from(selectedEmpIds).filter(Boolean);
    if (employeeList.length === 0) {
      showToast("Please select at least one employee", "error");
      return;
    }
    const dates = days
      .filter((d) => d.day <= dateRange)
      .map((d) => `${formYear}-${pad(formMonthIndex + 1)}-${pad(d.day)}`);
    if (dates.length === 0) {
      showToast("Please select at least one date", "error");
      return;
    }
    // the dropdown value IS the LeaveTypeId from the backend (company-dropdown-data)
    const leaveTypeId = Number(attendanceCode);
    if (!Number.isInteger(leaveTypeId) || leaveTypeId < 1) {
      showToast(
        attendanceOptions.length === 0
          ? "Leave types are not loaded yet - please try again in a moment"
          : "Please select a leave type",
        "error",
      );
      return;
    }
    if (buildApplyBatches(employeeList).length === 0) {
      showToast("All selected days are weekly offs or holidays - nothing to apply", "error");
      return;
    }
    setConfirmOpen(true);
  };

  /** Saves all result rows (from every request) into ONE Excel file */
  const saveBulkResultExcel = (
    headers: string[],
    rows: Record<string, unknown>[],
    fileName: string,
  ) => {
    if (!rows.length) return;
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    worksheet["!cols"] = headers.map((header) => ({
      wch: Math.min(
        60,
        Math.max(12, header.length, ...rows.map((row) => String(row[header] ?? "").length)),
      ),
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bulk Leave Result");
    XLSX.writeFile(workbook, fileName);
  };

  const attendanceLabel =
    attendanceOptions.find((option) => option.value === attendanceCode)?.label ?? "";

  const executeApply = async () => {
    const employeeList = Array.from(selectedEmpIds)
      .map((id) => String(id).trim())
      .filter(Boolean);
    const leaveTypeId = Number(attendanceCode);

    if (!Number.isInteger(leaveTypeId) || leaveTypeId < 1) {
      showToast("Please select a leave type", "error");
      setConfirmOpen(false);
      return;
    }

    const batches = buildApplyBatches(employeeList);

    // Collect the result rows of every request so the user gets ONE Excel file
    const allHeaders: string[] = [];
    const allRows: Record<string, unknown>[] = [];
    let fileName = "";
    let requestError: string | null = null;

    try {
      for (const batch of batches) {
        // one request per run of working days, so weekly offs / holidays are never sent
        for (const run of batch.runs) {
          const result = await bulkLeaveRequestDownload({
            employeeList: batch.employeeList,
            leaveTypeId,
            fromDate: toIsoDate(run[0]),
            toDate: toIsoDate(run[run.length - 1]),
            isHalfDay: false,
            isHRForceApply: true,
            // multi-employee leave apply never sends isAttendanceMarking
          }).unwrap();

          // Employee/date pairs that really got the leave (skip rows the SP rejected).
          // Dates are the ones the user selected, NOT the UTC dates in the result.
          const failedIds = getBulkLeaveFailedEmployeeIds(result.rows);
          const okEmployees = batch.employeeList.filter((id) => !failedIds.has(id));
          const okItems = buildReprocessItems(okEmployees, run.map((day) => toIsoDate(day)));
          // Only remembered here - POST /reprocess runs when the user clicks the Reprocess button
          addToReprocessQueue(okItems);

          fileName ||= result.fileName;
          result.headers.forEach((header) => {
            if (header && !allHeaders.includes(header)) allHeaders.push(header);
          });
          allRows.push(...result.rows);
        }
      }
    } catch (err) {
      requestError = getLeaveDailyErrorMessage(err);
    }

    // Download the result Excel (even if a later request failed, the earlier rows are real)
    saveBulkResultExcel(
      allHeaders,
      allRows,
      fileName || `bulk-leave-result-${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`,
    );

    const { failedCount, firstMessage } = getBulkLeaveFailures(allRows);
    setConfirmOpen(false);

    if (requestError) {
      showToast(requestError, "error");
      onApply?.(); // some days may already be saved - reload
      return;
    }

    if (failedCount > 0) {
      const okCount = Math.max(allRows.length - failedCount, 0);
      showToast(
        `${okCount} applied, ${failedCount} failed${firstMessage ? ` - ${firstMessage}` : ""}. See the downloaded Excel.`,
        "error",
      );
      onApply?.();
      return;
    }

    showToast(
      employeeList.length === 1
        ? "Leave applied - result Excel downloaded. Click Reprocess to update the table."
        : `Leave applied for ${employeeList.length} employees - result Excel downloaded. Click Reprocess to update the table.`,
    );
    setSelectedEmpIds(new Set());
    onApply?.();
  };

  const renderRow = (row: (typeof employees)[number], index: number) => {
    const empId = String(row.EmployeeID ?? row.employeeId ?? "");
    const fullName = String(row.FullName ?? row.fullName ?? "");
    const isOpen = expanded.has(empId);
    // NOD / NDP come from monthly-leave-calendar (row.NOD, row.NDP)
    const nod = row.NOD ?? row.nod ?? "-";
    const ndp = row.NDP ?? row.ndp ?? "-";
    // Holidays / weekly offs: backend fields if sent, else counted from the row's day codes
    let holidayCount = 0;
    let weekOffCount = 0;
    for (const d of days) {
      const c = getDayCodeFromRow(row, d.day).toUpperCase();
      if (c === "H") holidayCount += 1;
      else if (c === "W" || c === "WO") weekOffCount += 1;
    }
    const holidays = row.Holidays ?? row.holidays ?? row.H ?? holidayCount;
    const weekOffs = row.WeeklyOffs ?? row.weeklyOffs ?? row.WO ?? weekOffCount;
    return (
      <Fragment key={`${empId}-${index}`}>
      <div
        className="flex border-b border-[#f0d4cc] bg-white text-sm text-[#182237] hover:bg-[#fffaf8]"
      >
        <div
          className="sticky left-0 z-10 flex shrink-0 bg-white shadow-[6px_0_8px_-6px_rgba(16,24,40,0.12)]"
          style={{ width: "calc(var(--c1) + var(--c2))" }}
        >
          <div
            className="flex shrink-0 items-center gap-2 border-r border-[#f0d4cc] px-3 py-2.5 sm:px-4"
            style={{ width: "var(--c1)" }}
          >
            <input
              type="checkbox"
              checked={selectedEmpIds.has(empId)}
              onChange={() => toggleEmployee(empId)}
              aria-label={`Select ${fullName || empId}`}
              className="h-[16px] w-[16px] shrink-0 accent-[#914f3f]"
            />
            <div className="min-w-0">
              {/* full name: wraps onto a second line instead of being cut with "..." */}
              <div className="break-words text-[13px] font-semibold leading-snug">{fullName || "—"}</div>
              <div className="truncate text-[11px] text-[#8a94ad]">{empId}</div>
            </div>
          </div>
          <div
            className="flex shrink-0 items-center justify-center border-r border-[#f0d4cc]"
            style={{ width: "var(--c2)" }}
          >
            <div className="flex w-full items-center justify-center">
              <div className="flex shrink-0 items-center justify-center gap-3">
                <button
                  type="button"
                  title={isOpen ? "Hide leave balance" : "View leave balance"}
                  aria-label="View leave balance"
                  aria-expanded={isOpen}
                  onClick={() => {
                    // ===== CHANGED: open panel + fetch employee-leave-balance =====
                    toggleExpanded(empId);
                    setBalanceEmpId((current) =>
                      current === empId && expanded.has(empId) ? undefined : empId,
                    );
                  }}
                  className={`rounded-md p-1 transition ${
                    isOpen
                      ? "bg-[#914f3f] text-white shadow-sm ring-2 ring-[#f6dcd5]"
                      : "text-[#914f3f] hover:bg-[#fff1ed] hover:text-[#7f4234]"
                  }`}
                >
                  <Eye size={20} />
                </button>
                <button
                  type="button"
                  title="This month summary"
                  aria-label="This month summary"
                  aria-pressed={summaryEmpId === empId}
                  onClick={() => {
                    setSummaryEmpId(empId);
                    setSummaryTarget({
                      employeeName: fullName || empId,
                      present: String(ndp),
                      payDays: String(nod),
                      holidays: String(holidays),
                      weekOffs: String(weekOffs),
                    });
                  }}
                  className={`rounded-md p-1 transition active:scale-95 ${
                    summaryEmpId === empId
                      ? "bg-[#914f3f] text-white shadow-sm ring-2 ring-[#f6dcd5]"
                      : "text-[#914f3f] hover:bg-[#fff1ed] hover:text-[#7f4234]"
                  }`}
                >
                  <ClipboardClock size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex shrink-0" style={{ width: `calc(var(--dw) * ${count})` }}>
          {days.map(({ day, isWeekend }) => {
            const code = getDayCodeFromRow(row, day);
            const selected = day <= dateRange;
            // Leave Form opens for every cell except weekly off (W, WO), holiday (H) and pending (PN).
            // The cell's own code decides (not the calendar), so an employee who works on a
            // Sunday can still be edited, and a weekly off is never opened.
            const canOpenLeaveForm = !NO_LEAVE_FORM_CODES.includes(code.toUpperCase());
            return (
              <div
                key={day}
                className={`flex shrink-0 items-center justify-center border-r border-[#f6ebe7] text-[12px] font-semibold ${
                  selected ? "bg-[#fff1ed]" : isWeekend ? "bg-[#f8f9fb]" : "bg-white"
                }`}
                style={{ width: "var(--dw)", minHeight: 44 }}
              >
                {canOpenLeaveForm ? (
                  <button
                    type="button"
                    onMouseEnter={(event) => showTip(event, code, fullName || empId, day)}
                    onMouseLeave={hideTip}
                    aria-label={`Edit attendance for ${fullName || empId} on day ${day}`}
                    onClick={() =>
                      setFormTarget({
                        employeeId: empId,
                        employeeName: fullName,
                        day,
                        code,
                        year: formYear,
                        month: formMonthIndex + 1,
                      })
                    }
                    style={{ width: "min(34px, calc(var(--dw) - 4px))", height: "min(34px, calc(var(--dw) - 4px))", fontSize: "clamp(8px, calc(var(--dw) * 0.36), 12px)" }}
                    className={`grid place-items-center rounded-full font-semibold leading-none transition hover:ring-2 hover:ring-[#914f3f]/40 ${getCodeBadgeClass(code)}`}
                  >
                    {code}
                  </button>
                ) : (
                  <span
                    onMouseEnter={(event) => showTip(event, code, fullName || empId, day)}
                    onMouseLeave={hideTip}
                    style={{ width: "min(34px, calc(var(--dw) - 4px))", height: "min(34px, calc(var(--dw) - 4px))", fontSize: "clamp(8px, calc(var(--dw) * 0.36), 12px)" }}
                    className={`grid place-items-center rounded-full font-semibold leading-none ${getCodeBadgeClass(code)}`}
                  >
                    {code}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {isOpen && (
        <div className="border-b border-[#f0d4cc] bg-[#fffaf8]">
          <div className="sticky left-0 px-3 py-3 sm:px-4" style={{ width: "100cqw" }}>
            <div className="overflow-x-auto rounded-md bg-white">
              <table className="w-full min-w-[560px] border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#fff1ed] text-left text-[12px] font-bold uppercase text-[#914f3f]">
                    <th className="px-4 py-2.5">Leave Type</th>
                    {BALANCE_COLUMNS.map((col) => (
                      <th key={col} className="px-4 py-2.5 text-center">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* ===== CHANGED: API balance when this employee eye is open ===== */}
                  {(balanceEmpId === empId && apiBalanceRows.length > 0
                    ? mapApiBalanceRows(apiBalanceRows as Array<Record<string, unknown>>)
                    : balanceEmpId === empId && balanceLoading
                      ? DEFAULT_LEAVE_TYPES.map((leaveType) => ({ leaveType } as LeaveBalanceRow))
                      : getLeaveBalances(row)
                  ).map((bal) => (
                    <tr key={bal.leaveType} className="border-b border-[#eef1f5] last:border-b-0">
                      <td className="px-4 py-2.5">
                        <span className="rounded bg-[#fff1ed] px-2 py-1 text-[12px] font-bold text-[#914f3f]">{bal.leaveType}</span>
                      </td>
                      {BALANCE_COLUMNS.map((col) => (
                        <td key={col} className="px-4 py-2.5 text-center font-semibold text-[#303746]">
                          {bal[col] == null || bal[col] === "" ? "–" : Number(bal[col]).toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      </Fragment>
    );
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-[#e6eaf0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)]">
      {/* Card header */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-[#eef1f5] px-3 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#fff1ed] text-[#914f3f]">
            <CalendarRange size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-[17px] font-bold leading-tight text-[#182237]">
              Daily Attendance · {month.replace("/", " ")}
            </h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] font-medium text-[#738096]">
              <span>{count} days</span>
              <span className="inline-flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-sm bg-[#fdd9d0]" /> Selected
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-sm bg-[#d0483a]" /> Weekend
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-[#168b4c]" /> Today
              </span>
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">
          {/* Quick range presets */}
          <div className="flex items-center gap-0.5 rounded-lg bg-[#f3f5f9] p-1">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onDateRangeChange(preset.value)}
                className={`h-8 whitespace-nowrap rounded-md px-3 text-[13px] font-semibold transition ${
                  dateRange === preset.value
                    ? "bg-white text-[#914f3f] shadow-[0_1px_3px_rgba(16,24,40,0.12)]"
                    : "text-[#626874] hover:text-[#914f3f]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <SelectDropdown
            ariaLabel="Attendance code"
            value={attendanceCode}
            options={attendanceOptions}
            onChange={onAttendanceCodeChange}
            placeholder="Leave"
            disabled={attendanceOptions.length === 0}
            className="ml-auto w-[104px] sm:ml-0"
            menuWidth={140}
          />
          <button
            type="button"
            onClick={() => openApplyConfirm()}
            disabled={applying}
            className="flex h-11 shrink-0 disabled:cursor-not-allowed disabled:opacity-60 items-center gap-2 whitespace-nowrap rounded-lg bg-[#914f3f] px-5 text-[15px] font-semibold text-white shadow-[0_2px_6px_rgba(145,79,63,0.35)] transition hover:bg-[#7f4234] active:scale-[0.98]"
          >
            <Check size={17} /> {applying ? "Applying…" : "Apply"}
          </button>
        </div>
      </div>

      {/* ONE horizontal scroll container: header + rows scroll together, no inner vertical scroll */}
      <div
        className={`overflow-x-auto overflow-y-hidden [container-type:inline-size] ${SCROLL_X}`}
      >
        <div
          className={`w-max min-w-full ${gridVars}`}
          style={
            {
              // Fit all days on one screen; only scroll if each day would get < 20px
              "--dw": `max(20px, calc((100cqw - var(--c1) - var(--c2)) / ${count}))`,
            } as CSSProperties
          }
        >
          <div className="bg-white">
          {/* Slider row */}
          <div className="flex bg-[#fffaf8]">
            <div
              className="sticky left-0 z-20 flex shrink-0 items-center justify-between gap-2 border-r border-[#f0d4cc] bg-[#fffaf8] px-3 sm:px-4"
              style={leftWidth}
            >
              <span className="text-[14px] font-bold text-[#182237]">Date Range</span>
              <span className="whitespace-nowrap rounded-full bg-[#fff1ed] px-2.5 py-1 text-[12px] font-bold text-[#914f3f]">
                {pad(1)}–{pad(dateRange)}
                <span className="hidden font-semibold sm:inline"> · {dateRange}d</span>
              </span>
            </div>

            <div className="relative h-9 shrink-0" style={daysWidth}>
              {/* track + fill, from first to last day centre */}
              <div
                className="absolute top-[16px] h-1 rounded-full bg-[#eadbd6]"
                style={{ left: "calc(var(--dw) / 2)", right: "calc(var(--dw) / 2)" }}
              />
              <div
                className="absolute top-[16px] h-1 rounded-full bg-[#914f3f]"
                style={{
                  left: "calc(var(--dw) / 2)",
                  width: `calc(var(--dw) * ${dateRange - 1})`,
                }}
              />
              {/* one tick per day */}
              <div className="pointer-events-none absolute inset-x-0 top-[16px] flex h-1">
                {days.map(({ day }) => (
                  <span
                    key={day}
                    className="flex h-1 items-center justify-center"
                    style={{ width: "var(--dw)" }}
                  >
                    <span
                      className={`h-[3px] w-[3px] rounded-full ${day <= dateRange ? "bg-white/80" : "bg-[#cdb3ac]"}`}
                    />
                  </span>
                ))}
              </div>
              {/* thumb travels exactly from day 1 centre to last day centre */}
              <input
                type="range"
                min={1}
                max={count}
                step={1}
                value={dateRange}
                onChange={(event) => onDateRangeChange(Number(event.target.value))}
                aria-label="Date range"
                className={SLIDER}
                style={{
                  left: `calc(var(--dw) / 2 - ${THUMB / 2}px)`,
                  width: `calc(var(--dw) * ${count - 1} + ${THUMB}px)`,
                }}
              />
            </div>
          </div>

          {/* Header row */}
          <div className="flex border-y border-[#f0d4cc] bg-white text-sm font-semibold text-[#182237]">
            <div
              className="sticky left-0 z-20 flex shrink-0 bg-[#fff1ed] shadow-[6px_0_8px_-6px_rgba(16,24,40,0.18)]"
              style={leftWidth}
            >
              <div
                className="flex shrink-0 flex-col justify-between gap-3 border-r border-[#f0d4cc] px-3 py-3 sm:px-4"
                style={{ width: "var(--c1)" }}
              >
                <label className="flex cursor-pointer items-center gap-2 sm:gap-3">
                  <input type="checkbox" className="h-[18px] w-[18px] shrink-0 accent-[#914f3f]" />
                  Dates
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    aria-label="Select all employees"
                    checked={allEmployeesSelected}
                    onChange={toggleAllEmployees}
                    className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#914f3f]"
                  />
                  {/* Click to sort by name: A→Z, then Z→A */}
                  <button
                    type="button"
                    onClick={toggleNameSort}
                    title={nameSort === "asc" ? "Sort Z → A" : "Sort A → Z"}
                    aria-label={`Sort by name ${nameSort === "asc" ? "descending" : "ascending"}`}
                    className="group flex min-w-0 flex-1 items-center gap-2 text-left leading-tight outline-none"
                  >
                    <span className="transition group-hover:text-[#914f3f]">Emp Id / Name</span>
                    {/* Sort badge: ⇅ (not sorted) → ↑ A-Z → ↓ Z-A */}
                    <span
                      aria-hidden="true"
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-md transition ${
                        nameSort
                          ? "bg-[#914f3f] text-white shadow-[0_2px_5px_rgba(145,79,63,0.35)]"
                          : "bg-white text-[#b9a39d] ring-1 ring-[#f0cbc1] group-hover:text-[#914f3f] group-hover:ring-[#df8d7c]"
                      }`}
                    >
                      {nameSort === "asc" ? (
                        <ArrowUp size={14} strokeWidth={2.5} />
                      ) : nameSort === "desc" ? (
                        <ArrowDown size={14} strokeWidth={2.5} />
                      ) : (
                        <ArrowUpDown size={14} strokeWidth={2.25} />
                      )}
                    </span>
                  </button>
                </div>
              </div>
              <div
                className="flex shrink-0 items-center justify-center whitespace-nowrap px-2 text-[13px] font-bold text-[#914f3f] sm:text-sm"
                style={{ width: "var(--c2)" }}
              >
                Actions
              </div>
            </div>

            <div className="flex shrink-0" style={daysWidth}>
              {days.map(({ day, weekday, isWeekend }) => {
                const selected = day <= dateRange;
                return (
                  <div
                    key={day}
                    className={`relative flex shrink-0 flex-col items-center gap-1.5 border-r border-[#f6ebe7] py-2.5 transition-colors ${
                      selected ? "bg-[#fff1ed]" : isWeekend ? "bg-[#f8f9fb]" : "bg-white"
                    }`}
                    style={{ width: "var(--dw)" }}
                  >
                    {todayDay === day && (
                      <span
                        title="Today"
                        className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#168b4c]"
                      />
                    )}
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onDateRangeChange(day)}
                      aria-label={`Select up to day ${day}`}
                      className="h-[16px] w-[16px] cursor-pointer accent-[#914f3f]"
                    />
                    <span
                      style={{ fontSize: "clamp(10px, calc(var(--dw) * 0.36), 15px)" }}
                      className={`font-bold leading-none ${selected ? "text-[#182237]" : "text-[#8a94ad]"}`}
                    >
                      {day}
                    </span>
                    <span
                      style={{ fontSize: "clamp(7.5px, calc(var(--dw) * 0.25), 10.5px)" }}
                      className={`font-bold uppercase leading-none ${
                        isWeekend ? "text-[#d0483a]" : "text-[#8a94ad]"
                      }`}
                    >
                      {weekday}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          </div>
          {hasRows && (
            <div>
              {pagedEmployees.map((row, index) => renderRow(row, pageStart + index))}
            </div>
          )}
        </div>
      </div>

      {/* Employee rows from monthly-leave-calendar */}
      {loading ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500">Loading employees…</div>
      ) : visibleEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center sm:py-14">
          <img
            src={noDataImage}
            alt="No data available"
            className="h-auto w-[210px] max-w-full object-contain sm:w-[270px]"
          />
          <h3 className="mt-5 text-[18px] font-bold text-[#182237]">No records to show</h3>
          <p className="mt-1 max-w-sm text-[15px] text-[#738096]">
            No employees returned for this month.
          </p>
        </div>
      ) : null}

      {/* Pager - Rows per page / 1 to 10 of N */}
      {hasRows && (
        <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 border-t border-[#f0d4cc] bg-white px-4 py-2.5 text-[12.5px] font-medium text-[#738096]">
          <div className="flex items-center gap-2">
            Rows per page
            <RowsPerPageButtons
              value={pageSize}
              options={LEAVE_DAILY_PAGE_SIZE_OPTIONS}
              onChange={setPageSize}
            />
          </div>
          <span>
            {pageStart + 1} to {Math.min(pageStart + pageSize, totalRows)} of {totalRows}
          </span>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="First page" disabled={currentPage === 1} onClick={() => setPage(1)} className="grid h-8 w-8 place-items-center rounded-md text-[#914f3f] hover:bg-[#fff1ed] disabled:opacity-30"><ChevronsLeft size={16} /></button>
            <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="grid h-8 w-8 place-items-center rounded-md text-[#914f3f] hover:bg-[#fff1ed] disabled:opacity-30"><ChevronLeft size={16} /></button>
            {pageNumbers.map((n, i) =>
              n === "…" ? (
                <span key={`gap-${i}`} className="px-1">…</span>
              ) : (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`grid h-8 min-w-8 place-items-center rounded-md px-2 font-semibold ${
                    n === currentPage ? "bg-[#914f3f] text-white" : "text-[#182237] hover:bg-[#fff1ed]"
                  }`}
                >
                  {n}
                </button>
              ),
            )}
            <button type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="grid h-8 w-8 place-items-center rounded-md text-[#914f3f] hover:bg-[#fff1ed] disabled:opacity-30"><ChevronRight size={16} /></button>
            <button type="button" aria-label="Last page" disabled={currentPage === totalPages} onClick={() => setPage(totalPages)} className="grid h-8 w-8 place-items-center rounded-md text-[#914f3f] hover:bg-[#fff1ed] disabled:opacity-30"><ChevronsRight size={16} /></button>
          </div>
        </div>
      )}

      {tip &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[3000] font-[Urbanist]"
            style={{ left: tip.x, top: tip.y - 8, transform: "translate(-50%, -100%)" }}
          >
            <div className="relative w-max max-w-[230px] rounded-md border border-[#f0d4cc] bg-white px-2.5 py-1.5 shadow-[0_4px_12px_rgba(145,79,63,0.16)]">
              <div className="flex items-center gap-1.5">
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[8px] font-bold leading-none ${getCodeBadgeClass(tip.code)}`}
                >
                  {tip.code}
                </span>
                <span className="text-[11.5px] font-extrabold leading-tight text-[#182237]">
                  {tip.title}
                </span>
              </div>
              {(tip.who || tip.when) && (
                <div className="mt-0.5 text-[10px] font-medium leading-tight text-[#738096]">
                  {tip.who}
                  {tip.who && tip.when ? " · " : ""}
                  {tip.when}
                </div>
              )}
              <span className="absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-[#f0d4cc] bg-white" />
            </div>
          </div>,
          document.body,
        )}
      {/* ===== CHANGED: Apply leave confirmation ===== */}
      {confirmOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/70 px-4 font-[Urbanist]"
            onMouseDown={(e) => {
              // Click outside does nothing — only Cancel / Yes, Apply
              e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Confirm apply leave"
              className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.25)]"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#fff1ed] text-[#914f3f]">
                <Check size={22} />
              </div>
              <h3 className="text-center text-[18px] font-bold text-[#182237]">
                Confirm leave application
              </h3>
              <p className="mt-2 text-center text-[13px] leading-relaxed text-[#526070]">
                You are about to apply{" "}
                <span className="font-bold text-[#914f3f]">{attendanceLabel}</span>
                {" "}leave for{" "}
                <span className="font-bold text-[#182237]">
                  {selectedEmpIds.size} employee{selectedEmpIds.size === 1 ? "" : "s"}
                </span>
                .
              </p>
              <div className="mt-3 rounded-xl border border-[#f0d4cc] bg-[#fffaf8] px-4 py-3 text-[12.5px] text-[#526070]">
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-[#8a94ad]">Leave type</span>
                  <span className="font-bold text-[#914f3f]">{attendanceLabel}</span>
                </div>
                <div className="mt-1.5 flex justify-between gap-3">
                  <span className="font-medium text-[#8a94ad]">Employees</span>
                  <span className="font-bold text-[#182237]">{selectedEmpIds.size}</span>
                </div>
                <div className="mt-1.5 flex justify-between gap-3">
                  <span className="font-medium text-[#8a94ad]">Period</span>
                  <span className="font-bold text-[#182237]">
                    Day 1 – {dateRange} · {month}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-center text-[12px] text-[#8a94ad]">
                Please review the details before confirming. A result Excel will download after applying.
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={applying}
                  onClick={() => setConfirmOpen(false)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-[13px] font-semibold text-[#303746] hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={applying}
                  onClick={() => void executeApply()}
                  className="h-10 rounded-lg bg-[#914f3f] px-5 text-[13px] font-semibold text-white hover:bg-[#7f4234] disabled:opacity-60"
                >
                  {applying ? "Applying…" : "Yes, Apply"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
      {/* ===== END CHANGED ===== */}
      <LeaveSummaryModal
        target={summaryTarget}
        onClose={() => {
          setSummaryTarget(null);
          setSummaryEmpId(null);
        }}
      />
      <LeaveFormModal
        target={formTarget}
        onClose={() => setFormTarget(null)}
      />
      {toastNode}
    </div>
  );
};
/* ======================= Page ======================= */

interface LeaveDailyPageProps {
  /** Optional: options loaded from the API. Missing keys fall back to the defaults. */
  filterOptions?: Partial<Record<LeaveDailyFilterKey, SelectOption[]>>;
}

const DEFAULT_RANGE_END = 14;

const LeaveDailyPage = ({ filterOptions }: LeaveDailyPageProps) => {
  const [month, setMonth] = useState(getCurrentMonthValue);
  // "" = All Policies (no policyId is sent -> every employee is returned)
  const [leavePolicy, setLeavePolicy] = useState(ALL_POLICIES_VALUE);

  // ----- Reprocess -----
  const { showToast, toastNode } = useLeaveDailyToast();
  const { policies: apiPolicies } = useDailyPolicies();
  const [reprocessDailyLeave] = useReprocessDailyLeaveMutation();
  const [reprocessConfirmOpen, setReprocessConfirmOpen] = useState(false);
  const [reprocessRunning, setReprocessRunning] = useState(false);
  const [reprocessProgress, setReprocessProgress] = useState<{ done: number; total: number } | null>(null);
  /** What the server answered for each employee/date (null = result window closed) */
  const [reprocessResults, setReprocessResults] = useState<ReprocessResultItem[] | null>(null);
  // Employees ticked in the table: Reprocess uses them together with the selected dates
  const [selectedEmpIds, setSelectedEmpIds] = useState<Set<string>>(new Set());
  // employee/date pairs saved after each leave save (kept in localStorage) - used when nobody is selected
  const reprocessQueue = useReprocessQueue();

  // "All Policies" first, then the real policies (value = policyId) from company-dropdown-data
  const policyOptions: SelectOption[] = useMemo(
    () => [
      { label: "All Policies", value: ALL_POLICIES_VALUE },
      ...apiPolicies.map((policy) => ({ label: policy.label, value: String(policy.value) })),
    ],
    [apiPolicies],
  );

  // Once the API policies load, make sure the selected value is one of them
  useEffect(() => {
    if (!policyOptions.some((option) => option.value === leavePolicy)) {
      setLeavePolicy(policyOptions[0]?.value ?? "");
    }
  }, [policyOptions, leavePolicy]);

  // Apply dropdown: leave types from the backend (value = LeaveTypeId, label = code)
  const { leaveTypes: leaveTypeCodes } = useLeaveCodeOptions();
  const applyOptions: SelectOption[] = useMemo(
    () => leaveTypeCodes.map((type) => ({ label: type.code, value: String(type.id) })),
    [leaveTypeCodes],
  );
  const [attendanceCode, setAttendanceCode] = useState("");
  // pick the first leave type once the list arrives (or if the selected one disappears)
  useEffect(() => {
    if (!applyOptions.some((option) => option.value === attendanceCode)) {
      setAttendanceCode(applyOptions[0]?.value ?? "");
    }
  }, [applyOptions, attendanceCode]);
  const [dateRange, setDateRange] = useState(DEFAULT_RANGE_END);

  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(EMPTY_FILTER_SELECTION);

  // All 12 months of previous / current / next year - the dropdown scrolls
  // Month dropdown: months from the backend (company-dropdown-data -> monthYear), not a fixed list
  const { months: apiMonths } = useDailyMonths();
  // Only this month and the previous 2 months can be picked; every other month is disabled
  const monthOptions: SelectOption[] = useMemo(
    () =>
      apiMonths.length > 0
        ? apiMonths.map((option) => ({
            ...option,
            disabled: !isSelectableMonth(option.value),
            disabledReason: MONTH_DISABLED_REASON,
          }))
        : [{ label: month, value: month }],
    [apiMonths, month],
  );
  // If the selected month is missing from the list or disabled, use this month
  // (or the latest month that is allowed)
  useEffect(() => {
    if (apiMonths.length === 0) return;
    if (apiMonths.some((option) => option.value === month) && isSelectableMonth(month)) return;
    const allowed = apiMonths.filter((option) => isSelectableMonth(option.value));
    const current = getCurrentMonthValue();
    setMonth(
      allowed.some((option) => option.value === current)
        ? current
        : (allowed[allowed.length - 1] ?? apiMonths[apiMonths.length - 1]).value,
    );
  }, [apiMonths, month]);
  const days = useMemo(() => getMonthDays(month), [month]);

  // ----- Backend: filter dropdowns + monthly leave calendar -----
  // Existing parseMonthValue returns { year, monthIndex: 0-11 }; API needs month 1-12
  const { options: apiFilterOptions } = useLeaveDailyFilterOptions();
  const { year, month: monthNumber } = useMemo(() => {
    const parsed = parseMonthValue(month);
    return { year: parsed.year, month: parsed.monthIndex + 1 };
  }, [month]);
  // Every dropdown is sent to the backend (monthly-leave-calendar), which does the filtering
  const {
    rows: calendarRows,
    loading: calendarLoading,
    error: calendarError,
    reload: reloadCalendar,
  } = useMonthlyLeaveCalendar({
    year,
    month: monthNumber,
    branchIds: selectedFilters.branch ?? [],
    employmentStatusIds: selectedFilters.empStatus ?? [],
    designationIds: selectedFilters.designation ?? [],
    structureIds: selectedFilters.salaryStructure ?? [],
    leaveTypeIds: selectedFilters.leave ?? [],
    attendanceStatusIds: selectedFilters.attendance ?? [],
    policyId: leavePolicy,
  });

  const mergedFilterOptions = useMemo(
    () => ({
      ...LEAVE_DAILY_FILTER_OPTIONS,
      ...apiFilterOptions,
      ...filterOptions,
    }),
    [apiFilterOptions, filterOptions],
  );

  const handleMonthChange = (next: string) => {
    setMonth(next);
    // e.g. 30 -> Feb (28/29 days): keep the range inside the month
    setDateRange((current) => Math.min(current, getDaysInMonth(next)));
  };

  const handleFilterChange = (key: LeaveDailyFilterKey, values: string[]) =>
    setSelectedFilters((current) => ({ ...current, [key]: values }));

  const handleClearFilters = () => setSelectedFilters(EMPTY_FILTER_SELECTION);

  // Filter bar is always visible now (filter icon removed) - X just clears everything
  const handleCloseFilters = () => {
    setSearch("");
    setSelectedFilters(EMPTY_FILTER_SELECTION);
  };

  const todayDay = month === getCurrentMonthValue() ? new Date().getDate() : undefined;

  // ----- Reprocess: which employee/date pairs are sent -----
  const pad2 = (value: number) => String(value).padStart(2, "0");
  const { year: monthYearNumber, monthIndex: monthIndexNumber } = parseMonthValue(month);

  // Selected dates = day 1 .. the date range chosen above the table (no future days in the current month)
  const selectedDates = useMemo(() => {
    const lastDay = Math.min(dateRange, todayDay ?? days.length);
    return days
      .filter(({ day }) => day <= lastDay)
      .map(({ day }) => `${monthYearNumber}-${pad2(monthIndexNumber + 1)}-${pad2(day)}`);
  }, [days, dateRange, todayDay, monthYearNumber, monthIndexNumber]);

  // Employees selected in the table -> every selected employee x every selected date.
  // Nobody selected -> the days saved after earlier leave.
  const reprocessFromSelection = selectedEmpIds.size > 0;
  const reprocessItems: ReprocessItem[] = useMemo(
    () =>
      reprocessFromSelection
        ? buildReprocessItems(Array.from(selectedEmpIds), selectedDates)
        : reprocessQueue.map((item) => ({ employeeId: item.employeeId, date: item.date })),
    [reprocessFromSelection, selectedEmpIds, selectedDates, reprocessQueue],
  );
  const reprocessEmployeeCount = useMemo(
    () => new Set(reprocessItems.map((item) => item.employeeId)).size,
    [reprocessItems],
  );
  const reprocessDayCount = useMemo(
    () => new Set(reprocessItems.map((item) => item.date)).size,
    [reprocessItems],
  );
  const employeeNameById = useMemo(() => {
    const names: Record<string, string> = {};
    for (const row of calendarRows) {
      const id = String(row.EmployeeID ?? row.employeeId ?? "").trim();
      if (id) names[id] = String(row.FullName ?? row.fullName ?? "").trim();
    }
    return names;
  }, [calendarRows]);

  /**
   * Sends the items to POST /reprocess in batches and collects the server's answer for each one.
   * Returns one result per item (a batch that could not be sent is marked failed).
   */
  const runReprocess = async (items: ReprocessItem[]): Promise<ReprocessResultItem[]> => {
    if (items.length === 0) return [];
    setReprocessRunning(true);
    setReprocessProgress({ done: 0, total: items.length });

    const all: ReprocessResultItem[] = [];
    for (let start = 0; start < items.length; start += REPROCESS_BATCH_SIZE) {
      const batch = items.slice(start, start + REPROCESS_BATCH_SIZE);
      try {
        // POST /admin/ta/leave/daily/reprocess   { items: [{ employeeId, date }] }
        const { results } = await reprocessDailyLeave({ items: batch }).unwrap();
        all.push(...results);
        // anything the server did not answer for counts as failed
        const answered = new Set(results.map((result) => `${result.employeeId}|${result.date}`));
        for (const item of batch) {
          if (!answered.has(`${item.employeeId}|${item.date}`)) {
            all.push({ ...item, success: false, message: "No answer from the server for this item." });
          }
        }
      } catch (err) {
        const message = getLeaveDailyErrorMessage(err);
        all.push(...batch.map((item) => ({ ...item, success: false, message })));
      }
      setReprocessProgress({ done: Math.min(start + batch.length, items.length), total: items.length });
    }

    // done pairs leave the saved list; failed ones stay so they can be retried
    removeFromReprocessQueue(all.filter((result) => result.success));
    setReprocessRunning(false);
    setReprocessProgress(null);
    void reloadCalendar(); // the server recalculated now, so the table shows the new codes
    return all;
  };

  const handleReprocessClick = () => {
    if (reprocessItems.length === 0) {
      showToast("Select employees in the table (or save a leave) to reprocess", "error");
      return;
    }
    setReprocessConfirmOpen(true);
  };

  const handleReprocessConfirm = async () => {
    const results = await runReprocess(reprocessItems);
    setReprocessConfirmOpen(false);
    setReprocessResults(results);
  };

  const handleRetryFailed = async () => {
    const previous = reprocessResults ?? [];
    const failed = previous
      .filter((result) => !result.success)
      .map(({ employeeId, date }) => ({ employeeId, date }));
    const retried = await runReprocess(failed);
    setReprocessResults([...previous.filter((result) => result.success), ...retried]);
  };


  return (
    <div className="flex w-full min-w-0 flex-col gap-3 bg-[#f6f8fb] font-[Urbanist] text-[#101828]">
      <LeaveDailyToolbar
        leavePolicy={leavePolicy}
        policyOptions={policyOptions}
        onLeavePolicyChange={setLeavePolicy}
        month={month}
        monthOptions={monthOptions}
        onMonthChange={handleMonthChange}
        onExport={() => exportDailyAttendanceExcel(month, dateRange, days)}
        onReprocess={handleReprocessClick}
        reprocessing={reprocessRunning}
        reprocessCount={reprocessItems.length}
      />

      <LeaveDailyFilterBar
        search={search}
        onSearchChange={setSearch}
        options={mergedFilterOptions}
        selected={selectedFilters}
        onSelectedChange={handleFilterChange}
        onClearAll={handleClearFilters}
        onClose={handleCloseFilters}
      />

      {/* Shows Network: POST .../monthly-leave-calendar */}
      {calendarLoading && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Loading monthly leave calendar…
        </div>
      )}
      {calendarError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {calendarError}{" "}
          <button type="button" className="underline" onClick={() => void reloadCalendar()}>
            Retry
          </button>
        </div>
      )}

      <LeaveDailyDateGrid
        month={month}
        days={days}
        todayDay={todayDay}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        attendanceCode={attendanceCode}
        attendanceOptions={applyOptions}
        onAttendanceCodeChange={setAttendanceCode}
        employees={calendarRows}
        search={search}
        loading={calendarLoading}
        selectedEmpIds={selectedEmpIds}
        onSelectedEmpIdsChange={setSelectedEmpIds}
      />

      <ReprocessConfirmModal
        open={reprocessConfirmOpen}
        source={reprocessFromSelection ? "selection" : "saved"}
        itemCount={reprocessItems.length}
        employeeCount={reprocessEmployeeCount}
        dayCount={reprocessDayCount}
        rangeLabel={`${pad2(1)}–${pad2(selectedDates.length)} ${MONTH_LABELS[monthIndexNumber]} ${monthYearNumber}`}
        skippedSavedCount={reprocessQueue.length}
        loading={reprocessRunning}
        progress={reprocessProgress}
        onCancel={() => setReprocessConfirmOpen(false)}
        onConfirm={() => void handleReprocessConfirm()}
      />
      <ReprocessResultModal
        results={reprocessResults}
        nameById={employeeNameById}
        retrying={reprocessRunning}
        onRetryFailed={() => void handleRetryFailed()}
        onClose={() => setReprocessResults(null)}
      />
      {toastNode}
    </div>
  );
};

export default LeaveDailyPage;