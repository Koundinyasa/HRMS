// import EmployeeRow from "./EmployeeRow";
// import type {
//   LeaveCalendarTableProps,
// } from "../types/leavecalendar.types";
// //import { getStatusConfig } from "../constants/leaveCalendar.constants";
// const LeaveCalendarTable = ({
//   employees,
//   days,
// }: LeaveCalendarTableProps) => {
//   return (
//     <div className="flex h-full min-h-0 w-full flex-col">
//       <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto">
//         <table className="min-w-max border-collapse">
//           <thead className="sticky top-0 z-30">
//             <tr className="bg-blue-50">
//               <th
//                 className="sticky left-0 z-40 min-w-[220px] border border-gray-200 bg-blue-50 px-4 py-3 text-left text-xs font-semibold text-gray-600"              >
//                 Emp Id / Name
//               </th>
//               {days.map((day) => (
//                 <th
//                   key={day.key}
//                   className="min-w-[55px] border border-gray-200 bg-blue-50 px-2 py-2 text-center"
//                 >
//                   <div className="text-xs font-semibold text-gray-700">
//                     {day.date}
//                   </div>
//                   <div className="text-[11px] text-gray-400">
//                     {day.weekday}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {employees.length > 0 ? (
//               employees.map((employee) => (
//                 <EmployeeRow
//                   key={employee.EmployeeID}
//                   employee={employee}
//                   days={days}
//                 />
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={days.length + 1}
//                   className="py-10 text-center text-sm text-gray-500"
//                 >
//                   No employee data found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default LeaveCalendarTable;


import EmployeeRow from "./EmployeeRow";
import type { LeaveCalendarTableProps } from "../types/leavecalendar.types";

const LeaveCalendarTable = ({
  employees,
  days,
  onAttendanceClick,
}: LeaveCalendarTableProps) => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto">
        <table className="min-w-max border-collapse">
          <thead className="sticky top-0 z-30">
            <tr className="bg-blue-50">
              <th className="sticky left-0 z-40 min-w-[220px] border border-gray-200 bg-blue-50 px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Emp Id / Name
              </th>

              {days.map((day) => (
                <th
                  key={day.key}
                  className="min-w-[55px] border border-gray-200 bg-blue-50 px-2 py-2 text-center"
                >
                  <div className="text-xs font-semibold text-gray-700">
                    {day.date}
                  </div>

                  <div className="text-[11px] text-gray-400">
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
                  onAttendanceClick={onAttendanceClick}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={days.length + 1}
                  className="py-10 text-center text-sm text-gray-500"
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