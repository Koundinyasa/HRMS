import type {
  EmployeeSalaryAssignment,
  PayrollRun,
  SalaryComponent,
  SalaryDetails,
  SalaryLine,
  SalaryStructureResult,
} from "../types/payroll.types";

export type PayrollValidationResult =
  | { valid: true }
  | { valid: false; message: string };

export function validateSalaryDetails(details: SalaryDetails): PayrollValidationResult {
  if (!Number.isFinite(details.annualCtc) || details.annualCtc <= 0) {
    return { valid: false, message: "Enter a valid Annual CTC." };
  }
  if (
    !Number.isFinite(details.variablePct) ||
    details.variablePct < 0 ||
    details.variablePct > 100
  ) {
    return { valid: false, message: "Variable pay must be between 0 and 100%." };
  }
  return { valid: true };
}

export function validateSalaryLine(
  line: SalaryLine,
  existing: SalaryLine[],
): PayrollValidationResult {
  if (!line.component.trim()) {
    return { valid: false, message: "Enter a component name." };
  }
  if (line.method !== "BALANCE" && (!line.value || line.value <= 0)) {
    return { valid: false, message: "Enter a value greater than 0." };
  }
  const duplicate = existing.some(
    (item) =>
      item.id !== line.id &&
      item.kind === line.kind &&
      item.component.trim().toLowerCase() === line.component.trim().toLowerCase(),
  );
  if (duplicate) {
    return { valid: false, message: `"${line.component}" already exists.` };
  }
  const hasBalance = existing.some(
    (item) => item.id !== line.id && item.kind === line.kind && item.method === "BALANCE",
  );
  if (line.method === "BALANCE" && hasBalance) {
    return { valid: false, message: "Only one Balance component is allowed per section." };
  }
  return { valid: true };
}

export function validateStructure(
  lines: SalaryLine[],
  result: SalaryStructureResult,
): string[] {
  const errors: string[] = [];
  const basic = lines.find((line) => line.isBasic);
  if (!basic) errors.push("A Basic component is required.");
  if (basic?.method === "PERCENT_BASIC") {
    errors.push(`${basic.component} can't be calculated on Basic. Choose another method.`);
  }
  if (
    basic?.method === "BALANCE" &&
    lines.some((line) => line.kind === "EARNING" && line.method === "PERCENT_BASIC")
  ) {
    errors.push(
      `${basic.component} can't be Balance while another earning is % of Basic. Change that earning first.`,
    );
  }

  lines.forEach((line) => {
    if (line.method === "BALANCE") return;
    if (!line.value || line.value <= 0) {
      errors.push(`${line.component}: enter a value greater than 0.`);
    } else if (line.method !== "FIXED" && line.value > 100) {
      errors.push(`${line.component}: percentage cannot exceed 100.`);
    }
  });

  (["EARNING", "DEDUCTION"] as const).forEach((kind) => {
    const balances = lines.filter((line) => line.kind === kind && line.method === "BALANCE");
    if (balances.length > 1) {
      errors.push(
        `Only one Balance component is allowed in ${kind === "EARNING" ? "Earnings" : "Deductions"}.`,
      );
    }
  });

  if (!result.isBalanced) errors.push("Earnings + Deductions must equal Monthly CTC.");
  return errors;
}

export function validateSalaryComponent(
  component: SalaryComponent,
  existing: SalaryComponent[],
): PayrollValidationResult {
  if (!component.name.trim()) {
    return { valid: false, message: "Enter a component name." };
  }
  const duplicate = existing.some(
    (item) =>
      item.id !== component.id &&
      item.name.trim().toLowerCase() === component.name.trim().toLowerCase(),
  );
  if (duplicate) {
    return { valid: false, message: `"${component.name.trim()}" already exists.` };
  }
  if (component.method !== "BALANCE") {
    if (!Number.isFinite(component.value) || !component.value || component.value <= 0) {
      return { valid: false, message: "Enter a value greater than 0." };
    }
    if (component.method !== "FIXED" && component.value > 100) {
      return { valid: false, message: "Percentage value cannot exceed 100." };
    }
  }
  return { valid: true };
}

export function validateAssignment(
  input: { employeeId: string; structureId: string; effectiveFrom: string },
  existing: EmployeeSalaryAssignment[],
): PayrollValidationResult {
  if (!input.employeeId) return { valid: false, message: "Select an employee." };
  if (!input.structureId) return { valid: false, message: "Select a salary structure." };
  if (!input.effectiveFrom) return { valid: false, message: "Select an effective date." };
  const clash = existing.some(
    (item) => item.employeeId === input.employeeId && item.effectiveFrom === input.effectiveFrom,
  );
  if (clash) {
    return {
      valid: false,
      message: "This employee already has a salary structure effective on that date.",
    };
  }
  return { valid: true };
}

export function validatePayrollRunPeriod(
  period: string,
  runs: PayrollRun[],
): PayrollValidationResult {
  if (!/^\d{4}-\d{2}$/.test(period)) {
    return { valid: false, message: "Select a pay period." };
  }
  if (runs.some((run) => run.period === period)) {
    return { valid: false, message: "A payroll run already exists for this period." };
  }
  return { valid: true };
}
