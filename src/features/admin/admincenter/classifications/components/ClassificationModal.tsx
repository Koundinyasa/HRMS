import { X } from "lucide-react";
import ClassificationForm from "./ClassificationForm";
import type {
  ClassificationFormValues,
  ClassificationFormErrors,
  ClassificationModalMode,
} from "../types/classification.types";

export default function ClassificationModal({
  mode,
  values,
  errors,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}: {
  mode: ClassificationModalMode;
  values: ClassificationFormValues;
  errors: ClassificationFormErrors;
  isSaving: boolean;
  onChange: <K extends keyof ClassificationFormValues>(key: K, value: ClassificationFormValues[K]) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!mode) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800">
            {mode === "edit" ? "Edit Classification" : "Add Classification"}
          </h3>
          <X size={18} className="text-gray-400 cursor-pointer" onClick={onClose} />
        </div>

        <ClassificationForm values={values} errors={errors} onChange={onChange} />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#7654e8] text-white disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
