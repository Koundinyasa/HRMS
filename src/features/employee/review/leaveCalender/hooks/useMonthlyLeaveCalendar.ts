
import { useGetMonthlyLeaveCalendarQuery } from "../apis/leaveCalendarApi";
import type { UseMonthlyLeaveCalendarParams } from "../types/leavecalendar.types";

export const useMonthlyLeaveCalendar = ({
  companyId,
  year,
  month,
  branchId,
}: UseMonthlyLeaveCalendarParams) => {
  return useGetMonthlyLeaveCalendarQuery(
    {
      companyId,
      year,
      month,
      branchId,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
};