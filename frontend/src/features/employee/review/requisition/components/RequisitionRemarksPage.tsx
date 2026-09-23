import { useState } from "react";
import type { Requisition } from "../types/requisition.types";

interface RequisitionRemarksPageProps {
  requisitions: Requisition[];
  onBack: () => void;
}

export default function RequisitionRemarksPage({
  requisitions,
  onBack,
}: RequisitionRemarksPageProps) {
  const requisition = requisitions[0];

  const [remarks, setRemarks] = useState<Record<string, string>>(() => {
    try {
      const saved = window.localStorage.getItem(
        "requisition-rejection-remarks"
      );

      return saved ? (JSON.parse(saved) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });

  const updateRemarks = (id: string, value: string) => {
    setRemarks((previous) => ({
      ...previous,
      [id]: value,
    }));
  };

  const submitRemarks = () => {
    window.localStorage.setItem(
      "requisition-rejection-remarks",
      JSON.stringify(remarks)
    );
    onBack();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-leave-title"
        className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              id="reject-leave-title"
              className="text-lg font-semibold text-slate-900"
            >
              Reject Leave
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Please review the leave details before rejecting this leave.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            aria-label="Close rejection dialog"
            className="text-2xl leading-none text-slate-900 hover:text-slate-500"
          >
            &times;
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium text-slate-800">
              Leave Type
            </p>
            <div className="rounded-md border border-slate-900/80 bg-slate-50 px-3 py-3 text-sm text-slate-800">
              {requisition.leaveName}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-800">
              Leave ID
            </p>
            <div className="rounded-md border border-slate-900/80 bg-slate-50 px-3 py-3 text-sm text-slate-800">
              {requisition.leaveId}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-800">
              Employee Name
            </p>
            <div className="rounded-md border border-slate-900/80 bg-slate-50 px-3 py-3 text-sm text-slate-800">
              {requisition.employeeName}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-800">
              Date
            </p>
            <div className="rounded-md border border-slate-900/80 bg-slate-50 px-3 py-3 text-sm text-slate-800">
              {requisition.date}
            </div>
          </div>
        </div>

        <label
          htmlFor="rejection-remarks"
          className="mt-5 block text-sm font-medium text-slate-800"
        >
          Remarks
        </label>
        <textarea
          id="rejection-remarks"
          value={remarks[requisition.id] ?? requisition.reason ?? ""}
          onChange={(event) =>
            updateRemarks(requisition.id, event.target.value)
          }
          rows={5}
          placeholder="Enter rejection remarks..."
          className="mt-1 w-full resize-none rounded-md border border-slate-900/80 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-400 pt-5">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-slate-900 px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={submitRemarks}
            className="rounded-md bg-violet-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Submit
          </button>
        </div>
      </section>
    </div>
  );
}