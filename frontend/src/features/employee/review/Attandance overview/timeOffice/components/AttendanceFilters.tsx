import { useLayoutEffect, useRef, useState } from "react";
import {
  ArrowRightLeft,
  Bookmark,
  Calendar,
  Check,
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
  processed,
  processedAt,
  processMenuOpen,
  days,
  onDateChange,
  onEmployeeChange,
  onShiftChange,
  onWorkedShiftChange,
  onPolicyChange,
  onPatternChange,
  onProcessClick,
  onReprocess,
  onUndoProcess,
  onExport,
  onProcessMenuOpenChange,
}: AttendanceFiltersProps) {
  const processRef = useRef<HTMLDivElement>(null);

  const processPanelRef = useRef<HTMLDivElement>(null);

  const [processPosition, setProcessPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const updateProcessPosition = () => {
    if (!processRef.current) return;

    const rect = processRef.current.getBoundingClientRect();

    const width = 256;
    const margin = 8;

    const left = Math.min(
      Math.max(rect.right - width, margin),
      window.innerWidth - width - margin,
    );

    const top = Math.min(rect.bottom + 8, window.innerHeight - 40);

    setProcessPosition({
      top,
      left,
    });
  };

  useLayoutEffect(() => {
    if (!processMenuOpen) return;

    updateProcessPosition();

    window.addEventListener("resize", updateProcessPosition);

    window.addEventListener("scroll", updateProcessPosition, true);

    return () => {
      window.removeEventListener("resize", updateProcessPosition);

      window.removeEventListener("scroll", updateProcessPosition, true);
    };
  }, [processMenuOpen]);

  useLayoutEffect(() => {
    if (!processMenuOpen) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !processRef.current?.contains(target) &&
        !processPanelRef.current?.contains(target)
      ) {
        onProcessMenuOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [processMenuOpen, onProcessMenuOpenChange]);

  return (
    <div className="w-full overflow-x-auto lg:overflow-x-visible rounded-xl border border-black bg-white shadow-sm font-[Urbanist]">
      <div className="flex w-max min-w-max items-stretch divide-x divide-slate-200 font-[Urbanist]">
        {/* Employee */}
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

        {/* Process */}
        <div ref={processRef} className="relative shrink-0 font-[Urbanist]">
          <button
            type="button"
            onClick={onProcessClick}
            className={`flex h-[60px] w-[200px] items-center justify-center gap-1.5 text-[12px] font-medium transition-colors ${
              processed
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            }`}
          >
            {processed ? (
              <Check className="h-3.5 w-3.5 font-[Urbanist]" />
            ) : (
              <Bookmark className="h-3.5 w-3.5 font-[Urbanist]" />
            )}

            <span>{processed ? "Processed" : "Process"}</span>

            {processed && (
              <ChevronDown
                className={`h-3 w-3 ${processMenuOpen ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {processed && processMenuOpen && processPosition && (
            <div
              ref={processPanelRef}
              className="fixed z-[100] w-64 rounded-lg border border-black bg-white p-3 shadow-lg font-[Urbanist]"
              style={{
                top: processPosition.top,
                left: processPosition.left,
              }}
            >
              <p className="text-xs font-semibold text-slate-500 font-[Urbanist]">
                Processing status
              </p>

              <p className="mt-1 text-sm text-slate-700 font-[Urbanist]">
                Processed for{" "}
                <span className="font-semibold font-[Urbanist]">
                  {selectedEmployee?.name ?? ""}
                </span>
              </p>

              {processedAt && (
                <p className="text-xs text-slate-400 font-[Urbanist]">on {processedAt}</p>
              )}

              <div className="mt-3 flex gap-2 font-[Urbanist]">
                <button
                  type="button"
                  onClick={onReprocess}
                  className="flex-1 rounded-md border border-black bg-sky-50 px-2 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 font-[Urbanist]"
                >
                  Reprocess
                </button>

                <button
                  type="button"
                  onClick={onUndoProcess}
                  className="flex-1 rounded-md border border-black bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 font-[Urbanist]"
                >
                  Undo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
          className="flex h-[60px] w-[100px] shrink-0 items-center justify-center text-xs font-semibold text-emerald-700 hover:bg-emerald-50 font-[Urbanist]"
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
