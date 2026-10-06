import { useEffect, useState } from "react";
import { X, Bookmark } from "lucide-react";
import type { DayOfWeek, WeeklyOff, WeekHalfFlags } from "../api/weeklyoffApi";

const DAYS: DayOfWeek[] = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const WEEK_LABELS = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week"] as const;

interface WeeklyOffFormValues {
  effectiveFrom: string;
  dayOfWeek: DayOfWeek | "";
  weeks: WeekHalfFlags[]; // length 5, index 0..4
}

interface WeeklyOffFormModalProps {
  isOpen: boolean;
  masterLabel: string;
  effectiveFromOptions: string[]; // e.g. ["Sep/2026", "Aug/2026", ...]
  initialData?: WeeklyOff | null;
  onClose: () => void;
  onSubmit: (values: WeeklyOffFormValues) => void;
  isSubmitting?: boolean;
}

const DEFAULT_WEEKS: WeekHalfFlags[] = Array.from({ length: 5 }, () => ({
  firstHalf: true,
  secondHalf: true,
}));

const EMPTY_FORM: WeeklyOffFormValues = {
  effectiveFrom: "",
  dayOfWeek: "",
  weeks: DEFAULT_WEEKS,
};

export default function WeeklyOffFormModal({
  isOpen,
  masterLabel,
  effectiveFromOptions,
  initialData,
  onClose,
  onSubmit,
  isSubmitting,
}: WeeklyOffFormModalProps) {
  const [form, setForm] = useState<WeeklyOffFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<{ effectiveFrom?: boolean; dayOfWeek?: boolean }>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        effectiveFrom: initialData.effectiveFrom,
        dayOfWeek: initialData.dayOfWeek,
        weeks: [
          initialData.week1,
          initialData.week2,
          initialData.week3,
          initialData.week4,
          initialData.week5,
        ],
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleHalf = (weekIndex: number, half: keyof WeekHalfFlags) => {
    setForm((f) => {
      const weeks = [...f.weeks];
      weeks[weekIndex] = { ...weeks[weekIndex], [half]: !weeks[weekIndex][half] };
      return { ...f, weeks };
    });
  };

  const handleSave = () => {
    const newErrors = {
      effectiveFrom: !form.effectiveFrom,
      dayOfWeek: !form.dayOfWeek,
    };
    setErrors(newErrors);
    if (newErrors.effectiveFrom || newErrors.dayOfWeek) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-800">
            Weekly Off Form For{" "}
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-sm font-medium text-indigo-600">
              {masterLabel}
            </span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Effective From <span className="text-red-500">*</span>
              </label>
              <select
                value={form.effectiveFrom}
                onChange={(e) => setForm((f) => ({ ...f, effectiveFrom: e.target.value }))}
                className={`h-9 w-full rounded-lg border px-3 text-sm text-slate-700 outline-none ${
                  errors.effectiveFrom ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-indigo-300"
                }`}
              >
                <option value="">Select Effective From</option>
                {effectiveFromOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.effectiveFrom && (
                <p className="mt-1 text-xs text-red-500">Field Required</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Day of the Week <span className="text-red-500">*</span>
              </label>
              <select
                value={form.dayOfWeek}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dayOfWeek: e.target.value as DayOfWeek }))
                }
                className={`h-9 w-full rounded-lg border px-3 text-sm text-slate-700 outline-none ${
                  errors.dayOfWeek ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-indigo-300"
                }`}
              >
                <option value="">Select Day of the Week</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {WEEK_LABELS.map((label, i) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.weeks[i].firstHalf}
                      onChange={() => toggleHalf(i, "firstHalf")}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    First Half
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.weeks[i].secondHalf}
                      onChange={() => toggleHalf(i, "secondHalf")}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Second Half
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <X size={14} /> Close
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-60"
          >
            <Bookmark size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}