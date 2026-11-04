
import { useGetReviewMonthlyLeaveCalendarQuery } from "../apis/leaveCalendarApi";
import type { UseMonthlyLeaveCalendarParams } from "../types/leavecalendar.types";

export const useMonthlyLeaveCalendar = ({
  companyId,
  year,
  month,
  branchId,
}: UseMonthlyLeaveCalendarParams) => {
  return useGetReviewMonthlyLeaveCalendarQuery(
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