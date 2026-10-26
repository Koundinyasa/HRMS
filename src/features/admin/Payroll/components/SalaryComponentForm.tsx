import { useState } from "react";
import {
  CALC_METHOD_LABELS,
  DEFAULT_COMPONENT_FLAGS,
} from "../constants/payroll.constants";
import type { CalcMethod, SalaryComponent, SalaryLineKind } from "../types/payroll.types";
import { calcComponentPreview } from "../utils/payrollRun";
import { formatINR } from "../utils/salaryCalculator";
import type { PayrollValidationResult } from "../validation/payroll.validation";
import {
  ErrorNote,
  FormField,
  SectionCard,
  inputClass,
  neutralBtn,
  primaryBtn,
} from "./PayrollShared";

interface SalaryComponentFormProps {
  initial?: SalaryComponent;
  annualCtc: number;
  fixedMonthlyCtc: number;
  basicMonthly: number;
  onSave: (component: SalaryComponent) => PayrollValidationResult;
  onDone: () => void;
}

type FlagKey =
  | "taxable"
  | "statutory"
  | "prorated"
  | "partOfCtc"
  | "includeInPfWage"
  | "includeInEsiWage"
  | "active";

// Rendered column-first over 4 rows, so the first four are the left column
const FLAG_FIELDS: { key: FlagKey; label: string }[] = [
  { key: "taxable", label: "Taxable" },
  { key: "statutory", label: "Statutory" },
  { key: "prorated", label: "Pro-rated" },
  { key: "partOfCtc", label: "Part of CTC" },
  { key: "includeInPfWage", label: "Include in PF Wage" },
  { key: "includeInEsiWage", label: "Include in ESI Wage" },
  { key: "active", label: "Active" },
];

export function SalaryComponentForm({
  initial,
  annualCtc,
  fixedMonthlyCtc,
  basicMonthly,
  onSave,
  onDone,
}: SalaryComponentFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [postingType, setPostingType] = useState<SalaryLineKind>(initial?.postingType ?? "EARNING");
  const [method, setMethod] = useState<CalcMethod>(initial?.method ?? "PERCENT_CTC");
  const [value, setValue] = useState(initial?.value?.toString() ?? "");
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>({
    ...DEFAULT_COMPONENT_FLAGS,
    ...(initial
      ? {
          taxable: initial.taxable,
          statutory: initial.statutory,
          prorated: initial.prorated,
          partOfCtc: initial.partOfCtc,
          includeInPfWage: initial.includeInPfWage,
          includeInEsiWage: initial.includeInEsiWage,
          active: initial.active,
        }
      : {}),
  });
  const [error, setError] = useState("");

  const numericValue = Number(value);
  const monthly =
    method === "BALANCE" || !numericValue
      ? null
      : calcComponentPreview(method, numericValue, fixedMonthlyCtc, basicMonthly);

  const submit = () => {
    const result = onSave({
      id: initial?.id ?? crypto.randomUUID(),
      name: name.trim(),
      postingType,
      method,
      value: method === "BALANCE" ? null : numericValue,
      ...flags,
    });
    if (result.valid) onDone();
    else setError(result.message);
  };

  return (
    <>
      <SectionCard title="Component Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Component Name *">
            <input
              className={inputClass}
              value={name}
              placeholder="e.g. Compensatory Allowance"
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
          </FormField>

          <fieldset className="space-y-1.5 text-sm font-medium text-[#344054]">
            <legend className="mb-1.5">Posting Type *</legend>
            <div className="flex h-10 items-center gap-6">
              {(
                [
                  ["EARNING", "Credit (Earning)"],
                  ["DEDUCTION", "Debit (Deduction)"],
                ] as const
              ).map(([kind, label]) => (
                <label key={kind} className="flex items-center gap-2 font-normal">
                  <input
                    type="radio"
                    name="postingType"
                    checked={postingType === kind}
                    onChange={() => setPostingType(kind)}
                    className="h-4 w-4 accent-[#3b49d6]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <FormField label="Calculation Method *">
            <select
              className={inputClass}
              value={method}
              onChange={(e) => {
                setMethod(e.target.value as CalcMethod);
                setError("");
              }}
            >
              {Object.entries(CALC_METHOD_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Value *">
            <div className="relative">
              <input
                type="number"
                min={0}
                disabled={method === "BALANCE"}
                className={`${inputClass} pr-9 disabled:bg-[#f6f7fb]`}
                value={method === "BALANCE" ? "" : value}
                placeholder={method === "BALANCE" ? "Calculated automatically" : ""}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
              />
              {method !== "BALANCE" && (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#6b7280]">
                  {method === "FIXED" ? "₹" : "%"}
                </span>
              )}
            </div>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Preview">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[#eceef5] bg-[#fafbfe] px-4 py-3">
            <p className="text-xs text-[#6b7280]">Monthly Amount</p>
            <p className="mt-0.5 text-lg font-bold">{monthly === null ? "-" : formatINR(monthly)}</p>
          </div>
          <div className="rounded-lg border border-[#eceef5] bg-[#fafbfe] px-4 py-3">
            <p className="text-xs text-[#6b7280]">Annual Amount</p>
            <p className="mt-0.5 text-lg font-bold">{monthly === null ? "-" : formatINR(monthly * 12)}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-[#6b7280]">
          Posts as: <b className="text-[#1f2430]">
            {postingType === "EARNING" ? "Credit · Earning" : "Debit · Deduction"}
          </b>
        </p>
        <p className="mt-1 text-xs text-[#9aa1b5]">
          {method === "BALANCE"
            ? "A Balance component takes whatever is left once the other components are calculated."
            : `Based on the structure in the calculator (Annual CTC ${formatINR(annualCtc)}).`}
        </p>
      </SectionCard>

      <SectionCard title="Flags & Settings">
        <div className="grid grid-flow-col grid-cols-2 grid-rows-4 gap-x-8 gap-y-3 text-sm">
          {FLAG_FIELDS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={flags[key]}
                onChange={(e) => setFlags({ ...flags, [key]: e.target.checked })}
                className="h-4 w-4 accent-[#3b49d6]"
              />
              {label}
            </label>
          ))}
        </div>
      </SectionCard>

      <ErrorNote message={error} />

      <div className="flex flex-wrap justify-end gap-3 pb-6">
        <button type="button" onClick={onDone} className={neutralBtn}>Cancel</button>
        <button type="button" onClick={submit} className={primaryBtn}>Save Component</button>
      </div>
    </>
  );
}
