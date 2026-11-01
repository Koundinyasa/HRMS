import { isEmployeeFull, type Employee } from "../api/employeeListApi";
import { getStatus } from "./employeeList.utils";

const HEADERS = [
  "Emp ID",
  "Name",
  "Designation",
  "Joining Date",
  "Exit Date",
  "Email",
  "Mobile",
  "Branch",
  "Reporting Manager",
  "Leave Policy",
  "Attendance",
  "Status",
];

/** Lets Excel read accented names as UTF-8. */
const UTF8_BOM = String.fromCharCode(0xfeff);

/** A cell starting with = + - @ would run as a formula in Excel. */
function cell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportEmployeesCsv(employees: Employee[]) {
  const rows = employees.map((employee) =>
    isEmployeeFull(employee)
      ? [
          employee.EmployeeID,
          employee.EmployeeName,
          employee.DesignationName,
          employee.JoiningDate,
          employee.ExitDate,
          employee.Email,
          employee.MobileNo,
          employee.BranchName,
          employee.ReportingManager,
          employee.LeavePolicyName,
          employee.AttendanceType,
          getStatus(employee),
        ]
      : [
          employee.EmployeeID,
          employee.EmployeeName,
          "",
          employee.JoiningDate,
          employee.ExitDate,
          "",
          "",
          "",
          employee.ReportingAuthorityName,
          "",
          "",
          getStatus(employee),
        ],
  );

  const csv = [HEADERS, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([UTF8_BOM, csv], { type: "text/csv;charset=utf-8;" }));

  const link = document.createElement("a");
  link.href = url;
  link.download = "Employees.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
