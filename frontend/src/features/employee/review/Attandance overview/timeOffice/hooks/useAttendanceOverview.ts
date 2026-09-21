// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { useAttendance } from "./useRegularization";
// import { useGetReportingEmployeesQuery } from "../api/regularizationApi";

// import type {
//   AttendanceView,
//   OverviewDetailKey,
//   PunchTab,
//   Toast,
// } from "../types/attendanceOverview.types";

// import type { Employee } from "../types/regularization.types";

// import {
//   getOverviewStats,
//   normalizeAttendanceRows,
// } from "../validations/regularization.validations";

// export function useAttendanceOverview() {
//   // =====================================================
//   // REPORTING EMPLOYEES
//   // =====================================================

//   const {
//     data: reportingEmployees = [],
//     isLoading: reportingEmployeesLoading,
//     error: reportingEmployeesError,
//   } = useGetReportingEmployeesQuery();

//   const employeeOptions = useMemo<Employee[]>(
//     () =>
//       reportingEmployees.map((employee) => ({
//         id: employee.EmployeeID,
//         name: employee.EmployeeName,
//       })),
//     [reportingEmployees],
//   );

//   // =====================================================
//   // SELECTED EMPLOYEE
//   // =====================================================

//   const [selectedEmployee, setSelectedEmployee] =
//     useState<Employee | null>(null);

//   useEffect(() => {
//     if (
//       employeeOptions.length > 0 &&
//       !selectedEmployee
//     ) {
//       setSelectedEmployee(employeeOptions[0]);
//     }
//   }, [employeeOptions, selectedEmployee]);

//   // =====================================================
//   // ATTENDANCE VIEW
//   // =====================================================

//   const [view, setView] =
//     useState<AttendanceView>("list");

//   // =====================================================
//   // SELECTED MONTH
//   // =====================================================

//   const currentDate = useMemo(
//     () => new Date(),
//     [],
//   );

//   const currentMonth = currentDate.toLocaleString(
//     "en-US",
//     {
//       month: "short",
//     },
//   );

//   const currentYear =
//     currentDate.getFullYear();

//   const [selectedMonth, setSelectedMonth] =
//     useState(
//       `${currentMonth}/${currentYear}`,
//     );

//   // =====================================================
//   // ATTENDANCE FILTER VALUES
//   // =====================================================

//   const [assignedShift, setAssignedShift] =
//     useState("");

//   const [workedShift, setWorkedShift] =
//     useState("");

//   const [assignedPolicy, setAssignedPolicy] =
//     useState("");

//   const [assignedPattern, setAssignedPattern] =
//     useState("");

//   // =====================================================
//   // SELECTED DATE
//   // =====================================================

//   const [selectedDate, setSelectedDate] =
//     useState(
//       currentDate.getDate(),
//     );

//   // =====================================================
//   // PUNCH TAB
//   // =====================================================

//   const [punchTab, setPunchTab] =
//     useState<PunchTab>("raw");

//   // =====================================================
//   // TOASTS
//   // =====================================================

//   const [toasts, setToasts] =
//     useState<Toast[]>([]);

//   // =====================================================
//   // PROCESSING STATE
//   // =====================================================
//   // These are currently local UI states.
//   // They should be connected to an API when the
//   // attendance processing API is available.

//   const [processed, setProcessed] =
//     useState(false);

//   const [processedAt, setProcessedAt] =
//     useState<string | null>(null);

//   const [processMenuOpen, setProcessMenuOpen] =
//     useState(false);

//   // =====================================================
//   // OVERVIEW DETAIL MODAL
//   // =====================================================

//   const [activeDetailModal, setActiveDetailModal] =
//     useState<OverviewDetailKey | null>(null);

//   // =====================================================
//   // MONTH / YEAR
//   // =====================================================

//   const [monthLabel, monthYear] =
//     selectedMonth.split("/");

//   const selectedMonthNumber = useMemo(() => {
//     const date = new Date(
//       `${monthLabel} 1, ${monthYear}`,
//     );

//     const month = date.getMonth() + 1;

//     return Number.isInteger(month) &&
//       month >= 1 &&
//       month <= 12
//       ? month
//       : currentDate.getMonth() + 1;
//   }, [
//     monthLabel,
//     monthYear,
//     currentDate,
//   ]);

//   const selectedYear =
//     Number(monthYear) ||
//     currentDate.getFullYear();

//   // =====================================================
//   // ATTENDANCE API
//   // =====================================================

//   const {
//     attendance,
//     overview,
//     punchRecords,
//     loading,
//     error,
//     loadPunchDetails,
//     loadRawPunches,
//   } = useAttendance({
//     employeeId:
//       selectedEmployee?.id ?? "",

//     month: selectedMonthNumber,

//     year: selectedYear,

//     /*
//      * classificationId must come from the employee/API data.
//      * It should NOT be hardcoded here.
//      *
//      * This will be connected after the reporting employee
//      * response/type exposes ClassificationId.
//      */
//     classificationId:
//       Number(
//         selectedEmployee?.classificationId,
//       ) || 0,
//   });

//   // =====================================================
//   // PUNCH RECORDS
//   // =====================================================

//   const rawPunches = useMemo(
//     () =>
//       punchRecords.map((punch) => ({
//         time:
//           punch.time ??
//           punch.punchTime ??
//           "",

//         type:
//           (punch.type ??
//             punch.punchType) as
//             | "In"
//             | "Out",

//         source:
//           punch.source ??
//           punch.punchSource ??
//           "",
//       })),
//     [punchRecords],
//   );

//   // =====================================================
//   // NORMALIZED ATTENDANCE
//   // =====================================================

//   const days = useMemo(
//     () =>
//       normalizeAttendanceRows(
//         attendance,
//         selectedYear,
//         selectedMonthNumber,
//       ),
//     [
//       attendance,
//       selectedYear,
//       selectedMonthNumber,
//     ],
//   );

//   // =====================================================
//   // OVERVIEW STATS
//   // =====================================================

//   const overviewStats = useMemo(
//     () =>
//       getOverviewStats(
//         overview,
//         days,
//       ),
//     [overview, days],
//   );

//   // =====================================================
//   // ACTIVE DAY
//   // =====================================================

//   const activeDay =
//     days.find(
//       (day) =>
//         day.date === selectedDate,
//     ) ?? days[0];

//   // =====================================================
//   // KEEP SELECTED DATE VALID
//   // =====================================================

//   useEffect(() => {
//     if (
//       days.length > 0 &&
//       !days.some(
//         (day) =>
//           day.date === selectedDate,
//       )
//     ) {
//       setSelectedDate(days[0].date);
//     }
//   }, [
//     days,
//     selectedDate,
//   ]);

//   // =====================================================
//   // TOAST
//   // =====================================================

//   const pushToast = useCallback(
//     (
//       message: string,
//       tone: Toast["tone"] = "info",
//     ) => {
//       const id =
//         Date.now() +
//         Math.random();

//       setToasts((current) => [
//         ...current,
//         {
//           id,
//           message,
//           tone,
//         },
//       ]);

//       window.setTimeout(() => {
//         setToasts((current) =>
//           current.filter(
//             (item) =>
//               item.id !== id,
//           ),
//         );
//       }, 3200);
//     },
//     [],
//   );

//   // =====================================================
//   // PROCESS ATTENDANCE
//   // =====================================================
//   // Temporary local UI behavior.
//   // Replace with API mutation once processing API is provided.

//   const handleProcessClick =
//     useCallback(() => {
//       if (!processed) {
//         setProcessed(true);

//         setProcessedAt(
//           new Date().toLocaleString(),
//         );

//         pushToast(
//           "Attendance processed successfully.",
//           "success",
//         );
//       } else {
//         setProcessMenuOpen(
//           (value) => !value,
//         );
//       }
//     }, [
//       processed,
//       pushToast,
//     ]);

//   // =====================================================
//   // REPROCESS
//   // =====================================================

//   const handleReprocess =
//     useCallback(() => {
//       setProcessedAt(
//         new Date().toLocaleString(),
//       );

//       setProcessMenuOpen(false);

//       pushToast(
//         "Attendance re-processed successfully.",
//         "success",
//       );
//     }, [pushToast]);

//   // =====================================================
//   // UNDO PROCESS
//   // =====================================================

//   const handleUndoProcess =
//     useCallback(() => {
//       setProcessed(false);
//       setProcessedAt(null);
//       setProcessMenuOpen(false);

//       pushToast(
//         "Attendance processing undone.",
//         "info",
//       );
//     }, [pushToast]);

//   // =====================================================
//   // EXPORT
//   // =====================================================

//   const handleExport =
//     useCallback(() => {
//       try {
//         const header =
//           "Date,Day,Shift,Status,Check In,Check Out,Gross Work Hours,Work Hours,Break Hours";

//         const rows = days.map(
//           (day) =>
//             [
//               day.date,
//               day.day,
//               day.shift,
//               day.status,
//               day.checkIn ?? "",
//               day.checkOut ?? "",
//               day.grossWorkHours ?? "",
//               day.workHours ?? "",
//               day.breakHours ?? "",
//             ].join(","),
//         );

//         const csv = [
//           header,
//           ...rows,
//         ].join("\n");

//         const blob =
//           new Blob([csv], {
//             type: "text/csv;charset=utf-8;",
//           });

//         const url =
//           URL.createObjectURL(
//             blob,
//           );

//         const anchor =
//           document.createElement(
//             "a",
//           );

//         anchor.href = url;

//         anchor.download =
//           `attendance_${
//             selectedEmployee?.id ?? ""
//           }_${selectedMonth.replace(
//             "/",
//             "-",
//           )}.csv`;

//         document.body.appendChild(
//           anchor,
//         );

//         anchor.click();

//         document.body.removeChild(
//           anchor,
//         );

//         window.setTimeout(() => {
//           URL.revokeObjectURL(
//             url,
//           );
//         }, 5000);

//         pushToast(
//           "Attendance exported successfully.",
//           "success",
//         );
//       } catch (exportError) {
//         console.error(
//           "CSV export failed:",
//           exportError,
//         );

//         pushToast(
//           "Export failed.",
//           "info",
//         );
//       }
//     }, [
//       days,
//       pushToast,
//       selectedEmployee?.id,
//       selectedMonth,
//     ]);

//   // =====================================================
//   // SELECT DATE
//   // =====================================================

//   const selectDate =
//     useCallback(
//       (date: number) => {
//         setSelectedDate(date);
//       },
//       [],
//     );

//   // =====================================================
//   // SELECT EMPLOYEE
//   // =====================================================

//   const selectEmployee =
//     useCallback(
//       (employee: Employee) => {
//         setSelectedEmployee(
//           employee,
//         );

//         setSelectedDate(
//           currentDate.getDate(),
//         );
//       },
//       [currentDate],
//     );

//   // =====================================================
//   // DETAIL MODAL
//   // =====================================================

//   const openDetailModal =
//     useCallback(
//       (key: OverviewDetailKey) => {
//         setActiveDetailModal(
//           key,
//         );
//       },
//       [],
//     );

//   const closeDetailModal =
//     useCallback(() => {
//       setActiveDetailModal(null);
//     }, []);

//   // =====================================================
//   // LOAD SELECTED DAY PUNCHES
//   // =====================================================

//   const loadSelectedDayPunches =
//     useCallback(
//       async () => {
//         if (!activeDay) {
//           return;
//         }

//         const date =
//           `${selectedYear}-${String(
//             selectedMonthNumber,
//           ).padStart(
//             2,
//             "0",
//           )}-${String(
//             activeDay.date,
//           ).padStart(
//             2,
//             "0",
//           )}`;

//         try {
//           await loadPunchDetails(
//             date,
//           );

//           await loadRawPunches(
//             date,
//           );
//         } catch (punchError) {
//           console.error(
//             "Failed to load punch details:",
//             punchError,
//           );
//         }
//       },
//       [
//         activeDay,
//         selectedYear,
//         selectedMonthNumber,
//         loadPunchDetails,
//         loadRawPunches,
//       ],
//     );

//   // =====================================================
//   // RETURN
//   // =====================================================

//   return {
//     view,
//     setView,

//     selectedMonth,
//     setSelectedMonth,

//     employees:
//       employeeOptions,

//     selectedEmployee,
//     selectEmployee,

//     reportingEmployeesLoading,
//     reportingEmployeesError,

//     selectedMonthNumber,
//     selectedYear,

//     assignedShift,
//     setAssignedShift,

//     workedShift,
//     setWorkedShift,

//     assignedPolicy,
//     setAssignedPolicy,

//     assignedPattern,
//     setAssignedPattern,

//     selectedDate,
//     setSelectedDate:
//       selectDate,

//     punchTab,
//     setPunchTab,

//     days,
//     activeDay,

//     overview,
//     overviewStats,

//     loading,
//     error,

//     toasts,
//     setToasts,
//     pushToast,

//     processed,
//     processedAt,

//     processMenuOpen,
//     setProcessMenuOpen,

//     activeDetailModal,
//     openDetailModal,
//     closeDetailModal,

//     handleProcessClick,
//     handleReprocess,
//     handleUndoProcess,
//     handleExport,

//     loadSelectedDayPunches,

//     rawPunches,
//   };
// }

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAttendance } from "./useRegularization";
import { useGetAttendanceOverviewEmployeesQuery } from "../api/regularizationApi";

import type {
  AttendanceView,
  OverviewDetailKey,
  PunchTab,
  Toast,
} from "../types/attendanceOverview.types";

import type { Employee } from "../types/regularization.types";

import {
  getOverviewStats,
  normalizeAttendanceRows,
} from "../validations/regularization.validations";


type AttendanceRow = Record<string, unknown>;

const getAttendanceStatus = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "-";
  }

  const status = String(value).trim().toUpperCase();

  if (!status) return "-";

  // Keep the backend attendance codes exactly as they are.
  // P = Present, AB = Absent, H/HD = Holiday, WO = Week Off.
  if (
    status === "P" ||
    status === "AB" ||
    status === "A" ||
    status === "H" ||
    status === "HD" ||
    status === "WO" ||
    status === "W" ||
    status === "LV" ||
    status === "LOP"
  ) {
    return status;
  }

  // Backend may return descriptive values.
  if (status === "PRESENT") return "P";
  if (status === "ABSENT") return "AB";
  if (status === "HOLIDAY") return "H";
  if (status === "WEEK OFF" || status === "WEEK-OFF") return "WO";

  return status;
};

const extractStatusByDay = (
  source: unknown,
): Record<number, string> => {
  const result: Record<number, string> = {};

  const records: unknown[] = Array.isArray(source)
    ? source
    : source && typeof source === "object"
      ? [source]
      : [];

  for (const item of records) {
    if (!item || typeof item !== "object") continue;

    const row = item as AttendanceRow;

    const metricName = String(
      row.MetricName ??
        row.metricName ??
        row.Metric ??
        row.metric ??
        row.Name ??
        row.name ??
        "",
    )
      .trim()
      .toLowerCase();

    const isWorkStatusRow =
      metricName === "work status" ||
      metricName === "status" ||
      metricName.includes("workstatus") ||
      metricName.includes("attendance");

    if (isWorkStatusRow) {
      for (let day = 1; day <= 31; day += 1) {
        const value =
          row[`Day${day}`] ??
          row[`day${day}`];

        if (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
        ) {
          result[day] = getAttendanceStatus(value);
        }
      }
    }

    // Also support responses such as:
    // { Day: 1, Status: "P" }
    // { day: 2, WorkStatus: "AB" }
    const dayValue =
      row.Day ??
      row.day ??
      row.DayNumber ??
      row.dayNumber;

    const statusValue =
      row.Status ??
      row.status ??
      row.WorkStatus ??
      row.workStatus ??
      row.AttendanceStatus ??
      row.attendanceStatus;

    const dayNumber = Number(dayValue);

    if (
      Number.isInteger(dayNumber) &&
      dayNumber >= 1 &&
      dayNumber <= 31 &&
      statusValue !== undefined &&
      statusValue !== null
    ) {
      result[dayNumber] =
        getAttendanceStatus(statusValue);
    }

    // Also support overview keys such as:
    // "1 Tue": "P", "2 Wed": "AB", "6 Sun": "WO".
    for (const [key, value] of Object.entries(row)) {
      const match = key.match(/^(\d{1,2})(?:\s|$)/);

      if (!match) continue;

      const dayNumberFromKey = Number(match[1]);

      if (
        dayNumberFromKey >= 1 &&
        dayNumberFromKey <= 31 &&
        value !== undefined &&
        value !== null
      ) {
        const normalized =
          getAttendanceStatus(value);

        if (normalized !== "-") {
          result[dayNumberFromKey] =
            normalized;
        }
      }
    }
  }

  return result;
};

export function useAttendanceOverview() {
  // =====================================================
  // REPORTING EMPLOYEES
  // =====================================================

  const {
    data: reportingEmployees = [],
    isLoading: reportingEmployeesLoading,
    error: reportingEmployeesError,
  } = useGetAttendanceOverviewEmployeesQuery();

  const employeeOptions = useMemo<Employee[]>(
    () =>
      reportingEmployees.map((employee) => {
        const rawClassId =
          employee.ClassificationId ?? employee.classificationId;
        const classificationId =
          rawClassId !== undefined && rawClassId !== null && rawClassId !== ""
            ? Number(rawClassId)
            : undefined;

        return {
          id: employee.EmployeeID,
          name: employee.EmployeeName,
          ...(Number.isFinite(classificationId) && classificationId! > 0
            ? { classificationId }
            : {}),
        };
      }),
    [reportingEmployees],
  );

  // =====================================================
  // SELECTED EMPLOYEE
  // =====================================================

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  useEffect(() => {
    if (
      employeeOptions.length > 0 &&
      !selectedEmployee
    ) {
      setSelectedEmployee(employeeOptions[0]);
    }
  }, [employeeOptions, selectedEmployee]);

  // =====================================================
  // ATTENDANCE VIEW
  // =====================================================

  const [view, setView] =
    useState<AttendanceView>("list");

  // =====================================================
  // SELECTED MONTH
  // =====================================================

  const currentDate = useMemo(
    () => new Date(),
    [],
  );

  const currentMonth = currentDate.toLocaleString(
    "en-US",
    {
      month: "short",
    },
  );

  const currentYear =
    currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] =
    useState(
      `${currentMonth}/${currentYear}`,
    );

  // =====================================================
  // ATTENDANCE FILTER VALUES
  // =====================================================

  const [assignedShift, setAssignedShift] =
    useState("");

  const [workedShift, setWorkedShift] =
    useState("");

  const [assignedPolicy, setAssignedPolicy] =
    useState("");

  const [assignedPattern, setAssignedPattern] =
    useState("");

  // =====================================================
  // SELECTED DATE
  // =====================================================

  const [selectedDate, setSelectedDate] =
    useState(
      currentDate.getDate(),
    );

  // =====================================================
  // PUNCH TAB
  // =====================================================

  const [punchTab, setPunchTab] =
    useState<PunchTab>("raw");

  // =====================================================
  // TOASTS
  // =====================================================

  const [toasts, setToasts] =
    useState<Toast[]>([]);

  // =====================================================
  // PROCESSING STATE
  // =====================================================
  // These are currently local UI states.
  // They should be connected to an API when the
  // attendance processing API is available.

  const [processed, setProcessed] =
    useState(false);

  const [processedAt, setProcessedAt] =
    useState<string | null>(null);

  const [processMenuOpen, setProcessMenuOpen] =
    useState(false);

  // =====================================================
  // OVERVIEW DETAIL MODAL
  // =====================================================

  const [activeDetailModal, setActiveDetailModal] =
    useState<OverviewDetailKey | null>(null);

  // =====================================================
  // MONTH / YEAR
  // =====================================================

  const [monthLabel, monthYear] =
    selectedMonth.split("/");

  const selectedMonthNumber = useMemo(() => {
    const date = new Date(
      `${monthLabel} 1, ${monthYear}`,
    );

    const month = date.getMonth() + 1;

    return Number.isInteger(month) &&
      month >= 1 &&
      month <= 12
      ? month
      : currentDate.getMonth() + 1;
  }, [
    monthLabel,
    monthYear,
    currentDate,
  ]);

  const selectedYear =
    Number(monthYear) ||
    currentDate.getFullYear();

  // =====================================================
  // ATTENDANCE API
  // =====================================================

  const {
    attendance,
    overview: rawOverview,
    punchRecords,
    loading,
    error,
    loadPunchDetails,
    loadRawPunches,
  } = useAttendance({
    employeeId:
      selectedEmployee?.id ?? "",

    month: selectedMonthNumber,

    year: selectedYear,

    /*
     * classificationId must come from the employee/API data.
     * Prefer the value from reporting-employees when present.
     * Fall back to 0 only so the request is still issued
     * (some backends accept 0 / ignore the field).
     */
    classificationId: selectedEmployee?.classificationId,
  });

  // =====================================================
  // PUNCH RECORDS
  // =====================================================

    // =====================================================
  // PUNCH RECORDS
  // =====================================================

  const rawPunches = useMemo(
    () =>
      punchRecords.map((punch) => ({
        time: punch.time ?? "",
        type: (punch.type || "In") as "In" | "Out",
        source: punch.source ?? "",
      })),
    [punchRecords],
  );
  // =====================================================
  // NORMALIZED ATTENDANCE
  // =====================================================

  const days = useMemo(() => {
    const normalizedDays =
      normalizeAttendanceRows(
        attendance,
        selectedYear,
        selectedMonthNumber,
      );

    const statusByDay =
      extractStatusByDay(
        rawOverview,
      );

    const attendanceStatusByDay =
      extractStatusByDay(
        attendance,
      );

    const mergedStatusByDay = {
      ...statusByDay,
      ...attendanceStatusByDay,
    };

    return normalizedDays.map((day) => ({
      ...day,
      status:
        mergedStatusByDay[day.date] ??
        day.status,
    }));
  }, [
    attendance,
    rawOverview,
    selectedYear,
    selectedMonthNumber,
  ]);

  console.log("===== ATTENDANCE STATUS DEBUG =====");
  console.log("Raw attendance:", attendance);
  console.log("Raw overview:", rawOverview);
  console.log(
    "Final statuses:",
    days.map((day) => ({
      day: day.date,
      status: day.status,
    })),
  );
  console.log(
    "Present:",
    days.filter(
      (day) =>
        String(day.status).toUpperCase() === "P",
    ).length,
  );
  console.log(
    "Absent:",
    days.filter((day) => {
      const status =
        String(day.status).toUpperCase();
      return status === "AB" || status === "A";
    }).length,
  );
  console.log(
    "Holidays:",
    days.filter((day) => {
      const status =
        String(day.status).toUpperCase();
      return status === "H" || status === "HD";
    }).length,
  );
  console.log("===================================");

  // =====================================================
  // RESOLVE OVERVIEW TO THE SELECTED EMPLOYEE
  // =====================================================
  // Backend returns an array of employee calendar rows.
  // UI components expect a single employee object (or null).

  const overview = useMemo(() => {
    let base: any = null;

    if (!rawOverview) {
      base = null;
    } else if (Array.isArray(rawOverview)) {
      const metricRows = rawOverview.filter(
        (row) =>
          row &&
          typeof row === "object" &&
          "Classification" in row &&
          "Value" in row,
      ) as Array<Record<string, unknown>>;

      if (metricRows.length > 0) {
        base = metricRows.reduce<Record<string, unknown>>(
          (summary, row) => {
            const classification = String(row.Classification ?? "")
              .trim()
              .toLowerCase()
              .replace(/[^a-z]/g, "");
            const keyByClassification: Record<string, string> = {
              totalhours: "totalHours",
              avghoursperday: "averageHoursPerDay",
              averagehoursperday: "averageHoursPerDay",
              othours: "overtimeHours",
              presentdays: "presentDays",
              absentdays: "absentDays",
              earlyin: "earlyIn",
              latein: "lateIn",
              earlyout: "earlyOut",
              overstay: "overstay",
            };
            const key = keyByClassification[classification];
            const [amount, total] = String(row.Value ?? "")
              .split("/")
              .map((part) => part.trim());
            const numericAmount = Number(amount);
            const numericTotal = Number(total);

            if (key) {
              summary[key] = Number.isFinite(numericAmount)
                ? numericAmount
                : amount;
            }

            if (Number.isFinite(numericTotal)) {
              summary.totalDays = numericTotal;
            }

            return summary;
          },
          {},
        );
      } else if (!selectedEmployee?.id) {
        base = rawOverview[0] ?? null;
      } else {
        const match = rawOverview.find(
          (row: { EmployeeID?: string | number }) =>
            String(row?.EmployeeID ?? "") ===
            String(selectedEmployee.id),
        );
        base = match ?? rawOverview[0] ?? null;
      }
    } else {
      base = rawOverview;
    }

    // Enrich with simple aggregates from normalized days when
    // the overview payload does not already carry totals.
    // This keeps Monthly Overview cards from staying at 0.00
    // when only the metric-style daily rows are present.
    if (base && days.length > 0) {
      const hasTotalHours =
        base.totalHours != null ||
        base.TotalHours != null ||
        base.total_hours != null ||
        base.totalWorkHours != null;

      if (!hasTotalHours) {
        // Sum workHours / grossWorkHours that look like HH:MM or numbers
        let totalMinutes = 0;
        for (const d of days) {
          const raw =
            d.workHours || d.grossWorkHours || "";
          if (!raw) continue;
          const str = String(raw).trim();
          if (str.includes(":")) {
            const [h, m] = str.split(":").map(Number);
            if (Number.isFinite(h) && Number.isFinite(m)) {
              totalMinutes += h * 60 + m;
            }
          } else {
            const n = Number(str);
            if (Number.isFinite(n)) totalMinutes += n * 60;
          }
        }
        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        base = {
          ...base,
          totalHours: `${hrs}.${String(mins).padStart(2, "0")}`,
          TotalHours: `${hrs}.${String(mins).padStart(2, "0")}`,
        };
      }
    }

    return base;
  }, [rawOverview, selectedEmployee?.id, days]);

  // =====================================================
  // OVERVIEW STATS
  // =====================================================

  const overviewStats = useMemo(
    () =>
      getOverviewStats(
        overview,
        days,
      ),
    [overview, days],
  );

  // =====================================================
  // ACTIVE DAY
  // =====================================================

  const activeDay =
    days.find(
      (day) =>
        day.date === selectedDate,
    ) ?? days[0];

  // =====================================================
  // KEEP SELECTED DATE VALID
  // =====================================================

  useEffect(() => {
    if (
      days.length > 0 &&
      !days.some(
        (day) =>
          day.date === selectedDate,
      )
    ) {
      setSelectedDate(days[0].date);
    }
  }, [
    days,
    selectedDate,
  ]);

  // =====================================================
  // TOAST
  // =====================================================

  const pushToast = useCallback(
    (
      message: string,
      tone: Toast["tone"] = "info",
    ) => {
      const id =
        Date.now() +
        Math.random();

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          tone,
        },
      ]);

      window.setTimeout(() => {
        setToasts((current) =>
          current.filter(
            (item) =>
              item.id !== id,
          ),
        );
      }, 3200);
    },
    [],
  );

  // =====================================================
  // PROCESS ATTENDANCE
  // =====================================================
  // Temporary local UI behavior.
  // Replace with API mutation once processing API is provided.

  const handleProcessClick =
    useCallback(() => {
      if (!processed) {
        setProcessed(true);

        setProcessedAt(
          new Date().toLocaleString(),
        );

        pushToast(
          "Attendance processed successfully.",
          "success",
        );
      } else {
        setProcessMenuOpen(
          (value) => !value,
        );
      }
    }, [
      processed,
      pushToast,
    ]);

  // =====================================================
  // REPROCESS
  // =====================================================

  const handleReprocess =
    useCallback(() => {
      setProcessedAt(
        new Date().toLocaleString(),
      );

      setProcessMenuOpen(false);

      pushToast(
        "Attendance re-processed successfully.",
        "success",
      );
    }, [pushToast]);

  // =====================================================
  // UNDO PROCESS
  // =====================================================

  const handleUndoProcess =
    useCallback(() => {
      setProcessed(false);
      setProcessedAt(null);
      setProcessMenuOpen(false);

      pushToast(
        "Attendance processing undone.",
        "info",
      );
    }, [pushToast]);

  // =====================================================
  // EXPORT
  // =====================================================

  const handleExport =
    useCallback(() => {
      try {
        const header =
          "Date,Day,Shift,Status,Check In,Check Out,Gross Work Hours,Work Hours,Break Hours";

        const rows = days.map(
          (day) =>
            [
              day.date,
              day.day,
              day.shift,
              day.status,
              day.checkIn ?? "",
              day.checkOut ?? "",
              day.grossWorkHours ?? "",
              day.workHours ?? "",
              day.breakHours ?? "",
            ].join(","),
        );

        const csv = [
          header,
          ...rows,
        ].join("\n");

        const blob =
          new Blob([csv], {
            type: "text/csv;charset=utf-8;",
          });

        const url =
          URL.createObjectURL(
            blob,
          );

        const anchor =
          document.createElement(
            "a",
          );

        anchor.href = url;

        anchor.download =
          `attendance_${
            selectedEmployee?.id ?? ""
          }_${selectedMonth.replace(
            "/",
            "-",
          )}.csv`;

        document.body.appendChild(
          anchor,
        );

        anchor.click();

        document.body.removeChild(
          anchor,
        );

        window.setTimeout(() => {
          URL.revokeObjectURL(
            url,
          );
        }, 5000);

        pushToast(
          "Attendance exported successfully.",
          "success",
        );
      } catch (exportError) {
        console.error(
          "CSV export failed:",
          exportError,
        );

        pushToast(
          "Export failed.",
          "info",
        );
      }
    }, [
      days,
      pushToast,
      selectedEmployee?.id,
      selectedMonth,
    ]);

  // =====================================================
  // SELECT DATE
  // =====================================================

  const selectDate =
    useCallback(
      (date: number) => {
        setSelectedDate(date);
      },
      [],
    );

  // =====================================================
  // SELECT EMPLOYEE
  // =====================================================

  const selectEmployee =
    useCallback(
      (employee: Employee) => {
        setSelectedEmployee(
          employee,
        );

        setSelectedDate(
          currentDate.getDate(),
        );
      },
      [currentDate],
    );

  // =====================================================
  // DETAIL MODAL
  // =====================================================

  const openDetailModal =
    useCallback(
      (key: OverviewDetailKey) => {
        setActiveDetailModal(
          key,
        );
      },
      [],
    );

  const closeDetailModal =
    useCallback(() => {
      setActiveDetailModal(null);
    }, []);

  // =====================================================
  // LOAD SELECTED DAY PUNCHES
  // =====================================================

  const loadSelectedDayPunches =
    useCallback(
      async () => {
        if (!activeDay) {
          return;
        }

        const date =
          `${selectedYear}-${String(
            selectedMonthNumber,
          ).padStart(
            2,
            "0",
          )}-${String(
            activeDay.date,
          ).padStart(
            2,
            "0",
          )}`;

        try {
          await loadPunchDetails(
            date,
          );

          await loadRawPunches(
            date,
          );
        } catch (punchError) {
          console.error(
            "Failed to load punch details:",
            punchError,
          );
        }
      },
      [
        activeDay,
        selectedYear,
        selectedMonthNumber,
        loadPunchDetails,
        loadRawPunches,
      ],
    );

  // =====================================================
  // RETURN
  // =====================================================

  return {
    view,
    setView,

    selectedMonth,
    setSelectedMonth,

    employees:
      employeeOptions,

    selectedEmployee,
    selectEmployee,

    reportingEmployeesLoading,
    reportingEmployeesError,

    selectedMonthNumber,
    selectedYear,

    assignedShift,
    setAssignedShift,

    workedShift,
    setWorkedShift,

    assignedPolicy,
    setAssignedPolicy,

    assignedPattern,
    setAssignedPattern,

    selectedDate,
    setSelectedDate:
      selectDate,

    punchTab,
    setPunchTab,

    days,
    activeDay,

    overview,
    overviewStats,

    loading,
    error,

    toasts,
    setToasts,
    pushToast,

    processed,
    processedAt,

    processMenuOpen,
    setProcessMenuOpen,

    activeDetailModal,
    openDetailModal,
    closeDetailModal,

    handleProcessClick,
    handleReprocess,
    handleUndoProcess,
    handleExport,

    loadSelectedDayPunches,

    rawPunches,
  };
}
