import { useState } from "react";
import { X, Save } from "lucide-react";
import {
  useCreateLeavePolicyMutation,
  useUpdateLeavePolicyMutation,
} from "../api/settingsApi";
import type { LeavePolicyFormValues } from "../types/leavesettings.types";

interface AddLeavePolicyModalProps {
  policyId: number | null; // null = create, otherwise edit
  onClose: () => void;
}

export default function AddLeavePolicyModal({ policyId, onClose }: AddLeavePolicyModalProps) {
  const [createPolicy, { isLoading: isCreating }] = useCreateLeavePolicyMutation();
  const [updatePolicy, { isLoading: isUpdating }] = useUpdateLeavePolicyMutation();

  const [form, setForm] = useState<LeavePolicyFormValues>({
    policyId: policyId ?? undefined,
    policyName: "",
    maxLeavesAllowedInNoticePeriod: undefined,
    allowedLeavesDuringNoticePeriod: "",
    maxDaysAllowedToApplyFutureMonth: 60,
    emergencyContact: false,
    notifyTo: false,
    standInEmployee: false,
  });
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof LeavePolicyFormValues>(
    field: K,
    value: LeavePolicyFormValues[K]
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.policyName.trim()) return;
    setError(null);
    try {
      if (policyId) {
        await updatePolicy(form).unwrap();
      } else {
        await createPolicy(form).unwrap();
      }
      onClose();
    } catch (err) {
      console.error("Failed to save leave policy:", err);
      setError("Could not save the policy. Please check the details and try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[520px] bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Add Leave Policy</h2>
        </div>

        <div className="p-5 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Policy Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.policyName}
              onChange={(e) => setField("policyName", e.target.value)}
              placeholder="Marketing"
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Max Leaves Allowed in Notice Period
            </label>
            <input
              type="number"
              value={form.maxLeavesAllowedInNoticePeriod ?? ""}
              onChange={(e) =>
                setField("maxLeavesAllowedInNoticePeriod", Number(e.target.value))
              }
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Allowed Leaves During Notice Period
            </label>
            <select
              value={form.allowedLeavesDuringNoticePeriod ?? ""}
              onChange={(e) => setField("allowedLeavesDuringNoticePeriod", e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm bg-white outline-none focus:border-slate-300"
            >
              <option value="">Select</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Max Days Allowed to Apply Future Month
            </label>
            <input
              type="number"
              value={form.maxDaysAllowedToApplyFutureMonth ?? ""}
              onChange={(e) =>
                setField("maxDaysAllowedToApplyFutureMonth", Number(e.target.value))
              }
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-300"
            />
          </div>

          <div className="flex items-center gap-4 col-span-2">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.emergencyContact}
                onChange={(e) => setField("emergencyContact", e.target.checked)}
                className="rounded border-slate-300"
              />
              Emergency Contact
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.notifyTo}
                onChange={(e) => setField("notifyTo", e.target.checked)}
                className="rounded border-slate-300"
              />
              Notify To
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.standInEmployee}
                onChange={(e) => setField("standInEmployee", e.target.checked)}
                className="rounded border-slate-300"
              />
              Stand in Employee
            </label>
          </div>

          {error && <p className="col-span-2 text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-white transition-colors"
          >
            <X size={14} />
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isCreating || isUpdating || !form.policyName.trim()}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}