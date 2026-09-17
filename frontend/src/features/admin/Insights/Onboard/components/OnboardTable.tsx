



import { Move } from "lucide-react";
import type { OnboardEmployee } from "../types/onboard.types";

interface OnboardTableProps {
  employees: OnboardEmployee[];
  currentPage: number;
  rowsPerPage: number;
  onView: (employee: OnboardEmployee) => void;
}

export default function OnboardTable({
  employees,
  currentPage,
  rowsPerPage,
  onView,
}: OnboardTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] border-collapse">
        <thead>
          <tr className="bg-[#F9FAFB]">
            <th className="rounded-tl-lg px-4 py-3 text-left text-[11px] font-semibold text-slate-700">
              Sl.No.
            </th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-700">
              Employee ID
            </th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-700">
              Employee Name
            </th>
            <th className="rounded-tr-lg px-4 py-3 text-right text-[11px] font-semibold text-slate-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan={4} className="bg-white px-4 py-20 text-center text-xs text-slate-400">
                Did Not Find Any Onboard Report
              </td>
            </tr>
          ) : (
            employees.map((employee, index) => {
              const serialNumber = (currentPage - 1) * rowsPerPage + index + 1;
              return (
                <tr key={employee.id} className="border-t border-slate-100 bg-white">
                  <td className="px-4 py-3 text-xs text-slate-700">{serialNumber}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">{employee.employeeId}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">{employee.employeeName}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onView(employee)}
                      title="View confirmation letter"
                      className="inline-flex items-center justify-center rounded p-1 text-slate-500 hover:text-slate-700"
                    >
                      <Move size={15} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}