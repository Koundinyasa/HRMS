import { X } from "lucide-react";
import type { SalaryStructureDefinition } from "../types/classificationTypes";

export function SalaryStructureDefModal({
  structure,
  isAdding,
  onChange,
  onClose,
  onSave,
}: {
  structure: SalaryStructureDefinition;
  isAdding: boolean;
  onChange: (structure: SalaryStructureDefinition) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800">
            {isAdding ? "Add Structure" : "Edit Structure"}
          </h3>
          <X size={18} className="text-gray-400 cursor-pointer" onClick={onClose} />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Structure Name</label>
            <input
              value={structure.Name}
              onChange={(e) => onChange({ ...structure, Name: e.target.value })}
              placeholder="e.g. CTC Salary Structure"
              maxLength={60}
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Tag</label>
            <input
              value={structure.Tag}
              onChange={(e) => onChange({ ...structure, Tag: e.target.value })}
              placeholder="e.g. CTC"
              maxLength={20}
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!structure.Name.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#7654e8] text-white disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function SalaryStructureDeleteModal({
  structure,
  onCancel,
  onConfirm,
}: {
  structure: SalaryStructureDefinition;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete structure?</h3>
        <p className="text-sm text-gray-600 mb-6">
          Delete <strong>{structure.Name}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
