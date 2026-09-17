import { useState } from "react";
import { Search } from "lucide-react";
import FilterBar, { type FilterValues } from "@/features/admin/components/FilterBar";
import type { FilterFieldKey } from "@/features/admin/components/filterFields.constants";
import {
  useGetPenaltyLeaveDeductionRecordsQuery,
  useGetReconcileLeaveTypesQuery,
} from "../api/attendanceApi";
import { SEED_BRANCHES } from "@/features/admin/admincenter/classifications/constants/branch.constants";
import { SEED_DESIGNATIONS } from "@/features/admin/admincenter/classifications/constants/designation.constants";
import { LEAVE_POLICY_GROUPS } from "@/features/admin/admincenter/classifications/constants/leavePolicy.constants";

const EMP_STATUS_OPTIONS = [
  { value: "current", label: "Current Employees" },
  { value: "left", label: "Left Employees" },
];

export default function PenaltyLeaveDeductionTab() {
  const [month] = useState("2026-09");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [leaveTypeId, setLeaveTypeId] = useState<number | "">("");
  const [applied, setApplied] = useState(false);

  const leaveTypes = useGetReconcileLeaveTypesQuery();

  const { data: rows = [], isLoading } = useGetPenaltyLeaveDeductionRecordsQuery(
    {
      month,
      fromDate: `${month}-01`,
      toDate: `${month}-30`,
      leaveTypeId: leaveTypeId as number,
      search,
      branch: filters.branch as string[] | undefined,
      designation: filters.designation as string[] | undefined,
      leave: filters.leave as string[] | undefined,
      empStatus: filters.empStatus as string[] | undefined,
    },
    { skip: !applied || !leaveTypeId }
  );

  const fieldOptions = {
    branch: SEED_BRANCHES.map((b) => ({ value: String(b.Id), label: b.BranchName })),
    designation: SEED_DESIGNATIONS.map((d) => ({ value: String(d.Id), label: d.DesignationName })),
    leave: LEAVE_POLICY_GROUPS.map((g) => ({ value: g.code, label: g.name })),
    empStatus: EMP_STATUS_OPTIONS,
  };

  return (
    <div>
      <div className="flex items-center justify-end gap-3 mb-3">
        <select
          value={leaveTypeId}
          onChange={(e) => {
            setLeaveTypeId(Number(e.target.value));
            setApplied(false);
          }}
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 bg-white outline-none focus:border-slate-300"
        >
          <option value="">Penalty Deduction</option>
          {leaveTypes.data?.map((t: { id: number; label: string }) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setApplied(true)}
          disabled={!leaveTypeId}
          className="h-9 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          Apply
        </button>
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

      {!applied || !leaveTypeId ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <p className="text-rose-400 font-medium text-sm">No Data Found in - Penalty Leave Deduction</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-24 text-slate-400 text-sm">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <p className="text-rose-400 font-medium text-sm">No Data Found in - Penalty Leave Deduction</p>
        </div>
      ) : (
        // ⚠️ Table columns are guessed — no populated example was available.
        // Correct once a real row is seen.
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sky-50 text-left text-slate-700">
                <th className="font-semibold px-4 py-3">Employee ID</th>
                <th className="font-semibold px-4 py-3">Employee Name</th>
                <th className="font-semibold px-4 py-3">Date</th>
                <th className="font-semibold px-4 py-3">Leave Type</th>
                <th className="font-semibold px-4 py-3">Deduction Days</th>
                <th className="font-semibold px-4 py-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row) => (
                <tr key={`${row.employeeId}-${row.date}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sky-600 font-medium">{row.employeeId}</td>
                  <td className="px-4 py-3 text-slate-700">{row.employeeName}</td>
                  <td className="px-4 py-3 text-slate-600">{row.date}</td>
                  <td className="px-4 py-3 text-slate-600">{row.leaveType}</td>
                  <td className="px-4 py-3 text-slate-600">{row.deductionDays}</td>
                  <td className="px-4 py-3 text-slate-500">{row.reason ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}