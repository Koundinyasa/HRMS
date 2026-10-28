import { useState } from "react";
import { createPortal } from "react-dom";
import type { Requisition } from "../types/requisition.types";

interface RequisitionRemarksPageProps {
  requisitions: Requisition[];
  onBack: () => void;
  onSubmit: (remarks: Record<string, string>) => void | Promise<void>;
}

export default function RequisitionRemarksPage({
  requisitions,
  onBack,
  onSubmit,
}: RequisitionRemarksPageProps) {
  const requisition = requisitions[0];

  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const updateRemarks = (id: string, value: string) => {
    setRemarks((previous) => ({
      ...previous,
      [id]: value,
    }));
  };

  const submitRemarks = () => {
    void onSubmit(remarks);
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-3 sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-leave-title"
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-xl bg-white p-4 shadow-2xl sm:p-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="sticky top-0 z-10 -mx-4 -mt-4 flex items-start justify-between bg-white px-4 pt-4 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-6">
          <div>
            <h2
              id="reject-leave-title"
              className="text-lg font-semibold text-slate-900 font-[Urbanist]"
            >
              Reject Leave
            </h2>
            <p className="mt-1 text-sm text-slate-600 font-[Urbanist]">
              Please review the leave details before rejecting this leave.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            aria-label="Close rejection dialog"
            className="text-2xl leading-none text-slate-900 hover:text-slate-500 font-[Urbanist]"
          >
            &times;
          </button>
        </div>

        <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-slate-800 font-[Urbanist]">
              Leave Type
            </p>
            <div className="rounded-md border border-slate-900/80 bg-slate-50 px-3 py-2 text-sm text-slate-800 sm:py-3">
              {requisition.leaveName}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-800 font-[Urbanist]">
              Leave ID
            </p>
            <div className="rounded-md border border-slate-900/80 bg-slate-50 px-3 py-2 text-sm text-slate-800 sm:py-3">
              {requisition.leaveId}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-800 font-[Urbanist]">
              Employee Name
            </p>
            <div className="rounded-md border border-slate-900/80 bg-slate-50 px-3 py-2 text-sm text-slate-800 sm:py-3">
              {requisition.employeeName}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-800 font-[Urbanist]">
              Date
            </p>
            <div className="rounded-md border border-slate-900/80 bg-slate-50 px-3 py-2 text-sm text-slate-800 sm:py-3">
              {requisition.date}
            </div>
          </div>
        </div>

        <label
          htmlFor="rejection-remarks"
          className="mt-5 block text-sm font-medium text-slate-800 font-[Urbanist]"
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
          className="mt-1 w-full resize-none rounded-md border border-slate-900/80 px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:py-3"
        />

        <div className="sticky bottom-0 mt-4 flex justify-end gap-2 border-t border-slate-300 bg-white pt-3 sm:mt-6 sm:pt-5">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-black px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 font-[Urbanist]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={submitRemarks}
            className="rounded-md bg-violet-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 font-[Urbanist]"
          >
            Submit
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}