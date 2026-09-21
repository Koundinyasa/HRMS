
import type {
  AttendanceHistoryEmployee,
  LeaveCalendarDay,
  LeaveStatusConfig,
} from "../types/leavecalendar.types";

/* =========================================================
   CONSTANTS
========================================================= */

export const LEAVE_CALENDAR_CONSTANTS = {
  DEFAULT_MONTH: new Date().getMonth() + 1,
  DEFAULT_YEAR: new Date().getFullYear(),
  DEFAULT_BRANCH_ID: undefined,
  DEFAULT_ROWS_PER_PAGE: 10,
  ROWS_PER_PAGE_OPTIONS: [10, 25, 50],
} as const;

// Fallback for a status code the backend hasn't defined (or hasn't loaded
// yet), and that isn't in KNOWN_STATUS_STYLES below either.
export const DEFAULT_STATUS_STYLE = { label: "No Record", className: "bg-gray-100 text-gray-400" };

/* =========================================================
   STATUS
========================================================= */

const KNOWN_STATUS_STYLES: Record<string, { label: string; className: string }> = {
  P: { label: "Present", className: "bg-blue-100 text-blue-700" },
  W: { label: "Week Off", className: "bg-yellow-100 text-yellow-700" },
  WO: { label: "Week Off", className: "bg-yellow-100 text-yellow-700" },
  AB: { label: "Absent", className: "bg-red-100 text-red-700" },
  A: { label: "Absent", className: "bg-red-100 text-red-700" },
  H: { label: "Holiday", className: "bg-violet-100 text-violet-700" },
  HD: { label: "Half Day", className: "bg-orange-100 text-orange-700" },
  CL: { label: "Casual Leave", className: "bg-purple-100 text-purple-700" },
  SL: { label: "Sick Leave", className: "bg-purple-100 text-purple-700" },
  PL: { label: "Privilege Leave", className: "bg-purple-100 text-purple-700" },
  "P/AB": { label: "Half Present / Half Absent", className: "bg-pink-100 text-pink-700" },
  "AB/P": { label: "Half Absent / Half Present", className: "bg-pink-100 text-pink-700" },
};


export const getStatusConfig = (
  rawStatus: string | null | undefined,
  configMap: Record<string, { label: string; className: string }>,
): {
  code: string;
  label: string;
  className: string;
} => {
  const code = String(rawStatus ?? "")
    .trim()
    .toUpperCase();

  if (!code || code === "-") {
    return {
      code: "-",
      ...DEFAULT_STATUS_STYLE,
    };
  }

  const config = configMap[code] ?? KNOWN_STATUS_STYLES[code];

  if (config) {
    return {
      code,
      ...config,
    };
  }

 
  return {
    code,
    label: code,
    className: "bg-gray-100 text-gray-500",
  };
};


const STATUS_COLOR_PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-yellow-100 text-yellow-700",
  "bg-red-100 text-red-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

const colorForCode = (code: string): string => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash * 31 + code.charCodeAt(i)) >>> 0;
  }
  return STATUS_COLOR_PALETTE[hash % STATUS_COLOR_PALETTE.length];
};

export const buildStatusConfigMap = (
  statuses: LeaveStatusConfig[] | undefined,
): Record<string, { label: string; className: string }> => {
  const map: Record<string, { label: string; className: string }> = {};

  (statuses ?? []).forEach((status) => {
    map[status.code] = {
      label: status.label,
      className:
        status.className ??
        KNOWN_STATUS_STYLES[status.code]?.className ??
        colorForCode(status.code),
    };
  });

  return map;
};

/* =========================================================
   DYNAMIC DAY KEYS
========================================================= */

export const getCalendarDayKeys = (
  employee: Record<string, unknown>,
): string[] => {
  return Object.keys(employee)
    .filter((key) => /^\d{1,2}\s+/.test(key))
    .sort(
      (a, b) =>
        Number(a.split(" ")[0]) -
        Number(b.split(" ")[0]),
    );
};

/* =========================================================
   BUILD DAYS FROM SELECTED YEAR + MONTH
========================================================= */

export const buildLeaveCalendarDays = (
  year: number,
  monthIndex: number,
): LeaveCalendarDay[] => {
  const totalDays = new Date(
    year,
    monthIndex + 1,
    0,
  ).getDate();

  return Array.from(
    { length: totalDays },
    (_, index) => {
      const date = index + 1;

      const weekday = new Date(
        year,
        monthIndex,
        date,
      ).toLocaleDateString("en-US", {
        weekday: "short",
      });

      return {
        date,
        weekday,
        key: `${date} ${weekday}`,
      };
    },
  );
};

/* =========================================================
   EMPLOYEE ID
========================================================= */

export const getEmployeeId = (
  employee: Record<string, unknown>,
): string => {
  return String(
    employee.EmployeeID ??
      employee.employeeId ??
      employee.EmployeeId ??
      "",
  ).trim();
};

/* =========================================================
   EMPLOYEE NAME
========================================================= */

export const getEmployeeName = (
  employee: Record<string, unknown>,
): string => {
  return String(
    employee.FullName ??
      employee.employeeName ??
      employee.EmployeeName ??
      "",
  ).trim();
};

/* =========================================================
   SEARCH
========================================================= */

export const filterEmployees = (
  employees: any[],
  searchTerm: string,
) => {
  const search = searchTerm
    .trim()
    .toLowerCase();

  if (!search) {
    return employees;
  }

  return employees.filter((employee) => {
    const id = getEmployeeId(employee).toLowerCase();

    const name = getEmployeeName(employee).toLowerCase();

    return (
      id.includes(search) ||
      name.includes(search)
    );
  });
};

/* =========================================================
   ATTENDANCE SUMMARY
========================================================= */

export const summarizeAttendance = (
  employee: Record<string, any>,
): Pick<
  AttendanceHistoryEmployee,
  "present" | "absent"
> => {
  const dayKeys =
    getCalendarDayKeys(employee);

  return dayKeys.reduce(
    (totals, key) => {
      const status = String(
        employee[key] ?? "",
      )
        .trim()
        .toUpperCase();

      switch (status) {
        case "P":
        case "PRESENT":
          totals.present += 1;
          break;

        case "AB":
        case "A":
        case "ABSENT":
          totals.absent += 1;
          break;

        case "HD":
          totals.present += 0.5;
          totals.absent += 0.5;
          break;

        case "P/AB":
        case "AB/P":
          totals.present += 0.5;
          totals.absent += 0.5;
          break;

        default:
          /*
           * W, WO, H, CL, SL, PL and "-"
           * are not counted as present/absent.
           */
          break;
      }

      return totals;
    },
    {
      present: 0,
      absent: 0,
    },
  );
};
