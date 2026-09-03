import { useMemo, useState } from "react";
import {
  ATTENDANCE_OVERVIEW,
  IRREGULARITIES,
  LATEST_PUNCH_INTEGRATED_AT,
  PENDING_REQUESTS,
  POLICIES,
  PUNCH_RECORDS,
  SHIFTS,
  TODAY_LABEL,
  TOTAL_EMPLOYEES,
  WORKING_HOURS,
} from "../constants/punch.mock";
import { PUNCH_TILES_BY_PERIOD } from "../constants/timeoffice.constants";
import {
  METRIC_PREDICATES,
  applyFilters,
  countMetric,
  groupIrregularities,
  paginate,
  toRow,
} from "./punchMetrics";
import {
  mergeHours,
  useGetAttendanceOverviewQuery,
  useGetAverageOtHoursQuery,
  useGetAverageWorkingHoursQuery,
  useGetDashboardEmployeesQuery,
  useGetDashboardSummaryQuery,
  useGetIrregularitiesQuery,
  useGetPendingRequestsQuery,
  useGetPoliciesQuery,
  useGetPunchModeDistributionQuery,
} from "../api/timeofficeApi";
import type {
  IrregularityClassification,
  PunchFilters,
  PunchMetric,
  PunchPeriod,
} from "../types/timeoffice.types";

export const useTimeOffice = () => {
  const [period, setPeriod] = useState<PunchPeriod>("today");
  const [classification, setClassification] = useState<IrregularityClassification>("all");
  // null = showing the dashboard; a metric = showing that drill-down in its place.
  const [metric, setMetric] = useState<PunchMetric | null>(null);
  const [filters, setFilters] = useState<PunchFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Every query falls back to the mock, so the dashboard renders before the
  // backend exists. Delete punch.mock.ts and the `?? MOCK` tails once it does.
  const summaryQuery = useGetDashboardSummaryQuery(period);
  const employeesQuery = useGetDashboardEmployeesQuery(
    { metric: metric as PunchMetric, period },
    { skip: !metric }
  );
  const overviewQuery = useGetAttendanceOverviewQuery();
  const punchModeQuery = useGetPunchModeDistributionQuery(period);
  const irregularitiesQuery = useGetIrregularitiesQuery(classification);
  const workHoursQuery = useGetAverageWorkingHoursQuery();
  const otHoursQuery = useGetAverageOtHoursQuery();
  const policiesQuery = useGetPoliciesQuery();
  const pendingRequestsQuery = useGetPendingRequestsQuery();

  const records = PUNCH_RECORDS[period];
  const rows = useMemo(() => records.map(toRow), [records]);

  const counts = useMemo(() => {
    const fromApi = summaryQuery.data?.counts;
    return Object.fromEntries(
      PUNCH_TILES_BY_PERIOD[period].map((tile) => [tile, fromApi?.[tile] ?? countMetric(records, tile)])
    ) as Record<PunchMetric, number>;
  }, [summaryQuery.data, records, period]);

  const punchModeDistribution = useMemo(() => {
    if (punchModeQuery.data?.length) return punchModeQuery.data;

    const tally = new Map<string, number>();
    records.forEach((record) => {
      if (!record.checkInTime) return;
      const mode = record.punchMode ?? "Bio Metric";
      tally.set(mode, (tally.get(mode) ?? 0) + 1);
    });
    return [...tally].map(([mode, count]) => ({ mode, count }));
  }, [punchModeQuery.data, records]);

  const irregularities = useMemo(
    () => irregularitiesQuery.data ?? groupIrregularities(IRREGULARITIES, records, classification),
    [irregularitiesQuery.data, records, classification]
  );

  const workingHours = useMemo(() => {
    const merged = mergeHours(workHoursQuery.data, otHoursQuery.data);
    return merged.length ? merged : WORKING_HOURS;
  }, [workHoursQuery.data, otHoursQuery.data]);

  // Drill-down list: filter first, then page what's left.
  const metricRows = useMemo(() => {
    if (!metric) return [];
    if (employeesQuery.data?.length) return employeesQuery.data.map(toRow);
    return rows.filter(METRIC_PREDICATES[metric]);
  }, [metric, employeesQuery.data, rows]);
  const filteredRows = useMemo(() => applyFilters(metricRows, filters), [metricRows, filters]);
  const pagedRows = useMemo(() => paginate(filteredRows, page, pageSize), [filteredRows, page, pageSize]);

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
    setFilters((prev) => ({ ...prev, ...next }));
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
    totalEmployees: summaryQuery.data?.totalEmployees ?? TOTAL_EMPLOYEES,
    latestPunchIntegratedAt: summaryQuery.data?.latestPunchIntegratedAt ?? LATEST_PUNCH_INTEGRATED_AT,
    todayLabel: TODAY_LABEL,

    attendanceOverview: overviewQuery.data ?? ATTENDANCE_OVERVIEW,
    punchModeDistribution,
    irregularities,
    workingHours,
    policies: policiesQuery.data ?? POLICIES,
    shifts: SHIFTS,
    pendingRequests: pendingRequestsQuery.data ?? PENDING_REQUESTS,
  };
};
