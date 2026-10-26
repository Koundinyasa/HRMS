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
    <div className="font-[Urbanist] fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 flex-wrap min-w-0">
      <div className="font-[Urbanist] flex w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-xl min-w-0 max-w-full">
        {/* Header */}
        <div className="font-[Urbanist] flex items-center justify-between border-b border-black px-5 py-4 flex-wrap min-w-0">
          <div className="font-[Urbanist] flex items-center gap-2 flex-wrap min-w-0">
            <ShieldCheck size={16} className="font-[Urbanist] text-[#D97B3F]" />
            <h2 className="font-[Urbanist] text-base font-semibold text-[#814A3C]">
              Permissions
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-[Urbanist] text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="font-[Urbanist] px-5 py-5">
          <div className="font-[Urbanist] rounded-md border border-black bg-[#FDF1E9]/40 px-4 py-4">
            <label className="font-[Urbanist] flex cursor-pointer items-start gap-3 flex-wrap min-w-0">
              <input
                type="checkbox"
                checked={isPasswordProtected}
                onChange={(e) => setPasswordProtected(e.target.checked)}
                className="font-[Urbanist] mt-0.5 h-4 w-4 accent-[#814A3C]"
              />
              <span className="font-[Urbanist] text-[13px] font-medium text-slate-700">
                Protect PDF attachment with password sent via email
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="font-[Urbanist] flex items-center justify-end gap-2 border-t border-black px-5 py-3 flex-wrap min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="font-[Urbanist] inline-flex h-9 items-center gap-1.5 rounded-md border border-black bg-white px-4 text-xs font-medium text-slate-600 hover:bg-slate-50 flex-wrap min-w-0"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(isPasswordProtected)}
            className="font-[Urbanist] inline-flex h-9 items-center gap-1.5 rounded-md bg-[#814A3C] px-4 text-xs font-medium text-white hover:bg-[#6c3d31] flex-wrap min-w-0"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}