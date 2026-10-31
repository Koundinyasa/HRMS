import { Fragment, useEffect, useRef, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { format } from "date-fns";
import { NavLink, useParams } from "react-router-dom";
import { ChevronDown, ChevronRight, ClockFading, FileSpreadsheet, Filter } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import DateField from "../../components/DateField";
import PunchFilterBar from "../../components/PunchFilterBar";
import ProcessDrilldownList from "../../components/ProcessDrilldownList";
import {
  useGetPunchProcessTaInsightsCountsQuery,
  useGetPunchProcessTaInsightsDetailsQuery,
} from "../../api/timeofficeApi";
import { PUNCH_PROCESS_TABS, TIME_OFFICE_SECTION_PATH } from "../../constants/timeoffice.constants";
import { INSIGHT_TILES } from "../../constants/regularization.mock";
import type { PunchFilters } from "../../types/timeoffice.types";

const INSIGHT_IDS: Record<string, number> = {
  totalAbsent: 1,
  lopOverride: 2,
  leaveAndPunch: 3,
  otPendingAuth: 4,
  cwPendingAuth: 5,
  cwStatus: 6,
  overTime: 7,
  pendingPermissionPunches: 8,
  punchProcessPending: 9,
  integrationPending: 10,
};

const INSIGHT_COUNT_FIELDS: Record<string, string[]> = {
  totalAbsent: ["totalAbsent", "totalAbsentCount", "totalAbsentEmployees", "absentCount"],
  lopOverride: ["lopOverride", "lopOverrideCount", "lopOverrideEmployees"],
  leaveAndPunch: ["leaveAndPunch", "leaveAndPunchCount", "leavePunch", "leavePunchCount"],
  otPendingAuth: ["otPendingAuth", "otPendingAuthCount", "otPendingAuthorization", "overtimePendingAuthCount"],
  cwPendingAuth: ["cwPendingAuth", "cwPendingAuthCount", "cwPendingAuthorization"],
  cwStatus: ["cwStatus", "cwStatusCount"],
  overTime: ["overTime", "overTimeCount", "overtimeCount"],
  pendingPermissionPunches: ["pendingPermissionPunches", "pendingPermissionPunchCount"],
  punchProcessPending: ["punchProcessPending", "punchProcessPendingCount"],
  integrationPending: ["integrationPending", "integrationPendingCount"],
};

const getInsightCount = (counts: Record<string, unknown> | undefined, key: string) => {
  if (!counts) return 0;
  const candidates = new Set((INSIGHT_COUNT_FIELDS[key] ?? []).map((field) => field.toLowerCase()));
  const field = Object.keys(counts).find((name) => candidates.has(name.replace(/[^a-z0-9]/gi, "").toLowerCase()));
  const value = field ? Number(counts[field]) : 0;
  return Number.isFinite(value) ? value : 0;
};

const getInsightGridColumns = () => {
  if (typeof window === "undefined") return 5;
  if (window.matchMedia("(min-width: 1280px)").matches) return 5;
  return window.matchMedia("(min-width: 640px)").matches ? 2 : 1;
};

export default function PunchProcessTaInsightsPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;
  const [from, setFrom] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [to, setTo] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [filters, setFilters] = useState<PunchFilters>({});
  const [openTile, setOpenTile] = useState<{ key: string; label: string; color: string; insightId: number } | null>(null);
  const [gridColumns, setGridColumns] = useState(getInsightGridColumns);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const {
    currentData: insightCounts,
    isFetching: isSummaryLoading,
    isError: isSummaryError,
  } = useGetPunchProcessTaInsightsCountsQuery({ fromDate: from, toDate: to });
  const tiles = INSIGHT_TILES.map((template) => {
    const value = getInsightCount(insightCounts, template.key);
    return { ...template, value, total: value };
  });
  const [animatedCounts, setAnimatedCounts] = useState<Record<string, number>>({});
  const insightCountsKey = tiles.map((tile) => tile.value).join(",");
  useEffect(() => {
    const targets = Object.fromEntries(tiles.map((tile) => [tile.key, Math.max(0, Math.trunc(tile.value))]));
    const duration = 1000;
    let startTime: number | null = null;
    let frameId = 0;

    setAnimatedCounts(Object.fromEntries(tiles.map((tile) => [tile.key, 0])));

    const animate = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedCounts(Object.fromEntries(
        tiles.map((tile) => [tile.key, Math.round((targets[tile.key] ?? 0) * easedProgress)]),
      ));

      if (progress < 1) frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [from, to, insightCountsKey]);
  const openTileIndex = openTile ? tiles.findIndex((tile) => tile.key === openTile.key) : -1;
  const detailsAfterIndex = openTileIndex >= 0
    ? Math.min(Math.ceil((openTileIndex + 1) / gridColumns) * gridColumns - 1, tiles.length - 1)
    : -1;
  const {
    currentData: details = [],
    isFetching: isDetailsLoading,
    isError: isDetailsError,
  } = useGetPunchProcessTaInsightsDetailsQuery(
    openTile
      ? {
          insightId: openTile.insightId,
          fromDate: from,
          toDate: to,
        }
      : skipToken,
  );
  useEffect(() => {
    if (openTile) detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [openTile]);

  useEffect(() => {
    const updateGridColumns = () => setGridColumns(getInsightGridColumns());
    window.addEventListener("resize", updateGridColumns);
    return () => window.removeEventListener("resize", updateGridColumns);
  }, []);

  const downloadExcel = () => {
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Insight", "Employees", "Total Employees"],
      ...tiles.map((tile) => [tile.label, tile.value, tile.total]),
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "TA Insights");
    XLSX.writeFile(workbook, `TA_Insights_${from}_${to}.xlsx`);
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className={`punch-horizontal-scroll min-w-0 max-w-full overscroll-x-contain [touch-action:pan-x] xl:overflow-x-visible ${isDatePickerOpen ? "overflow-visible" : "overflow-x-auto"}`}>
        <div className="flex w-max min-w-full flex-nowrap items-center justify-between gap-4 rounded-xl border border-emerald-500 bg-emerald-50 px-3 py-2 xl:w-full xl:gap-2">
          <nav aria-label="Time Office navigation" className="flex shrink-0 items-center gap-2 xl:gap-1">
            {PUNCH_PROCESS_TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${basePath}/${tab.path}`}
                className={({ isActive }) =>
                  `rounded-lg border bg-white px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? "border-emerald-500 text-emerald-600" : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 xl:ml-auto xl:flex-nowrap xl:gap-2">
            <DateField
              label="From"
              value={from}
              onChange={setFrom}
              onOpenChange={setIsDatePickerOpen}
              className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm text-slate-700 [&>div]:w-[140px] sm:[&>div]:w-[150px] [&>div>input]:h-9 [&>div>input]:rounded-lg [&>div>input]:px-3 [&>div>input]:pr-9 [&>div>button]:h-8 [&>div>button]:w-8"
            />
            <DateField
              label="To"
              value={to}
              onChange={setTo}
              onOpenChange={setIsDatePickerOpen}
              align="right"
              className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm text-slate-700 [&>div]:w-[140px] sm:[&>div]:w-[150px] [&>div>input]:h-9 [&>div>input]:rounded-lg [&>div>input]:px-3 [&>div>input]:pr-9 [&>div>button]:h-8 [&>div>button]:w-8"
            />
            <Button type="button" variant="ghost" aria-label="Download TA Insights Excel" title="Download Excel" onClick={downloadExcel} className="h-auto w-auto shrink-0 p-0 text-emerald-600 hover:text-emerald-700">
              <FileSpreadsheet size={22} />
            </Button>
            <Button type="button" variant="ghost" aria-label="Filter" className="h-auto w-auto shrink-0 p-0 text-slate-400 hover:text-slate-600"><Filter size={19} /></Button>
            <Button type="button" variant="ghost" aria-label="History" className="h-auto w-auto shrink-0 p-0 text-slate-400 hover:text-slate-600"><ClockFading size={21} /></Button>
          </div>
        </div>
      </div>

      <PunchFilterBar
        rows={[]}
        filters={filters}
        onChange={(next) => setFilters((previous) => ({ ...previous, ...next }))}
        onClear={() => setFilters({})}
        showChipsInitially
        showOverflowControls
        scrollable
        showSearch={false}
      />

      {isSummaryLoading && <p className="text-sm text-slate-500">Loading TA Insights...</p>}
      {isSummaryError && (
        <p role="alert" className="text-sm text-red-600">
          Unable to load TA Insights. Please try again.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-5">
        {tiles.map((tile, index) => (
          <Fragment key={tile.key}>
            <article className="flex min-h-[205px] flex-col overflow-hidden rounded-[22px] border-2 bg-white shadow-sm" style={{ borderColor: tile.color }}>
              <div className="flex flex-1 flex-col px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-900">{tile.label}</h2>
                {tile.key === "integrationPending" && (
                  <Button type="button" variant="outline" className="mt-3 h-auto self-center rounded-md border-2 border-emerald-500 bg-white px-3 py-1 text-xs font-semibold text-slate-800">
                    Integrate
                  </Button>
                )}
                <p className="mt-auto flex items-baseline gap-1.5 pt-4" style={{ color: tile.color }}>
                  <span
                    className="inline-block shrink-0 text-right text-3xl font-bold tabular-nums"
                    style={{ width: `${Math.max(2, String(Math.trunc(tile.value)).length)}ch` }}
                  >
                    {animatedCounts[tile.key] ?? 0}
                  </span>
                  <span className="inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap">
                    <span className="text-lg font-semibold">-</span>
                    <span className="inline-block text-right text-lg font-semibold tabular-nums" style={{ width: `${Math.max(2, String(Math.trunc(tile.total)).length)}ch` }}>
                      {animatedCounts[tile.key] ?? 0}
                    </span>
                    <span className="text-xs text-slate-500">Employee(s)</span>
                  </span>
                </p>
              </div>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setOpenTile((current) => current?.key === tile.key ? null : {
                  key: tile.key,
                  label: tile.label,
                  color: tile.color,
                  insightId: INSIGHT_IDS[tile.key],
                })}
                className="h-12 rounded-none border-t text-sm font-semibold transition-opacity hover:opacity-75"
                style={{ borderColor: tile.color, color: index < 5 ? "#238BE8" : tile.color }}
              >
                View Details {openTile?.key === tile.key ? <ChevronDown size={18} className="ml-2" /> : <ChevronRight size={18} className="ml-2" />}
              </Button>
            </article>
            {index === detailsAfterIndex && openTile && (
              <div ref={detailsRef} className="col-span-full min-w-0">
                {isDetailsError && (
                  <p role="alert" className="mb-2 text-sm text-red-600">
                    Unable to load {openTile.label} details. Please try again.
                  </p>
                )}
                <ProcessDrilldownList
                  title={openTile.label}
                  color={openTile.color}
                  rows={details}
                  isLoading={isDetailsLoading}
                  scrollable={openTile.key === "integrationPending"}
                  onBack={() => setOpenTile(null)}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>

    </div>
  );
}
