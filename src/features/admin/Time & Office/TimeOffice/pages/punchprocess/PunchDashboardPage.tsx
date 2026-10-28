import { NavLink, useParams } from "react-router-dom";
import { Bookmark, History, Info, Star } from "lucide-react";
import DropdownSelect from "../../../../components/DropdownSelect";
import PunchStatTiles from "../../components/PunchStatTiles";
import PunchMetricList from "../../components/PunchMetricList";
import {
  AttendanceOverviewChart,
  IrregularityCharts,
  PunchModeChart,
  WorkingHoursCharts,
} from "../../components/PunchCharts";
import { PendingRequestsCard, PoliciesShiftsPanel } from "../../components/PunchSidePanels";
import {
  IRREGULARITY_CLASSIFICATIONS,
  PUNCH_PERIOD_OPTIONS,
  PUNCH_PROCESS_TABS,
  TIME_OFFICE_SECTION_PATH,
} from "../../constants/timeoffice.constants";
import { useTimeOffice } from "../../hooks/useTimeOffice";
import type { IrregularityClassification, PunchPeriod } from "../../types/timeoffice.types";

export default function PunchDashboardPage() {
  const { domain } = useParams();
  const timeOffice = useTimeOffice();
  const basePath = `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-4">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-500 rounded-xl px-3 py-2 w-max min-w-full sm:w-fit">
            {PUNCH_PROCESS_TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${basePath}/${tab.path}`}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg border bg-white text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? "border-emerald-500 text-emerald-600" : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {/* ponytail: inert until we know what Process should trigger. */}
          <button
            type="button"
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-emerald-200 text-sm font-medium text-slate-700 bg-white"
          >
            <Bookmark size={15} /> Process
          </button>
          <button
            type="button"
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white"
          >
            <History size={16} />
          </button>
        </div>
      </div>

      {/* The drill-down replaces the dashboard body in place — the URL does not change. */}
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
          onBack={timeOffice.closeMetric}
        />
      ) : (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              {timeOffice.todayLabel}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-sky-700 bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1">
              <Info size={13} />
              Latest Punch Integrated: {timeOffice.latestPunchIntegratedAt}
            </span>
            <div className="ml-auto">
              <DropdownSelect
                options={PUNCH_PERIOD_OPTIONS}
                value={timeOffice.period}
                onChange={(value) => timeOffice.changePeriod(value as PunchPeriod)}
                align="right"
                menuClassName="w-36"
                className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)] gap-4">
            <PunchStatTiles
              period={timeOffice.period}
              totalEmployees={timeOffice.totalEmployees}
              counts={timeOffice.counts}
              onOpenMetric={timeOffice.openMetric}
            />
            <PoliciesShiftsPanel policies={timeOffice.policies} shifts={timeOffice.shifts} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <AttendanceOverviewChart data={timeOffice.attendanceOverview} />
            <PunchModeChart data={timeOffice.punchModeDistribution} />
            <PendingRequestsCard requests={timeOffice.pendingRequests} monthLabel="JUN 2026" />
          </div>

          <IrregularityCharts
            data={timeOffice.irregularities}
            action={
              <DropdownSelect
                options={IRREGULARITY_CLASSIFICATIONS}
                value={timeOffice.classification}
                onChange={(value) => timeOffice.setClassification(value as IrregularityClassification)}
                align="right"
                menuClassName="w-44"
                className="h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-emerald-600"
              />
            }
          />

          <WorkingHoursCharts data={timeOffice.workingHours} />
        </>
      )}
    </div>
  );
}
