import { Pencil, Plus } from "lucide-react";
import { CALC_METHOD_LABELS } from "../constants/payroll.constants";
import type { SalaryComponent } from "../types/payroll.types";
import { lineValueText } from "../utils/salaryCalculator";
import { EmptyState, SectionCard, StatusBadge, primaryBtn, tableCell } from "./PayrollShared";

interface SalaryComponentsListProps {
  components: SalaryComponent[];
  onAdd: () => void;
  onEdit: (id: string) => void;
}

const yesNo = (flag: boolean) => (flag ? "Yes" : "No");

export function SalaryComponentsList({ components, onAdd, onEdit }: SalaryComponentsListProps) {
  const addButton = (
    <button type="button" onClick={onAdd} className={primaryBtn}>
      <Plus className="h-4 w-4" />
      Add Component
    </button>
  );

  return (
    <SectionCard title="Salary Components" action={addButton}>
      {components.length === 0 ? (
        <EmptyState message="No salary components yet. Add one to get started." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#f6f7fb] text-left">
                <th className={tableCell}>#</th>
                <th className={tableCell}>Component</th>
                <th className={tableCell}>Posting Type</th>
                <th className={tableCell}>Calculation Method</th>
                <th className={tableCell}>Value</th>
                <th className={tableCell}>Taxable</th>
                <th className={tableCell}>Part of CTC</th>
                <th className={tableCell}>Status</th>
                <th className={`${tableCell} text-center`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {components.map((component, index) => (
                <tr key={component.id}>
                  <td className={tableCell}>{index + 1}</td>
                  <td className={tableCell}>{component.name}</td>
                  <td className={tableCell}>
                    <StatusBadge tone={component.postingType === "EARNING" ? "green" : "amber"}>
                      {component.postingType === "EARNING" ? "Earning" : "Deduction"}
                    </StatusBadge>
                  </td>
                  <td className={tableCell}>{CALC_METHOD_LABELS[component.method]}</td>
                  <td className={tableCell}>{lineValueText(component)}</td>
                  <td className={tableCell}>{yesNo(component.taxable)}</td>
                  <td className={tableCell}>{yesNo(component.partOfCtc)}</td>
                  <td className={tableCell}>
                    <StatusBadge tone={component.active ? "green" : "gray"}>
                      {component.active ? "Active" : "Inactive"}
                    </StatusBadge>
                  </td>
                  <td className={`${tableCell} text-center`}>
                    <button
                      type="button"
                      aria-label={`Edit ${component.name}`}
                      onClick={() => onEdit(component.id)}
                      className="p-1 text-[#4b5563] hover:text-[#3b49d6]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
