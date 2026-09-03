import { CalendarClock } from "lucide-react";
import type { ProcessHistoryEntry, PunchRequestsSummary } from "../types/timeoffice.types";

const STATUS_STYLES: Record<ProcessHistoryEntry["status"], string> = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Failed: "bg-red-50 text-red-700 border-red-200",
};

export function PunchRequestsPanel({ summary }: { summary: PunchRequestsSummary }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Punch Requests</h3>
        <button type="button" className="text-slate-400 hover:text-emerald-600">
          <CalendarClock size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800">{summary.regularization}</p>
          <p className="text-xs text-slate-500 mt-1">Regularization Request</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800">{summary.essMobile}</p>
          <p className="text-xs text-slate-500 mt-1">ESS/Mobile Request</p>
        </div>
      </div>
    </div>
  );
}

export function TemporaryShiftPanel() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col items-center justify-center gap-2 min-h-[160px]">
      <h3 className="self-start text-sm font-semibold text-slate-800">Temporary Assigned Shift</h3>
      <p className="flex-1 flex items-center justify-center text-sm text-slate-400">No data found</p>
    </div>
  );
}

export function ProcessHistoryPanel({ entries }: { entries: ProcessHistoryEntry[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-slate-800">Process History</h3>
      <ul className="flex flex-col gap-3">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-slate-800">{entry.rangeLabel}</p>
              <p className="text-xs text-slate-500">Processed On {entry.processedOn}</p>
            </div>
            <span className={`text-xs font-medium rounded-full border px-2.5 py-1 whitespace-nowrap ${STATUS_STYLES[entry.status]}`}>
              {entry.status}
            </span>
          </li>
        ))}
        {entries.length === 0 && <p className="text-sm text-slate-400 py-6 text-center">No data found</p>}
      </ul>
    </div>
  );
}
