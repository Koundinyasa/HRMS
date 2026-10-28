import StatusBadge from "./StatusBadge";
import type { EmployeeRowProps } from "../types/leavecalendar.types";

const EmployeeRow = ({
  employee,
  days,
  onAttendanceClick,
}: EmployeeRowProps) => {
  return (
   <tr className="group font-[Urbanist]">
      {/* Employee ID / Name */}
      <td className="sticky left-0 z-10 w-[200px] min-w-[200px] max-w-[200px] border-b border-r border-[#dbe3ee] bg-white px-4 py-2 align-middle shadow-[2px_0_4px_-2px_rgba(16,24,40,0.08)] transition-colors group-hover:bg-[#f4f9fd]">
        <div className="mb-1 inline-block max-w-full truncate rounded bg-[#f2f4f7] px-2 py-0.5 text-[11px] font-medium leading-4 text-[#667085]">
          {employee.EmployeeID}
        </div>

        <div className="truncate text-sm font-semibold leading-tight text-[#344054]" title={employee.FullName}>
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
            className="w-[48px] min-w-[48px] border-b border-r border-[#dbe3ee] bg-white px-1 py-2 text-center align-middle transition-colors group-hover:bg-[#f4f9fd]"
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
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#1d9bf0]/40 active:scale-95"
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