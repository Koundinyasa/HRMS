import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
 
export interface NewClassificationData {
  name: string;
  mandatory: boolean;
  showInFormulaEditor: boolean;
  withoutMaster: boolean;
}
 
interface AddClassificationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewClassificationData) => void;
}
 
const DEFAULTS: NewClassificationData = {
  name: "",
  mandatory: true,
  showInFormulaEditor: false,
  withoutMaster: false,
};
 
export default function AddClassificationModal({
  open,
  onClose,
  onSave,
}: AddClassificationModalProps) {
  const [data, setData] = useState<NewClassificationData>(DEFAULTS);
  const [error, setError] = useState("");
 
  useEffect(() => {
    if (open) {
      setData(DEFAULTS);
      setError("");
    }
  }, [open]);
 
  if (!open) return null;
 
  const handleSave = () => {
    if (!data.name.trim()) {
      setError("Classification Name is required");
      return;
    }
    onSave(data);
  };
 
  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-[320px] bg-white rounded-md shadow-xl overflow-hidden text-[13px]">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <span className="font-semibold text-gray-800 text-[13px]">
            Add New Classification
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
 
        <div className="px-4 py-4">
          <label className="block text-[12px] text-gray-500 mb-1">
            Classification Name <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full border rounded px-2.5 py-1.5 text-[13px] bg-[#FAF6EC] focus:outline-none focus:ring-1 focus:ring-[#90CAF9] focus:border-[#2196F3] ${
              error ? "border-red-400" : "border-gray-300"
            }`}
            value={data.name}
            onChange={(e) => {
              setData((prev) => ({ ...prev, name: e.target.value }));
              if (error) setError("");
            }}
          />
          {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
 
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.mandatory}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, mandatory: e.target.checked }))
                }
                className="w-3.5 h-3.5 accent-[#2196F3]"
              />
              Mandatory
            </label>
            <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showInFormulaEditor}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    showInFormulaEditor: e.target.checked,
                  }))
                }
                className="w-3.5 h-3.5 accent-[#2196F3]"
              />
              Show in formula editor
            </label>
            <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.withoutMaster}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, withoutMaster: e.target.checked }))
                }
                className="w-3.5 h-3.5 accent-[#2196F3]"
              />
              Without Master
            </label>
          </div>
        </div>
 
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="h-[30px] px-3.5 text-[12px] text-gray-600 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5"
          >
            <X size={13} />
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-[30px] px-3.5 text-[12px] font-medium text-white bg-[#2196F3] rounded hover:bg-[#1976D2] flex items-center gap-1.5"
          >
            <Save size={13} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}