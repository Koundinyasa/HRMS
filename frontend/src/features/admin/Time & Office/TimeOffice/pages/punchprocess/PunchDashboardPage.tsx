import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Bookmark,
  ChevronLeft,
  ChevronDown,
  FileSpreadsheet,
  Filter,
  History,
  Info,
  Search,
  Sun,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";

import DropdownSelect from "../../../../components/DropdownSelect";
import PunchStatTiles from "../../components/PunchStatTiles";
import PunchMetricList from "../../components/PunchMetricList";

import {
  AttendanceOverviewChart,
  IrregularityCharts,
  PunchModeChart,
  WorkingHoursCharts,
} from "../../components/PunchCharts";

import {
  PendingRequestsCard,
  PoliciesShiftsPanel,
} from "../../components/PunchSidePanels";

import {
  IRREGULARITY_CLASSIFICATIONS,
  METRIC_COLUMNS,
  PUNCH_PERIOD_OPTIONS,
  PUNCH_PROCESS_TABS,
  TIME_OFFICE_SECTION_PATH,
} from "../../constants/timeoffice.constants";

import { useTimeOffice } from "../../hooks/useTimeOffice";

import type {
  IrregularityClassification,
  PunchMetric,
  PunchPeriod,
} from "../../types/timeoffice.types";

export default function PunchDashboardPage() {
  const { domain } = useParams();

  const timeOffice = useTimeOffice();

  const [isHistoryOpen, setIsHistoryOpen] =
    useState(false);

  const [showMetricFilters, setShowMetricFilters] =
    useState(true);

  const basePath =
    `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;

  const dashboardDateLabel = `${timeOffice.period === "today" ? "Today" : "Yesterday"} ${timeOffice.todayLabel}`;

  const pendingMonthLabel =
    new Intl.DateTimeFormat("en", {
      month: "short",
      year: "numeric",
    })
      .format(new Date())
      .toUpperCase();

  const exportDashboard = () => {
    const workbook = XLSX.utils.book_new();

    const summary = [
      {
        Metric: "Total Employees",
        Count: timeOffice.totalEmployees,
      },
      ...Object.entries(timeOffice.counts).map(
        ([metric, count]) => ({
          Metric: metric,
          Count: count ?? 0,
        }),
      ),
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(summary),
      "Summary",
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(
        timeOffice.attendanceOverview,
      ),
      "Attendance Overview",
    );

    XLSX.writeFile(
      workbook,
      `time-office-dashboard-${timeOffice.period}.xlsx`,
    );
  };

  const exportMetric = () => {
    if (!timeOffice.metric) return;

    const columns = METRIC_COLUMNS[timeOffice.metric];

    const rows = timeOffice.filteredRows.map((row) =>
      columns.reduce<Record<string, string | number>>(
        (result, column) => {
          const value = row[column.key];

          result[column.label] =
            typeof value === "boolean"
              ? String(value)
              : value ?? "";

          return result;
        },
        {},
      ),
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(rows),
      "Employees",
    );

    XLSX.writeFile(
      workbook,
      `${timeOffice.metric}-employees.xlsx`,
    );
  };

  const openMetric = (metric: PunchMetric) => {
    setShowMetricFilters(true);
    timeOffice.openMetric(metric);
  };

  if (isHistoryOpen) {
    return (
      <PunchProcessHistoryPage
        onClose={() => setIsHistoryOpen(false)}
      />
    );
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-4">
      {/* Responsive Punch Process navigation */}
      <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-xl border border-emerald-500 bg-[#effbf6]">
        <div className="flex w-max min-w-full flex-row flex-nowrap items-center gap-3 whitespace-nowrap px-3 py-2">
          <nav
            aria-label="Punch process"
            className="flex shrink-0 flex-row flex-nowrap items-center gap-2 whitespace-nowrap"
          >
            {PUNCH_PROCESS_TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${basePath}/${tab.path}`}
                className={({ isActive }) =>
                  `flex h-[38px] shrink-0 items-center whitespace-nowrap rounded-lg border bg-white px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 ${
                    isActive
                      ? "border-emerald-500 text-emerald-700"
                      : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 flex-row flex-nowrap items-center gap-2 whitespace-nowrap">
            {timeOffice.metric ? (
              <>
                <button
                  type="button"
                  onClick={timeOffice.closeMetric}
                  className="flex h-9 shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <ChevronLeft size={17} />
                  Back
                </button>

                <button
                  type="button"
                  onClick={exportMetric}
                  aria-label="Export employees to Excel"
                  title="Export employees to Excel"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-emerald-700 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <FileSpreadsheet size={20} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowMetricFilters((visible) => !visible)
                  }
                  aria-label={
                    showMetricFilters
                      ? "Hide filters"
                      : "Show filters"
                  }
                  aria-pressed={showMetricFilters}
                  title={
                    showMetricFilters
                      ? "Hide filters"
                      : "Show filters"
                  }
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    showMetricFilters
                      ? "bg-emerald-100 text-sky-700"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Filter size={20} />
                </button>
              </>
            ) : (
              <button
                type="button"
                className="shrink-0 rounded-lg bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-400 p-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <span className="flex h-9 items-center gap-2 rounded-[7px] bg-white px-4 text-sm font-semibold text-slate-800">
                  <Bookmark size={15} />
                  Process
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              aria-label="Process history"
              title="Process history"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dotted border-slate-300 bg-white text-slate-500 transition-colors hover:border-emerald-400 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <History size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {timeOffice.isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700"
        >
          Loading attendance dashboard data…
        </div>
      )}

      {/* Error state */}
      {timeOffice.isError &&
        timeOffice.errorMessage &&
        !timeOffice.errorMessage.toLowerCase().includes("polic") && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          {timeOffice.errorMessage}
        </div>
      )}

      {/* Empty state */}
      {!timeOffice.isLoading &&
        !timeOffice.isError &&
        !timeOffice.hasDashboardData &&
        !timeOffice.metric && (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
            No attendance dashboard data was returned by the API.
          </div>
        )}

      {/* Employee metric drill-down */}
      {timeOffice.metric ? (
        <PunchMetricList
          metric={timeOffice.metric}
          allRows={timeOffice.metricRows}
          filteredRows={timeOffice.filteredRows}
          pagedRows={timeOffice.pagedRows}
          filters={timeOffice.filters}
          onFiltersChange={timeOffice.updateFilters}
          onClearFilters={timeOffice.clearFilters}
          page={timeOffice.page}
          pageSize={timeOffice.pageSize}
          onPageChange={timeOffice.setPage}
          onPageSizeChange={timeOffice.changePageSize}
          showFilters={showMetricFilters}
          isLoading={timeOffice.isMetricLoading}
          errorMessage={timeOffice.metricErrorMessage}
        />
      ) : (
        <>
          {/* Summary and policy panels */}
          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]">
            <PunchStatTiles
              period={timeOffice.period}
              totalEmployees={timeOffice.totalEmployees}
              counts={timeOffice.counts}
              onOpenMetric={openMetric}
              header={
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Sun
                      size={17}
                      className="text-amber-400"
                    />
                    {dashboardDateLabel}
                  </span>

                  <span className="hidden h-6 border-l border-slate-200 sm:block" />

                  <span className="flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs text-sky-700">
                    <Info size={14} />
                    Latest Punch Integrated:{" "}
                    {timeOffice.latestPunchIntegratedAt}
                  </span>

                  <div className="ml-auto flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={exportDashboard}
                      aria-label="Export dashboard to Excel"
                      title="Export dashboard to Excel"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-50"
                    >
                      <FileSpreadsheet size={20} />
                    </button>

                    <DropdownSelect
                      options={PUNCH_PERIOD_OPTIONS}
                      value={timeOffice.period}
                      onChange={(value) =>
                        timeOffice.changePeriod(
                          value as PunchPeriod,
                        )
                      }
                      align="right"
                      menuClassName="w-36"
                      className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    />
                  </div>
                </div>
              }
            />

            <PoliciesShiftsPanel
              policies={timeOffice.policies}
              shifts={timeOffice.shifts}
            />
          </div>

          {/* Dashboard charts */}
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 xl:auto-rows-[348px] xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <AttendanceOverviewChart
              data={timeOffice.attendanceOverview}
            />

            <PunchModeChart
              data={timeOffice.punchModeDistribution}
            />

            <PendingRequestsCard
              requests={timeOffice.pendingRequests}
              monthLabel={pendingMonthLabel}
            />
          </div>

          {/* Attendance irregularities */}
          <IrregularityCharts
            data={timeOffice.irregularities}
            action={
              <DropdownSelect
                options={IRREGULARITY_CLASSIFICATIONS}
                value={timeOffice.classification}
                onChange={(value) =>
                  timeOffice.setClassification(
                    value as IrregularityClassification,
                  )
                }
                align="right"
                menuClassName="w-44"
                className="h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-emerald-600"
              />
            }
          />

          {/* Working hours */}
          <WorkingHoursCharts
            data={timeOffice.workingHours}
          />
        </>
      )}
    </div>
  );
}

function PunchProcessHistoryPage({
  onClose,
}: {
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section
        aria-label="Process history"
        aria-modal="true"
        className="flex h-[min(740px,90vh)] w-full max-w-7xl flex-col overflow-hidden rounded-xl bg-white font-[Urbanist] shadow-2xl"
        role="dialog"
      >
        <div className="flex min-h-12 items-center gap-4 border-b border-slate-100 px-4 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Search
              size={18}
              className="shrink-0 text-slate-400"
            />

            <input
              type="search"
              aria-label="Search process history"
              placeholder="Start Typing..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-300"
            />
          </div>

          <HistoryFilter label="Employee" />
          <HistoryFilter label="Action" />
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-[#d5e8f6] text-slate-800">
              <tr>
                {[
                  "Record Details",
                  "Record Changes",
                  "Action Time",
                  "User",
                  "Employee Name",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={5} className="px-4 py-5">
                  <div className="rounded-md border border-[#eee8da] bg-[#fdfbf5] py-4 text-center text-base font-medium text-[#666354]">
                    No Record Found
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer className="flex min-h-[76px] items-center justify-end border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X size={17} />
            Cancel
          </button>
        </footer>
      </section>
    </div>
  );
}

function HistoryFilter({
  label,
}: {
  label: string;
}) {
  return (
    <label className="relative shrink-0">
      <select
        aria-label={label}
        defaultValue=""
        className="h-9 appearance-none rounded-md border border-transparent bg-transparent py-1 pl-3 pr-7 text-sm font-semibold text-slate-600 outline-none transition-colors hover:border-slate-200 focus:border-emerald-400"
      >
        <option value="">{label}</option>
      </select>

      <ChevronDown
        size={15}
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </label>
  );
}
