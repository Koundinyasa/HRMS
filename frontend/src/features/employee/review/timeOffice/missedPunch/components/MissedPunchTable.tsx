import MissedPunchRow from "./MissedPunchRow";

import type {
  MissedPunchTableProps,
} from "../types/missedPunch.types";

export default function MissedPunchTable({
  employees,
  isLoading,
  onAction,
}: MissedPunchTableProps) {
  return (
    <div className="mt-3 overflow-x-auto">
      <div className="min-w-0 space-y-3">
        <div className="grid grid-cols-2 items-center gap-2 rounded-lg bg-[#d8edf9] px-3 py-4 text-sm font-semibold text-[#172554] sm:grid-cols-4 sm:gap-4 sm:py-5">
          <div>Employee ID</div>
          <div>Employee Name</div>
          <div>Punch Date</div>
          <div>Action</div>
        </div>

        {isLoading ? (
          <div className="rounded-lg bg-white px-3 py-8 text-center text-sm text-[#68758a] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            Loading...
          </div>
        ) : employees.length === 0 ? (
          <div className="rounded-lg bg-white px-3 py-8 text-center text-sm text-[#68758a] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            No missed punches found
          </div>
        ) : (
          employees.map((employee) => (
            <MissedPunchRow
              key={`${employee.employeeId}-${employee.punchDate}`}
              employee={employee}
              onAction={onAction}
            />
          ))
        )}
      </div>
    </div>
  );
}