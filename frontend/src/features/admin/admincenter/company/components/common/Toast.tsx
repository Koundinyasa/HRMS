import { useCallback, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
 
export type ToastVariant = "success" | "error";
 
interface ToastState {
  message: string;
  variant: ToastVariant;
  id: number;
}
 
/**
 * Small, dependency-free toast. Call showToast("Saved successfully") after
 * a save succeeds, or showToast("Failed to save", "error") if it fails.
 * Render <Toast toast={toast} /> once near the top of the page.
 */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
 
  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = Date.now();
      setToast({ message, variant, id });
      // Auto-dismiss after 3 seconds.
      setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, 3000);
    },
    [],
  );
 
  return { toast, showToast };
}
 
export function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
 
  const isSuccess = toast.variant === "success";
 
  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
      role="status"
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
      )}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}
 