import { useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import FilterBar, { type FilterValues } from "@/features/admin/components/FilterBar";
import type { FilterFieldKey } from "@/features/admin/components/filterFields.constants";
import {
  useGetMissingLeaveRecordsQuery,
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

export default function MissingLeaveTab() {
  const [month] = useState("2026-09"); // ⚠️ wire to a real month picker once one exists
  const [fromDate] = useState("2026-09-01");
  const [toDate] = useState("2026-09-30");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [leaveTypeId, setLeaveTypeId] = useState<number | "">("");

  const rowKey = (employeeId: string, date: string) => `${employeeId}__${date}`;

  const { data: rows = [], isLoading, isError } = useGetMissingLeaveRecordsQuery({
    month,
    fromDate,
    toDate,
    search,
    branch: filters.branch as string[] | undefined,
    salaryStructure: filters.salaryStructure as string[] | undefined,
    leave: filters.leave as string[] | undefined,
    attendance: filters.attendance as string[] | undefined,
    designation: filters.designation as string[] | undefined,
    empStatus: filters.empStatus as string[] | undefined,
    query: filters.query as string | undefined,
  });

  const leaveTypes = useGetReconcileLeaveTypesQuery();
  const [updateReconcileLeave, { isLoading: isUpdating }] = useUpdateReconcileLeaveMutation();

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

  const handleUpdate = async () => {
    if (!leaveTypeId || selected.size === 0) return;
    const employees = rows
      .filter((r) => selected.has(rowKey(r.employeeId, r.date)))
      .map((r) => ({ employeeId: Number(r.employeeId), date: r.date }));

    try {
      await updateReconcileLeave({ leaveTypeId, employees }).unwrap();
      setSelected(new Set());
      setLeaveTypeId("");
    } catch {
      // TODO: surface a toast on failure
    }
  };

  return (
    <div>
      {/* Bulk action bar */}
      <div className="flex items-center justify-end gap-3 mb-3">
        <select
          value={leaveTypeId}
          onChange={(e) => setLeaveTypeId(Number(e.target.value))}
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 bg-white outline-none focus:border-slate-300"
        >
          <option value="">Select Leave Type</option>
          {leaveTypes.data?.map((t: { id: number; label: string }) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={!leaveTypeId || selected.size === 0 || isUpdating}
          className="h-9 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          Update
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm rounded-lg px-4 py-2.5 mb-3">
        <CheckCircle2 size={16} className="shrink-0" />
        In the <strong>Missing Leave</strong> section, employees who have no punch records and have not
        applied for leave will be listed.
      </div>

      {/* Search + filter bar */}
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sky-50 text-left text-slate-700">
              <th className="font-semibold px-4 py-3">Employee ID</th>
              <th className="font-semibold px-4 py-3">Employee Name</th>
              <th className="font-semibold px-4 py-3">Date</th>
              <th className="font-semibold px-4 py-3">TA Status</th>
              <th className="font-semibold px-4 py-3">Working Hours</th>
              <th className="font-semibold px-4 py-3 text-center" colSpan={2}>
                Leave
              </th>
              <th className="font-semibold px-4 py-3 text-right">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-slate-300" />
              </th>
            </tr>
            <tr className="bg-sky-50 text-left text-xs text-slate-500">
              <th colSpan={5} />
              <th className="font-medium px-4 pb-2">First Half</th>
              <th className="font-medium px-4 pb-2">Second Half</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-red-400">
                  Could not load records.
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400">
                  No missing leave records found.
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
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        {row.taStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.workingHours}</td>
                    <td className="px-4 py-3">
                      {row.firstHalfIndicator && (
                        <span className="inline-block w-6 h-6 rounded bg-amber-100" title="Present" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.secondHalfConfirmed && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-sky-100 text-sky-600">
                          ✓
                        </span>
                      )}
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