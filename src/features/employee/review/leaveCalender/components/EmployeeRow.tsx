import StatusBadge from "./StatusBadge";
import type { EmployeeRowProps } from "../types/leavecalendar.types";
const EmployeeRow = ({ employee, days }: EmployeeRowProps) => {
  return (
    <tr className="bg-white font-[Urbanist]">
      <td className="sticky left-0 z-10 w-[200px] min-w-[200px] border-b border-r border-[#e8ecf2] bg-white px-4 py-2 text-left align-middle font-[Urbanist]">
        <div className="mb-0.5 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] leading-tight text-gray-500 font-[Urbanist]">
          {employee.EmployeeID}
        </div>
        <div className="truncate text-sm font-medium leading-tight text-gray-700 font-[Urbanist]">
          {employee.FullName}
        </div>
      </td>
      {days.map((day) => (
        <td
          key={day.key}
          className="w-[48px] min-w-[48px] border-b border-r border-[#e8ecf2] px-1 py-1.5 text-center align-middle font-[Urbanist]"
        >
          <StatusBadge status={employee[day.key]} />
        </td>
      ))}
    </tr>
  );
};
export default EmployeeRow;
