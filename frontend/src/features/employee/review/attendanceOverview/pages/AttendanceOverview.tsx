import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceTable from "../components/AttendanceTable";
import EmployeeSearchSelect from "../components/EmployeeSearchSelect";
import MonthlyOverview from "../components/MonthlyOverview";
import OverviewDetailsModal from "../components/OverviewDetailsModal";
import PunchDetails from "../components/PunchDetails";
import RequestStatus from "../components/RequestStatus";
import ToastStack from "../components/ToastStack";
import { useAttendanceOverview } from "../hooks/useAttendanceOverview";
import { NavLink, useParams } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import {
  CalendarDays,
  FileSpreadsheet,
  Grid2X2,
  History,
  List,
} from "lucide-react";
import { MonthPicker } from "@/components/ui/monthpicker";
import { useGetProfileQuery } from "../../../dashboard/api/dashboardApi";
import {
  PUNCH_PROCESS_TABS,
  TIME_OFFICE_SECTION_PATH,
} from "@/features/admin/Time & Office/TimeOffice/constants/timeoffice.constants";

interface AttendanceOverviewProps {
  /** Admin Time Office > Punch Process: company-wide employees and data. */
  adminMode?: boolean;
}

export default function AttendanceOverview({
  adminMode = false,
}: AttendanceOverviewProps) {
  const employeeFilterRef = useRef<HTMLDivElement>(null);
  const promptRowRef = useRef<HTMLDivElement>(null);
  const promptTextRef = useRef<HTMLSpanElement>(null);
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
  const { domain } = useParams();
  const { data: profileData } = useGetProfileQuery();
  const adminBasePath = `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;

  const {
    view,

    employees,
    selectedEmployee,
    selectEmployee,
    reportingEmployeesLoading,

    selectedMonth,
    setSelectedMonth,
    setView,

    selectedMonthNumber,
    selectedYear,

    assignedShift,
    setAssignedShift,

    workedShift,
    setWorkedShift,

    assignedPolicy,
    setAssignedPolicy,

    assignedPattern,
    setAssignedPattern,

    selectedDate,
    setSelectedDate,

    punchTab,
    setPunchTab,

    days,
    activeDay,
    overview,
    overviewStats,

    loading,
    error,

    toasts,
    setToasts,
    pushToast,

    activeDetailModal,
    openDetailModal,
    closeDetailModal,

    handleExport,

    rawPunches,
  } = useAttendanceOverview(adminMode);

  useLayoutEffect(() => {
    if (showAttendanceDetails) return;

    const employeeFilter = employeeFilterRef.current;
    const promptRow = promptRowRef.current;
    const promptText = promptTextRef.current;
    if (!employeeFilter || !promptRow || !promptText) return;

    const positionPrompt = () => {
      const filterRect = employeeFilter.getBoundingClientRect();
      const rowRect = promptRow.getBoundingClientRect();
      const target = Math.max(0, filterRect.left - rowRect.left);
      const start = rowRect.width;
      promptText.style.left = `${start}px`;
      promptText.style.setProperty(
        "--attendance-prompt-distance",
        `${target - start}px`,
      );
    };

    positionPrompt();
    const resizeObserver = new ResizeObserver(positionPrompt);
    resizeObserver.observe(employeeFilter);
    resizeObserver.observe(promptRow);
    resizeObserver.observe(promptText);

    return () => resizeObserver.disconnect();
  }, [showAttendanceDetails]);

  const profile = profileData?.data?.profile;
  const managerEmployee = profile
    ? {
        id: profile.Code || profile.EmployeeID,
        name: profile.FullName || "Sriram Preetham",
      }
    : null;

  return (
    <div
      className={
        adminMode
          ? "min-h-screen w-full min-w-0 overflow-x-hidden bg-slate-100 px-4 pb-4 pt-0 font-sans text-slate-800 font-[Urbanist]"
          : "min-h-screen bg-slate-100 p-4 font-sans text-slate-800 font-[Urbanist]"
      }
    >
      <div className="mx-auto max-w-[1600px] space-y-4 font-[Urbanist]">
        <div
          className={
            adminMode
              ? "flex w-full min-w-0 flex-col gap-2 rounded-xl border border-emerald-500 bg-emerald-50 px-2 py-1.5 font-[Urbanist] md:flex-row md:items-center md:justify-between md:gap-1"
              : "flex min-w-0 flex-col gap-2 rounded-xl border border-[#e0e5ec] bg-white px-4 py-2 font-[Urbanist] md:flex-row md:items-center md:justify-between md:gap-8 md:py-0"
          }
        >
          {adminMode ? (
            <nav
              aria-label="Punch process"
              className="punch-horizontal-scroll flex min-w-0 max-w-full flex-nowrap items-center gap-1 overflow-x-auto overscroll-x-contain pb-1 [touch-action:pan-x] md:pb-0"
            >
              {PUNCH_PROCESS_TABS.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={`${adminBasePath}/${tab.path}`}
                  className={({ isActive }) =>
                    `shrink-0 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-emerald-500 bg-white text-emerald-600"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>
          ) : (
          <div className="flex min-w-0 items-center gap-8 overflow-x-auto font-[Urbanist]">
            <NavLink
              to={`/${domain}/employee/TA/attendanceoverview`}
              className="whitespace-nowrap border-b-2 border-[#1997e8] px-1 py-5 text-[15px] font-semibold text-[#1997e8] font-[Urbanist]"
            >
              Attendance Overview
            </NavLink>
          </div>
          )}
          <div className="flex min-w-0 flex-wrap items-center gap-2 font-[Urbanist]">
            <button
              type="button"
              title="List view"
              onClick={() => setView("list")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                view === "list"
                  ? "border-sky-500 bg-sky-500 text-white"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              <List size={16} />
            </button>
            <button
              type="button"
              title="Calendar view"
              onClick={() => setView("calendar")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                view === "calendar"
                  ? "border-sky-500 bg-sky-500 text-white"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              <CalendarDays size={16} />
            </button>
            <div className="w-[120px] font-[Urbanist]">
              <MonthPicker
                value={selectedMonth}
                onChange={setSelectedMonth}
                className="h-9 rounded-lg border-black bg-white text-xs font-[Urbanist]"
              />
            </div>
            <div ref={employeeFilterRef} className="shrink-0">
              <EmployeeSearchSelect
                employees={employees}
                selectedEmployee={selectedEmployee}
                loading={reportingEmployeesLoading}
                onSelect={(employee) => {
                  if (employee) {
                    selectEmployee(employee);
                    setShowAttendanceDetails(true);
                  } else {
                    setShowAttendanceDetails(false);
                  }
                }}
              />
            </div>
            <button
              type="button"
              title="Grid view"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("timeOfficeGridClick"))
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black text-slate-500 font-[Urbanist]"
            >
              <Grid2X2 size={16} />
            </button>
            <button
              type="button"
              title="Export"
              onClick={handleExport}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black text-emerald-600 font-[Urbanist]"
            >
              <FileSpreadsheet size={16} />
            </button>
            <button
              type="button"
              title="History"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("timeOfficeHistory"))
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black text-slate-500 font-[Urbanist]"
            >
              <History size={16} />
            </button>
          </div>
        </div>

        {/* ================================================================
            ATTENDANCE FILTERS
        ================================================================ */}

        {!showAttendanceDetails && (
          <div
            ref={promptRowRef}
            className="attendance-prompt-row relative h-16 overflow-hidden text-sm text-red-600 font-[Urbanist]"
          >
            <span
              ref={promptTextRef}
              className="attendance-prompt-move-left absolute top-6 whitespace-nowrap"
            >
              Select an employee to view details.
            </span>
          </div>
        )}

        {showAttendanceDetails && (
          <AttendanceFilters
            employees={employees}
            reportingEmployeesLoading={reportingEmployeesLoading}
            selectedEmployee={selectedEmployee}
            managerEmployee={adminMode ? null : managerEmployee}
            selectedDate={selectedDate}
            selectedMonthNumber={selectedMonthNumber}
            selectedYear={selectedYear}
            assignedShift={assignedShift}
            workedShift={workedShift}
            assignedPolicy={assignedPolicy}
            assignedPattern={assignedPattern}
            days={days}
            onDateChange={setSelectedDate}
            onEmployeeChange={(employee) => {
              selectEmployee(employee);
              setShowAttendanceDetails(true);
            }}
            onShiftChange={setAssignedShift}
            onWorkedShiftChange={setWorkedShift}
            onPolicyChange={setAssignedPolicy}
            onPatternChange={setAssignedPattern}
            onExport={handleExport}
          />
        )}

        {showAttendanceDetails && (
          <>
            {loading && (
              <div className="rounded-lg border border-black bg-sky-50 px-4 py-2 text-xs font-medium text-sky-700 font-[Urbanist]">
                Loading attendance for {selectedEmployee?.name ?? "employee"}...
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-black bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 font-[Urbanist]">
                Attendance API could not be loaded.
                <span className="ml-1 font-[Urbanist]">{error}</span>
              </div>
            )}

            <AttendanceTable
              days={days}
              view={view}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onInfo={(message) => {
                pushToast(message, "info");
              }}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 font-[Urbanist]">
              {/* Monthly Overview */}

              <MonthlyOverview
                selectedMonth={selectedMonth}
                overview={overview}
                overviewStats={overviewStats}
                onOpenDetail={openDetailModal}
              />

              {/* Punch Details */}

              <PunchDetails
                selectedDate={selectedDate}
                selectedMonthNumber={selectedMonthNumber}
                selectedYear={selectedYear}
                activeDay={activeDay}
                punchTab={punchTab}
                punches={rawPunches}
                onPunchTabChange={setPunchTab}
              />

              {/* Request Status */}

              <RequestStatus
                onRaiseRequest={() =>
                  pushToast(
                    "Regularization request form is a placeholder in this demo",
                    "info",
                  )
                }
              />
            </div>
          </>
        )}
      </div>

      {/* ================================================================
          OVERVIEW DETAILS MODAL
      ================================================================ */}

      {activeDetailModal && (
        <OverviewDetailsModal
          detailKey={activeDetailModal}
          onClose={closeDetailModal}
          days={days}
          selectedMonth={selectedMonthNumber}
          selectedYear={selectedYear}
        />
      )}

      {/* ================================================================
          TOAST
      ================================================================ */}

      <ToastStack
        toasts={toasts}
        onDismiss={(id) =>
          setToasts((current) => current.filter((toast) => toast.id !== id))
        }
      />
    </div>
  );
}
