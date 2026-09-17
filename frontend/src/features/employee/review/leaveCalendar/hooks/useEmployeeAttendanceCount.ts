import { useGetEmployeeAttendanceCountQuery } from "../api/leaveCalendarApi";

import type {
  GetEmployeeAttendanceCountParams,
} from "../types/leavecalendar.types";

export const useEmployeeAttendanceCount = ({
  year,
  month,
  branchId,
}: GetEmployeeAttendanceCountParams) => {
  return useGetEmployeeAttendanceCountQuery(
    {
      year,
      month,
      branchId,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
};