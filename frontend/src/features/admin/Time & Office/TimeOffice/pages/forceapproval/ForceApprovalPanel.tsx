import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { History, Inbox, SlidersHorizontal } from "lucide-react";
import PunchFilterBar from "../../components/PunchFilterBar";
import ProcessDrilldownList from "../../components/ProcessDrilldownList";
import { FORCE_APPROVAL_SECTION_PATH, FORCE_APPROVAL_TABS } from "../../constants/timeoffice.constants";
import { useGetFaceTemplateApprovalQuery, useGetPunchApprovalQuery } from "../../api/regularizationApi";
import type { PunchFilters } from "../../types/timeoffice.types";

/** Only these two tabs have a backend endpoint so far; the rest stay the empty placeholder below. */
type ForceApprovalEndpoint = "punch" | "facetemplate";

/**
 * Shared shell for the Force Approval tabs (Punch / Weekly Off / Over Time /
 * Official Permission / Personal Permission / Shift / Face Template). Approve
 * and Reject stay disabled everywhere — the controller doesn't define those
 * operations or body params yet.
 */
export default function ForceApprovalPanel({ title, endpoint }: { title: string; endpoint?: ForceApprovalEndpoint }) {
  const { domain } = useParams();
  const [filters, setFilters] = useState<PunchFilters>({});

  const punchQuery = useGetPunchApprovalQuery(undefined, { skip: endpoint !== "punch" });
  const faceTemplateQuery = useGetFaceTemplateApprovalQuery(undefined, { skip: endpoint !== "facetemplate" });
  const { data: rows, isFetching } = endpoint === "punch" ? punchQuery : endpoint === "facetemplate" ? faceTemplateQuery : { data: undefined, isFetching: false };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-4">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-500 rounded-xl px-3 py-2 w-max min-w-full sm:w-fit">
            {FORCE_APPROVAL_TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={`/${domain}/admin/${FORCE_APPROVAL_SECTION_PATH}/${tab.path}`}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg border bg-white text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? "border-emerald-500 text-emerald-600" : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button type="button" disabled className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-40">
            Approve
          </button>
          <button type="button" disabled className="h-9 px-4 rounded-lg border border-red-200 text-red-600 text-sm font-medium disabled:opacity-40">
            Reject
          </button>
          <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white">
            <SlidersHorizontal size={16} />
          </button>
          <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white">
            <History size={16} />
          </button>
        </div>
      </div>

      <PunchFilterBar rows={[]} filters={filters} onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))} onClear={() => setFilters({})} />

      {rows ? (
        <ProcessDrilldownList title={title} color="#2563EB" rows={rows} isLoading={isFetching} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 min-h-[360px] text-slate-300">
          <Inbox size={72} strokeWidth={1} />
          <p className="text-sm font-medium text-amber-600">No Data Found in - {title}</p>
        </div>
      )}
    </div>
  );
}
