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
    <div className="punch-horizontal-scroll mt-3 w-full min-w-0 overflow-x-auto">
      <div className="w-full min-w-[760px] space-y-3">
        <div className="grid w-full grid-cols-[90px_minmax(0,1fr)_110px_50px] items-center gap-3 rounded-lg bg-[#d8edf9] px-3 py-4 text-sm font-semibold text-[#172554]">
          <div>Employee ID</div>
          <div>Employee Name</div>
          <div>Punch Date</div>
          <div className="text-right">Action</div>
        </div>

        {isLoading ? (
          <div className="rounded-lg bg-white px-3 py-8 text-center text-sm text-[#68758a] shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-[Urbanist]">
            Loading...
          </div>
        ) : employees.length === 0 ? (
          <div className="rounded-lg bg-white px-3 py-8 text-center text-sm text-[#68758a] shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-[Urbanist]">
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