import React from "react";
import type { TAInsightEmployee } from "../types/taInsightsTypes";

interface TAInsightsTableProps {
  employees: TAInsightEmployee[];
}

const TAInsightsTable: React.FC<TAInsightsTableProps> = ({
  employees,
}) => {
  if (!employees.length) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-500">
        No employee details found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white">
      <table className="w-full min-w-[760px] border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-[#d8eaf7] text-left">
            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4">
              Emp ID
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4">
              Emp Name
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4">
              Date
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4">
              First Punch
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4">
              Last Punch
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4">
              Work Hours
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4">
              Attendance Status
            </th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee, index) => (
            <tr
              key={`${employee.empId}-${index}`}
              className="border-b border-slate-100 hover:bg-slate-50"
            >
              <td className="px-3 py-4 text-sm text-slate-700">
                {employee.empId}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700">
                {employee.empName}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700">
                {employee.date}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700">
                {employee.firstPunch || "-"}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700">
                {employee.lastPunch || "-"}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700">
                {employee.workHours || "-"}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700">
                {employee.attendanceStatus || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TAInsightsTable;