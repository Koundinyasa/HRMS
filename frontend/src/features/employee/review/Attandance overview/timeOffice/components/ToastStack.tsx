import { Check, X } from "lucide-react";

import type {
  ToastStackProps,
} from "../types/attendanceOverview.types";

export default function ToastStack({
  toasts,
  onDismiss,
}: ToastStackProps) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg ${
            toast.tone === "success"
              ? "bg-emerald-600"
              : "bg-slate-800"
          }`}
        >
          <Check className="h-4 w-4" />

          {toast.message}

          <button
            type="button"
            onClick={() =>
              onDismiss(toast.id)
            }
            className="ml-2 opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
