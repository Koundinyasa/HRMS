import { statusClass } from "../constants/leave.constants";
import { useLeave } from "../hooks/useLeave";

const COLS = "grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr] items-center px-5 min-w-[640px]";

export default function LeaveHistoryPage() {
  const { history } = useLeave();

  return (
    <div className="flex flex-col gap-2">
      {/* JWT-scoped like balance — never the employee picked in the dropdown. */}
      <p className="text-xs text-slate-500">Showing your own leave history</p>

      <div className="overflow-x-auto">
        <div className="flex flex-col gap-2 min-w-[640px]">
          <div className={`${COLS} py-4 bg-[#EDEBFB] rounded-md font-bold text-sm text-slate-800`}>
            <span>Leave Name</span>
            <span>Leave Date</span>
            <span>Reason</span>
            <span>Days</span>
            <span>Status</span>
          </div>

          {history.data?.map((row) => (
            <div key={row.id} className={`${COLS} py-4 bg-white rounded-md shadow-sm text-sm text-slate-800`}>
              <span>{row.leaveTypeName}</span>
              <span>{row.fromDate === row.toDate ? row.fromDate : `${row.fromDate} – ${row.toDate}`}</span>
              <span>{row.reason}</span>
              <span>{row.days}</span>
              <span className={`border rounded px-2.5 py-1 font-semibold w-fit ${statusClass(row.status)}`}>
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!history.isLoading && !history.data?.length && (
        <div className="bg-white rounded-md shadow-sm py-10 text-center text-sm text-slate-500">
          No leave history
        </div>
      )}
    </div>
  );
}
