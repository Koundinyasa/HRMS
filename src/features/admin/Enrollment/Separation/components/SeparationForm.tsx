import {
  SEPARATION_TYPES,
} from "../constants/separationConstants";

import type { SeparationFormData } from "../types/separationTypes";

interface SeparationFormProps {
  formData: SeparationFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onChange: (
    field: keyof SeparationFormData,
    value: string
  ) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

export default function SeparationForm({
  formData,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: SeparationFormProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Employee
          </label>

          <input
            value={formData.employeeId}
            onChange={(event) =>
              onChange(
                "employeeId",
                event.target.value
              )
            }
            placeholder="Enter employee ID"
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
          />

          {errors.employeeId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.employeeId}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Separation Date
          </label>

          <input
            type="date"
            value={formData.separationDate}
            onChange={(event) =>
              onChange(
                "separationDate",
                event.target.value
              )
            }
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
          />

          {errors.separationDate && (
            <p className="mt-1 text-xs text-red-600">
              {errors.separationDate}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Separation Type
          </label>

          <select
            value={formData.separationType}
            onChange={(event) =>
              onChange(
                "separationType",
                event.target.value
              )
            }
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
          >
            <option value="">
              Select separation type
            </option>

            {SEPARATION_TYPES.map((type) => (
              <option
                key={type.value}
                value={type.value}
              >
                {type.label}
              </option>
            ))}
          </select>

          {errors.separationType && (
            <p className="mt-1 text-xs text-red-600">
              {errors.separationType}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Reason
          </label>

          <input
            value={formData.reason}
            onChange={(event) =>
              onChange("reason", event.target.value)
            }
            placeholder="Enter reason"
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
          />

          {errors.reason && (
            <p className="mt-1 text-xs text-red-600">
              {errors.reason}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Remarks
          </label>

          <textarea
            value={formData.remarks}
            onChange={(event) =>
              onChange("remarks", event.target.value)
            }
            placeholder="Enter remarks"
            rows={4}
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}