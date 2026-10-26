import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EmptyState } from "./RecruitmentShared";
import type { Approval, ApprovalStatus } from "../types/recruitment.types";
import { APPROVAL_TABS } from "../constants/recruitment.constants";
interface ApprovalsPanelProps {
  approvals: Approval[];
  canManageApprovals: boolean;
  selectedApprovalStatus: ApprovalStatus;
  setSelectedApprovalStatus: (status: ApprovalStatus) => void;
  search: string;
  approvalComments: Record<number, string>;
  setApprovalComments: Dispatch<SetStateAction<Record<number, string>>>;
  sendBackOpening: (approvalId: number) => void;
  approveOpening: (approvalId: number) => void;
}

export function ApprovalsPanel({
  approvals,
  canManageApprovals,
  selectedApprovalStatus,
  setSelectedApprovalStatus,
  search,
  approvalComments,
  setApprovalComments,
  sendBackOpening,
  approveOpening,
}: ApprovalsPanelProps) {
  const filterKey = `${search}\u0000${selectedApprovalStatus}`;
  const [pagination, setPagination] = useState({ page: 1, filterKey });
  const [pageSize, setPageSize] = useState(10);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(
    null,
  );

  const visibleApprovals = canManageApprovals
    ? approvals
    : approvals.filter((approval) => approval.status === "waiting");
  const filteredApprovals = visibleApprovals
    .filter((approval) => approval.status === selectedApprovalStatus)
    .filter((approval) => {
      const normalizedSearch = search.trim().toLowerCase();
      return (
        !normalizedSearch ||
        approval.title.toLowerCase().includes(normalizedSearch) ||
        approval.requisitionNo?.toLowerCase().includes(normalizedSearch) ||
        approval.department.toLowerCase().includes(normalizedSearch) ||
        approval.designation?.toLowerCase().includes(normalizedSearch) ||
        approval.location.toLowerCase().includes(normalizedSearch) ||
        approval.requestedBy.toLowerCase().includes(normalizedSearch)
      );
    });
  const totalPages = Math.max(1, Math.ceil(filteredApprovals.length / pageSize));
  const currentPage = Math.min(
    pagination.filterKey === filterKey ? pagination.page : 1,
    totalPages,
  );
  const changePage = (nextPage: number) =>
    setPagination({ page: nextPage, filterKey });
  const startIndex = (currentPage - 1) * pageSize;
  const pageApprovals = filteredApprovals.slice(
    startIndex,
    startIndex + pageSize,
  );
  const firstRow = filteredApprovals.length === 0 ? 0 : startIndex + 1;
  const lastRow = Math.min(startIndex + pageSize, filteredApprovals.length);

  return (
    <section className="space-y-5">
      <div className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto">
        <div className="flex w-max min-w-full flex-nowrap gap-2 pb-1">
          {APPROVAL_TABS.map((tab) => {
            const isSelected = selectedApprovalStatus === tab.status;
            const count = visibleApprovals.filter(
              (approval) => approval.status === tab.status,
            ).length;
            return (
              <button
                key={tab.status}
                type="button"
                onClick={() => setSelectedApprovalStatus(tab.status)}
                aria-pressed={isSelected}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isSelected
                    ? "border-[#202a26] bg-[#202a26] text-white"
                    : "border-[#dfe6e1] bg-white text-[#566258] hover:bg-[#f8faf8]"
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredApprovals.length === 0 ? (
          <EmptyState
            message={
              selectedApprovalStatus === "waiting"
                ? "There are no requisitions pending approval."
                : selectedApprovalStatus === "ready"
                ? "There are no approved requisitions."
                : "There are no rejected requisitions."
            }
          />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#dfe6e1] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1320px] border-collapse whitespace-nowrap text-left">
              <thead>
                <tr>
                  {[
                    "Requisition No.",
                    "Job Title",
                    "Department",
                    "Designation",
                    "Vacancies",
                    "Salary Range",
                    "Experience",
                    "Priority",
                    "Hiring Manager",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap bg-[#f8faf8] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#78867e] first:pl-5"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageApprovals.map((approval) => (
                  <tr
                    key={approval.id}
                    className="border-t border-[#eef1ed] odd:bg-white even:bg-[#fffaf0] transition-colors hover:bg-[#f3e4c5]"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 first:pl-5">
                      <span className="text-sm font-semibold text-[#28332d]">
                        {approval.requisitionNo ?? `REQ-${approval.id}`}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-[#28332d]">
                      {approval.title}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#46534b]">
                      {approval.department}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#46534b]">
                      {approval.designation ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#46534b]">
                      {approval.positions}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#46534b]">
                      {approval.salaryBand}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#46534b]">
                      {approval.experienceRequired ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#46534b]">
                      {approval.priority ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#46534b]">
                      {approval.requestedBy}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          approval.status === "waiting"
                            ? "bg-amber-100 text-amber-800"
                            : approval.status === "ready"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {approval.status === "waiting"
                          ? "Pending"
                          : approval.status === "ready"
                            ? "Approved"
                            : "Rejected"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => setSelectedApproval(approval)}
                        className="whitespace-nowrap rounded-lg border border-[#ead9b7] bg-white px-3 py-2 text-xs font-semibold text-[#986713] transition hover:bg-[#fffaf0]"
                      >
                        View / Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#eceee9] px-4 py-3 text-xs text-[#68756d] sm:flex-row sm:px-5">
            <div className="flex items-center gap-2">
              <label htmlFor="approval-page-size">Rows per page</label>
              <select
                id="approval-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  changePage(1);
                }}
                className="rounded-lg border border-[#dfe4df] bg-white px-2 py-1.5 text-xs text-[#354239] outline-none focus:border-[#537b65]"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>
                Showing {firstRow}–{lastRow} of {filteredApprovals.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changePage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-[#dfe6e1] px-3 py-1.5 font-semibold text-[#566258] transition hover:bg-[#f8faf8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <span aria-live="polite">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  changePage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-[#dfe6e1] px-3 py-1.5 font-semibold text-[#566258] transition hover:bg-[#f8faf8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedApproval && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202a26]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedApproval(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="requisition-approval-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[#efeee9] bg-white px-5 py-4">
              <h2
                id="requisition-approval-title"
                className="font-bold text-[#26332c]"
              >
                {selectedApproval.requisitionNo ??
                  `REQ-${selectedApproval.id}`}{" "}
                · {selectedApproval.title}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedApproval(null)}
                aria-label="Close requisition details"
                className="rounded-lg p-1.5 text-[#7e8981] transition hover:bg-[#f5f4ef]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
              {[
                ["Department", selectedApproval.department],
                ["Designation", selectedApproval.designation ?? "—"],
                ["Vacancies", String(selectedApproval.positions)],
                ["Salary Range", selectedApproval.salaryBand],
                ["Experience", selectedApproval.experienceRequired ?? "—"],
                ["Job Description", selectedApproval.jobDescription],
                ["Priority", selectedApproval.priority ?? "—"],
                ["Hiring Manager", selectedApproval.requestedBy],
                ["Status", selectedApproval.status === "waiting"
                  ? "Pending"
                  : selectedApproval.status === "ready"
                    ? "Approved"
                    : "Rejected"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-[#f0f0eb] py-3"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                    {label}
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm font-medium text-[#354239]">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
            {canManageApprovals && selectedApproval.status === "waiting" && (
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#efeee9] px-5 py-4">
                <input
                  aria-label={`Rejection reason for ${selectedApproval.title}`}
                  value={approvalComments[selectedApproval.id] ?? ""}
                  onChange={(event) =>
                    setApprovalComments((previous) => ({
                      ...previous,
                      [selectedApproval.id]: event.target.value,
                    }))
                  }
                  placeholder="Rejection reason"
                  className="h-9 min-w-[220px] flex-1 rounded-lg border border-[#dfe6e1] px-2.5 text-xs outline-none focus:border-[#537b65]"
                />
                <button
                  type="button"
                  disabled={!approvalComments[selectedApproval.id]?.trim()}
                  onClick={() => {
                    sendBackOpening(selectedApproval.id);
                    setSelectedApproval(null);
                  }}
                  className="h-9 rounded-lg border border-rose-200 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => {
                    approveOpening(selectedApproval.id);
                    setSelectedApproval(null);
                  }}
                  className="h-9 rounded-lg bg-[#e5a538] px-3 text-xs font-semibold text-[#342712] hover:bg-[#d99a2b]"
                >
                  Approve
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
