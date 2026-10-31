
import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  useGetEmployeeMonthlyAttendanceDetailsQuery,
  useGetEmployeeAttendanceOverviewQuery,
  useLazyGetEmployeePunchDashboardQuery,
  useLazyGetEmployeeDailyRawPunchesQuery,
} from "../api/regularizationApi";

import type {
  AttendanceOverviewData,
  PunchRecord,
  UseAttendanceProps,
} from "../types/regularization.types";

import {
  isValidEmployeeId,
  isValidMonth,
  isValidYear,
} from "../validations/regularization.validations";

export function useAttendance({
  employeeId,
  month,
  year,
  classificationId,
}: UseAttendanceProps) {
  const [punchRecords, setPunchRecords] =
    useState<PunchRecord[]>([]);

  // =====================================================
  // VALIDATE REQUEST
  // =====================================================

  const validRequest =
    isValidEmployeeId(employeeId) &&
    isValidMonth(month) &&
    isValidYear(year);

  // =====================================================
  // MONTHLY ATTENDANCE
  // =====================================================

  const {
    data: attendanceData = [],
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
    refetch: refetchAttendance,
  } = useGetEmployeeMonthlyAttendanceDetailsQuery(
    {
      employeeId: Number(employeeId),
      month,
      year,
      classificationId,
    },
    {
      skip: !validRequest,
    },
  );

  // =====================================================
  // ATTENDANCE OVERVIEW
  // =====================================================

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useGetEmployeeAttendanceOverviewQuery(
    {
      employeeId,
      month,
      year,
    },
    {
      skip: !validRequest,
    },
  );

  const overviewRows = useMemo(
    () =>
      Array.isArray(overviewData)
        ? (overviewData as AttendanceOverviewData[])
        : [],
    [overviewData],
  );

  // =====================================================
  // PUNCH DASHBOARD
  // =====================================================

  const [
    getPunchDashboard,
    { isLoading: isPunchLoading },
  ] = useLazyGetEmployeePunchDashboardQuery();

  // =====================================================
  // RAW PUNCHES
  // =====================================================

  const [
    getRawPunches,
    { isLoading: isRawPunchLoading },
  ] = useLazyGetEmployeeDailyRawPunchesQuery();

  // The two calls return their data under each other's names: the 31-day
  // grid (rows with MetricName and Day1..Day31) and the monthly summary
  // (rows with Classification and Value). Each one is picked by what it
  // contains, so the screen works whichever call returns which.
  const hasKeys = (data: unknown, ...keys: string[]) =>
    Array.isArray(data) &&
    data.some(
      (row) =>
        row &&
        typeof row === "object" &&
        keys.every((key) => key in (row as Record<string, unknown>)),
    );

  const gridData = [attendanceData, overviewData].find((data) =>
    hasKeys(data, "MetricName"),
  );
  const summaryData = [attendanceData, overviewData].find((data) =>
    hasKeys(data, "Classification", "Value"),
  );

  const attendance = validRequest
    ? ((gridData ?? attendanceData) as typeof attendanceData)
    : [];
  const overview = validRequest
    ? ((summaryData ?? overviewRows) as unknown as AttendanceOverviewData)
    : null;
  const error = !validRequest
    ? "Invalid employee or attendance selection."
    : isAttendanceError || isOverviewError
      ? "Failed to load attendance."
      : null;

  // =====================================================
  // RELOAD ATTENDANCE
  // =====================================================

  const loadAttendance =
    useCallback(async () => {
      if (validRequest) {
        await Promise.all([refetchAttendance(), refetchOverview()]);
      }
    }, [
      validRequest,
      refetchAttendance,
      refetchOverview,
    ]);

  // =====================================================
  // LOAD PUNCH DETAILS
  // =====================================================

  const loadPunchDetails =
    useCallback(
      async (selectedDate: string) => {
        if (!validRequest) {
          return {
            employeeProfile: [],
            attendanceSummary: [],
            punchRecords: [],
          };
        }

        const result =
          await getPunchDashboard({
            employeeId,
            selectedDate,
            viewType: "CustomMonth",
          }).unwrap();

        setPunchRecords(
          result?.punchRecords || [],
        );

        return result;
      },
      [
        validRequest,
        employeeId,
        getPunchDashboard,
      ],
    );

  // =====================================================
  // LOAD RAW PUNCHES
  // =====================================================

  const loadRawPunches =
    useCallback(
      async (date: string) => {
        if (!validRequest) {
          return [];
        }

        return getRawPunches({
          employeeId,
          date,
        }).unwrap();
      },
      [
        validRequest,
        employeeId,
        getRawPunches,
      ],
    );

  // =====================================================
  // RETURN
  // =====================================================

  return {
    attendance,
    overview,
    punchRecords,

    loading:
      isAttendanceLoading ||
      isOverviewLoading ||
      isPunchLoading ||
      isRawPunchLoading,

    isAttendanceLoading,
    isOverviewLoading,
    isPunchLoading,
    isRawPunchLoading,

    error,

    loadAttendance,
    loadPunchDetails,
    loadRawPunches,
  };
}