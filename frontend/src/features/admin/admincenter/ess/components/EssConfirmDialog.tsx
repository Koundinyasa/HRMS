import { X } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Centered delete/confirm modal — replaces browser window.confirm.
 */
export default function EssConfirmDialog({
  open,
  title = "Confirm delete",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 font-[Urbanist]"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-3.5">
          <h3 className="text-[17px] font-bold text-[#131313]">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1 text-[#626262] hover:bg-gray-100 hover:text-[#131313]"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="text-sm leading-relaxed text-[#475569]">{message}</p>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-[#E2E8F0] px-5 py-3.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="h-[34px] rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[#131313] hover:bg-gray-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-[34px] rounded-lg bg-[#DD3232] px-4 text-sm font-medium text-white hover:bg-[#C12B2B] disabled:opacity-60"
          >
            {isLoading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}