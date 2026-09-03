import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { CalendarClock, History, SlidersHorizontal } from "lucide-react";
import RegularizationLayout from "./RegularizationLayout";
import PunchFilterBar from "../../components/PunchFilterBar";
import PunchRegularizationModal from "../../components/PunchRegularizationModal";
import DateField from "../../components/DateField";
import {
  useGetMissedPunchListQuery,
  useGetMissedPunchRegularizationDetailsQuery,
  useSaveMissedPunchRegularizationMutation,
} from "../../api/regularizationApi";
import type { MissedPunchRow, PunchFilters } from "../../types/timeoffice.types";

export default function MissedPunchPage() {
  const [from, setFrom] = useState("2026-06-05");
  const [to, setTo] = useState("2026-06-12");
  const [filters, setFilters] = useState<PunchFilters>({});
  const [active, setActive] = useState<MissedPunchRow | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: rows = [] } = useGetMissedPunchListQuery({ fromDate: from, toDate: to });
  const { data: activeDetails } = useGetMissedPunchRegularizationDetailsQuery(
    active ? { employeeId: active.employeeId, punchDate: active.punchDate } : skipToken
  );
  const [saveRegularization] = useSaveMissedPunchRegularizationMutation();

  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <RegularizationLayout>
      <div className="flex items-center justify-end gap-2 flex-wrap">
        <DateField label="From" value={from} onChange={setFrom} />
        <DateField label="To" value={to} onChange={setTo} />
        <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white">
          <SlidersHorizontal size={16} />
        </button>
        <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white">
          <History size={16} />
        </button>
      </div>

      <PunchFilterBar rows={[]} filters={filters} onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))} onClear={() => setFilters({})} />

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#EAF1FE]">
            <tr className="text-left">
              <th className="font-semibold text-slate-700 px-4 py-3">Employee ID</th>
              <th className="font-semibold text-slate-700 px-4 py-3">Employee Name</th>
              <th className="font-semibold text-slate-700 px-4 py-3">Punch Date</th>
              <th className="font-semibold text-slate-700 px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={`${row.employeeId}-${row.punchDate}-${i}`} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-700">{row.employeeId}</td>
                <td className="px-4 py-3 text-emerald-600 font-medium">{row.employeeName}</td>
                <td className="px-4 py-3 text-slate-700">{row.punchDate}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => setActive(row)} className="text-sky-600 hover:text-sky-700">
                    <CalendarClock size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate-400">No missed punches found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-end gap-4 px-4 py-3 text-sm text-slate-500">
          <span>Rows per page 10</span>
          <span>
            {rows.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, rows.length)} of {rows.length}
          </span>
          <div className="flex items-center gap-1">
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="h-7 w-7 rounded-lg border border-slate-200 disabled:opacity-40">‹</button>
            <span className="px-2 font-medium text-slate-700">{page}</span>
            <button
              type="button"
              disabled={page * pageSize >= rows.length}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 w-7 rounded-lg border border-slate-200 disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {active && (
        <PunchRegularizationModal
          employeeName={active.employeeName}
          date={active.punchDate}
          existingPunch={activeDetails?.[0]}
          onClose={() => setActive(null)}
          onSave={async (punchType, time, remarks) => {
            try {
              await saveRegularization({
                employeeId: active.employeeId,
                punchDate: active.punchDate,
                punchType,
                time,
                remarks,
              }).unwrap();
              toast.success(`Regularized ${active.employeeName} - ${active.punchDate}`);
              setActive(null);
            } catch {
              toast.error("Failed to save regularization. Please try again.");
            }
          }}
        />
      )}
    </RegularizationLayout>
  );
}
