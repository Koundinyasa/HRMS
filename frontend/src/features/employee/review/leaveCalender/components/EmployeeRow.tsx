import StatusBadge from "./StatusBadge";
import type { EmployeeRowProps } from "../types/leavecalendar.types";
const EmployeeRow = ({ employee, days }: EmployeeRowProps) => {
  return (
    <tr className="odd:bg-white even:bg-gray-50">
      <td className="sticky left-0 z-10 min-w-[220px] border border-gray-200 bg-inherit px-4 py-3">
        <div className="mb-1 inline-block rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-500">
          {employee.EmployeeID}
        </div>
        <div className="text-sm font-medium text-gray-700">
          {employee.FullName}
        </div>
      </td>
      {days.map((day) => (
        <td
          key={day.key}
          className="border border-gray-200 px-2 py-3 text-center"
        >
          <StatusBadge status={employee[day.key]} />
        </td>
      ))}
    </tr>
  );
};
export default EmployeeRow;
