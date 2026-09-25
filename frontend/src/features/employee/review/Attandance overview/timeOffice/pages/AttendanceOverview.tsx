import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceTable from "../components/AttendanceTable";
import MonthlyOverview from "../components/MonthlyOverview";
import OverviewDetailsModal from "../components/OverviewDetailsModal";
import PunchDetails from "../components/PunchDetails";
import RequestStatus from "../components/RequestStatus";
import ToastStack from "../components/ToastStack";
import { useAttendanceOverview } from "../hooks/useAttendanceOverview";
import { NavLink, useParams } from "react-router-dom";
import { useState } from "react";
import { CalendarDays, FileSpreadsheet, Grid2X2, History, List } from "lucide-react";
import { MonthPicker } from "@/components/ui/monthpicker";
import { useGetProfileQuery } from "../../../../dashboard/api/dashboardApi";

export default function AttendanceOverview() {
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
  const { domain } = useParams();
  const { data: profileData } = useGetProfileQuery();

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

  const profile = profileData?.data?.profile;
  const managerEmployee = profile
    ? {
        id: profile.Code || profile.EmployeeID,
        name: profile.FullName || "Sriram Preetham",
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800 font-[Urbanist]">
      <div className="mx-auto max-w-[1600px] space-y-4 font-[Urbanist]">
        <div className="flex min-w-0 items-center justify-between gap-8 overflow-x-auto rounded-xl border border-[#e0e5ec] bg-white px-4 font-[Urbanist]">
          <div className="flex min-w-max items-center gap-8 font-[Urbanist]">
          <NavLink
            to={`/${domain}/employee/TA/attendanceoverview`}
            className="whitespace-nowrap border-b-2 border-[#1997e8] px-1 py-5 text-[15px] font-semibold text-[#1997e8] font-[Urbanist]"
          >
            Attendance Overview
          </NavLink>
          </div>
          <div className="flex min-w-max items-center gap-2 font-[Urbanist]">
            <button type="button" title="List view" onClick={() => setView("list")} className={`flex h-9 w-9 items-center justify-center rounded-lg border ${view === "list" ? "border-sky-500 bg-sky-500 text-white" : "border-slate-200 text-slate-500"}`}>
              <List size={16} />
            </button>
            <button type="button" title="Calendar view" onClick={() => setView("calendar")} className={`flex h-9 w-9 items-center justify-center rounded-lg border ${view === "calendar" ? "border-sky-500 bg-sky-500 text-white" : "border-slate-200 text-slate-500"}`}>
              <CalendarDays size={16} />
            </button>
            <div className="w-[120px] font-[Urbanist]">
              <MonthPicker value={selectedMonth} onChange={setSelectedMonth} className="h-9 rounded-lg border-black bg-white text-xs font-[Urbanist]" />
            </div>
            <select
              aria-label="Select employee"
              value={selectedEmployee?.id ?? ""}
              onChange={(event) => {
                const employee = employees.find((item) => item.id === event.target.value);
                if (employee) {
                  selectEmployee(employee);
                  setShowAttendanceDetails(true);
                } else {
                  setShowAttendanceDetails(false);
                }
              }}
              disabled={reportingEmployeesLoading || employees.length === 0}
              className="h-9 w-[180px] rounded-lg border border-black bg-white px-2 text-xs text-slate-600 font-[Urbanist]"
            >
              <option value="">
                {reportingEmployeesLoading ? "Loading employees..." : "Select employee"}
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>{employee.id} {employee.name}</option>
              ))}
            </select>
            <button type="button" title="Grid view" onClick={() => window.dispatchEvent(new CustomEvent("timeOfficeGridClick"))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-black text-slate-500 font-[Urbanist]">
              <Grid2X2 size={16} />
            </button>
            <button type="button" title="Export" onClick={handleExport} className="flex h-9 w-9 items-center justify-center rounded-lg border border-black text-emerald-600 font-[Urbanist]">
              <FileSpreadsheet size={16} />
            </button>
            <button type="button" title="History" onClick={() => window.dispatchEvent(new CustomEvent("timeOfficeHistory"))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-black text-slate-500 font-[Urbanist]">
              <History size={16} />
            </button>
          </div>
        </div>

        {/* ================================================================
            ATTENDANCE FILTERS
        ================================================================ */}

        {showAttendanceDetails && (
          <AttendanceFilters
            employees={employees}
            reportingEmployeesLoading={reportingEmployeesLoading}
            selectedEmployee={selectedEmployee}
            managerEmployee={managerEmployee}
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
            onEmployeeChange={(employee) => {
              selectEmployee(employee);
              setShowAttendanceDetails(true);
            }}
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
