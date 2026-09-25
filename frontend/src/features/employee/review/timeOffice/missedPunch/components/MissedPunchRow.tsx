import {
  CalendarClock,
} from "lucide-react";

import type {
  MissedPunchRowProps,
} from "../types/missedPunch.types";

import {
  formatDateForDisplay,
} from "../validations/missedPunch.validation";

export default function MissedPunchRow({
  employee,
  onAction,
}: MissedPunchRowProps) {
  return (
    <div className="grid grid-cols-2 items-center gap-2 rounded-lg bg-white px-3 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:grid-cols-4 sm:gap-4 sm:py-5 font-[Urbanist]">

      {/* EMPLOYEE ID */}

      <div className="min-w-0 break-words text-sm font-medium text-[#172554] font-[Urbanist]">
        {employee.employeeId ||
          "-"}
      </div>

      {/* EMPLOYEE NAME */}

      <div className="min-w-0 break-words text-sm font-medium text-[#172554] font-[Urbanist]">
        {employee.employeeName ||
          "-"}
      </div>

      {/* PUNCH DATE */}

      <div className="min-w-0 break-words text-sm font-medium text-[#172554] font-[Urbanist]">
        {formatDateForDisplay(
          employee.punchDate,
        )}
      </div>

      {/* ACTION */}

      <div className="flex justify-end sm:justify-center font-[Urbanist]">
        <button
          type="button"
          title="Open missed punch"
          onClick={() =>
            onAction(employee)
          }
          className="rounded-md p-1 text-[#1997e8] transition hover:bg-[#eef8ff] font-[Urbanist]"
        >
          <CalendarClock
            size={24}
            strokeWidth={2}
          />
        </button>
      </div>

    </div>
  );
}