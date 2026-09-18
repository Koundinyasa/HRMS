import { useState } from "react";
import { CheckCircle2, Fingerprint, Search, Send } from "lucide-react";
import FilterBar, { type FilterValues } from "@/features/admin/components/FilterBar";
import type { FilterFieldKey } from "@/features/admin/components/filterFields.constants";
import {
  useGetLeavePunchExistRecordsQuery,
  useGetReconcileLeaveTypesQuery,
  useUpdateReconcileLeaveMutation,
} from "../api/attendanceApi";
import { SEED_BRANCHES } from "@/features/admin/admincenter/classifications/constants/branch.constants";
import { SEED_DESIGNATIONS } from "@/features/admin/admincenter/classifications/constants/designation.constants";
import { LEAVE_POLICY_GROUPS } from "@/features/admin/admincenter/classifications/constants/leavePolicy.constants";

const EMP_STATUS_OPTIONS = [
  { value: "current", label: "Current Employees" },
  { value: "left", label: "Left Employees" },
];

export default function LeavePunchExistTab() {
  const [month] = useState("2026-09");
  const [fromDate] = useState("2026-09-01");
  const [toDate] = useState("2026-09-30");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rowKey = (employeeId: string, date: string) => `${employeeId}__${date}`;

  const { data: rows = [], isLoading, isError } = useGetLeavePunchExistRecordsQuery({
    month,
    fromDate,
    toDate,
    search,
    branch: filters.branch as string[] | undefined,
    designation: filters.designation as string[] | undefined,
    leave: filters.leave as string[] | undefined,
    empStatus: filters.empStatus as string[] | undefined,
  });

  const leaveTypes = useGetReconcileLeaveTypesQuery();
  const [updateReconcileLeave] = useUpdateReconcileLeaveMutation();

  const fieldOptions = {
    branch: SEED_BRANCHES.map((b) => ({ value: String(b.Id), label: b.BranchName })),
    designation: SEED_DESIGNATIONS.map((d) => ({ value: String(d.Id), label: d.DesignationName })),
    leave: LEAVE_POLICY_GROUPS.map((g) => ({ value: g.code, label: g.name })),
    empStatus: EMP_STATUS_OPTIONS,
  };

  const allSelected = rows.length > 0 && selected.size === rows.length;

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => rowKey(r.employeeId, r.date))));
  };

  const toggleRow = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // ⚠️ Best guess — the send icon reconciles this row using the leave type
  // already shown in "Applied Leave" (matched by code prefix, e.g. "SL").
  // Confirm the real intended behavior.
  const reconcileRow = async (employeeId: string, date: string, appliedLeave: string) => {
    const code = appliedLeave.split(" ")[0];
    const match = leaveTypes.data?.find((t: { id: number; label: string }) =>
      t.label.toUpperCase().includes(code.toUpperCase())
    );
    if (!match) return;
    try {
      await updateReconcileLeave({
        leaveTypeId: match.id,
        employees: [{ employeeId: Number(employeeId), date }],
      }).unwrap();
    } catch {
      // TODO: surface a toast on failure
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm rounded-lg px-4 py-2.5 mb-3">
        <CheckCircle2 size={16} className="shrink-0" />
        In the <strong>Leave/Punch Exist</strong> section, employees who have punch records and have also
        applied for leave will be listed.
      </div>

      <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-lg px-3 py-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Start Typing..."
            className="w-full h-8 pl-8 pr-2 text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <FilterBar
          variant="plain"
          fields={["query", "branch", "salaryStructure", "leave", "attendance", "designation", "empStatus"]}
          fieldOptions={fieldOptions}
          values={filters}
          onChange={(key: FilterFieldKey, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
          onClearAll={() => setFilters({})}
          showMenu
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sky-50 text-left text-slate-700">
              <th className="font-semibold px-4 py-3">Employee Id</th>
              <th className="font-semibold px-4 py-3">Employee Name</th>
              <th className="font-semibold px-4 py-3">Date</th>
              <th className="font-semibold px-4 py-3">Working Hours</th>
              <th className="font-semibold px-4 py-3">Applied Leave</th>
              <th className="font-semibold px-4 py-3 text-right">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-slate-300" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-red-400">
                  Could not load records.
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const key = rowKey(row.employeeId, row.date);
                return (
                  <tr key={key} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sky-600 font-medium">{row.employeeId}</td>
                    <td className="px-4 py-3 text-slate-700">{row.employeeName}</td>
                    <td className="px-4 py-3 text-slate-600">{row.date}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="flex items-center gap-1.5">
                        {row.workingHours}
                        {row.hasPunchRecord && <Fingerprint size={14} className="text-sky-400" />}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-xs font-medium">
                          {row.appliedLeave}
                        </span>
                        <button
                          type="button"
                          onClick={() => reconcileRow(row.employeeId, row.date, row.appliedLeave)}
                          title="Reconcile"
                          className="text-sky-500 hover:text-sky-700"
                        >
                          <Send size={14} />
                        </button>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="checkbox"
                        checked={selected.has(key)}
                        onChange={() => toggleRow(key)}
                        className="rounded border-slate-300"
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}