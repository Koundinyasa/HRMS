import { useMemo } from "react";
import {
  useGetHolidayListQuery,
  useGetLeaveBalanceQuery,
  useGetLeaveHistoryQuery,
  useGetLeaveStatusQuery,
  useGetLeaveTypesQuery,
} from "../api/leaveApi";

// import { useGetHolidayListQuery as useDashboardHolidayList } from "../../dashboard/api/dashboardApi";

export const useLeave = () => {
  const leaveTypesQuery = useGetLeaveTypesQuery();

  const holidayListQuery =
    useGetHolidayListQuery();

  const leaveStatusQuery =
    useGetLeaveStatusQuery();
  

  const leaveHistoryQuery =
    useGetLeaveHistoryQuery();

  const leaveBalanceQuery =
    useGetLeaveBalanceQuery();

    const holidays = useMemo(
  () =>
    Array.isArray(holidayListQuery.data)
      ? holidayListQuery.data
      : [],
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

 return {
    // Data
    leaveTypes: leaveTypesQuery.data ?? [],
    holidayList: holidays,
    holidayDates,
    leaveStatus: leaveStatusQuery.data?.LeaveApplications ?? [],
    leaveHistory:
      leaveHistoryQuery.data?.sections.find(
        (section) => section.title === "Leave History"
      ) ?? null,
    leaveBalance:
      leaveBalanceQuery.data?.sections.find(
        (section) => section.title === "Leave Balance"
      ) ?? null,

    // Loading
    leaveTypesLoading:
      leaveTypesQuery.isLoading,

    holidayLoading:
      holidayListQuery.isLoading,

    statusLoading:
      leaveStatusQuery.isLoading,

    historyLoading:
      leaveHistoryQuery.isLoading,

    balanceLoading:
      leaveBalanceQuery.isLoading,

    // Error
    leaveTypesError:
      leaveTypesQuery.isError,

    holidayError:
      holidayListQuery.isError,

    statusError:
      leaveStatusQuery.isError,

    historyError:
      leaveHistoryQuery.isError,

    balanceError:
      leaveBalanceQuery.isError,

    // Refetch
    refetchLeaveTypes:
      leaveTypesQuery.refetch,

    refetchHolidayList:
      holidayListQuery.refetch,

    refetchLeaveStatus:
      leaveStatusQuery.refetch,

    refetchLeaveHistory:
      leaveHistoryQuery.refetch,

    refetchLeaveBalance:
      leaveBalanceQuery.refetch,
  };
};