import { CLASSIFICATION_TYPES } from "../constants/classification.constants";
import type { ClassificationFormValues, ClassificationFormErrors } from "../types/classification.types";

export default function ClassificationForm({
  values,
  errors,
  onChange,
}: {
  values: ClassificationFormValues;
  errors: ClassificationFormErrors;
  onChange: <K extends keyof ClassificationFormValues>(key: K, value: ClassificationFormValues[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Classification Name</label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#7654e8]"
          placeholder="e.g. Branch"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="text-sm text-gray-600 mb-1 block">Short Name</label>
        <input
          type="text"
          value={values.shortName}
          onChange={(e) => onChange("shortName", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#7654e8]"
          placeholder="e.g. BR"
        />
        {errors.shortName && <p className="text-xs text-red-500 mt-1">{errors.shortName}</p>}
      </div>

      <div>
        <label className="text-sm text-gray-600 mb-1 block">Type</label>
        <select
          value={values.type}
          onChange={(e) => onChange("type", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#7654e8]"
        >
          {CLASSIFICATION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
      </div>

      <div>
        <label className="text-sm text-gray-600 mb-1 block">Description (optional)</label>
        <textarea
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#7654e8] resize-none"
          placeholder="Short description..."
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(e) => onChange("active", e.target.checked)}
          className="accent-[#7654e8]"
        />
        Active
      </label>
    </div>
  );
}
