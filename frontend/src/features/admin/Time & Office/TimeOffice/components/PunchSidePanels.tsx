import { useState } from "react";
import type { PolicySummary, ShiftSummary } from "../types/timeoffice.types";

export function PoliciesShiftsPanel({
  policies,
  shifts,
}: {
  policies: PolicySummary[];
  shifts: ShiftSummary[];
}) {
  const [tab, setTab] = useState<"policies" | "shifts">("policies");

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(["policies", "shifts"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`text-sm font-medium capitalize pb-1 border-b-2 transition-colors ${
                tab === key ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <button type="button" className="text-xs font-medium text-emerald-600 hover:underline">
          See All
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {tab === "policies" &&
          policies.map((policy) => (
            <div key={policy.name} className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-800">{policy.name}</p>
                <p className="text-xs text-slate-500">{policy.effectiveFrom}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{policy.updatedAgo}</span>
            </div>
          ))}

        {tab === "shifts" &&
          shifts.map((shift) => (
            <div key={shift.name} className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-800">{shift.name}</p>
              <span className="text-xs text-slate-500">{shift.timing}</span>
            </div>
          ))}

        {((tab === "policies" && policies.length === 0) || (tab === "shifts" && shifts.length === 0)) && (
          <p className="text-sm text-slate-400 py-6 text-center">No data found</p>
        )}
      </div>
    </div>
  );
}

export function PendingRequestsCard({
  requests,
  monthLabel,
}: {
  requests: { id: string; label: string }[];
  monthLabel: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 min-h-[200px]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Pending Requests</h3>
        <span className="text-xs font-medium text-emerald-600">{monthLabel}</span>
      </div>

      {requests.length === 0 ? (
        <p className="flex-1 flex items-center justify-center text-lg font-semibold text-slate-200">
          No data found
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {requests.map((request) => (
            <li key={request.id} className="text-sm text-slate-700">{request.label}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
