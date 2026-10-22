import { CalendarDays, IndianRupee, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { CALC_METHOD_LABELS } from "../constants/payroll.constants";
import type {
  CtcSummary,
  ResolvedSalaryLine,
  SalaryStructureResult,
} from "../types/payroll.types";
import { formatINR, lineValueText } from "../utils/salaryCalculator";
import {
  ErrorNote,
  SectionCard,
  StatCard,
  neutralBtn,
  outlineBtn,
  primaryBtn,
  tableCell,
} from "./PayrollShared";

interface SalaryStructurePreviewProps {
  summary: CtcSummary;
  structure: SalaryStructureResult;
  structureErrors: string[];
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
}

function BreakdownTable({
  rows,
  totalLabel,
  total,
}: {
  rows: ResolvedSalaryLine[];
  totalLabel: string;
  total: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#f6f7fb] text-left">
            <th className={tableCell}>Component</th>
            <th className={tableCell}>Calculation Method</th>
            <th className={tableCell}>Value</th>
            <th className={`${tableCell} text-right`}>Monthly Amount</th>
            <th className={`${tableCell} text-right`}>Annual Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((line) => (
            <tr key={line.id}>
              <td className={tableCell}>{line.component}</td>
              <td className={tableCell}>{CALC_METHOD_LABELS[line.method]}</td>
              <td className={tableCell}>{lineValueText(line)}</td>
              <td className={`${tableCell} text-right`}>{formatINR(line.monthlyAmount)}</td>
              <td className={`${tableCell} text-right`}>{formatINR(line.monthlyAmount * 12)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-[#fafbfe] font-bold">
            <td colSpan={3} className={tableCell}>{totalLabel}</td>
            <td className={`${tableCell} text-right`}>{formatINR(total)}</td>
            <td className={`${tableCell} text-right`}>{formatINR(total * 12)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function SalaryStructurePreview({
  summary,
  structure,
  structureErrors,
  onBack,
  onEdit,
  onSave,
}: SalaryStructurePreviewProps) {
  const hasErrors = structureErrors.length > 0;

  return (
    <>
      {hasErrors && (
        <div className="space-y-2">
          <ErrorNote message="This structure can't be saved yet. Fix the following in the calculator:" />
          <ul className="list-disc space-y-1 pl-9 text-sm text-rose-600">
            {structureErrors.map((message) => <li key={message}>{message}</li>)}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Annual CTC" value={formatINR(summary.annualCtc)} icon={<IndianRupee className="h-5 w-5" />} />
        <StatCard label="Monthly CTC" value={formatINR(summary.monthlyCtc)} icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Earnings Target" value={formatINR(summary.earningsTarget)} icon={<Wallet className="h-5 w-5" />} tone="green" />
      </div>

      <SectionCard title="Earnings Breakdown" subtitle="Credit components" icon={<TrendingUp className="h-5 w-5" />} tone="green">
        <BreakdownTable rows={structure.earnings} totalLabel="Total Earnings" total={structure.totalEarnings} />
      </SectionCard>

      <SectionCard title="Deductions Breakdown" subtitle="Debit components" icon={<TrendingDown className="h-5 w-5" />} tone="amber">
        <BreakdownTable rows={structure.deductions} totalLabel="Total Deductions" total={structure.totalDeductions} />
      </SectionCard>

      <div className="flex flex-wrap justify-end gap-3 pb-6">
        <button type="button" onClick={onBack} className={neutralBtn}>Back</button>
        <button type="button" onClick={onEdit} className={outlineBtn}>Edit Structure</button>
        <button type="button" onClick={onSave} disabled={hasErrors} className={primaryBtn}>
          Save Structure
        </button>
      </div>
    </>
  );
}
