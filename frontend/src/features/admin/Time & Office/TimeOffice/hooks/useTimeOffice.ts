import { useMemo, useState } from "react";
import { PUNCH_TILES_BY_PERIOD } from "../constants/timeoffice.constants";
import {
  mergeHours,
  useGetAttendanceOverviewQuery,
  useGetAverageOtHoursQuery,
  useGetAverageWorkingHoursQuery,
  useGetDashboardEmployeesQuery,
  useGetTimeOfficeDashboardSummaryQuery,
  useGetIrregularitiesQuery,
  useGetAttendancePolicyShiftsQuery,
  useGetPunchModeDistributionQuery,
} from "../api/timeofficeApi";
import { toRow, applyFilters, paginate } from "./punchMetrics";
import type {
  IrregularityClassification,
  PunchFilters,
  PunchMetric,
  PunchPeriod,
  PunchRow,
  PolicySummary,
  ShiftSummary,
} from "../types/timeoffice.types";

const asPolicySummary = (rows: PolicySummary[]): PolicySummary[] => rows;

const formatSelectedDate = (value?: string) => {
  if (!value) {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const getErrorText = (error: unknown) => {
  if (!error || typeof error !== "object") return "";
  const record = error as Record<string, unknown>;
  const data = record.data && typeof record.data === "object"
    ? record.data as Record<string, unknown>
    : undefined;
  return String(data?.message ?? record.error ?? record.message ?? "Unable to load dashboard data.");
};

export const useTimeOffice = () => {
  const [period, setPeriod] = useState<PunchPeriod>("today");
  const [classification, setClassification] = useState<IrregularityClassification>("all");
  const [metric, setMetric] = useState<PunchMetric | null>(null);
  const [filters, setFilters] = useState<PunchFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const summaryQuery = useGetTimeOfficeDashboardSummaryQuery(period);
  const employeeTotalQuery = useGetTimeOfficeDashboardSummaryQuery("today");
  const employeesQuery = useGetDashboardEmployeesQuery(
    {
      metric: metric as PunchMetric,
      period,
      selectedDate: summaryQuery.data?.selectedDate,
    },
    { skip: !metric },
  );
  const overviewQuery = useGetAttendanceOverviewQuery();
  const punchModeQuery = useGetPunchModeDistributionQuery(period);
  const irregularitiesQuery = useGetIrregularitiesQuery(classification);
  const workHoursQuery = useGetAverageWorkingHoursQuery();
  const otHoursQuery = useGetAverageOtHoursQuery();
  const policyShiftsQuery = useGetAttendancePolicyShiftsQuery();

  const rows = useMemo<PunchRow[]>(() => [], []);
  const counts = useMemo(
    () => Object.fromEntries(
      PUNCH_TILES_BY_PERIOD[period].map((tile) => [tile, summaryQuery.data?.counts[tile] ?? 0]),
    ) as Record<PunchMetric, number>,
    [summaryQuery.data, period],
  );

  const punchModeDistribution = punchModeQuery.data ?? [];
  const irregularities = irregularitiesQuery.data ?? [];
  const workingHours = useMemo(
    () => mergeHours(workHoursQuery.data, otHoursQuery.data),
    [workHoursQuery.data, otHoursQuery.data],
  );

  const metricRows = useMemo(
    () => (employeesQuery.data ?? []).map(toRow),
    [employeesQuery.data],
  );
  const filteredRows = useMemo(
    () => applyFilters(metricRows, filters),
    [metricRows, filters],
  );
  const pagedRows = useMemo(
    () => paginate(filteredRows, page, pageSize),
    [filteredRows, page, pageSize],
  );

  const openMetric = (next: PunchMetric) => {
    setMetric(next);
    setFilters({});
    setPage(1);
  };
  const closeMetric = () => setMetric(null);
  const changePeriod = (next: PunchPeriod) => {
    setPeriod(next);
    setMetric(null);
  };
  const updateFilters = (next: PunchFilters) => {
    setFilters((previous) => ({ ...previous, ...next }));
    setPage(1);
  };
  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };
  const changePageSize = (next: number) => {
    setPageSize(next);
    setPage(1);
  };

  const dashboardQueries = [
    summaryQuery,
    overviewQuery,
    punchModeQuery,
    irregularitiesQuery,
    workHoursQuery,
    otHoursQuery,
    policyShiftsQuery,
  ];
  const errorQuery = dashboardQueries.find((query) => query.isError);
  const hasDashboardData = dashboardQueries.some((query) => query.data !== undefined);

  const policies = asPolicySummary(policyShiftsQuery.data?.attendancePolicies ?? []);
  const shifts: ShiftSummary[] = (policyShiftsQuery.data?.shifts ?? []).map((shift) => ({
    name: shift.shiftName || shift.shiftCode,
    timing: [shift.startTime, shift.endTime].filter(Boolean).join(" - "),
  }));

  return {
    period,
    changePeriod,
    classification,
    setClassification,
    metric,
    openMetric,
    closeMetric,
    filters,
    updateFilters,
    clearFilters,
    page,
    setPage,
    pageSize,
    changePageSize,
    rows,
    metricRows,
    filteredRows,
    pagedRows,
    counts,
    totalEmployees:
      employeeTotalQuery.data?.totalEmployees ?? summaryQuery.data?.totalEmployees ?? 0,
    latestPunchIntegratedAt: summaryQuery.data?.latestPunchIntegratedAt ?? "—",
    todayLabel: formatSelectedDate(summaryQuery.data?.selectedDate),
    attendanceOverview: overviewQuery.data ?? [],
    punchModeDistribution,
    irregularities,
    workingHours,
    policies,
    shifts,
    pendingRequests: [],
    isMetricLoading: employeesQuery.isLoading || employeesQuery.isFetching,
    metricErrorMessage: employeesQuery.isError ? getErrorText(employeesQuery.error) : "",
    isLoading: dashboardQueries.some((query) => query.isLoading),
    isError: Boolean(errorQuery),
    errorMessage: errorQuery ? getErrorText(errorQuery.error) : "",
    hasDashboardData,
  };
};
