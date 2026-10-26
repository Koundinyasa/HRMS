import { Eye, FileText } from "lucide-react";

import type { ExitEmployee } from "../types/exitReport.types";

type ExitReportTableProps = {
  employees: ExitEmployee[];
  onView?: (employee: ExitEmployee) => void;
};

export default function ExitReportTable({ employees, onView }: ExitReportTableProps) {
  return (
    // <div className="overflow-x-auto">
    //   <table className="w-full min-w-[1000px] border-collapse">
    <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
  <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-bold text-black">Employee ID</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black">Employee Name</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black">Department</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black">Designation</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black">Joining Date</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black">Relieving Date</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black">Exit Reason</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black">Status</th>
            <th className="px-4 py-3 text-center text-sm font-bold text-black">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">{employee.employeeId}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{employee.employeeName}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{employee.department}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{employee.designation}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{employee.joiningDate}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{employee.relievingDate}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{employee.exitReason}</td>

              <td className="px-4 py-3 text-sm">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {employee.status}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    title="View"
                    onClick={() => onView?.(employee)}
                    className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    type="button"
                    title="Documents"
                    className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FileText size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
