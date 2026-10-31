import { SquareArrowOutUpRight } from "lucide-react";
import type {
  ProcessHistoryEntry,
  PunchRequestsSummary,
} from "../types/timeoffice.types";

const STATUS_STYLES: Record<ProcessHistoryEntry["status"], string> = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Failed: "bg-red-50 text-red-700 border-red-200",
  Unknown: "bg-slate-50 text-slate-600 border-slate-200",
};

const PANEL_CLASS =
  "min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm";

const PANEL_HEADER_CLASS =
  "flex h-[52px] items-center justify-between bg-[#E6EAF2] px-4";

export function PunchRequestsPanel({
  summary,
}: {
  summary: PunchRequestsSummary;
}) {
  return (
    <section className={`${PANEL_CLASS} flex flex-col`}>
      <div className={PANEL_HEADER_CLASS}>
        <h3 className="text-lg font-semibold text-slate-900">
          Punch Requests
        </h3>

        <button
          type="button"
          aria-label="Open punch requests"
          className="text-[#168FE5] transition-colors hover:text-[#0879CC]"
        >
          <SquareArrowOutUpRight size={24} />
        </button>
      </div>

      {summary.regularization === 0 && summary.essMobile === 0 ? (
        <div className="flex min-h-[260px] flex-1 flex-col items-center justify-center gap-2 px-4 py-2">
          <div className="grid w-full grid-cols-2 gap-3 text-center">
            <div className="flex min-h-[80px] flex-col items-center justify-center gap-1 bg-slate-50 px-2 py-2">
              <p className="text-sm font-medium text-slate-500">Regularization Request</p>
              <p className="text-2xl font-bold text-sky-500">{summary.regularization}</p>
            </div>
            <div className="flex min-h-[80px] flex-col items-center justify-center gap-1 bg-slate-50 px-2 py-2">
              <p className="text-sm font-medium text-slate-500">ESS/Mobile Request</p>
              <p className="text-2xl font-bold text-sky-500">{summary.essMobile}</p>
            </div>
          </div>
          <img src="/no-data.png" alt="No punch request data available" className="h-56 w-56 max-w-full object-contain" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="flex min-h-[100px] flex-col items-center justify-center gap-2 bg-slate-50 px-2 py-3 text-center">
            <p className="text-sm font-medium text-slate-500">
              Regularization Request
            </p>
            <p className="text-2xl font-bold text-sky-500">
              {summary.regularization}
            </p>
          </div>

          <div className="flex min-h-[100px] flex-col items-center justify-center gap-2 bg-slate-50 px-2 py-3 text-center">
            <p className="text-sm font-medium text-slate-500">
              ESS/Mobile Request
            </p>
            <p className="text-2xl font-bold text-sky-500">
              {summary.essMobile}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export function TemporaryShiftPanel() {
  return (
    <section className={`${PANEL_CLASS} flex min-h-[260px] flex-col`}>
      <div className={PANEL_HEADER_CLASS}>
        <h3 className="text-lg font-semibold text-slate-900">
          Temporary Assigned Shift
        </h3>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-2">
        <img src="/no-data.png" alt="No temporary assigned shift data available" className="h-72 w-72 max-w-full object-contain" />
      </div>
    </section>
  );
}

export function ProcessHistoryPanel({
  entries,
}: {
  entries: ProcessHistoryEntry[];
}) {
  return (
    <section className={`${PANEL_CLASS} flex min-h-[260px] flex-col`}>
      <div className={PANEL_HEADER_CLASS}>
        <h3 className="text-lg font-semibold text-slate-900">
          Process History
        </h3>
      </div>

      <div className="max-h-[320px] flex-1 overflow-y-auto p-4">
        {entries.length > 0 ? (
          <ul className="flex flex-col gap-5">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {entry.rangeLabel}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Processed On {entry.processedOn}
                  </p>
                </div>

                <span
                  className={`shrink-0 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium ${
                    STATUS_STYLES[entry.status]
                  }`}
                >
                  {entry.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">
            No data found
          </p>
        )}
      </div>
    </section>
  );
}
