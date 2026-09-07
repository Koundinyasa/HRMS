import { NavLink, useParams } from "react-router-dom";
import { Filter } from "lucide-react";
import DateField from "../../components/DateField";
import ProcessStatTiles from "../../components/ProcessStatTiles";
import ProcessDrilldownList from "../../components/ProcessDrilldownList";
import { PunchRequestsPanel, TemporaryShiftPanel, ProcessHistoryPanel } from "../../components/ProcessPanels";
import { PROCESS_TILES, PUNCH_PROCESS_TABS, TIME_OFFICE_SECTION_PATH } from "../../constants/timeoffice.constants";
import { useProcessTab } from "../../hooks/useProcessTab";
import type { ProcessDrilldownTile } from "../../types/timeoffice.types";

const isDrilldownTile = (tile: string): tile is ProcessDrilldownTile =>
  tile === "missedPunch" ||
  tile === "shiftUnassigned" ||
  tile === "yetToProcess" ||
  tile === "processed" ||
  tile === "reProcessEffectiveDate" ||
  tile === "allReProcess";

export default function ProcessPage() {
  const { domain } = useParams();
  const process = useProcessTab();
  const basePath = `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;

  const openTileMeta = process.openTile && PROCESS_TILES.find((tile) => tile.key === process.openTile);

  return (
    <div className="flex flex-col gap-4">
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

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-semibold text-slate-800">Time &amp; Attendance Process</h2>

        <div className="flex items-center gap-2 flex-wrap">
          <DateField
            label="From"
            value={process.dateFrom}
            onChange={process.setDateFrom}
            className="flex items-center gap-2 text-xs text-slate-500"
          />
          <DateField
            label="Till"
            value={process.dateTo}
            onChange={process.setDateTo}
            className="flex items-center gap-2 text-xs text-slate-500"
          />
          <button
            type="button"
            title="Filter"
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <Filter size={16} />
          </button>
          <button
            type="button"
            onClick={process.handleProcess}
            disabled={process.isProcessing}
            className="h-9 px-4 rounded-lg bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {process.isProcessing ? "Processing…" : "Process"}
          </button>
        </div>
      </div>

      {openTileMeta ? (
        <ProcessDrilldownList
          title={openTileMeta.label}
          color={openTileMeta.color}
          rows={process.drilldownRows}
          isLoading={process.isDrilldownLoading}
          onBack={process.closeProcessTile}
        />
      ) : (
        <>
          <ProcessStatTiles
            summary={process.summary}
            onOpenTile={(tile) => isDrilldownTile(tile) && process.openProcessTile(tile)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <PunchRequestsPanel summary={process.punchRequests} />
            <TemporaryShiftPanel />
            <ProcessHistoryPanel entries={process.history} />
          </div>
        </>
      )}
    </div>
  );
}
