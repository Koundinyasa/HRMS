import { Plus } from "lucide-react";
import type {
  Employee,
  EmployeeSalaryAssignment,
  SalaryStructureRecord,
} from "../types/payroll.types";
import { formatDate } from "../utils/payrollFormat";
import { formatINR } from "../utils/salaryCalculator";
import { SectionCard, StatusBadge, primaryBtn, smallOutlineBtn, tableCell } from "./PayrollShared";

interface EmployeeSalaryListProps {
  employees: Employee[];
  structures: SalaryStructureRecord[];
  assignments: EmployeeSalaryAssignment[];
  onAssign: (employeeId?: string) => void;
}

export function EmployeeSalaryList({
  employees,
  structures,
  assignments,
  onAssign,
}: EmployeeSalaryListProps) {
  const today = new Date().toISOString().slice(0, 10);

  const rows = employees.map((employee) => {
    const mine = assignments
      .filter((item) => item.employeeId === employee.id)
      .sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));
    // Current = latest assignment already in effect; otherwise the next upcoming one
    const inEffect = mine.find((item) => item.effectiveFrom <= today);
    const assignment = inEffect ?? mine[mine.length - 1];
    const structure = structures.find((item) => item.id === assignment?.structureId);
    return { employee, assignment, structure, upcoming: !!assignment && !inEffect };
  });

  const assignButton = (
    <button type="button" onClick={() => onAssign()} className={primaryBtn}>
      <Plus className="h-4 w-4" />
      Assign Structure
    </button>
  );

  return (
    <SectionCard title="Employee Salary" action={assignButton}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#f6f7fb] text-left">
              <th className={tableCell}>Employee</th>
              <th className={tableCell}>Designation</th>
              <th className={tableCell}>Salary Structure</th>
              <th className={`${tableCell} text-right`}>Annual CTC</th>
              <th className={tableCell}>Effective From</th>
              <th className={tableCell}>Status</th>
              <th className={`${tableCell} text-center`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ employee, assignment, structure, upcoming }) => (
              <tr key={employee.id}>
                <td className={tableCell}>
                  {employee.name}
                  <span className="block text-xs text-[#6b7280]">{employee.code}</span>
                </td>
                <td className={tableCell}>{employee.designation}</td>
                <td className={tableCell}>{structure?.name ?? "-"}</td>
                <td className={`${tableCell} text-right`}>
                  {structure ? formatINR(structure.details.annualCtc) : "-"}
                </td>
                <td className={tableCell}>{assignment ? formatDate(assignment.effectiveFrom) : "-"}</td>
                <td className={tableCell}>
                  {!assignment ? (
                    <StatusBadge tone="gray">Not assigned</StatusBadge>
                  ) : upcoming ? (
                    <StatusBadge tone="blue">Upcoming</StatusBadge>
                  ) : (
                    <StatusBadge tone="green">Active</StatusBadge>
                  )}
                </td>
                <td className={`${tableCell} text-center`}>
                  <button type="button" className={smallOutlineBtn} onClick={() => onAssign(employee.id)}>
                    {assignment ? "Change" : "Assign"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
