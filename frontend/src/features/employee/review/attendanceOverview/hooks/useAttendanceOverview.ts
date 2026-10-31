import {
  useCallback,
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

import { buildOverview } from "../utils/buildOverview";
import { downloadAttendanceCsv } from "../utils/downloadAttendanceCsv";
import { extractStatusByDay } from "../utils/attendanceStatus";

import {
  getOverviewStats,
  normalizeAttendanceRows,
} from "../validations/regularization.validations";


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

  const [selectedDateState, setSelectedDate] =
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
  const selectedDate = days.some(
    (day) => day.date === selectedDateState,
  )
    ? selectedDateState
    : (days[0]?.date ?? selectedDateState);

  // =====================================================
  // RESOLVE OVERVIEW TO THE SELECTED EMPLOYEE
  // =====================================================
  // Backend returns an array of employee calendar rows.
  // UI components expect a single employee object (or null).

  const overview = useMemo(
    () => buildOverview(rawOverview, selectedEmployee?.id, days),
    [rawOverview, selectedEmployee?.id, days],
  );

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
  // EXPORT
  // =====================================================

  const handleExport =
    useCallback(() => {
      try {
        downloadAttendanceCsv(
          days,
          `attendance_${selectedEmployee?.id ?? ""}_${selectedMonth.replace("/", "-")}.csv`,
        );

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
      selectedEmployee,
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

    activeDetailModal,
    openDetailModal,
    closeDetailModal,

    handleExport,

    loadSelectedDayPunches,

    rawPunches,
  };
}
