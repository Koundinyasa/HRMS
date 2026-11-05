import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { RefreshCw, Search } from "lucide-react";

import {
  useApproveFaceReRegistrationMutation,
  useGetFaceReRegistrationRequestsQuery,
  useRejectFaceReRegistrationMutation,
} from "../api/faceReRegistrationApi";
import type {
  FaceReRegistrationRequest,
  FaceReRegistrationStatusFilter,
} from "../types/faceReRegistration.types";

const TABS: FaceReRegistrationStatusFilter[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Used",
  "Expired",
  "All",
];

const STATUS_CLASS: Record<string, string> = {
  Pending: "bg-orange-100 text-orange-600",
  Approved: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
  Used: "bg-blue-100 text-blue-600",
  Expired: "bg-gray-100 text-gray-600",
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
};

function getErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { data?: { message?: unknown } })?.data?.message;
  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message) && typeof message[0] === "string") return message[0];
  return fallback;
}

type PendingAction =
  | { type: "approve"; request: FaceReRegistrationRequest }
  | { type: "reject"; request: FaceReRegistrationRequest };

const FaceReRegistrationApprovalPage = () => {
  const [tab, setTab] = useState<FaceReRegistrationStatusFilter>("Pending");
  const [search, setSearch] = useState("");
  const [action, setAction] = useState<PendingAction | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetFaceReRegistrationRequestsQuery(tab);
  const [approve, { isLoading: isApproving }] =
    useApproveFaceReRegistrationMutation();
  const [reject, { isLoading: isRejecting }] =
    useRejectFaceReRegistrationMutation();
  const isActionLoading = isApproving || isRejecting;

  const requests = useMemo(() => {
    const rows = data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        r.employeeName?.toLowerCase().includes(term) ||
        r.employeeCode?.toLowerCase().includes(term) ||
        r.employeeId?.toLowerCase().includes(term) ||
        r.reason?.toLowerCase().includes(term),
    );
  }, [data, search]);

  const closeAction = () => {
    if (isActionLoading) return;
    setAction(null);
    setRejectionReason("");
  };

  const handleConfirm = async () => {
    if (!action) return;
    try {
      if (action.type === "approve") {
        const res = await approve(action.request.id).unwrap();
        toast.success(res.message || "Request approved.");
      } else {
        if (!rejectionReason.trim()) {
          toast.error("Please enter your reason for rejecting this request.");
          return;
        }
        const res = await reject({
          id: action.request.id,
          rejectionReason: rejectionReason.trim(),
        }).unwrap();
        toast.success(res.message || "Request rejected.");
      }
      setAction(null);
      setRejectionReason("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  const isReject = action?.type === "reject";

  return (
    <div className="min-h-full w-full bg-[#f3f4fa] p-4 md:p-5">
      <div className="space-y-4">
        {/* Title */}
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-5">
          <div className="inline-block">
            <h1 className="text-[15px] font-medium text-[#0086d1]">
              Face Re-registration Approval
            </h1>
            <div className="mt-2 h-[2px] w-[102px] bg-[#0086d1]" />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Your team members need your approval before they can replace their
            registered face. An approval can be used once, within 7 days.
          </p>
        </div>

        {/* Tabs + search */}
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  tab === t
                    ? "bg-[#0086d1] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee or reason"
                className="h-9 w-full rounded-md border border-slate-300 pl-8 pr-3 text-sm outline-none focus:border-blue-500 md:w-64"
              />
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              aria-label="Refresh"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {isError && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-4">
            <p className="text-sm text-red-500">Failed to load requests.</p>
          </div>
        )}

        {/* Table */}
        <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse">
              <thead>
                <tr className="bg-[#d8ebf8] text-left">
                  {[
                    "Employee",
                    "Requested On",
                    "Reason",
                    "Current Registration",
                    "Status",
                    tab === "Pending" ? "Action" : "Decision",
                  ].map((h) => (
                    <th key={h} className="px-4 py-4 text-sm font-semibold text-[#0b315d]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="h-[115px] px-4 text-center text-sm text-slate-400">
                      Loading requests...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-[115px] px-4 text-center text-sm text-slate-400">
                      No {tab === "All" ? "" : tab.toLowerCase() + " "}requests found
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100 transition hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <div className="font-medium">{r.employeeName}</div>
                        <div className="text-xs text-slate-400">{r.employeeCode || r.employeeId}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{formatDate(r.requestedAt)}</td>
                      <td
                        className="max-w-[260px] truncate px-4 py-4 text-sm text-slate-700"
                        title={r.reason ?? ""}
                      >
                        {r.reason || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {formatDate(r.currentRegistrationDate)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            STATUS_CLASS[r.status] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {r.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => setAction({ type: "approve", request: r })}
                              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => setAction({ type: "reject", request: r })}
                              className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500">
                            <div>{formatDate(r.decidedAt)}</div>
                            {r.status === "Rejected" && r.rejectionReason && (
                              <div className="max-w-[200px] truncate" title={r.rejectionReason}>
                                {r.rejectionReason}
                              </div>
                            )}
                            {r.status === "Approved" && r.expiresAt && (
                              <div>Valid till {formatDate(r.expiresAt)}</div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approve / Reject confirmation */}
      {action && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={closeAction}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-[#0b315d]">
                {isReject ? "Reject Re-registration" : "Approve Re-registration"}
              </h2>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <p className="text-sm text-slate-500">Employee</p>
                <p className="font-medium text-slate-700">{action.request.employeeName}</p>
              </div>
              {action.request.reason && (
                <div>
                  <p className="text-sm text-slate-500">Reason given</p>
                  <p className="text-sm text-slate-700">{action.request.reason}</p>
                </div>
              )}
              {isReject ? (
                <div>
                  <label htmlFor="rejection-reason" className="mb-2 block text-sm font-medium text-slate-600">
                    Reason for rejecting <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="rejection-reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="The employee will see this reason"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  The employee will be able to replace their registered face once,
                  within the next 7 days.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={closeAction}
                disabled={isActionLoading}
                className="rounded-md border border-slate-300 px-5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirm()}
                disabled={isActionLoading || (isReject && !rejectionReason.trim())}
                className={`rounded-md px-5 py-2 text-sm font-medium text-white ${
                  isReject ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isActionLoading ? "Processing..." : isReject ? "Reject" : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceReRegistrationApprovalPage;
