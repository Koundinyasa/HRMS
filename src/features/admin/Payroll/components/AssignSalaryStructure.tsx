import { useMemo, useState } from "react";
import type {
  Employee,
  EmployeeSalaryAssignment,
  SalaryStructureRecord,
} from "../types/payroll.types";
import { formatDate } from "../utils/payrollFormat";
import { resolveStructure } from "../utils/payrollRun";
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

interface AssignSalaryStructureProps {
  employees: Employee[];
  structures: SalaryStructureRecord[];
  assignments: EmployeeSalaryAssignment[];
  initialEmployeeId?: string;
  onAssign: (input: {
    employeeId: string;
    structureId: string;
    effectiveFrom: string;
  }) => PayrollValidationResult;
  onDone: () => void;
}

export function AssignSalaryStructure({
  employees,
  structures,
  assignments,
  initialEmployeeId = "",
  onAssign,
  onDone,
}: AssignSalaryStructureProps) {
  const [employeeId, setEmployeeId] = useState(initialEmployeeId);
  const [structureId, setStructureId] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [error, setError] = useState("");

  const selected = structures.find((item) => item.id === structureId);
  const resolved = useMemo(() => (selected ? resolveStructure(selected) : null), [selected]);

  // Show what the employee has today so a re-assignment is a conscious choice
  const current = useMemo(() => {
    const latest = assignments
      .filter((item) => item.employeeId === employeeId)
      .sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0];
    const record = structures.find((item) => item.id === latest?.structureId);
    return latest && record ? { latest, record } : null;
  }, [assignments, employeeId, structures]);

  const submit = () => {
    const result = onAssign({ employeeId, structureId, effectiveFrom });
    if (result.valid) onDone();
    else setError(result.message);
  };

  const summaryRows: [string, string][] = resolved
    ? [
        ["Annual CTC", formatINR(resolved.summary.annualCtc)],
        ["Monthly CTC", formatINR(resolved.summary.monthlyCtc)],
        [`CTC Deduction Pool (16%)`, formatINR(resolved.summary.deductionPool)],
        ["Fixed Monthly CTC", formatINR(resolved.summary.fixedMonthlyCtc)],
        ["Earnings", formatINR(resolved.summary.earningsTarget)],
      ]
    : [];

  return (
    <>
      <SectionCard title="Assignment Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Employee *">
            <select
              className={inputClass}
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                setError("");
              }}
            >
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.code})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Salary Structure *">
            <select
              className={inputClass}
              value={structureId}
              onChange={(e) => {
                setStructureId(e.target.value);
                setError("");
              }}
            >
              <option value="">Select salary structure</option>
              {structures.map((structure) => (
                <option key={structure.id} value={structure.id}>{structure.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Effective From *">
            <input
              type="date"
              className={inputClass}
              value={effectiveFrom}
              onChange={(e) => {
                setEffectiveFrom(e.target.value);
                setError("");
              }}
            />
          </FormField>
        </div>

        {current && (
          <p className="mt-4 rounded-lg bg-[#f6f7fb] px-3 py-2 text-sm text-[#4b5563]">
            Currently on <b>{current.record.name}</b> since {formatDate(current.latest.effectiveFrom)}.
            The new assignment replaces it from its effective date.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Salary Summary">
        {resolved ? (
          <dl className="grid gap-x-12 gap-y-3 text-sm sm:grid-cols-2">
            {summaryRows.map(([label, amount]) => (
              <div key={label} className="flex justify-between border-b border-[#eceef5] pb-2">
                <dt className="text-[#6b7280]">{label}</dt>
                <dd className="font-bold">{amount}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm text-[#6b7280]">Select a salary structure to see its summary.</p>
        )}
      </SectionCard>

      <ErrorNote message={error} />

      <div className="flex flex-wrap justify-end gap-3 pb-6">
        <button type="button" onClick={onDone} className={neutralBtn}>Cancel</button>
        <button type="button" onClick={submit} className={primaryBtn}>Assign Structure</button>
      </div>
    </>
  );
}
