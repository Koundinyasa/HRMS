import { useState } from "react";
import { X } from "lucide-react";
import { CALC_METHOD_LABELS } from "../constants/payroll.constants";
import type { CalcMethod, SalaryLine, SalaryLineKind } from "../types/payroll.types";
import { ErrorNote, FormField, inputClass, neutralBtn, primaryBtn } from "./PayrollShared";

interface SalaryLineModalProps {
  kind: SalaryLineKind;
  initial?: SalaryLine;
  error: string;
  onSave: (line: SalaryLine) => boolean;
  onClose: () => void;
}

export function SalaryLineModal({ kind, initial, error, onSave, onClose }: SalaryLineModalProps) {
  const [component, setComponent] = useState(initial?.component ?? "");
  const [method, setMethod] = useState<CalcMethod>(initial?.method ?? "PERCENT_CTC");
  const [value, setValue] = useState(initial?.value?.toString() ?? "");

  const submit = () => {
    const saved = onSave({
      id: initial?.id ?? crypto.randomUUID(),
      kind,
      isBasic: initial?.isBasic,
      component: component.trim(),
      method,
      value: method === "BALANCE" ? null : Number(value),
    });
    if (saved) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md space-y-4 rounded-3xl border border-[#e6e8f2] bg-white p-6 shadow-[0_24px_60px_-20px_rgba(16,24,40,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {initial ? "Edit" : "Add"} {kind === "EARNING" ? "Earning" : "Deduction"}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-[#6b7280]" />
          </button>
        </div>

        <FormField label="Component">
          <input className={inputClass} value={component} onChange={(e) => setComponent(e.target.value)} />
        </FormField>

        <FormField label="Calculation Method">
          <select
            className={inputClass}
            value={method}
            onChange={(e) => setMethod(e.target.value as CalcMethod)}
          >
            {Object.entries(CALC_METHOD_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </FormField>

        {method !== "BALANCE" && (
          <FormField label={method === "FIXED" ? "Amount (₹)" : "Value (%)"}>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </FormField>
        )}

        <ErrorNote message={error} />

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={neutralBtn}>
            Cancel
          </button>
          <button type="button" onClick={submit} className={primaryBtn}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
