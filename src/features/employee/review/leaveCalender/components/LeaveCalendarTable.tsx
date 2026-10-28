import EmployeeRow from "./EmployeeRow";
import type { LeaveCalendarTableProps } from "../types/leavecalendar.types";
//import { getStatusConfig } from "../constants/leaveCalendar.constants";
const LeaveCalendarTable = ({ employees, days }: LeaveCalendarTableProps) => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col font-[Urbanist]">
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto font-[Urbanist]">
        <table className="min-w-max border-separate border-spacing-0 font-[Urbanist]">
          <thead className="sticky top-0 z-30 font-[Urbanist]">
            <tr className="bg-[#eaf4fb] font-[Urbanist]">
              <th className="sticky left-0 z-40 w-[200px] min-w-[200px] border-b border-r border-[#dbe3ee] bg-[#eaf4fb] px-4 py-2.5 text-left align-middle text-xs font-semibold text-[#344054] font-[Urbanist]">
                Emp Id / Name
              </th>
              {days.map((day) => (
                <th
                  key={day.key}
                  className="w-[48px] min-w-[48px] border-b border-r border-[#dbe3ee] bg-[#eaf4fb] px-1 py-2 text-center align-middle font-[Urbanist]" >
                
                  <div className="text-[13px] font-semibold leading-tight text-[#344054] font-[Urbanist]">
                    {day.date}
                  </div>
                  <div className="text-[10px] font-medium leading-tight text-[#8792a3] font-[Urbanist]">
                    {day.weekday}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <EmployeeRow
                  key={employee.EmployeeID}
                  employee={employee}
                  days={days}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={days.length + 1}
                  className="py-10 text-center text-sm text-gray-500 font-[Urbanist]"
                >
                  No employee data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveCalendarTable;
