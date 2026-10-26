import { useState } from "react";
import { X, Save, ShieldCheck } from "lucide-react";

interface PdfProtectionModalProps {
  onClose: () => void;
  onSave: (isPasswordProtected: boolean) => void;
  initialValue?: boolean;
}

export default function PdfProtectionModal({
  onClose,
  onSave,
  initialValue = false,
}: PdfProtectionModalProps) {
  const [isPasswordProtected, setPasswordProtected] = useState(initialValue);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#D97B3F]" />
            <h2 className="text-base font-semibold text-[#814A3C]">
              Permissions
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <div className="rounded-md border border-[#F3D9C9] bg-[#FDF1E9]/40 px-4 py-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={isPasswordProtected}
                onChange={(e) => setPasswordProtected(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#814A3C]"
              />
              <span className="text-[13px] font-medium text-slate-700">
                Protect PDF attachment with password sent via email
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(isPasswordProtected)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#814A3C] px-4 text-xs font-medium text-white hover:bg-[#6c3d31]"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}