import { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  PiggyBank,
  Plus,
  Scale,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { CALC_METHOD_LABELS } from "../constants/payroll.constants";
import type {
  CalcMethod,
  CtcSummary,
  ResolvedSalaryLine,
  SalaryDetails,
  SalaryLine,
  SalaryLineKind,
  SalaryStructureResult,
} from "../types/payroll.types";
import { formatINR } from "../utils/salaryCalculator";
import {
  FormField,
  SectionCard,
  StatCard,
  inputClass,
  neutralBtn,
  outlineBtn,
  primaryBtn,
} from "./PayrollShared";
import { SalaryLineModal } from "./SalaryLineModal";

interface SalaryStructureCalculatorProps {
  details: SalaryDetails;
  setDetails: (details: SalaryDetails) => void;
  lines: SalaryLine[];
  summary: CtcSummary;
  structure: SalaryStructureResult;
  structureErrors: string[];
  lineError: string;
  setLineError: (message: string) => void;
  saveLine: (line: SalaryLine) => boolean;
  updateLine: (id: string, patch: Partial<SalaryLine>) => void;
  removeLine: (id: string) => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  onPreview: () => void;
}

const cell = "border border-[#eceef5] px-3 py-2.5";

// Same look as inputClass, without w-full so the width can be set per field
const inlineField =
  "h-10 rounded-xl border border-[#d8dbe8] bg-white px-3 text-sm shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition hover:border-[#b9bfe6] focus:border-[#3b49d6] focus:ring-4 focus:ring-[#3b49d6]/10";

const ALL_METHODS = Object.keys(CALC_METHOD_LABELS) as CalcMethod[];

export function SalaryStructureCalculator({
  details,
  setDetails,
  summary,
  structure,
  structureErrors,
  lineError,
  setLineError,
  saveLine,
  updateLine,
  removeLine,
  onSaveDraft,
  onCancel,
  onPreview,
}: SalaryStructureCalculatorProps) {
  const [editor, setEditor] = useState<{
    kind: SalaryLineKind;
    line?: SalaryLine;
  } | null>(null);

  const openEditor = (kind: SalaryLineKind, line?: SalaryLine) => {
    setLineError("");
    setEditor({ kind, line });
  };

  // Keep the number only when the unit stays the same (% -> %); switching % <-> Fixed ₹ resets it
  const changeMethod = (line: ResolvedSalaryLine, method: CalcMethod) => {
    const sameUnit =
      line.method !== "BALANCE" && (line.method === "FIXED") === (method === "FIXED");
    updateLine(line.id, {
      method,
      value: method === "BALANCE" ? null : sameUnit ? (line.value ?? 0) : 0,
    });
  };

  const changeValue = (id: string, raw: string) =>
    updateLine(id, { value: raw === "" ? 0 : Number(raw) });

  const summaryTiles = [
    { label: "Annual CTC", value: summary.annualCtc, icon: <IndianRupee className="h-5 w-5" />, tone: "indigo" },
    { label: "Monthly CTC", value: summary.monthlyCtc, icon: <CalendarDays className="h-5 w-5" />, tone: "indigo" },
    { label: "CTC Deduction Pool (16%)", value: summary.deductionPool, icon: <PiggyBank className="h-5 w-5" />, tone: "amber" },
    { label: "Earnings Target", value: summary.earningsTarget, icon: <Target className="h-5 w-5" />, tone: "green" },
  ] as const;

  const renderTable = (
    rows: ResolvedSalaryLine[],
    totalLabel: string,
    total: number,
  ) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#f6f7fb] text-left">
            <th className={cell}>#</th>
            <th className={cell}>Component</th>
            <th className={cell}>Calculation Method</th>
            <th className={cell}>Value</th>
            <th className={`${cell} text-right`}>Monthly Amount</th>
            <th className={`${cell} text-right`}>Annual Amount</th>
            <th className={`${cell} text-center`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((line, index) => (
            <tr key={line.id}>
              <td className={cell}>{index + 1}</td>
              <td className={cell}>{line.component}</td>
              <td className={cell}>
                <select
                  aria-label={`Calculation method for ${line.component}`}
                  className={`${inlineField} w-44`}
                  value={line.method}
                  onChange={(e) => changeMethod(line, e.target.value as CalcMethod)}
                >
                  {ALL_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {CALC_METHOD_LABELS[method]}
                    </option>
                  ))}
                </select>
              </td>
              <td className={cell}>
                {line.method === "BALANCE" ? (
                  <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-amber-800">
                    Auto
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      aria-label={`Value for ${line.component}`}
                      min={0}
                      max={line.method === "FIXED" ? undefined : 100}
                      step={line.method === "FIXED" ? 100 : 1}
                      placeholder="0"
                      className={`${inlineField} w-24`}
                      value={line.value || ""}
                      onChange={(e) => changeValue(line.id, e.target.value)}
                    />
                    <span className="text-sm text-[#6b7280]">
                      {line.method === "FIXED" ? "₹" : "%"}
                    </span>
                  </div>
                )}
              </td>
              <td className={`${cell} text-right`}>
                {formatINR(line.monthlyAmount)}
              </td>
              <td className={`${cell} text-right text-[#6b7280]`}>
                {formatINR(line.monthlyAmount * 12)}
              </td>
              <td className={`${cell} text-center`}>
                <button
                  type="button"
                  aria-label={`Delete ${line.component}`}
                  disabled={line.isBasic}
                  onClick={() => removeLine(line.id)}
                  className="rounded-lg p-1.5 text-[#98a2b3] transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-[#fafbfe] font-bold">
            <td colSpan={4} className={cell}>
              {totalLabel}
            </td>
            <td className={`${cell} text-right`}>{formatINR(total)}</td>
            <td className={`${cell} text-right`}>{formatINR(total * 12)}</td>
            <td className="border border-[#eceef5]" />
          </tr>
        </tfoot>
      </table>
    </div>
  );

  const addButton = (kind: SalaryLineKind, label: string) => (
    <button
      type="button"
      onClick={() => openEditor(kind)}
      className={`${outlineBtn} !h-9 !px-4`}
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <>
      <SectionCard
        title="Salary Details"
        subtitle="The CTC this structure is built on"
        icon={<IndianRupee className="h-5 w-5" />}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Annual CTC *">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#667085]">
                ₹
              </span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                className={`${inputClass} pl-7 font-semibold`}
                value={details.annualCtc || ""}
                onChange={(e) =>
                  setDetails({
                    ...details,
                    annualCtc: Number(e.target.value.replace(/\D/g, "")),
                  })
                }
              />
            </div>
          </FormField>
        </div>
      </SectionCard>

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#667085]">CTC Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryTiles.map((tile) => (
            <StatCard
              key={tile.label}
              label={tile.label}
              value={formatINR(tile.value)}
              icon={tile.icon}
              tone={tile.tone}
            />
          ))}
        </div>
      </div>

      <SectionCard
        title="Earnings"
        subtitle="Credit components paid to the employee"
        icon={<TrendingUp className="h-5 w-5" />}
        tone="green"
        action={addButton("EARNING", "Add Earning")}
      >
        {renderTable(
          structure.earnings,
          "Total Earnings",
          structure.totalEarnings,
        )}
      </SectionCard>

      <SectionCard
        title="Deductions"
        subtitle="Debit components taken from the CTC pool"
        icon={<TrendingDown className="h-5 w-5" />}
        tone="amber"
        action={addButton("DEDUCTION", "Add Deduction")}
      >
        {renderTable(
          structure.deductions,
          "Total Deductions (CTC Pool)",
          structure.totalDeductions,
        )}
      </SectionCard>

      <SectionCard
        title="Reconciliation"
        subtitle="Earnings and deductions must add up to the Monthly CTC"
        icon={<Scale className="h-5 w-5" />}
        tone={structure.isBalanced ? "green" : "amber"}
      >
        <div
          className={`rounded-2xl border p-5 ${
            structure.isBalanced
              ? "border-[#cdebd5] bg-gradient-to-br from-[#effaf2] to-[#e3f6e8]"
              : "border-rose-100 bg-gradient-to-br from-rose-50 to-white"
          }`}
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {structure.isBalanced ? (
                <CheckCircle2 className="h-9 w-9 text-[#22a447]" />
              ) : (
                <AlertCircle className="h-9 w-9 text-rose-600" />
              )}
              <div>
                <p className="font-bold">
                  {structure.isBalanced
                    ? "Structure is balanced"
                    : "Structure is not balanced"}
                </p>
                <p className="text-xs text-[#6b7280]">
                  Earnings + Deductions equals Monthly CTC.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#344054] ring-1 ring-black/5">
              Monthly CTC {formatINR(summary.monthlyCtc)}
            </span>
          </div>

          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {[
              { label: "Earnings", amount: structure.totalEarnings },
              { operator: "+" },
              { label: "CTC Deduction Pool", amount: structure.totalDeductions },
              { operator: "=" },
              { label: "Total", amount: structure.total, strong: true },
            ].map((item, index) =>
              "operator" in item ? (
                <span key={index} className="hidden text-center text-xl font-bold text-[#98a2b3] sm:block">
                  {item.operator}
                </span>
              ) : (
                <div
                  key={item.label}
                  className={`rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ${
                    item.strong ? "ring-[#3b49d6]/30" : "ring-black/5"
                  }`}
                >
                  <p className="text-xs text-[#6b7280]">{item.label}</p>
                  <p className={`mt-0.5 text-lg ${item.strong ? "font-extrabold text-[#3b49d6]" : "font-bold"}`}>
                    {formatINR(item.amount)}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
        {structureErrors.length > 0 && (
          <ul
            role="alert"
            className="mt-4 list-disc space-y-1 rounded-xl border border-rose-100 bg-rose-50 py-3 pl-9 pr-4 text-sm font-medium text-rose-700"
          >
            {structureErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </SectionCard>

      <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e0e3f3] bg-white/90 px-4 py-3 shadow-[0_12px_30px_-12px_rgba(31,36,48,0.25)] backdrop-blur">
        <p
          className={`text-sm font-medium ${
            structureErrors.length > 0 ? "text-rose-600" : "text-[#1c8a3c]"
          }`}
        >
          {structureErrors.length > 0
            ? `${structureErrors.length} issue${structureErrors.length > 1 ? "s" : ""} to fix before preview`
            : "Structure looks good. Ready to preview."}
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onCancel} className={neutralBtn}>
            Cancel
          </button>
          <button type="button" onClick={onSaveDraft} className={outlineBtn}>
            Save as Draft
          </button>
          <button
            type="button"
            disabled={structureErrors.length > 0}
            onClick={onPreview}
            className={primaryBtn}
          >
            Preview Structure
          </button>
        </div>
      </div>

      {editor && (
        <SalaryLineModal
          kind={editor.kind}
          initial={editor.line}
          error={lineError}
          onSave={saveLine}
          onClose={() => setEditor(null)}
        />
      )}
    </>
  );
}
