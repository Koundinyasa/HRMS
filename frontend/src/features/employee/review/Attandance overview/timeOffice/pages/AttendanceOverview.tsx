import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceTable from "../components/AttendanceTable";
import MonthlyOverview from "../components/MonthlyOverview";
import OverviewDetailsModal from "../components/OverviewDetailsModal";
import PunchDetails from "../components/PunchDetails";
import RequestStatus from "../components/RequestStatus";
import ToastStack from "../components/ToastStack";
import { useAttendanceOverview } from "../hooks/useAttendanceOverview";
import { NavLink } from "react-router-dom";

export default function AttendanceOverview() {
  const {
    view,

    employees,
    selectedEmployee,
    selectEmployee,
    reportingEmployeesLoading,

    selectedMonth,

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

    processed,
    processedAt,
    processMenuOpen,
    setProcessMenuOpen,

    activeDetailModal,
    openDetailModal,
    closeDetailModal,

    handleProcessClick,
    handleReprocess,
    handleUndoProcess,
    handleExport,

    rawPunches,
  } = useAttendanceOverview();

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <div className="flex min-w-0 items-center gap-8 overflow-x-auto rounded-xl border border-[#e0e5ec] bg-white px-4">
          <NavLink
            to="../../Punch"
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-1 py-5 text-[15px] font-semibold ${
                isActive
                  ? "border-[#1997e8] text-[#1997e8]"
                  : "border-transparent text-[#68758a]"
              }`
            }
          >
            Punch
          </NavLink>
          <NavLink
            to="../../MissedPunch"
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-1 py-5 text-[15px] font-semibold ${
                isActive
                  ? "border-[#1997e8] text-[#1997e8]"
                  : "border-transparent text-[#68758a]"
              }`
            }
          >
            Missed Punch
          </NavLink>
          <NavLink
            to="../attendanceoverview"
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-1 py-5 text-[15px] font-semibold ${
                isActive
                  ? "border-[#1997e8] text-[#1997e8]"
                  : "border-transparent text-[#68758a]"
              }`
            }
          >
            Attendance
          </NavLink>
          <NavLink
            to="../../TAInsights"
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-1 py-5 text-[15px] font-semibold ${
                isActive
                  ? "border-[#1997e8] text-[#1997e8]"
                  : "border-transparent text-[#68758a]"
              }`
            }
          >
            TA Insights
          </NavLink>
        </div>

        {/* ================================================================
            ATTENDANCE FILTERS
        ================================================================ */}

        <AttendanceFilters
          employees={employees}
          reportingEmployeesLoading={reportingEmployeesLoading}
          selectedEmployee={selectedEmployee}
          selectedDate={selectedDate}
          selectedMonthNumber={selectedMonthNumber}
          selectedYear={selectedYear}
          assignedShift={assignedShift}
          workedShift={workedShift}
          assignedPolicy={assignedPolicy}
          assignedPattern={assignedPattern}
          processed={processed}
          processedAt={processedAt}
          processMenuOpen={processMenuOpen}
          days={days}
          onDateChange={setSelectedDate}
          onEmployeeChange={selectEmployee}
          onShiftChange={setAssignedShift}
          onWorkedShiftChange={setWorkedShift}
          onPolicyChange={setAssignedPolicy}
          onPatternChange={setAssignedPattern}
          onProcessClick={handleProcessClick}
          onReprocess={handleReprocess}
          onUndoProcess={handleUndoProcess}
          onExport={handleExport}
          onProcessMenuOpenChange={setProcessMenuOpen}
        />

        {/* ================================================================
            LOADING
        ================================================================ */}

        {loading && (
          <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-medium text-sky-700">
            Loading attendance for {selectedEmployee?.name ?? "employee"}...
          </div>
        )}

        {/* ================================================================
            API ERROR
        ================================================================ */}

        {error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
            Attendance API could not be loaded.
            <span className="ml-1">{error}</span>
          </div>
        )}

        {/* ================================================================
            ATTENDANCE TABLE
        ================================================================ */}

        <AttendanceTable
          days={days}
          view={view}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onInfo={(message) => {
            pushToast(message, "info");
          }}
        />

        {/* ================================================================
            BOTTOM SECTION
        ================================================================ */}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
