import { useEffect, useState } from "react";
import { X, Bookmark } from "lucide-react";
import type { Holiday } from "../api/holidaySettingsApi";

interface HolidayFormValues {
  holidayName: string;
  holidayDate: string; // DD-MM-YYYY
  isNationalHoliday: boolean;
  isRestrictedHoliday: boolean;
}

interface HolidayFormModalProps {
  isOpen: boolean;
  masterLabel: string;
  initialData?: Holiday | null; // null/undefined => "Add" mode
  onClose: () => void;
  onSubmit: (values: HolidayFormValues) => void;
  isSubmitting?: boolean;
}

const EMPTY_FORM: HolidayFormValues = {
  holidayName: "",
  holidayDate: "",
  isNationalHoliday: false,
  isRestrictedHoliday: false,
};

export default function HolidayFormModal({
  isOpen,
  masterLabel,
  initialData,
  onClose,
  onSubmit,
  isSubmitting,
}: HolidayFormModalProps) {
  const [form, setForm] = useState<HolidayFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setForm({
        holidayName: initialData.holidayName,
        holidayDate: initialData.holidayDate,
        isNationalHoliday: initialData.isNationalHoliday,
        isRestrictedHoliday: initialData.isRestrictedHoliday,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.holidayName.trim() || !form.holidayDate.trim()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-800">
            Holiday Form For{" "}
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-sm font-medium text-indigo-600">
              {masterLabel}
            </span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Holiday Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.holidayName}
              onChange={(e) => setForm((f) => ({ ...f, holidayName: e.target.value }))}
              placeholder="Holiday Name"
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-indigo-300"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Holiday Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={toIsoDate(form.holidayDate)}
              onChange={(e) =>
                setForm((f) => ({ ...f, holidayDate: toDisplayDate(e.target.value) }))
              }
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-indigo-300"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isNationalHoliday}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isNationalHoliday: e.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              National Holiday
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isRestrictedHoliday}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isRestrictedHoliday: e.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Restricted Holiday
            </label>
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

// "DD-MM-YYYY" <-> "YYYY-MM-DD" (native <input type="date">) helpers
function toIsoDate(display: string) {
  if (!display) return "";
  const [d, m, y] = display.split("-");
  if (!d || !m || !y) return "";
  return `${y}-${m}-${d}`;
}
function toDisplayDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}