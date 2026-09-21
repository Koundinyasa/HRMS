import { useMemo, useState } from "react";
import { Filter, History, Check, X as XIcon } from "lucide-react";
import * as XLSX from "xlsx";
import EmptyState from "./EmptyState";
import FilterBar, { type FilterValues } from "@/features/admin/components/FilterBar";
import { SEED_BRANCHES } from "@/features/admin/admincenter/classifications/constants/branch.constants";
import { SEED_DESIGNATIONS } from "@/features/admin/admincenter/classifications/constants/designation.constants";
import { LEAVE_POLICY_GROUPS } from "@/features/admin/admincenter/classifications/constants/leavePolicy.constants";
import {
  useGetForceLeaveApprovalsQuery,
  useApproveLeavesMutation,
  useRejectLeavesMutation,
  type LeaveApprovalViewType,
  type LeaveApprovalMonthType,
} from "../api/leaveApproval.api";

const SALARY_STRUCTURE_OPTIONS = [
  { value: "ctc", label: "CTC Salary Structure" },
  { value: "new", label: "New Salary Structure" },
];
const EMP_STATUS_OPTIONS = [
  { value: "current", label: "Current Employees" },
  { value: "left", label: "Left Employees" },
];

export default function ForceLeaveApprovalPanel() {
  const [viewType, setViewType] = useState<LeaveApprovalViewType>("applied");
  const [monthType, setMonthType] = useState<LeaveApprovalMonthType>("current");
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { data: rows, isFetching } = useGetForceLeaveApprovalsQuery({
    viewType,
    monthType,
    branch: filters.branch as string[] | undefined,
    salaryStructure: filters.salaryStructure as string[] | undefined,
    leave: filters.leave as string[] | undefined,
    attendance: filters.attendance as string[] | undefined,
    designation: filters.designation as string[] | undefined,
    empStatus: filters.empStatus as string[] | undefined,
  });

  const [approveLeaves, { isLoading: isApproving }] = useApproveLeavesMutation();
  const [rejectLeaves, { isLoading: isRejecting }] = useRejectLeavesMutation();

  const fieldOptions = {
    branch: SEED_BRANCHES.map((b) => ({ value: String(b.Id), label: b.BranchName })),
    designation: SEED_DESIGNATIONS.map((d) => ({ value: String(d.Id), label: d.DesignationName })),
    leave: LEAVE_POLICY_GROUPS.map((g) => ({ value: g.code, label: g.name })),
    attendance: [], // wire real options if/when an attendance-type source exists
    salaryStructure: SALARY_STRUCTURE_OPTIONS,
    empStatus: EMP_STATUS_OPTIONS,
  };

  const handleFilterChange = (key: string, value: string[] | string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const clearAllFilters = () => setFilters({});

  const switchView = (v: LeaveApprovalViewType) => {
    setViewType(v);
    setSelectedIds(new Set());
  };
  const switchMonth = (m: LeaveApprovalMonthType) => {
    setMonthType(m);
    setSelectedIds(new Set());
  };

  const toggleRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (!rows) return;
    setSelectedIds((prev) =>
      prev.size === rows.length ? new Set() : new Set(rows.map((r) => r.id))
    );
  };

  const hasSelection = selectedIds.size > 0;

  const handleApprove = async () => {
    if (!hasSelection) return;
    await approveLeaves({ leaveApplicationIds: Array.from(selectedIds) });
    setSelectedIds(new Set());
  };

  const handleReject = async () => {
    if (!hasSelection) return;
    await rejectLeaves({ leaveApplicationIds: Array.from(selectedIds) });
    setSelectedIds(new Set());
  };

  const handleExcelDownload = () => {
    const exportRows = (rows ?? []).map((r) => ({
      "Approver Name": r.approverName,
      "Employee Id": r.employeeId,
      "Employee Name": r.employeeName,
      "Leave Name": r.leaveName,
      Date: r.date,
      Days: r.days,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Approval");
    XLSX.writeFile(workbook, `leave-approval-${viewType}-${monthType}.xlsx`);
  };

  const emptyMessage = useMemo(
    () =>
      viewType === "applied"
        ? "No Data Found in - Leave approval"
        : "No Data Found in - Leave Cancellation",
    [viewType]
  );

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <h3 className="border-b-2 border-blue-500 pb-2 text-sm font-semibold text-blue-600">
          Leave Approval
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleApprove}
            disabled={!hasSelection || isApproving}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium ${
              hasSelection
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            <Check size={14} /> Approve
          </button>
          <button
            onClick={handleReject}
            disabled={!hasSelection || isRejecting}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium ${
              hasSelection
                ? "bg-red-500 text-white hover:bg-red-600"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            <XIcon size={14} /> Reject
          </button>
          <button
            onClick={handleExcelDownload}
            title="Download Excel"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            X
          </button>
          <button title="Filter" className="text-slate-400 hover:text-slate-600">
            <Filter size={18} />
          </button>
          <button title="History" className="text-slate-400 hover:text-slate-600">
            <History size={18} />
          </button>
        </div>
      </div>

      {/* Applied Leave / Leave Cancellation pills */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="inline-flex rounded-lg bg-slate-50 p-1">
          <button
            onClick={() => switchView("applied")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium ${
              viewType === "applied" ? "bg-blue-100 text-blue-600" : "text-slate-500"
            }`}
          >
            Applied Leave
          </button>
          <button
            onClick={() => switchView("cancellation")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium ${
              viewType === "cancellation" ? "bg-blue-100 text-blue-600" : "text-slate-500"
            }`}
          >
            Leave Cancellation
          </button>
        </div>
      </div>

      {/* Current / Non-Current Month pills */}
      <div className="flex items-center gap-3 bg-slate-50 px-5 py-3">
        <button
          onClick={() => switchMonth("current")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            monthType === "current" ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"
          }`}
        >
          Current Month Details
        </button>
        <button
          onClick={() => switchMonth("non-current")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            monthType === "non-current" ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"
          }`}
        >
          Non-Current Month Details
        </button>
      </div>

      {/* Filter bar */}
      <div className="px-5 py-4">
        <FilterBar
          variant="chip"
          fieldOptions={fieldOptions}
          values={filters}
          onChange={handleFilterChange}
          onClearAll={clearAllFilters}
        />
      </div>

      {/* Table / empty state */}
      {isFetching ? (
        <div className="py-16 text-center text-slate-400">Loading…</div>
      ) : !rows || rows.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-600">
                <th className="px-3 py-2">Approver Name</th>
                <th className="px-3 py-2">Employee Id</th>
                <th className="px-3 py-2">Employee Name</th>
                <th className="px-3 py-2">Leave Name</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Days</th>
                <th className="px-3 py-2 text-right">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === rows.length && rows.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50">
                  <td className="px-3 py-3 font-medium text-blue-600">{row.approverName}</td>
                  <td className="px-3 py-3 text-slate-500">{row.employeeId}</td>
                  <td className="px-3 py-3 text-slate-700">{row.employeeName}</td>
                  <td className="px-3 py-3 text-slate-700">{row.leaveName}</td>
                  <td className="px-3 py-3 text-slate-500">{row.date}</td>
                  <td className="px-3 py-3 text-slate-500">{row.days}</td>
                  <td className="px-3 py-3 text-right">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}