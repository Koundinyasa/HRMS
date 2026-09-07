import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { History, SlidersHorizontal } from "lucide-react";
import RegularizationLayout from "./RegularizationLayout";
import PunchFilterBar from "../../components/PunchFilterBar";
import DateField from "../../components/DateField";
import ProcessDrilldownList from "../../components/ProcessDrilldownList";
import { useGetTaInsightsDetailsQuery, useGetTaInsightsSummaryQuery } from "../../api/regularizationApi";
import { INSIGHT_TILES } from "../../constants/regularization.mock";
import type { PunchFilters } from "../../types/timeoffice.types";

export default function TaInsightsPage() {
  const [from, setFrom] = useState("2026-06-11");
  const [to, setTo] = useState("2026-06-11");
  const [filters, setFilters] = useState<PunchFilters>({});
  const [openTile, setOpenTile] = useState<{ key: string; label: string; color: string } | null>(null);

  const { data: tiles = INSIGHT_TILES } = useGetTaInsightsSummaryQuery({ fromDate: from, toDate: to });
  const { data: details = [], isFetching: isDetailsLoading } = useGetTaInsightsDetailsQuery(
    openTile ? { type: openTile.key, fromDate: from, toDate: to } : skipToken
  );

  return (
    <RegularizationLayout>
      <div className="flex items-center justify-end gap-2 flex-wrap">
        <DateField label="From" value={from} onChange={setFrom} />
        <DateField label="To" value={to} onChange={setTo} />
        <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white">
          <SlidersHorizontal size={16} />
        </button>
        <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white">
          <History size={16} />
        </button>
      </div>

      <PunchFilterBar rows={[]} filters={filters} onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))} onClear={() => setFilters({})} />

      {openTile ? (
        <ProcessDrilldownList
          title={openTile.label}
          color={openTile.color}
          rows={details}
          isLoading={isDetailsLoading}
          onBack={() => setOpenTile(null)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          {tiles.map((tile) => (
            <div key={tile.key} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">{tile.label}</p>
              <p className="text-2xl font-bold" style={{ color: tile.color }}>
                {tile.value} <span className="text-sm font-normal text-slate-400">- {tile.total} Employee(s)</span>
              </p>
              <button
                type="button"
                disabled={!tile.active}
                onClick={() => setOpenTile({ key: tile.key, label: tile.label, color: tile.color })}
                className="text-xs font-medium text-left disabled:text-slate-300"
                style={tile.active ? { color: tile.color } : undefined}
              >
                View Details {tile.active && "›"}
              </button>
            </div>
          ))}
        </div>
      )}
    </RegularizationLayout>
  );
}
