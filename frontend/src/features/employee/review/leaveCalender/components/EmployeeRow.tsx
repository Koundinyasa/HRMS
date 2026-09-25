import StatusBadge from "./StatusBadge";
import type { EmployeeRowProps } from "../types/leavecalendar.types";
const EmployeeRow = ({ employee, days }: EmployeeRowProps) => {
  return (
    <tr className="odd:bg-white even:bg-gray-50 font-[Urbanist]">
      <td className="sticky left-0 z-10 min-w-[220px] border border-black bg-inherit px-4 py-3 font-[Urbanist]">
        <div className="mb-1 inline-block rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-500 font-[Urbanist]">
          {employee.EmployeeID}
        </div>
        <div className="text-sm font-medium text-gray-700 font-[Urbanist]">
          {employee.FullName}
        </div>
      </td>
      {days.map((day) => (
        <td
          key={day.key}
          className="border border-black px-2 py-3 text-center font-[Urbanist]"
        >
          <StatusBadge status={employee[day.key]} />
        </td>
      ))}
    </tr>
  );
};
export default EmployeeRow;
