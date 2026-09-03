import { useGetSalaryCalenderdaysQuery } from "../api/attendanceApi";

export const useSalaryCalenderDays = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetSalaryCalenderdaysQuery();
  return { salaryCalenderDays: data, isLoading, isFetching, isError, refetch };
};