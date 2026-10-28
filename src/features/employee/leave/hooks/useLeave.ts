import { useMemo } from "react";
import {
  useGetLeaveBalanceQuery,
  useGetLeaveHistoryQuery,
  useGetLeaveStatusQuery,
  useGetLeaveTypesQuery,
} from "../api/leaveApi";
// 🔴 CHANGED (1 of 3): use the dashboard holiday API (known shape: { success, data: [...] })
import { useGetHolidayListQuery } from "../../dashboard/api/dashboardApi";

export const useLeave = (employeeId?: string) => {
  const leaveTypesQuery = useGetLeaveTypesQuery(employeeId, {
    skip: employeeId === "",
  });
  const holidayListQuery = useGetHolidayListQuery(); // 🔴 CHANGED (2 of 3): was useGetLeaveHolidayListQuery()
  const leaveStatusQuery = useGetLeaveStatusQuery();
  const leaveHistoryQuery = useGetLeaveHistoryQuery();
  const leaveBalanceQuery = useGetLeaveBalanceQuery();

  // 🔴 CHANGED (3 of 3): the array is inside .data of the response
  const holidays = useMemo(
    () =>
      Array.isArray(holidayListQuery.data?.data)
        ? holidayListQuery.data.data
        : [],
    [holidayListQuery.data],
  );

  const holidayDates = useMemo(
    () =>
      new Map(
        holidays.map((holiday) => [
          holiday.HolidayDate.slice(0, 10),
          { name: holiday.HolidayName, isOptional: holiday.IsOptional },
        ]),
      ),
    [holidays],
  );

  // Holiday dates that must be blocked for leave (optional holidays are NOT blocked)
  const blockedHolidayIsos = useMemo(
    () =>
      new Set(
        holidays
          .filter((holiday) => !holiday.IsOptional)
          .map((holiday) => holiday.HolidayDate.slice(0, 10)),
      ),
    [holidays],
  );

  // ---- DEBUG LOGGING ----
  console.log("=== useLeave DEBUG ===");
  console.log("HOLIDAYS:", holidays, "BLOCKED:", [...blockedHolidayIsos]);
  console.log("BALANCE RAW DATA:", leaveBalanceQuery.data);
  console.log("BALANCE STATUS:", leaveBalanceQuery.status);
  console.log("BALANCE isLoading:", leaveBalanceQuery.isLoading);
  console.log("BALANCE isFetching:", leaveBalanceQuery.isFetching);
  console.log("BALANCE isSuccess:", leaveBalanceQuery.isSuccess);
  console.log("BALANCE ERROR:", leaveBalanceQuery.error);
  console.log("BALANCE SECTIONS:", leaveBalanceQuery.data?.sections);

  const leaveBalance =
    leaveBalanceQuery.data?.sections?.find(
      (section) => section.title?.trim().toLowerCase() === "leave balance",
    ) ?? null;

  console.log("LEAVE BALANCE (matched section):", leaveBalance);
  // ---- END DEBUG LOGGING ----

  return {
    leaveTypes: Array.isArray(leaveTypesQuery.currentData)
      ? leaveTypesQuery.currentData
      : [],
    holidayList: holidays,
    holidayDates,
    blockedHolidayIsos,
    leaveStatus: leaveStatusQuery.data?.LeaveApplications ?? [],
    leaveHistory:
      leaveHistoryQuery.data?.sections?.find(
        (section) => section.title === "Leave History",
      ) ?? null,
    leaveBalance,

    leaveTypesLoading: leaveTypesQuery.isLoading || leaveTypesQuery.isFetching,
    holidayLoading: holidayListQuery.isLoading,
    statusLoading: leaveStatusQuery.isLoading,
    historyLoading: leaveHistoryQuery.isLoading,
    balanceLoading: leaveBalanceQuery.isLoading || leaveBalanceQuery.isFetching,

    leaveTypesError: leaveTypesQuery.isError,
    holidayError: holidayListQuery.isError,
    statusError: leaveStatusQuery.isError,
    historyError: leaveHistoryQuery.isError,
    balanceError: leaveBalanceQuery.isError,

    refetchLeaveTypes: leaveTypesQuery.refetch,
    refetchHolidayList: holidayListQuery.refetch,
    refetchLeaveStatus: leaveStatusQuery.refetch,
    refetchLeaveHistory: leaveHistoryQuery.refetch,
    refetchLeaveBalance: leaveBalanceQuery.refetch,
  };
};
