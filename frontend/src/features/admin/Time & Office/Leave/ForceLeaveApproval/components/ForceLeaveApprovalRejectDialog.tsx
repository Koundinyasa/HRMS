import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createPortal } from "react-dom";
import { X as XIcon } from "lucide-react";
import type { ForceLeaveApprovalRejectDialogProps } from "../types/forceapproval.types";
import { useRejectForceLeaveApprovals } from "../hooks/useForceLeaveApprovalApi";

export default function ForceLeaveApprovalRejectDialog({
  rows,
  onClose,
  onRejected,
  onSubmittingChange,
}: ForceLeaveApprovalRejectDialogProps) {
  const [rejectLeaves] = useRejectForceLeaveApprovals();
  const [remarks, setRemarks] = useState(rows.length === 1 ? rows[0].reason : "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedRemarks = remarks.trim();
    if (!rows.length) return;
    if (!trimmedRemarks) {
      setError("Please enter a reason for rejection.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    onSubmittingChange(true);
    try {
      await Promise.all(rows.map((row) => rejectLeaves({ approvalId: row.id, remarks: trimmedRemarks }).unwrap()));
      onRejected();
      onClose();
    } catch (submitError) {
      console.error("Failed to reject leave applications:", submitError);
      setError("Unable to reject the selected leave. Please try again.");
    } finally {
      setIsSubmitting(false);
      onSubmittingChange(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="force-reject-leave-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-[640px] overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="force-reject-leave-title" className="text-lg font-semibold text-slate-900">Reject Leave</h2>
            <p className="mt-1 text-sm text-slate-600">Please review the leave details before rejecting this leave.</p>
          </div>
          <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close rejection dialog" className="text-slate-900 hover:text-slate-500 disabled:opacity-50">
            <XIcon size={20} />
          </Button>
        </div>

        {rows.length === 1 ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Leave Type", rows[0].leaveName],
              ["Leave ID", String(rows[0].id)],
              ["Employee Name", rows[0].employeeName],
              ["Applied Date", rows[0].date],
              ["From Date", rows[0].fromDate],
              ["To Date", rows[0].toDate],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="mb-1 text-sm font-medium text-slate-800">{label}</p>
                <div className="rounded-md border border-slate-900/80 bg-slate-50 px-3 py-3 text-sm text-slate-800">{value || "-"}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 max-h-44 overflow-y-auto rounded-md border border-slate-200">
            {rows.map((row) => (
              <div key={row.id} className="grid grid-cols-[auto_1fr] gap-x-3 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0">
                <span className="font-medium text-slate-800">{row.employeeName}</span>
                <span className="text-right text-slate-600">{row.leaveName} · {row.fromDate} – {row.toDate} · ID {row.id}</span>
              </div>
            ))}
          </div>
        )}

        <label htmlFor="force-rejection-remarks" className="mt-5 block text-sm font-medium text-slate-800">
          Remarks <span aria-hidden="true" className="text-base font-bold text-red-600">*</span>
        </label>
        <textarea
          id="force-rejection-remarks"
          required
          value={remarks}
          onChange={(event) => {
            setRemarks(event.target.value);
            setError("");
          }}
          disabled={isSubmitting}
          rows={5}
          placeholder="Enter rejection remarks..."
          className="mt-1 w-full resize-none rounded-md border border-slate-900/80 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
        />

        {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-400 pt-5">
          <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting} className="rounded-md border border-slate-900 px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-50">Close</Button>
          <Button variant="ghost" type="button" onClick={() => void handleSubmit()} disabled={isSubmitting} className="rounded-md bg-violet-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
