import { ArrowUpRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  PUNCH_METRIC_ACCENTS,
  PUNCH_METRIC_LABELS,
  PUNCH_TILES_BY_PERIOD,
} from "../constants/timeoffice.constants";
import type { PunchMetric, PunchPeriod } from "../types/timeoffice.types";

interface PunchStatTilesProps {
  period: PunchPeriod;
  totalEmployees: number;
  counts: Record<PunchMetric, number>;
  onOpenMetric: (metric: PunchMetric) => void;
}

export default function PunchStatTiles({
  period,
  totalEmployees,
  counts,
  onOpenMetric,
}: PunchStatTilesProps) {
  const tiles = PUNCH_TILES_BY_PERIOD[period];

  // Donut segments mirror the tiles, so the ring always adds up to what's shown.
  const donutData = tiles
    .map((tile) => ({ name: PUNCH_METRIC_LABELS[tile], value: counts[tile] ?? 0, fill: PUNCH_METRIC_ACCENTS[tile] }))
    .filter((segment) => segment.value > 0);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-6 flex-wrap lg:flex-nowrap">
      <div className="relative w-[150px] h-[150px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData.length ? donutData : [{ name: "None", value: 1, fill: "#E2E8F0" }]}
              dataKey="value"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={2}
              stroke="none"
            >
              {(donutData.length ? donutData : [{ fill: "#E2E8F0" }]).map((segment, index) => (
                <Cell key={index} fill={segment.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-800">{totalEmployees}</span>
          <span className="text-[11px] text-slate-500">Total Employees</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 min-w-0">
        {tiles.map((tile) => (
          <button
            key={tile}
            type="button"
            onClick={() => onOpenMetric(tile)}
            className="text-left rounded-xl border border-slate-100 shadow-sm px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xl font-bold" style={{ color: PUNCH_METRIC_ACCENTS[tile] }}>
                {counts[tile] ?? 0}
              </span>
              <ArrowUpRight size={15} style={{ color: PUNCH_METRIC_ACCENTS[tile] }} />
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">{PUNCH_METRIC_LABELS[tile]}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
