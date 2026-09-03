import { Pencil, Trash2 } from "lucide-react";

import type { SeparationEmployee } from "../types/separationTypes";

import {
  formatDate,
  getStatusClass,
} from "../utils/separationUtils";

interface SeparationTableProps {
  employees: SeparationEmployee[];
  onEdit?: (employee: SeparationEmployee) => void;
  onDelete?: (id: string) => void;
}

export default function SeparationTable({
  employees,
  onEdit,
  onDelete,
}: SeparationTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                Employee
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                Code
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                Designation
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                Separation Date
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                Type
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                Status
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  No separation records found
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {employee.employeeName}
                    </div>

                    {employee.department && (
                      <div className="text-xs text-gray-500">
                        {employee.department}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {employee.employeeCode}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {employee.designation || "-"}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(
                      employee.separationDate
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {employee.separationType || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        employee.status
                      )}`}
                    >
                      {employee.status || "Pending"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(employee)}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete?.(employee.id)
                        }
                        className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}