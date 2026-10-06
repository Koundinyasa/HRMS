import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import AssignLayout from "./AssignLayout";
import PunchFilterBar from "../../components/PunchFilterBar";
import DateField from "../../components/DateField";
import DropdownSelect from "../../../../components/DropdownSelect";
import { POLICY_UPDATE_ROWS } from "../../constants/assign.mock";
import type { PunchFilters } from "../../types/timeoffice.types";

const POLICY_OPTIONS = [
  { label: "Policies", value: "" },
  { label: "General Policy", value: "General Policy" },
];

export default function PolicyUpdateAssignPage() {
  const [filters, setFilters] = useState<PunchFilters>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [temporary, setTemporary] = useState(false);
  const [policyFrom, setPolicyFrom] = useState("");
  const [policyTo, setPolicyTo] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("2026-06-12");
  const pageSize = 250;
  const rows = POLICY_UPDATE_ROWS.slice(0, pageSize);

  const toggleAll = (checked: boolean) => setSelected(checked ? new Set(rows.map((r) => r.employeeId)) : new Set());
  const toggleOne = (id: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });

  return (
    <AssignLayout
      actions={
        <label className="flex items-center gap-2 text-sm text-slate-600 mr-1">
          Temporary Policy Update
          <button
            type="button"
            role="switch"
            aria-checked={temporary}
            onClick={() => setTemporary((v) => !v)}
            className={`relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full transition-colors ${temporary ? "bg-emerald-600" : "bg-slate-200"}`}
          >
            <span className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${temporary ? "translate-x-[15px]" : "translate-x-0.5"}`} />
          </button>
        </label>
      }
    >
      <div className="flex items-center justify-end gap-2 flex-wrap bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Policy From -
          <DropdownSelect
            options={POLICY_OPTIONS}
            value={policyFrom}
            onChange={setPolicyFrom}
            menuClassName="w-40"
            className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm min-w-[140px]"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          TA Policy To -
          <DropdownSelect
            options={POLICY_OPTIONS}
            value={policyTo}
            onChange={setPolicyTo}
            menuClassName="w-40"
            className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm min-w-[140px]"
          />
        </label>
        <DateField label="Effective Date" value={effectiveDate} onChange={setEffectiveDate} />
        <button type="button" disabled={!policyTo || selected.size === 0} className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-40">
          Update
        </button>
        <button type="button" title="Export to Excel" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600">
          <FileSpreadsheet size={16} />
        </button>
      </div>

      <PunchFilterBar rows={[]} filters={filters} onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))} onClear={() => setFilters({})} />

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#EAF1FE]">
            <tr className="text-left">
              <th className="font-semibold text-slate-700 px-4 py-3">Employee Id</th>
              <th className="font-semibold text-slate-700 px-4 py-3">Employee Name</th>
              <th className="font-semibold text-slate-700 px-4 py-3">Effective Date</th>
              <th className="font-semibold text-slate-700 px-4 py-3">Policy</th>
              <th className="font-semibold text-slate-700 px-4 py-3">
                <input type="checkbox" checked={selected.size === rows.length} onChange={(e) => toggleAll(e.target.checked)} />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.employeeId} className="border-t border-slate-100">
                <td className="px-4 py-3 text-emerald-600 font-medium">{row.employeeId}</td>
                <td className="px-4 py-3 text-slate-700">{row.employeeName}</td>
                <td className="px-4 py-3 text-slate-700">{row.effectiveDate}</td>
                <td className="px-4 py-3 text-slate-700">{row.policy}</td>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(row.employeeId)} onChange={(e) => toggleOne(row.employeeId, e.target.checked)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-end gap-4 px-4 py-3 text-sm text-slate-500">
          <span>Rows per page {pageSize}</span>
          <span>1 to {rows.length} of {POLICY_UPDATE_ROWS.length}</span>
        </div>
      </div>
    </AssignLayout>
  );
}
