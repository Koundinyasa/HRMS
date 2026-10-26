import { useState } from "react";

import type {
  HelpdeskRequest,
} from "../types/helpdeskRequests.types";

interface HelpdeskRequestModalProps {
  request: HelpdeskRequest;
  action: "approve" | "reject";
  onClose: () => void;
  onConfirm: (remarks?: string) => void;
  loading?: boolean;
}

const HelpdeskRequestModal = ({
  request,
  action,
  onClose,
  onConfirm,
  loading = false,
}: HelpdeskRequestModalProps) => {
  const [remarks, setRemarks] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0b315d]">
            {action === "approve" ? "Approve Helpdesk Request" : "Reject Helpdesk Request"}
          </h2>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <p className="text-sm text-slate-500">
              Employee
            </p>

            <p className="font-medium text-slate-700">
              {request.employeeName}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Request
            </p>

            <p className="font-medium text-slate-700">
              {request.subject}
            </p>
          </div>

          <div>
            <label
              htmlFor="helpdesk-remarks"
              className="mb-2 block text-sm font-medium text-slate-600"
            >
              Remarks
            </label>

            <textarea
              id="helpdesk-remarks"
              value={remarks}
              onChange={(event) =>
                setRemarks(event.target.value)
              }
              rows={4}
              placeholder={
                action === "reject"
                  ? "Enter reason for rejection"
                  : "Enter remarks (optional)"
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <p className="text-sm text-slate-500">
            Are you sure you want to {action} this helpdesk request?
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-slate-300 px-5 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(remarks)}
            disabled={loading}
            className={`rounded-md px-5 py-2 text-sm font-medium text-white disabled:opacity-50 ${
              action === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? "Processing..."
              : action === "approve"
                ? "Approve Request"
                : "Reject Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpdeskRequestModal;