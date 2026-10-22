import { CTC_DEDUCTION_POOL_PCT } from "../constants/payroll.constants";
import type {
  CtcSummary,
  SalaryDetails,
  SalaryLine,
  SalaryStructureResult,
} from "../types/payroll.types";

export function formatINR(value: number) {
  return `₹ ${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function lineValueText(line: Pick<SalaryLine, "method" | "value">) {
  if (line.method === "BALANCE") return "-";
  if (line.method === "FIXED") return formatINR(line.value ?? 0);
  return `${line.value}%`;
}

export function calcCtcSummary(details: SalaryDetails): CtcSummary {
  const annualCtc = details.annualCtc || 0;
  const monthlyCtc = annualCtc / 12;
  const variablePay = (monthlyCtc * (details.variablePct || 0)) / 100;
  const fixedMonthlyCtc = monthlyCtc - variablePay;
  const deductionPool = (fixedMonthlyCtc * CTC_DEDUCTION_POOL_PCT) / 100;

  return {
    annualCtc,
    monthlyCtc: Math.round(monthlyCtc),
    variablePay: Math.round(variablePay),
    fixedMonthlyCtc: Math.round(fixedMonthlyCtc),
    deductionPool: Math.round(deductionPool),
    earningsTarget: Math.round(fixedMonthlyCtc - deductionPool),
  };
}

// "CTC" in "% of CTC" means fixed monthly CTC
export function calcSalaryStructure(
  lines: SalaryLine[],
  summary: CtcSummary,
): SalaryStructureResult {
  const fixed = summary.fixedMonthlyCtc;

  // Basic is what "% of Basic" is measured against, so it is worked out first:
  //   % of CTC -> share of CTC | Fixed -> the amount | Balance -> what is left of the earnings
  //   target after the other earnings that don't depend on Basic.
  // "% of Basic" on Basic itself makes no sense (0 here, and validateStructure flags it).
  const basicLine = lines.find((line) => line.isBasic);
  const independentEarnings = lines
    .filter(
      (line) =>
        line.kind === "EARNING" &&
        !line.isBasic &&
        (line.method === "PERCENT_CTC" || line.method === "FIXED"),
    )
    .reduce(
      (sum, line) =>
        sum +
        (line.method === "FIXED"
          ? Math.round(line.value ?? 0)
          : Math.round((fixed * (line.value ?? 0)) / 100)),
      0,
    );

  let basic = 0;
  switch (basicLine?.method) {
    case "PERCENT_CTC":
      basic = ((basicLine.value ?? 0) * fixed) / 100;
      break;
    case "FIXED":
      basic = basicLine.value ?? 0;
      break;
    case "BALANCE":
      basic = Math.max(summary.earningsTarget - independentEarnings, 0);
      break;
  }

  const directAmount = (line: SalaryLine) => {
    const value = line.value ?? 0;
    switch (line.method) {
      case "PERCENT_CTC":
        return Math.round((fixed * value) / 100);
      case "PERCENT_BASIC":
        return Math.round((basic * value) / 100);
      case "FIXED":
        return Math.round(value);
      default:
        return 0;
    }
  };

  const resolveGroup = (kind: SalaryLine["kind"], target: number) => {
    const group = lines.filter((line) => line.kind === kind);
    const fixedSum = group.reduce((sum, line) => sum + directAmount(line), 0);
    const balance = Math.max(target - fixedSum, 0);

    return group.map((line) => ({
      ...line,
      monthlyAmount: line.method === "BALANCE" ? balance : directAmount(line),
    }));
  };

  const earnings = resolveGroup("EARNING", summary.earningsTarget);
  const deductions = resolveGroup("DEDUCTION", summary.deductionPool);
  const totalEarnings = earnings.reduce((s, l) => s + l.monthlyAmount, 0);
  const totalDeductions = deductions.reduce((s, l) => s + l.monthlyAmount, 0);
  const total = totalEarnings + totalDeductions;

  return {
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
    total,
    isBalanced: total === summary.fixedMonthlyCtc,
  };
}
