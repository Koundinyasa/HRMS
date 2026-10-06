import { useState } from "react";
import { ScanFace } from "lucide-react";
import AssignLayout from "./AssignLayout";
import PunchFilterBar from "../../components/PunchFilterBar";
import { ASSIGN_EMPLOYEE_ROWS } from "../../constants/assign.mock";
import type { PunchFilters } from "../../types/timeoffice.types";

/** No reference screenshot for this tab specifically — table shape inferred from Geo-Location/Policy Update. */
export default function FaceTemplateAssignPage() {
  const [filters, setFilters] = useState<PunchFilters>({});
  const rows = ASSIGN_EMPLOYEE_ROWS.slice(0, 250);

  return (
    <AssignLayout>
      <PunchFilterBar rows={[]} filters={filters} onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))} onClear={() => setFilters({})} />

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#EAF1FE]">
            <tr className="text-left">
              <th className="font-semibold text-slate-700 px-4 py-3">Employee Id</th>
              <th className="font-semibold text-slate-700 px-4 py-3">Employee Name</th>
              <th className="font-semibold text-slate-700 px-4 py-3">Face Template</th>
              <th className="font-semibold text-slate-700 px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.employeeId} className="border-t border-slate-100">
                <td className="px-4 py-3 text-emerald-600 font-medium">{row.employeeId}</td>
                <td className="px-4 py-3 text-slate-700">{row.employeeName}</td>
                <td className="px-4 py-3 text-slate-300"><ScanFace size={16} /></td>
                <td className="px-4 py-3">
                  <button type="button" className="h-7 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-500">
                    Register
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-end gap-4 px-4 py-3 text-sm text-slate-500">
          <span>Rows per page 250</span>
          <span>1 to {rows.length} of {ASSIGN_EMPLOYEE_ROWS.length}</span>
        </div>
      </div>
    </AssignLayout>
  );
}
