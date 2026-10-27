import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X, XCircle } from "lucide-react";

export type LeaveDailyToastType = "success" | "error";

interface ToastState {
  id: number;
  type: LeaveDailyToastType;
  message: string;
}

/** Small side popup (top-right) that closes itself after a few seconds. */
export const useLeaveDailyToast = (durationMs = 3500) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const hideToast = useCallback(() => setToast(null), []);

  const showToast = useCallback(
    (message: string, type: LeaveDailyToastType = "success") => {
      window.clearTimeout(timer.current);
      setToast({ id: Date.now(), type, message });
      timer.current = window.setTimeout(() => setToast(null), durationMs);
    },
    [durationMs],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const toastNode = toast
    ? createPortal(
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className={`fixed right-4 top-4 z-[4000] flex max-w-[360px] items-center gap-3 rounded-lg border bg-white px-4 py-3 font-[Urbanist] text-[14px] font-semibold shadow-[0_8px_24px_rgba(16,24,40,0.18)] ${
            toast.type === "success"
              ? "border-[#b9dfcc] text-[#168b4c]"
              : "border-[#f3c4c8] text-[#e33c4b]"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-[#182237]">{toast.message}</span>
          <button
            type="button"
            aria-label="Close message"
            onClick={hideToast}
            className="ml-1 text-[#8795ab] hover:text-[#5f6d85]"
          >
            <X size={16} />
          </button>
        </div>,
        document.body,
      )
    : null;

  return { showToast, toastNode };
};