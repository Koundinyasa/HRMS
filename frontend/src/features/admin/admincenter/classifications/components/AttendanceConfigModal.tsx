import { X } from "lucide-react";
import type { AttendanceConfig, AttendanceType } from "../types/attendance.types";

const ATTENDANCE_TYPES: AttendanceType[] = ["Daily", "Weekly", "Monthly", "Shift Based"];

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between text-sm text-gray-700 cursor-pointer py-1">
      {label}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full relative transition-colors ${checked ? "bg-emerald-500" : "bg-gray-300"}`}
      >
        <span
          className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
            checked ? "right-0.5" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

export function AttendanceConfigModal({
  config,
  isAdding,
  onChange,
  onClose,
  onSave,
}: {
  config: AttendanceConfig;
  isAdding: boolean;
  onChange: (config: AttendanceConfig) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800">
            {isAdding ? "Add Attendance" : "Edit Attendance"}
          </h3>
          <X size={18} className="text-gray-400 cursor-pointer" onClick={onClose} />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Attendance Name</label>
              <input
                value={config.Name}
                onChange={(e) => onChange({ ...config, Name: e.target.value })}
                placeholder="e.g. Daily"
                className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Short Name</label>
              <input
                value={config.ShortName}
                onChange={(e) => onChange({ ...config, ShortName: e.target.value })}
                placeholder="e.g. Daily"
                className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Salary Calendar Days</label>
            <input
              value={config.SalaryCalendarDays}
              onChange={(e) => onChange({ ...config, SalaryCalendarDays: e.target.value })}
              placeholder="e.g. Actual days/Month"
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Attendance Type</label>
            <select
              value={config.AttendanceType}
              onChange={(e) => onChange({ ...config, AttendanceType: e.target.value as AttendanceType })}
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
            >
              {ATTENDANCE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-gray-200 px-3 py-1 divide-y divide-gray-100">
            <ToggleField label="Independent" checked={config.Independent} onChange={(v) => onChange({ ...config, Independent: v })} />
            <ToggleField label="OT Enable" checked={config.OtEnable} onChange={(v) => onChange({ ...config, OtEnable: v })} />
            <ToggleField label="Late In Early Out Enable" checked={config.LateInEarlyOutEnable} onChange={(v) => onChange({ ...config, LateInEarlyOutEnable: v })} />
            <ToggleField label="Active" checked={config.Active} onChange={(v) => onChange({ ...config, Active: v })} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!config.Name.trim() || !config.ShortName.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#7654e8] text-white disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function AttendanceConfigDeleteModal({
  config,
  onCancel,
  onConfirm,
}: {
  config: AttendanceConfig;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete attendance config?</h3>
        <p className="text-sm text-gray-600 mb-6">
          Delete <strong>{config.Name}</strong>? This cannot be undone.
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
