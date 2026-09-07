
import { useMemo } from "react";
import {
  useGetHolidayListQuery,
  useGetLeaveBalanceQuery,
  useGetLeaveHistoryQuery,
  useGetLeaveStatusQuery,
  useGetLeaveTypesQuery,
} from "../api/leaveApi";
 
export const useLeave = () => {
  const leaveTypesQuery = useGetLeaveTypesQuery();
  const holidayListQuery = useGetHolidayListQuery();
  const leaveStatusQuery = useGetLeaveStatusQuery();
  const leaveHistoryQuery = useGetLeaveHistoryQuery();
  const leaveBalanceQuery = useGetLeaveBalanceQuery();
 
  const holidays = useMemo(
    () => (Array.isArray(holidayListQuery.data) ? holidayListQuery.data : []),
    [holidayListQuery.data]
  );
 
  const holidayDates = useMemo(
    () =>
      new Map(
        holidays.map((holiday) => [
          holiday.HolidayDate.slice(0, 10),
          { name: holiday.HolidayName, isOptional: holiday.IsOptional },
        ])
      ),
    [holidays]
  );
 
  // ---- DEBUG LOGGING ----
  console.log("=== useLeave DEBUG ===");
  console.log("BALANCE RAW DATA:", leaveBalanceQuery.data);
  console.log("BALANCE STATUS:", leaveBalanceQuery.status);
  console.log("BALANCE isLoading:", leaveBalanceQuery.isLoading);
  console.log("BALANCE isFetching:", leaveBalanceQuery.isFetching);
  console.log("BALANCE isSuccess:", leaveBalanceQuery.isSuccess);
  console.log("BALANCE ERROR:", leaveBalanceQuery.error);
  console.log("BALANCE SECTIONS:", leaveBalanceQuery.data?.sections);
 
  const leaveBalance =
    leaveBalanceQuery.data?.sections?.find(
      (section) => section.title?.trim().toLowerCase() === "leave balance"
    ) ?? null;
 
  console.log("LEAVE BALANCE (matched section):", leaveBalance);
  // ---- END DEBUG LOGGING ----
 
  return {
    leaveTypes: Array.isArray(leaveTypesQuery.data) ? leaveTypesQuery.data : [],
    holidayList: holidays,
    holidayDates,
    leaveStatus: leaveStatusQuery.data?.LeaveApplications ?? [],
    leaveHistory:
      leaveHistoryQuery.data?.sections?.find(
        (section) => section.title === "Leave History"
      ) ?? null,
    leaveBalance,
 
    leaveTypesLoading: leaveTypesQuery.isLoading,
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
 
 