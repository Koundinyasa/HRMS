import { useState } from "react";
import { FileSpreadsheet, MapPin, Pencil } from "lucide-react";
import AssignLayout from "./AssignLayout";
import PunchFilterBar from "../../components/PunchFilterBar";
import DateField from "../../components/DateField";
import DropdownSelect from "../../../../components/DropdownSelect";
import { ASSIGN_EMPLOYEE_ROWS, GEO_LOCATION_ASSIGNED } from "../../constants/assign.mock";
import type { PunchFilters } from "../../types/timeoffice.types";

const LOCATION_OPTIONS = [
  { label: "Select location", value: "" },
  { label: "Head Office", value: "Head Office" },
];

export default function GeoLocationAssignPage() {
  const [filters, setFilters] = useState<PunchFilters>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [changeTo, setChangeTo] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("2026-06-12");
  const pageSize = 250;
  const rows = ASSIGN_EMPLOYEE_ROWS.slice(0, pageSize);

  const toggleAll = (checked: boolean) => setSelected(checked ? new Set(rows.map((r) => r.employeeId)) : new Set());
  const toggleOne = (id: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });

  return (
    <AssignLayout>
      <div className="flex items-center justify-end gap-2 flex-wrap bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Change Location To -
          <DropdownSelect
            options={LOCATION_OPTIONS}
            value={changeTo}
            onChange={setChangeTo}
            menuClassName="w-44"
            className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm min-w-[160px]"
          />
        </label>
        <DateField label="Effective Date" value={effectiveDate} onChange={setEffectiveDate} />
        <button type="button" disabled={!changeTo || selected.size === 0} className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-40">
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
              <th className="font-semibold text-slate-700 px-4 py-3">Location</th>
              <th className="font-semibold text-slate-700 px-4 py-3">
                <input type="checkbox" checked={selected.size === rows.length} onChange={(e) => toggleAll(e.target.checked)} /> Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.employeeId} className="border-t border-slate-100">
                <td className="px-4 py-3 text-emerald-600 font-medium">{row.employeeId}</td>
                <td className="px-4 py-3 text-slate-700">{row.employeeName}</td>
                <td className="px-4 py-3">
                  <MapPin size={16} className={GEO_LOCATION_ASSIGNED[row.employeeId] ? "text-red-500" : "text-slate-300"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selected.has(row.employeeId)} onChange={(e) => toggleOne(row.employeeId, e.target.checked)} />
                    <button type="button" className="text-slate-400 hover:text-emerald-600"><Pencil size={14} /></button>
                    <button
                      type="button"
                      disabled={!selected.has(row.employeeId)}
                      className="h-7 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 disabled:opacity-40"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-end gap-4 px-4 py-3 text-sm text-slate-500">
          <span>Rows per page {pageSize}</span>
          <span>1 to {rows.length} of {ASSIGN_EMPLOYEE_ROWS.length}</span>
        </div>
      </div>
    </AssignLayout>
  );
}
