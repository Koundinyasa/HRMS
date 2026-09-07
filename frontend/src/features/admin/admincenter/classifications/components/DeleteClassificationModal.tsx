import { AlertTriangle } from "lucide-react";
import type { Classification } from "../types/classification.types";

export default function DeleteClassificationModal({
  target,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  target: Classification | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!target) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} className="text-red-500" />
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-1">Delete Classification</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <span className="font-medium">{target.name}</span>? This
          action cannot be undone.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
