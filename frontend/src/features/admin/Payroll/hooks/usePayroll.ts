import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  DEFAULT_SALARY_DETAILS,
  DEFAULT_SALARY_LINES,
  SEED_ASSIGNMENTS,
  SEED_COMPONENTS,
  SEED_EMPLOYEES,
  SEED_RUN_PERIODS,
  SEED_STRUCTURES,
} from "../constants/payroll.constants";
import type {
  EmployeeSalaryAssignment,
  PayrollRun,
  SalaryComponent,
  SalaryDetails,
  SalaryLine,
  SalaryStructureRecord,
} from "../types/payroll.types";
import { formatLpa } from "../utils/payrollFormat";
import { buildPayrollRun } from "../utils/payrollRun";
import { calcCtcSummary, calcSalaryStructure } from "../utils/salaryCalculator";
import {
  type PayrollValidationResult,
  validateAssignment,
  validatePayrollRunPeriod,
  validateSalaryComponent,
  validateSalaryDetails,
  validateSalaryLine,
  validateStructure,
} from "../validation/payroll.validation";

const today = () => new Date().toISOString().slice(0, 10);

const buildSeedRuns = (): PayrollRun[] =>
  SEED_RUN_PERIODS.map((period) =>
    buildPayrollRun(period, `${period}-28`, SEED_EMPLOYEES, SEED_ASSIGNMENTS, SEED_STRUCTURES),
  ).reverse(); // newest first

// ======================================================
// RE-EXPORTS FOR COMPONENTS
// Components import API hooks from this file, never from
// "../api/payroll.api" directly.
// ======================================================

export { useSaveSalaryStructureMutation } from "../api/payroll.api";

type PayrollRunResult = { valid: true; runId: string } | { valid: false; message: string };

export function usePayroll() {
  // ==================================================
  // LOCAL UI STATE (static data - calculations done in frontend)
  // ==================================================

  const [details, setDetails] = useState<SalaryDetails>(DEFAULT_SALARY_DETAILS);
  const [lines, setLines] = useState<SalaryLine[]>(DEFAULT_SALARY_LINES);
  const [lineError, setLineError] = useState("");

  // Master data (static until the backend endpoints are ready)
  const [components, setComponents] = useState<SalaryComponent[]>(SEED_COMPONENTS);
  const [structures, setStructures] = useState<SalaryStructureRecord[]>(SEED_STRUCTURES);
  const [assignments, setAssignments] = useState<EmployeeSalaryAssignment[]>(SEED_ASSIGNMENTS);
  const [runs, setRuns] = useState<PayrollRun[]>(buildSeedRuns);
  const employees = SEED_EMPLOYEES;

  // ==================================================
  // DERIVED DATA
  // ==================================================

  const summary = useMemo(() => calcCtcSummary(details), [details]);
  const structure = useMemo(() => calcSalaryStructure(lines, summary), [lines, summary]);
  const structureErrors = useMemo(() => {
    const detailsCheck = validateSalaryDetails(details);
    return [
      ...(detailsCheck.valid ? [] : [detailsCheck.message]),
      ...validateStructure(lines, structure),
    ];
  }, [details, lines, structure]);

  // ==================================================
  // ACTIONS
  // ==================================================

  const saveLine = (line: SalaryLine) => {
    const check = validateSalaryLine(line, lines);
    if (!check.valid) {
      setLineError(check.message);
      return false;
    }
    setLineError("");
    setLines((prev) =>
      prev.some((item) => item.id === line.id)
        ? prev.map((item) => (item.id === line.id ? line : item))
        : [...prev, line],
    );
    return true;
  };

  // Inline edits from the table (method / value). Checked by validateStructure, not here,
  // so the user can clear a field and retype it.
  const updateLine = (id: string, patch: Partial<SalaryLine>) =>
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, ...patch } : line)));

  const removeLine = (id: string) =>
    setLines((prev) => prev.filter((line) => line.id !== id));

  const saveDraft = () => {
    // TODO: call useSaveSalaryStructureMutation once the endpoint is ready
    toast.success("Salary structure draft saved.");
  };

  // Saves the structure currently open in the calculator as a reusable record
  const saveStructure = () => {
    // TODO: call useSaveSalaryStructureMutation once the endpoint is ready
    const baseName = `Structure - ${formatLpa(details.annualCtc)}`;
    const taken = structures.filter((item) => item.name.startsWith(baseName)).length;
    const record: SalaryStructureRecord = {
      id: crypto.randomUUID(),
      name: taken ? `${baseName} (${taken + 1})` : baseName,
      details,
      lines,
      createdOn: today(),
    };
    setStructures((prev) => [...prev, record]);
    toast.success(`"${record.name}" saved.`);
    return record;
  };

  // Saving a component also puts it in the calculator: Credit -> Earnings, Debit -> Deductions.
  // The structure row shares the component's id, so editing the component later updates the same row.
  // An inactive component is kept in the master list but left out of the structure.
  const saveComponent = (component: SalaryComponent): PayrollValidationResult => {
    const check = validateSalaryComponent(component, components);
    if (!check.valid) return check;

    const line: SalaryLine = {
      id: component.id,
      kind: component.postingType,
      component: component.name,
      method: component.method,
      value: component.value,
    };

    if (component.active) {
      const lineCheck = validateSalaryLine(line, lines);
      if (!lineCheck.valid) return lineCheck;
    }

    setComponents((prev) =>
      prev.some((item) => item.id === component.id)
        ? prev.map((item) => (item.id === component.id ? component : item))
        : [...prev, component],
    );
    setLines((prev) => {
      const without = prev.filter((item) => item.id !== component.id);
      if (!component.active) return without;
      return prev.some((item) => item.id === component.id)
        ? prev.map((item) => (item.id === component.id ? line : item))
        : [...prev, line];
    });

    const section = component.postingType === "EARNING" ? "Earnings" : "Deductions";
    toast.success(
      component.active
        ? `"${component.name}" added to ${section}.`
        : `"${component.name}" saved (inactive, not added to ${section}).`,
    );
    return check;
  };

  const assignStructure = (input: {
    employeeId: string;
    structureId: string;
    effectiveFrom: string;
  }): PayrollValidationResult => {
    const check = validateAssignment(input, assignments);
    if (!check.valid) return check;
    setAssignments((prev) => [...prev, { id: crypto.randomUUID(), ...input }]);
    toast.success("Salary structure assigned.");
    return check;
  };

  const createPayrollRun = (period: string): PayrollRunResult => {
    const check = validatePayrollRunPeriod(period, runs);
    if (!check.valid) return check;
    const run = buildPayrollRun(period, today(), employees, assignments, structures);
    if (run.payslips.length === 0) {
      return { valid: false, message: "No employees have a salary structure effective for this period." };
    }
    setRuns((prev) => [run, ...prev].sort((a, b) => b.period.localeCompare(a.period)));
    toast.success(`Payroll run created for ${run.payslips.length} employees.`);
    return { valid: true, runId: run.id };
  };

  return {
    // UI STATE
    details,
    setDetails,
    lines,
    lineError,
    setLineError,

    // DATA
    summary,
    structure,
    structureErrors,
    components,
    structures,
    employees,
    assignments,
    runs,

    // ACTIONS
    saveLine,
    updateLine,
    removeLine,
    saveDraft,
    saveStructure,
    saveComponent,
    assignStructure,
    createPayrollRun,
  };
}
