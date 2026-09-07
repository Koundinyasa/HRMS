import { X } from "lucide-react";
import type { StructureEntry, StructureCalculationType, StructureBasedOn } from "../types/classificationTypes";

const CALCULATION_TYPES: StructureCalculationType[] = ["Lumpsum", "Percentage", "Formula", "Flat Rate", "Every Month"];
const BASED_ON_OPTIONS: StructureBasedOn[] = ["Pay Days", "Calendar Days", "Fixed", "Independent"];

export default function SalaryStructureEntryModal({
  entry,
  componentName,
  onChange,
  onClose,
  onSave,
}: {
  entry: StructureEntry;
  componentName: string;
  onChange: (entry: StructureEntry) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800">Edit {componentName}</h3>
          <X size={18} className="text-gray-400 cursor-pointer" onClick={onClose} />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Calculation Type</label>
            <select
              value={entry.CalculationType}
              onChange={(e) => onChange({ ...entry, CalculationType: e.target.value as StructureCalculationType })}
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
            >
              {CALCULATION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Effective From</label>
              <input
                value={entry.EffectiveFrom}
                onChange={(e) => onChange({ ...entry, EffectiveFrom: e.target.value })}
                placeholder="e.g. Feb/2026"
                className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Effective Till</label>
              <input
                value={entry.EffectiveTill}
                onChange={(e) => onChange({ ...entry, EffectiveTill: e.target.value })}
                placeholder="e.g. Till Date"
                className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Based On</label>
            <select
              value={entry.BasedOn}
              onChange={(e) => onChange({ ...entry, BasedOn: e.target.value as StructureBasedOn })}
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
            >
              {BASED_ON_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">TDS Ref</label>
            <input
              value={entry.TdsRef}
              onChange={(e) => onChange({ ...entry, TdsRef: e.target.value })}
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#7654e8] text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
