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
      <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-500 font-[Urbanist]">
        No employee details found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white font-[Urbanist]">
      <table className="w-full min-w-[760px] border-collapse text-xs sm:text-sm font-[Urbanist]">
        <thead>
          <tr className="bg-[#d8eaf7] text-left font-[Urbanist]">
            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4 font-[Urbanist]">
              Emp ID
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4 font-[Urbanist]">
              Emp Name
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4 font-[Urbanist]">
              Date
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4 font-[Urbanist]">
              First Punch
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4 font-[Urbanist]">
              Last Punch
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4 font-[Urbanist]">
              Work Hours
            </th>

            <th className="px-2 py-3 font-semibold text-slate-800 sm:px-3 sm:py-4 font-[Urbanist]">
              Attendance Status
            </th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee, index) => (
            <tr
              key={`${employee.empId}-${index}`}
              className="border-b border-black hover:bg-slate-50 font-[Urbanist]"
            >
              <td className="px-3 py-4 text-sm text-slate-700 font-[Urbanist]">
                {employee.empId}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700 font-[Urbanist]">
                {employee.empName}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700 font-[Urbanist]">
                {employee.date}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700 font-[Urbanist]">
                {employee.firstPunch || "-"}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700 font-[Urbanist]">
                {employee.lastPunch || "-"}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700 font-[Urbanist]">
                {employee.workHours || "-"}
              </td>

              <td className="px-3 py-4 text-sm text-slate-700 font-[Urbanist]">
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