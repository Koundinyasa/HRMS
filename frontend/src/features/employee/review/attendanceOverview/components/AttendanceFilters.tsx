import {
  ArrowRightLeft,
  Bookmark,
  Calendar,
  ChevronDown,
  ClipboardList,
  Clock,
  UserCheck,
} from "lucide-react";

import AttendanceDropdown, {
  AttendanceDropdownItem,
} from "./AttendanceDropdown";

import type { AttendanceFiltersProps } from "../types/attendanceOverview.types";

export default function AttendanceFilters({
  employees,
  reportingEmployeesLoading = false,
  selectedEmployee,
  managerEmployee,
  selectedDate,
  selectedMonthNumber,
  selectedYear,
  assignedShift,
  workedShift,
  assignedPolicy,
  assignedPattern,
  days,
  onDateChange,
  onShiftChange,
  onWorkedShiftChange,
  onPolicyChange,
  onPatternChange,
  onExport,
}: AttendanceFiltersProps) {
  return (
    <div className="punch-horizontal-scroll w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-[#dbe3ee] bg-white shadow-sm font-[Urbanist] [touch-action:pan-x]">
      <div className="flex w-full min-w-max items-stretch divide-x divide-[#dbe3ee] font-[Urbanist]">
        <AttendanceDropdown
          widthClass="w-64"
          trigger={(open, toggle) => (
            <button
              type="button"
              onClick={toggle}
              className="flex h-[60px] w-[220px] shrink-0 items-center gap-2 bg-white px-3 text-left hover:bg-slate-50 font-[Urbanist]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 font-[Urbanist]">
                <UserCheck className="h-3.5 w-3.5 text-sky-600 font-[Urbanist]" />
              </span>

              <span className="min-w-0 flex-1 font-[Urbanist]">
                <span className="block truncate text-[12px] font-semibold leading-4 text-sky-700 font-[Urbanist]">
                  {(managerEmployee ?? selectedEmployee)?.name?.toUpperCase() ?? "SELECT EMPLOYEE"}
                </span>

                <span className="mt-0.5 flex items-center gap-1 text-[10px] leading-3 text-slate-400 font-[Urbanist]">
                  <Calendar className="h-3 w-3 font-[Urbanist]" />
                  {String(selectedDate).padStart(2, "0")}/
                  {String(selectedMonthNumber).padStart(2, "0")}/{selectedYear}
                </span>
              </span>

              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-sky-500 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        >
          {reportingEmployeesLoading ? (
            <div className="px-3 py-4 text-center text-xs text-slate-400 font-[Urbanist]">
              Loading employees...
            </div>
          ) : (
            [employees.find((employee) =>
              employee.name.toLowerCase().includes("preetham"),
            )].map((employee) => (
              <AttendanceDropdownItem
                key={employee?.id ?? "preetham"}
                active={employee?.id === (managerEmployee ?? selectedEmployee)?.id}
                onClick={() => undefined}
              >
                Sriram Preetham
              </AttendanceDropdownItem>
            ))
          )}
        </AttendanceDropdown>

        {/* Assigned shift */}
        <AttendanceDropdown
          trigger={(open, toggle) => (
            <button
              type="button"
              onClick={toggle}
              className="flex h-[60px] w-[280px] shrink-0 items-center gap-3 bg-white px-3 hover:bg-slate-50 font-[Urbanist]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-100 font-[Urbanist]">
                <Clock className="h-3.5 w-3.5 text-violet-600 font-[Urbanist]" />
              </span>

              <span className="min-w-0 flex-1 text-left leading-tight font-[Urbanist]">
                <span className="block truncate text-[12px] font-semibold text-violet-600 font-[Urbanist]">
                  {assignedShift}
                </span>
                <span className="block text-[10px] text-slate-400 font-[Urbanist]">
                  Assigned Shift
                </span>
              </span>

              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-violet-500 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        >
          {assignedShift ? (
            <AttendanceDropdownItem
              active
              onClick={() => onShiftChange(assignedShift)}
            >
              {assignedShift}
            </AttendanceDropdownItem>
          ) : (
            <div className="px-3 py-4 text-center text-xs text-slate-400 font-[Urbanist]">
              No shift assigned.
            </div>
          )}
        </AttendanceDropdown>

        {/* Worked shift */}
        <AttendanceDropdown
          trigger={(open, toggle) => (
            <button
              type="button"
              onClick={toggle}
              className="flex h-[60px] w-[290px] shrink-0 items-center gap-3 bg-white px-3 hover:bg-slate-50 font-[Urbanist]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-100 font-[Urbanist]">
                <Clock className="h-3.5 w-3.5 text-amber-600 font-[Urbanist]" />
              </span>

              <span className="min-w-0 flex-1 text-left leading-tight font-[Urbanist]">
                <span className="block truncate text-[12px] font-semibold text-amber-600 font-[Urbanist]">
                  {workedShift}
                </span>
                <span className="block text-[10px] text-slate-400 font-[Urbanist]">
                  Worked Shift
                </span>
              </span>

              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-amber-500 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        >
          {workedShift ? (
            <AttendanceDropdownItem
              active
              onClick={() => onWorkedShiftChange(workedShift)}
            >
              {workedShift}
            </AttendanceDropdownItem>
          ) : (
            <div className="px-3 py-4 text-center text-xs text-slate-400 font-[Urbanist]">
              No worked shift data.
            </div>
          )}
        </AttendanceDropdown>

        {/* Assigned policy */}
        <AttendanceDropdown
          trigger={(open, toggle) => (
            <button
              type="button"
              onClick={toggle}
              className="flex h-[60px] w-[270px] shrink-0 items-center gap-3 bg-white px-3 hover:bg-slate-50 font-[Urbanist]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 font-[Urbanist]">
                <ClipboardList className="h-3.5 w-3.5 text-emerald-600 font-[Urbanist]" />
              </span>

              <span className="min-w-0 flex-1 text-left leading-tight font-[Urbanist]">
                <span className="block truncate text-[12px] font-semibold text-emerald-600 font-[Urbanist]">
                  {assignedPolicy}
                </span>
                <span className="block text-[10px] text-slate-400 font-[Urbanist]">
                  Assigned Policy
                </span>
              </span>

              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-emerald-500 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        >
          {assignedPolicy ? (
            <AttendanceDropdownItem
              active
              onClick={() => onPolicyChange(assignedPolicy)}
            >
              {assignedPolicy}
            </AttendanceDropdownItem>
          ) : (
            <div className="px-3 py-4 text-center text-xs text-slate-400 font-[Urbanist]">
              No policy assigned.
            </div>
          )}
        </AttendanceDropdown>

        {/* Assigned pattern */}
        <AttendanceDropdown
          trigger={(open, toggle) => (
            <button
              type="button"
              onClick={toggle}
              className="flex h-[60px] w-[280px] shrink-0 items-center gap-3 bg-white px-3 hover:bg-slate-50 font-[Urbanist]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-lime-100 font-[Urbanist]">
                <ArrowRightLeft className="h-3.5 w-3.5 text-lime-600 font-[Urbanist]" />
              </span>

              <span className="min-w-0 flex-1 text-left leading-tight font-[Urbanist]">
                <span className="block truncate text-[12px] font-semibold text-lime-600 font-[Urbanist]">
                  {assignedPattern}
                </span>
                <span className="block text-[10px] text-slate-400 font-[Urbanist]">
                  Assigned Pattern
                </span>
              </span>

              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-lime-600 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        >
          {assignedPattern ? (
            <AttendanceDropdownItem
              active
              onClick={() => onPatternChange(assignedPattern)}
            >
              {assignedPattern}
            </AttendanceDropdownItem>
          ) : (
            <div className="px-3 py-4 text-center text-xs text-slate-400 font-[Urbanist]">
              No pattern assigned.
            </div>
          )}
        </AttendanceDropdown>

        {/* Process: not available yet. There is no server action behind it. */}
        <div className="relative min-w-[200px] flex-1 font-[Urbanist]">
          <button
            type="button"
            disabled
            title="Attendance processing is not available here yet"
            className="flex h-[60px] w-full cursor-not-allowed items-center justify-center gap-1.5 bg-slate-50 text-[12px] font-medium text-slate-300"
          >
            <Bookmark className="h-3.5 w-3.5 font-[Urbanist]" />
            <span>Process (not available yet)</span>
          </button>
        </div>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
         className="sticky right-0 z-20 flex h-[60px] w-[100px] shrink-0 items-center justify-center border-l border-[#dbe3ee] bg-white text-xs font-semibold text-emerald-700 shadow-[-4px_0_6px_-4px_rgba(16,24,40,0.12)] hover:bg-emerald-50 font-[Urbanist]"
        >
          Export
        </button>
        
      </div>

      {/* Date list helper */}
      <div className="hidden font-[Urbanist]">
        {days.map((day) => (
          <button
            key={day.date}
            type="button"
            onClick={() => onDateChange(day.date)}
          >
            {day.date}
          </button>
        ))}
      </div>
    </div>
  );
}
