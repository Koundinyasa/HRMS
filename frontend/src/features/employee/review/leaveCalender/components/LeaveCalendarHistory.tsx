import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaFileExcel } from "react-icons/fa";
import { useMonthlyLeaveCalendar } from "../hooks/useMonthlyLeaveCalendar";
import { getEmployeeId, getEmployeeName, summarizeAttendance } from "../constants/leaveCalendar.constants";
import type { AttendanceHistoryEmployee } from "../types/leavecalendar.types";
export default function LeaveCalendarHistory() {
  // Same default month as LeaveCalendar.tsx - the current month
  const [selectedMonth] = useState(new Date().getMonth());
  const companyId = 1; // TODO: source from the authenticated user's company context
  const selectedYear = new Date().getFullYear();
  // API expects month from 1 to 12
  const selectedMonthNumber = selectedMonth + 1;
  const {
    data: monthlyLeaveCalendar = [],
    isLoading,
    isError,
  } = useMonthlyLeaveCalendar({
    companyId,
    year: selectedYear,
    month: selectedMonthNumber,
  });
  const employees: AttendanceHistoryEmployee[] = useMemo(() => {
    const calendarEmployees = Array.isArray(monthlyLeaveCalendar)
      ? monthlyLeaveCalendar
      : [];
    return calendarEmployees.map((calendarEmployee, index) => {
      const employeeId = getEmployeeId(calendarEmployee);
      const employeeName = getEmployeeName(calendarEmployee);
      const { present, absent } = summarizeAttendance(calendarEmployee);
      return {
        employeeId: employeeId || `employee-${index}`,
        employeeName,
        present,
        absent,
      };
    });
  }, [monthlyLeaveCalendar]);
  // ===============================
  // Export to Excel
  // ===============================
  const exportToExcel = () => {
    const exportData = employees.map((employee) => ({
      "Employee ID": employee.employeeId,
      "Employee Name": employee.employeeName,
      "Present Days": employee.present,
      "Absent Days": employee.absent,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance History");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, "AttendanceHistory.xlsx");
  };
  return (
    <div className="h-full w-full overflow-hidden bg-slate-100 p-2 sm:p-3 md:p-4 font-[Urbanist]">
      <div className="flex h-full w-full max-w-full flex-col overflow-hidden rounded-lg bg-white shadow font-[Urbanist]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black px-3 py-3 sm:px-4 sm:py-4 font-[Urbanist]">
          <h2 className="text-sm font-semibold text-blue-600 sm:text-base md:text-xl font-[Urbanist]">
            Attendance History
          </h2>
          <button
            onClick={exportToExcel}
            disabled={employees.length === 0}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:w-9 font-[Urbanist]"
            title="Export Excel"
            type="button"
          >
            <FaFileExcel size={22} className="text-green-600 sm:size-[26px] font-[Urbanist]" />
          </button>
        </div>
        {/* Loading State */}
        {isLoading && (
          <div className="shrink-0 px-4 py-3 text-center text-sm text-gray-500 font-[Urbanist]">
            Loading attendance history...
          </div>
        )}
        {/* Error State */}
        {isError && (
          <div className="shrink-0 px-4 py-6 text-center text-sm text-red-500 font-[Urbanist]">
            Failed to load attendance history.
          </div>
        )}
        {/* Table */}
        {!isLoading && !isError && (
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto font-[Urbanist]">
            <table className="w-full min-w-[600px] table-fixed border-collapse font-[Urbanist]">
              <thead className="sticky top-0 z-10 bg-blue-50 font-[Urbanist]">
                <tr>
                  <th className="w-[25%] border border-black bg-blue-50 px-1 py-2 text-[10px] font-semibold leading-tight sm:px-2 sm:py-3 sm:text-xs md:text-sm font-[Urbanist]">
                    Employee ID
                  </th>
                  <th className="w-[30%] border border-black bg-blue-50 px-1 py-2 text-[10px] font-semibold leading-tight sm:px-2 sm:py-3 sm:text-xs md:text-sm font-[Urbanist]">
                    Employee Name
                  </th>
                  <th className="w-[22.5%] border border-black bg-blue-50 px-1 py-2 text-[10px] font-semibold leading-tight sm:px-2 sm:py-3 sm:text-xs md:text-sm font-[Urbanist]">
                    Present Days
                  </th>
                  <th className="w-[22.5%] border border-black bg-blue-50 px-1 py-2 text-[10px] font-semibold leading-tight sm:px-2 sm:py-3 sm:text-xs md:text-sm font-[Urbanist]">
                    Absent Days
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-black px-3 py-6 text-center text-sm text-gray-500 font-[Urbanist]"
                    >
                      No attendance history found.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee, index) => (
                    <tr key={employee.employeeId || `employee-${index}`}>
                      <td className="break-all border border-black px-1 py-3 text-[10px] leading-tight text-gray-700 sm:px-2 sm:py-3 sm:text-xs md:text-sm font-[Urbanist]">
                        {employee.employeeId || "-"}
                      </td>

                      <td className="break-words border border-black px-1 py-3 text-[10px] leading-tight text-gray-700 sm:px-2 sm:py-3 sm:text-xs md:text-sm font-[Urbanist]">
                        {employee.employeeName || "-"}
                      </td>

                      <td className="border border-black px-1 py-3 text-center text-[11px] font-semibold text-green-600 sm:px-2 sm:py-3 sm:text-xs md:text-sm font-[Urbanist]">
                        {employee.present}
                      </td>

                      <td className="border border-black px-1 py-3 text-center text-[11px] font-semibold text-red-600 sm:px-2 sm:py-3 sm:text-xs md:text-sm font-[Urbanist]">
                        {employee.absent}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
