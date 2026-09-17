import { useState } from "react";
import { Calendar, FolderX } from "lucide-react";
import { useGetDescriptionsQuery, useGetAttendancetypesQuery } from "../api/attendanceApi";
import { SEED_BRANCHES } from "@/features/admin/admincenter/classifications/constants/branch.constants";
import { SEED_DESIGNATIONS } from "@/features/admin/admincenter/classifications/constants/designation.constants";
import { LEAVE_POLICY_GROUPS } from "@/features/admin/admincenter/classifications/constants/leavePolicy.constants";
import FilterBar, { type FilterValues } from "@/features/admin/components/FilterBar";
import type { FilterFieldKey } from "@/features/admin/components/filterFields.constants";

// ⚠️ No API endpoint exists yet for salary structures in this module —
// seeded from the screenshot's exact options until a real one is wired up.
const SALARY_STRUCTURE_OPTIONS = [
  { value: "ctc", label: "CTC Salary Structure" },
  { value: "new", label: "New Salary Structure" },
  { value: "salary-structure", label: "Salary structure" },
  { value: "test", label: "Test Structure" },
  { value: "test-2", label: "Test Structure 2" },
  { value: "test-3", label: "TEST3" },
];

const EMP_STATUS_OPTIONS = [
  { value: "current", label: "Current Employees" },
  { value: "left", label: "Left Employees" },
];

export default function AttendanceIntegrationPanel() {
  const descriptions = useGetDescriptionsQuery();
  const attendanceTypes = useGetAttendancetypesQuery();

  const [filters, setFilters] = useState<FilterValues>({});
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFilterChange = (key: FilterFieldKey, value: string[] | string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearAllFilters = () => setFilters({});

  const fieldOptions = {
    branch: SEED_BRANCHES.map((b) => ({ value: String(b.Id), label: b.BranchName })),
    designation: SEED_DESIGNATIONS.map((d) => ({ value: String(d.Id), label: d.DesignationName })),
    leave: LEAVE_POLICY_GROUPS.map((g) => ({ value: g.code, label: g.name })),
    attendance: (attendanceTypes.data ?? []).map((a: { id: number; label: string }) => ({
      value: String(a.id),
      label: a.label,
    })),
    salaryStructure: SALARY_STRUCTURE_OPTIONS,
    empStatus: EMP_STATUS_OPTIONS,
  };

  // ⚠️ No query results / notifications endpoint is wired up here yet —
  // always shows the empty state until that data source is available.
  const hasResults = false;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <div className="mb-5">
        <FilterBar
          variant="chip"
          fieldOptions={fieldOptions}
          values={filters}
          onChange={handleFilterChange}
          onClearAll={clearAllFilters}
        />
      </div>

      {/* Description / date range */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <select
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 bg-white outline-none focus:border-slate-300"
          >
            <option value="">Select Description</option>
            {descriptions.data?.map((d: { label: string; value: string }) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">From Date</label>
          <div className="relative">
            <input
              type="text"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="DD-MM-YYYY"
              className="h-9 w-full rounded-lg border border-slate-200 pl-3 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
            />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">To Date</label>
          <div className="relative">
            <input
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="DD-MM-YYYY"
              className="h-9 w-full rounded-lg border border-slate-200 pl-3 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
            />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results / empty state */}
      {hasResults ? (
        <div>{/* results table goes here once a data source exists */}</div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          {/* ⚠️ Placeholder — swap in the real illustration asset */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
            <FolderX size={40} className="text-slate-300" />
          </div>
          <p className="text-sm text-slate-500">No Current Notifications</p>
        </div>
      )}
    </div>
  );
}