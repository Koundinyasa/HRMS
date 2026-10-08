import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import TimeOfficeNavbar from "../../components/TimeOfficeNavbar";
import LeaveCalendarSearch from "../components/LeaveCalendarSearch";
import LeaveCalendarTable from "../components/LeaveCalendarTable";
import LeaveCalendarFooter from "../components/LeaveCalendarFooter";

import DailyLogModal, { type PunchLogEntry } from "../components/DailyLogModal";

import type {
  LeaveCalendarEmployee,
  LeaveCalendarDay,
} from "../types/leavecalendar.types";

import { useMonthlyLeaveCalendar } from "../hooks/useMonthlyLeaveCalendar";

import {
  buildLeaveCalendarDays,
  getCalendarDayKeys,
  LEAVE_CALENDAR_CONSTANTS,
} from "../constants/leaveCalendar.constants";
import { useLazyGetEmployeeDailyRawPunchesQuery } from "@/features/employee/review/attendanceOverview/api/regularizationApi";
import {
  Bookmark,
  ChevronDown,
  FileSpreadsheet,
  Filter,
  History,
  MoreVertical,
  Plus,
  X,
} from "lucide-react";
import { MonthPicker } from "@/components/ui/monthpicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
// =========================================================
// RAW PUNCH API
// =========================================================
const LEAVE_TYPE_OPTIONS = [
  { value: "none", label: "Select Leave Type" },
  { value: "P", label: "Present" },
  { value: "A", label: "Absent" },
  { value: "W", label: "Week Off" },
  { value: "H", label: "Holiday" },
];
const LeaveCalendar = () => {
  // =========================================================
  // BASIC STATE
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [leaveType, setLeaveType] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState<number>(
    LEAVE_CALENDAR_CONSTANTS.DEFAULT_ROWS_PER_PAGE,
  );

  const navScrollRef = useRef<HTMLDivElement>(null);
  const monthPickerRef = useRef<HTMLDivElement>(null);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [navOffset, setNavOffset] = useState(0);

  const openMonthPicker = () => {
    if (monthPickerOpen) return;
    setNavOffset(navScrollRef.current?.scrollLeft ?? 0);
    setMonthPickerOpen(true);
  };

  // restore the scroll position once the picker is closed
  useLayoutEffect(() => {
    if (!monthPickerOpen && navScrollRef.current) {
      navScrollRef.current.scrollLeft = navOffset;
    }
  }, [monthPickerOpen, navOffset]);

  // treat an outside click or Escape as "picker closed"
  useEffect(() => {
    if (!monthPickerOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (!monthPickerRef.current?.contains(event.target as Node)) {
        setMonthPickerOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMonthPickerOpen(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [monthPickerOpen]);

  // =========================================================
  // DAILY LOG MODAL STATE
  // =========================================================

  const [dailyLogOpen, setDailyLogOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<{
    employeeName: string;
    employeeId: string;
    date: string;
    apiDate: string;
    status: string;
    punches: PunchLogEntry[];
  } | null>(null);

  const [punchesLoading, setPunchesLoading] = useState(false);

  // =========================================================
  // MONTHLY LEAVE CALENDAR API
  // =========================================================

  const companyId = 1;

  const selectedYear = new Date().getFullYear();

  // API expects month 1 - 12
  const apiMonth = selectedMonth + 1;

  const {
    data: monthlyLeaveCalendar = [],
    isLoading,
    isError,
    error,
  } = useMonthlyLeaveCalendar({
    companyId,
    year: selectedYear,
    month: apiMonth,
  });

  // =========================================================
  // RAW PUNCH API
  // =========================================================

  const [getEmployeeRawPunches] = useLazyGetEmployeeDailyRawPunchesQuery();

  // =========================================================
  // DEBUG - PAGE LOAD
  // =========================================================

  useEffect(() => {
    console.log("========================================");

    console.log("LEAVE CALENDAR PAGE LOADED");

    console.log("Year:", selectedYear);

    console.log("Month:", apiMonth);

    console.log("Employees received:", monthlyLeaveCalendar.length);

    console.log("========================================");
  }, [selectedYear, apiMonth, monthlyLeaveCalendar.length]);

  // =========================================================
  // DEBUG - DAILY LOG
  // =========================================================

  useEffect(() => {
    console.log("DAILY LOG OPEN:", dailyLogOpen);

    console.log("SELECTED EMPLOYEE:", selectedEmployee);
  }, [dailyLogOpen, selectedEmployee]);

  // =========================================================
  // CALENDAR DAYS
  // =========================================================

  const days = useMemo(
    () => buildLeaveCalendarDays(selectedYear, selectedMonth),
    [selectedYear, selectedMonth],
  );

  // =========================================================
  // SEARCH
  // =========================================================

  const searchValue = searchTerm.toLowerCase().trim();

  const filteredEmployees = useMemo(
    () =>
      monthlyLeaveCalendar.filter((employee) => {
        const name = String(employee.FullName ?? "").toLowerCase();

        const id = String(employee.EmployeeID ?? "").toLowerCase();

        return name.includes(searchValue) || id.includes(searchValue);
      }),
    [monthlyLeaveCalendar, searchValue],
  );

  // =========================================================
  // RESET PAGE WHEN SEARCH CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalItems = filteredEmployees.length;

  const pageCount = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const safePage = Math.min(currentPage, pageCount);

  const paginatedEmployees = filteredEmployees.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );

  // =========================================================
  // LEGEND
  // =========================================================

  const legendCodes = useMemo(() => {
    const codes = new Set<string>();

    filteredEmployees.forEach((employee) => {
      getCalendarDayKeys(employee).forEach((key) => {
        const value = String(employee[key] ?? "")
          .trim()
          .toUpperCase();

        if (value) {
          codes.add(value);
        }
      });
    });

    return Array.from(codes).sort();
  }, [filteredEmployees]);

  // =========================================================
  // ROWS PER PAGE
  // =========================================================

  const handleRowsPerPageChange = (value: number) => {
    console.log("ROWS PER PAGE:", value);

    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // =========================================================
  // ATTENDANCE BADGE CLICK
  // =========================================================

  const handleAttendanceClick = async (
    employee: LeaveCalendarEmployee,
    day: LeaveCalendarDay,
    status: string,
  ) => {
    console.log("");
    console.log("==========================================");

    console.log("ATTENDANCE BADGE CLICKED");

    console.log("Employee:", employee.FullName);

    console.log("Employee ID:", employee.EmployeeID);

    console.log("Day:", day);

    console.log("Status:", status);

    const employeeName = String(employee.FullName ?? "").trim() || "-";

    const employeeId = String(employee.EmployeeID ?? "").trim() || "-";

    // Display date
    const selectedDate = `${day.date} ${day.weekday}`;

    // =====================================================
    // API DATE
    // Example:
    // 2026-09-10
    // =====================================================

    const apiDate = `${selectedYear}-${String(apiMonth).padStart(
      2,
      "0",
    )}-${String(day.date).padStart(2, "0")}`;

    const selectedStatus = String(status ?? "").trim() || "No Record";

    console.log("Employee ID for API:", employeeId);

    console.log("Date for API:", apiDate);

    console.log("==========================================");

    // =====================================================
    // OPEN MODAL
    // =====================================================

    setSelectedEmployee({
      employeeName,
      employeeId,
      date: selectedDate,
      apiDate,
      status: selectedStatus,
      punches: [],
    });

    setDailyLogOpen(true);

    // =====================================================
    // LOADING
    // =====================================================

    setPunchesLoading(true);

    try {
      console.log("CALLING RAW PUNCH API");

      console.log("REQUEST BODY:", {
        employeeId,
        date: apiDate,
      });

      // ===================================================
      // API CALL
      // ===================================================

      const response = await getEmployeeRawPunches({
        employeeId,
        date: apiDate,
      }).unwrap();

      console.log("==========================================");

      console.log("RAW PUNCH API RESPONSE:");

      console.log(response);

      console.log("==========================================");

      // ===================================================
      // MAP API RESPONSE
      //
      // Backend:
      //
      // PunchType     -> type
      // OriginalTime  -> time
      // EntryType     -> source
      //
      // ===================================================

      const punches: PunchLogEntry[] = response.map((punch) => ({
        type: String(punch.type ?? "").toUpperCase() === "OUT" ? "Out" : "In",

        time: punch.time || "-",

        entryType: punch.source || "-",

        location: undefined,

        hasSelfie: false,
      }));

      console.log("MAPPED PUNCH DATA:");

      console.log(punches);

      // ===================================================
      // UPDATE MODAL
      // ===================================================

      setSelectedEmployee((current) => {
        if (
          !current ||
          current.employeeId !== employeeId ||
          current.apiDate !== apiDate
        ) {
          return current;
        }

        return {
          ...current,
          punches,
        };
      });
    } catch (apiError) {
      console.error("==========================================");

      console.error("RAW PUNCH API ERROR:");

      console.error(apiError);

      console.error("==========================================");

      setSelectedEmployee((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          punches: [],
        };
      });
    } finally {
      setPunchesLoading(false);
    }
  };

  // =========================================================
  // CLOSE DAILY LOG
  // =========================================================

  const handleCloseDailyLog = () => {
    console.log("CLOSING DAILY LOG");

    setDailyLogOpen(false);

    setSelectedEmployee(null);

    setPunchesLoading(false);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-full w-full min-w-0 bg-[#f4f5f9] p-3 sm:p-6 md:h-full md:overflow-hidden">
      <div className="flex h-auto min-h-0 w-full flex-col overflow-visible md:h-full md:overflow-hidden">
        <TimeOfficeNavbar allowVerticalOverflow className="mb-3 shrink-0">
          <div
            ref={navScrollRef}
            className={`punch-horizontal-scroll max-w-[calc(100vw-5.5rem)] pb-1 sm:max-w-none sm:overflow-visible ${
              monthPickerOpen ? "overflow-visible" : "overflow-x-auto"
            }`}
          >
            <div
              className="flex w-max items-center gap-2"
              style={
                monthPickerOpen
                  ? { transform: `translateX(-${navOffset}px)` }
                  : undefined
              }
            >
              <div
                ref={monthPickerRef}
                onClick={openMonthPicker}
                className="w-[150px] shrink-0"
              >
                <MonthPicker
                  value={`${new Date(2000, selectedMonth, 1).toLocaleDateString(
                    "en-US",
                    { month: "short" },
                  )}/${selectedYear}`}
                  onChange={(value) => {
                    const monthIndex = new Date(
                      `${value.split("/")[0]} 1, 2000`,
                    ).getMonth();
                    if (!Number.isNaN(monthIndex)) setSelectedMonth(monthIndex);
                    setMonthPickerOpen(false);
                  }}
                  className="h-10 w-full border-slate-300 bg-white font-[Urbanist]"
                />
              </div>

              <Select
                value={leaveType || "none"}
                onValueChange={(value) => {
                  if (value !== null) {
                    setLeaveType(value === "none" ? "" : value);
                  }
                }}
              >
                <SelectTrigger
                  aria-label="Select Leave Type"
                  className="h-10 w-[160px] shrink-0 rounded-md border-slate-300 bg-white text-sm text-slate-600 shadow-none focus:ring-0"
                >
                  <span className="min-w-0 truncate">
                    {
                      LEAVE_TYPE_OPTIONS.find(
                        (option) => option.value === (leaveType || "none"),
                      )?.label
                    }
                  </span>
                </SelectTrigger>

                <SelectContent
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  alignItemWithTrigger={false}
                  className="w-(--anchor-width) min-w-[160px] max-w-[calc(100vw-2rem)]"
                >
                  {LEAVE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                type="button"
                title="Export attendance"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-emerald-200 text-emerald-600"
              >
                <FileSpreadsheet size={18} />
              </button>
              <button
                type="button"
                title="Filter attendance"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500"
              >
                <Filter size={18} />
              </button>
              <button
                type="button"
                title="Attendance history"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500"
              >
                <History size={18} />
              </button>
            </div>
          </div>
        </TimeOfficeNavbar>

        <div className="punch-horizontal-scroll flex shrink-0 items-center justify-end gap-2 overflow-x-auto rounded-t-xl border-b border-slate-200 bg-white px-3 py-2">
          {[
            "Half Day Status",
            "Revert",
            "Bulk Correction",
            "Exception",
            "Process",
          ].map((label) => (
            <button
              key={label}
              type="button"
              className={`inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-sm font-medium ${
                label === "Half Day Status" || label === "Exception"
                  ? "border-[#1997e8] bg-[#1997e8] text-white"
                  : "border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              <Bookmark size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* SEARCH */}

        <div className="punch-horizontal-scroll flex min-h-12 min-w-full shrink-0 items-center justify-between gap-3 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2">
          <LeaveCalendarSearch
            searchTerm={searchTerm}
            compact
            setSearchTerm={setSearchTerm}
          />
          <div className="ml-auto flex shrink-0 items-center gap-4">
            <button
              type="button"
              className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-slate-600 hover:text-[#1997e8]"
            >
              <Plus size={16} /> Add Filter
            </button>
            {[
              "Query",
              "TA Policy",
              "Pattern",
              "TA Supervisor",
              "Attendance",
              "Leave",
            ].map((label) => (
              <button
                key={label}
                type="button"
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm text-slate-500 hover:text-[#1997e8]"
              >
                {label} <ChevronDown size={15} />
              </button>
            ))}
            <button
              type="button"
              title="More filters"
              className="shrink-0 text-slate-500"
            >
              <MoreVertical size={18} />
            </button>
            <button
              type="button"
              title="Clear filters"
              onClick={() => {
                setSearchTerm("");
                setLeaveType("");
              }}
              className="shrink-0 text-red-400"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* LOADING */}

        {isLoading && (
          <div className="shrink-0 py-6 text-center text-gray-500">
            Loading monthly leave calendar...
          </div>
        )}

        {/* ERROR */}

        {isError && (
          <div className="shrink-0 py-6 text-center text-red-500">
            <p>Failed to load monthly leave calendar.</p>

            <pre className="mt-2 max-h-40 overflow-auto text-left text-xs">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* TABLE */}

        {!isLoading && !isError && (
          <div className="min-h-[320px] flex-none overflow-visible border-x border-[#e0e5ec] bg-white md:min-h-0 md:flex-1 md:overflow-hidden">
            <LeaveCalendarTable
              employees={paginatedEmployees}
              days={days}
              onAttendanceClick={handleAttendanceClick}
            />
          </div>
        )}

        {/* FOOTER */}

        <div className="shrink-0">
          <LeaveCalendarFooter
            totalItems={totalItems}
            currentPage={safePage}
            rowsPerPage={rowsPerPage}
            legendCodes={legendCodes}
            onRowsPerPageChange={handleRowsPerPageChange}
            onPrevPage={() => setCurrentPage((page) => Math.max(1, page - 1))}
            onNextPage={() =>
              setCurrentPage((page) => Math.min(pageCount, page + 1))
            }
          />
        </div>
      </div>

      {/* =====================================================
          DAILY LOG MODAL
      ===================================================== */}

      <DailyLogModal
        open={dailyLogOpen}
        onClose={handleCloseDailyLog}
        employeeName={selectedEmployee?.employeeName ?? "-"}
        employeeId={selectedEmployee?.employeeId ?? "-"}
        date={selectedEmployee?.date ?? "-"}
        status={selectedEmployee?.status ?? "-"}
        punches={selectedEmployee?.punches ?? []}
        punchesLoading={punchesLoading}
      />
    </div>
  );
};

export default LeaveCalendar;
