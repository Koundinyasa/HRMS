// // import StatusBadge from "./StatusBadge";
// // import type { EmployeeRowProps } from "../types/leavecalendar.types";
// // const EmployeeRow = ({ employee, days }: EmployeeRowProps) => {
// //   return (
// //     <tr className="odd:bg-white even:bg-gray-50 font-[Urbanist]">
// //       <td className="sticky left-0 z-10 min-w-[220px] border border-black bg-inherit px-4 py-3 font-[Urbanist]">
// //         <div className="mb-1 inline-block rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-500 font-[Urbanist]">
// //           {employee.EmployeeID}
// //         </div>
// //         <div className="text-sm font-medium text-gray-700 font-[Urbanist]">
// //           {employee.FullName}
// //         </div>
// //       </td>
// //       {days.map((day) => (
// //         <td
// //           key={day.key}
// //           className="border border-black px-2 py-3 text-center font-[Urbanist]"
// //         >
// //           <StatusBadge status={employee[day.key]} />
// //         </td>
// //       ))}
// //     </tr>
// //   );
// // };
// // export default EmployeeRow;


// import StatusBadge from "./StatusBadge";
// import type { EmployeeRowProps } from "../types/leavecalendar.types";

// const EmployeeRow = ({
//   employee,
//   days,
//   onAttendanceClick,
// }: EmployeeRowProps) => {
//   return (
//     <tr className="odd:bg-white even:bg-gray-50 font-[Urbanist]">
//       {/* Employee */}
//       <td className="sticky left-0 z-10 min-w-[220px] border border-black bg-white px-4 py-3 font-[Urbanist]">
//         <div className="mb-1 inline-block rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-500 font-[Urbanist]">
//           {employee.EmployeeID}
//         </div>

//         <div className="text-sm font-medium text-gray-700 font-[Urbanist]">
//           {employee.FullName}
//         </div>
//       </td>

//       {/* Attendance Days */}
//       {days.map((day) => {
//         const status = String(employee[day.key] ?? "")
//           .trim()
//           .toUpperCase();

//         return (
//           <td
//             key={day.key}
//             className="border border-black px-2 py-3 text-center font-[Urbanist]"
//             onClick={() => {
//               console.log("ATTENDANCE CELL CLICKED", {
//                 employee: employee.FullName,
//                 employeeId: employee.EmployeeID,
//                 date: day.date,
//                 weekday: day.weekday,
//                 status,
//               });

//               onAttendanceClick(
//                 employee,
//                 day,
//                 status,
//               );
//             }}
//             style={{
//               cursor: "pointer",
//             }}
//           >
//             <div
//               className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full font-[Urbanist]"
//               role="button"
//               tabIndex={0}
//               onClick={(event) => {
//                 event.stopPropagation();

//                 console.log("ATTENDANCE BADGE CLICKED", {
//                   employee: employee.FullName,
//                   employeeId: employee.EmployeeID,
//                   date: day.date,
//                   status,
//                 });

//                 onAttendanceClick(
//                   employee,
//                   day,
//                   status,
//                 );
//               }}
//               onKeyDown={(event) => {
//                 if (
//                   event.key === "Enter" ||
//                   event.key === " "
//                 ) {
//                   event.preventDefault();

//                   onAttendanceClick(
//                     employee,
//                     day,
//                     status,
//                   );
//                 }
//               }}
//             >
//               <StatusBadge
//                 status={employee[day.key]}
//               />
//             </div>
//           </td>
//         );
//       })}
//     </tr>
//   );
// };

// export default EmployeeRow;

import StatusBadge from "./StatusBadge";
import type { EmployeeRowProps } from "../types/leavecalendar.types";

const EmployeeRow = ({
  employee,
  days,
  onAttendanceClick,
}: EmployeeRowProps) => {
  return (
    <tr className="odd:bg-white even:bg-gray-50 font-[Urbanist]">
      {/* Employee ID / Name */}
      <td className="sticky left-0 z-10 min-w-[220px] border border-black bg-white px-4 py-3 font-[Urbanist]">
        <div className="mb-1 inline-block rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-500 font-[Urbanist]">
          {employee.EmployeeID}
        </div>

        <div className="text-sm font-medium text-gray-700 font-[Urbanist]">
          {employee.FullName}
        </div>
      </td>

      {/* Attendance Status */}
      {days.map((day) => {
        const status = String(employee[day.key] ?? "")
          .trim()
          .toUpperCase();

        return (
          <td
            key={day.key}
            className="border border-black px-2 py-3 text-center font-[Urbanist]"
          >
            {/* Badge Button */}
            <button
              type="button"
              title={`Open Daily Log - ${status || "No Record"}`}
              onClick={() => {
                console.log("================================");
                console.log("BADGE CLICKED");
                console.log("Employee:", employee.FullName);
                console.log("Employee ID:", employee.EmployeeID);
                console.log("Date:", day.date);
                console.log("Weekday:", day.weekday);
                console.log("Status:", status);
                console.log("================================");

                onAttendanceClick(
                  employee,
                  day,
                  status,
                );
              }}
              className="
                inline-flex
                h-9
                w-9
                items-center
                justify-center
                cursor-pointer
                rounded-full
                border-0
                bg-transparent
                p-0
                outline-none
                hover:scale-105
                active:scale-95
               font-[Urbanist]"
              style={{
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              <StatusBadge
                status={employee[day.key]}
              />
            </button>
          </td>
        );
      })}
    </tr>
  );
};

export default EmployeeRow;