import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClockFading, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

import DateField from "../../components/DateField";
import ProcessStatTiles from "../../components/ProcessStatTiles";
import ProcessDrilldownList from "../../components/ProcessDrilldownList";
import {
  PunchRequestsPanel,
  TemporaryShiftPanel,
  ProcessHistoryPanel,
} from "../../components/ProcessPanels";

import {
  ASSIGN_SECTION_PATH,
  PROCESS_TILES,
  PUNCH_PROCESS_TABS,
  REGULARIZATION_SECTION_PATH,
  TIME_OFFICE_SECTION_PATH,
} from "../../constants/timeoffice.constants";

import { useProcessTab } from "../../hooks/useProcessTab";
import type { ProcessDrilldownTile } from "../../types/timeoffice.types";

const isDrilldownTile = (
  tile: string,
): tile is ProcessDrilldownTile =>
  tile === "missedPunch" ||
  tile === "shiftUnassigned" ||
  tile === "yetToProcess" ||
  tile === "processed" ||
  tile === "reProcessEffectiveDate" ||
  tile === "allReProcess";

const getRowValue = (row: Record<string, string | number>, ...candidates: string[]) => {
  const key = Object.keys(row).find((item) =>
    candidates.some((candidate) => item.toLowerCase() === candidate.toLowerCase()),
  );
  return key ? String(row[key] ?? "") : "";
};

export default function ProcessPage() {
  const { domain } = useParams();
  const navigate = useNavigate();
  const process = useProcessTab();

  const [autoShortfallPermission, setAutoShortfallPermission] =
    useState(false);

  const basePath = `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;
  const regularizationBasePath = `/${domain}/admin/${REGULARIZATION_SECTION_PATH}`;
  const shiftUnassignedBasePath = basePath.replace(/\/punch-process$/, "/shift-unassigned");
  const assignBasePath = `/${domain}/admin/${ASSIGN_SECTION_PATH}`;

  const openTileMeta =
    process.openTile &&
    PROCESS_TILES.find((tile) => tile.key === process.openTile);
  const isReprocessView =
    process.openTile === "reProcessEffectiveDate" || process.openTile === "allReProcess";

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {/* Top navigation */}
      <nav
        aria-label="Time Office navigation"
        className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto pb-1"
      >
        <div className="flex w-max min-w-full items-center justify-between gap-4 rounded-xl border border-emerald-500 bg-emerald-50 px-3 py-2">
          <div className="flex items-center gap-2">
            {PUNCH_PROCESS_TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${basePath}/${tab.path}`}
                className={({ isActive }) =>
                  `rounded-lg border bg-white px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-emerald-500 text-emerald-600"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            {isReprocessView && (
              <>
              <Button type="button" variant="outline" onClick={process.closeProcessTile} className="flex h-10 items-center gap-2 rounded-lg border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <ArrowLeft size={17} /> Back
              </Button>
              {/* <Button type="button" onClick={process.handleProcess} disabled={process.isProcessing} className="flex h-10 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60">
                <Bookmark size={16} /> Process
              </Button> */}
              </>
            )}
            <Button
              type="button"
              variant="ghost"
              aria-label="Process history"
              title="Process history"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
            >
              <ClockFading size={20} />
            </Button>
          </div>
        </div>
      </nav>

      {process.isSummaryError && (
        <p role="alert" className="text-sm text-red-600">
          Unable to load the process dashboard. Please try again.
        </p>
      )}
      {process.isHistoryError && (
        <p role="alert" className="text-sm text-red-600">
          Unable to load process history. Please try again.
        </p>
      )}
      {process.isSummaryLoading && (
        <p className="text-sm text-slate-500">Loading process dashboard...</p>
      )}

      {/* Process header and controls */}
      {!isReprocessView && <section className="overflow-visible rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="min-w-0 text-lg font-semibold text-slate-900">
            Time &amp; Attendance Process
          </h2>

          <div className="w-full min-w-0 xl:w-auto">
            <div className="flex min-w-0 flex-wrap items-center gap-3 py-1">
            <DateField
              label="From"
              value={process.dateFrom}
              onChange={process.setDateFrom}
              fixedCalendarPosition
              className="flex w-[200px] shrink-0 items-center gap-2 whitespace-nowrap text-xs text-slate-700 sm:text-sm"
            />

            <DateField
              label="To"
              value={process.dateTo}
              onChange={process.setDateTo}
              align="right"
              fixedCalendarPosition
              className="flex w-[200px] shrink-0 items-center gap-2 whitespace-nowrap text-xs text-slate-700 sm:text-sm"
            />

            {/* Auto Shortfall Permission toggle */}
            <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
              <span className="whitespace-nowrap text-sm text-slate-800">
                Auto Shortfall Permission
              </span>

              <Button
                type="button"
                variant="ghost"
                role="switch"
                aria-checked={autoShortfallPermission}
                aria-label="Auto Shortfall Permission"
                onClick={() =>
                  setAutoShortfallPermission((current) => !current)
                }
                className={[
                  "relative inline-flex h-5 w-9 shrink-0 items-center justify-start rounded-full p-0",
                  "cursor-pointer transition-colors focus:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-sky-500",
                  "focus-visible:ring-offset-2",
                  autoShortfallPermission
                    ? "bg-sky-500 hover:bg-sky-500"
                    : "bg-slate-300 hover:bg-slate-300",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-block h-4 w-4 transform rounded-full bg-white",
                    "shadow-sm ring-1 ring-black/5 transition-transform",
                    autoShortfallPermission
                      ? "translate-x-4"
                      : "translate-x-0.5",
                  ].join(" ")}
                />
              </Button>
            </div>

            {/* Filter control */}
            <Button
              type="button"
              variant="ghost"
              title="Filter"
              aria-label="Filter"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <Filter size={18} />
            </Button>

            {/* Existing Process action, hidden per request. */}
            {/* <Button
              type="button"
              onClick={process.handleProcess}
              disabled={process.isProcessing}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-sky-500 px-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Bookmark size={16} />
              {process.isProcessing ? "Processing…" : "Process"}
            </Button> */}

            </div>
          </div>
        </div>
        {!openTileMeta && (
          <div className="border-t border-slate-200 px-1 py-4">
            <ProcessStatTiles
              summary={process.summary}
              onOpenTile={(tile) => {
                if (tile === "nonTimeAttendance") {
                  navigate(`${assignBasePath}/policy-update`);
                  return;
                }

                if (tile === "missedPunch") {
                  navigate(`${regularizationBasePath}/missed-punch`);
                  return;
                }

                if (tile === "shiftUnassigned") {
                  navigate(`${shiftUnassignedBasePath}/shift-pattern`);
                  return;
                }

                if (isDrilldownTile(tile)) process.openProcessTile(tile);
              }}
            />
          </div>
        )}
      </section>}

        {/* Tile drill-down or Process dashboard */}
        {openTileMeta ? (
          isReprocessView ? (
            <div className="flex flex-col gap-4">
              <div className="punch-horizontal-scroll flex min-w-0 items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
                {/* <Button
                  type="button"
                  variant="ghost"
                  onClick={() => process.openProcessTile("reProcessEffectiveDate")}
                  className={`h-11 shrink-0 whitespace-nowrap rounded-lg px-5 text-sm font-medium transition-colors ${process.openTile === "reProcessEffectiveDate" ? "bg-sky-100 text-sky-500" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Re-Process Employees Effective Date
                </Button> */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => process.openProcessTile("allReProcess")}
                  className={`h-11 shrink-0 whitespace-nowrap rounded-lg px-5 text-sm font-medium transition-colors ${process.openTile === "allReProcess" ? "bg-sky-100 text-sky-500" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  All Re-Process Employees
                </Button>
              </div>

              <div className="punch-horizontal-scroll min-w-0 overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="bg-[#D5EAF7]">
                    <tr className="text-left">
                      <th className="px-4 py-5 font-semibold text-slate-800">Employee Id</th>
                      <th className="px-4 py-5 font-semibold text-slate-800">Employee Name</th>
                      <th className="px-4 py-5 font-semibold text-slate-800">Date</th>
                      <th className="w-14 px-4 py-5 text-right"><input type="checkbox" aria-label="Select all employees" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {process.drilldownRows.map((row, index) => (
                      <tr key={`${getRowValue(row, "employeeId", "empId")}-${index}`} className="border-t border-slate-100">
                        <td className="px-4 py-5 text-slate-800">{getRowValue(row, "employeeId", "empId", "employeeCode")}</td>
                        <td className="px-4 py-5 text-slate-800">{getRowValue(row, "employeeName", "empName", "name")}</td>
                        <td className="px-4 py-5 text-slate-800">{getRowValue(row, "date", "effectiveDate")}</td>
                        <td className="px-4 py-5 text-right"><input type="checkbox" aria-label={`Select employee ${index + 1}`} /></td>
                      </tr>
                    ))}
                    {!process.isDrilldownLoading && process.drilldownRows.length === 0 && (
                      <tr><td colSpan={4} className="py-6 text-center"><img src="/no-data.png" alt="No re-process employees found" className="mx-auto h-64 w-64 object-contain" /></td></tr>
                    )}
                    {process.isDrilldownLoading && <tr><td colSpan={4} className="py-12 text-center text-slate-400">Loading...</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <ProcessDrilldownList
              title={openTileMeta.label}
              color={openTileMeta.color}
              rows={process.drilldownRows}
              isLoading={process.isDrilldownLoading}
              onBack={process.closeProcessTile}
            />
          )
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <PunchRequestsPanel summary={process.punchRequests} />
            <TemporaryShiftPanel />
            <ProcessHistoryPanel entries={process.history} />
          </div>
        )}
    </div>
  );
}
