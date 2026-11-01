
import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  usePostPpEmployeeRawPunchesMutation,
  useGetPpEmployeeAttendanceOverviewQuery,
  useGetPpEmployeeMonthlyAttendanceDetailsQuery,
} from "@/features/admin/Time & Office/TimeOffice/api/timeofficeApi";

import {
  useGetEmployeeMonthlyAttendanceDetailsQuery,
  useGetEmployeeAttendanceOverviewQuery,
  useLazyGetEmployeePunchDashboardQuery,
  useLazyGetEmployeeDailyRawPunchesQuery,
} from "../api/regularizationApi";

import type {
  AttendanceDay,
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
  adminMode = false,
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

  // Reporting managers read their reportees through /review; the admin
  // Time Office screen reads the whole company through the punchprocess
  // routes (the company comes from the login token on the server).
  const reviewAttendanceQuery =
    useGetEmployeeMonthlyAttendanceDetailsQuery(
      {
        employeeId,
        month,
        year,
        classificationId,
      },
      {
        skip: !validRequest || adminMode,
      },
    );

  const adminAttendanceQuery =
    useGetPpEmployeeMonthlyAttendanceDetailsQuery(
      {
        employeeId,
        month,
        year,
      },
      {
        skip: !validRequest || !adminMode,
      },
    );

  const attendanceQuery = adminMode
    ? adminAttendanceQuery
    : reviewAttendanceQuery;

  const attendanceData = useMemo(
    () => (attendanceQuery.data ?? []) as unknown as AttendanceDay[],
    [attendanceQuery.data],
  );
  const isAttendanceLoading = attendanceQuery.isLoading;
  const isAttendanceError = attendanceQuery.isError;
  const refetchAttendance = attendanceQuery.refetch;

  // =====================================================
  // ATTENDANCE OVERVIEW
  // =====================================================

  const reviewOverviewQuery =
    useGetEmployeeAttendanceOverviewQuery(
      {
        employeeId,
        month,
        year,
      },
      {
        skip: !validRequest || adminMode,
      },
    );

  const adminOverviewQuery =
    useGetPpEmployeeAttendanceOverviewQuery(
      {
        employeeId,
        month,
        year,
      },
      {
        skip: !validRequest || !adminMode,
      },
    );

  const overviewQuery = adminMode
    ? adminOverviewQuery
    : reviewOverviewQuery;

  const overviewData: unknown = overviewQuery.data;
  const isOverviewLoading = overviewQuery.isLoading;
  const isOverviewError = overviewQuery.isError;
  const refetchOverview = overviewQuery.refetch;

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

  const [
    postAdminRawPunches,
    { isLoading: isAdminRawPunchLoading },
  ] = usePostPpEmployeeRawPunchesMutation();

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
        // The punch dashboard is a reportee-only route; the admin screen
        // reads the day's raw punches instead (loadRawPunches).
        if (!validRequest || adminMode) {
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
        adminMode,
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

        if (adminMode) {
          const rows = await postAdminRawPunches({
            employeeId,
            date,
          }).unwrap();

          const records: PunchRecord[] = rows
            .map((item) => ({
              time: String(item.OriginalTime ?? ""),
              type: String(item.PunchType ?? ""),
              source: String(item.EntryType ?? ""),
            }))
            .filter(
              (item) => item.time || item.type || item.source,
            );

          setPunchRecords(records);
          return records;
        }

        return getRawPunches({
          employeeId,
          date,
        }).unwrap();
      },
      [
        adminMode,
        validRequest,
        employeeId,
        getRawPunches,
        postAdminRawPunches,
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
      isRawPunchLoading ||
      isAdminRawPunchLoading,

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