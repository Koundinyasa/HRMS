import { useGetDashboardSummaryQuery } from '../api/dashboardApi';

export const useDashboard = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDashboardSummaryQuery();

  return {
    data,
    welcome:             data?.welcome,
    menus:               data?.menus              ?? [],
    summary:             data?.summary,
    departmentWiseCount: data?.departmentWiseCount ?? [],
    genderWiseCount:     data?.genderWiseCount     ?? [],
    ageGroupWiseCount:   data?.ageGroupWiseCount   ?? [],
    upcomingEvents:      data?.upcomingEvents      ?? [],
    team:                data?.team                ?? [],
    avgTenure:           data?.avgTenure            ?? '—',
    AgeRangeDatum:       data?.AgeRangeDatum       ?? [],
    DeptDatum:           data?.DeptDatum           ?? [],
    TenureDatum:         data?.TenureDatum         ?? [],
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};