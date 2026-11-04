import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  PUNCH_METRIC_ACCENTS,
  PUNCH_METRIC_LABELS,
  PUNCH_TILES_BY_PERIOD,
} from "../constants/timeoffice.constants";
import type { PunchMetric, PunchStatTilesProps } from "../types/timeoffice.types";

export default function PunchStatTiles({
  period,
  totalEmployees,
  counts,
  onOpenMetric,
  header,
}: PunchStatTilesProps) {
  const tiles = PUNCH_TILES_BY_PERIOD[period];
  const [displayedEmployeeTotal, setDisplayedEmployeeTotal] = useState(0);
  const [displayedCounts, setDisplayedCounts] = useState<Partial<Record<PunchMetric, number>>>({});
  const tileCountsKey = tiles.map((tile) => counts[tile] ?? 0).join(",");

  useEffect(() => {
    const target = Math.max(0, Math.trunc(totalEmployees));
    const targets = Object.fromEntries(
      tiles.map((tile) => [tile, Math.max(0, Math.trunc(counts[tile] ?? 0))]),
    ) as Partial<Record<PunchMetric, number>>;
    const duration = 1000;
    let startTime: number | null = null;
    let frameId = 0;

    setDisplayedEmployeeTotal(0);
    setDisplayedCounts(Object.fromEntries(tiles.map((tile) => [tile, 0])) as Partial<Record<PunchMetric, number>>);

    const animate = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayedEmployeeTotal(Math.round(target * easedProgress));
      setDisplayedCounts(
        Object.fromEntries(
          tiles.map((tile) => [tile, Math.round((targets[tile] ?? 0) * easedProgress)]),
        ) as Partial<Record<PunchMetric, number>>,
      );

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [period, totalEmployees, tileCountsKey]);

  // Donut segments mirror the tiles, so the ring always adds up to what's shown.
  const donutData = tiles
    .map((tile) => ({ name: PUNCH_METRIC_LABELS[tile], value: counts[tile] ?? 0, fill: PUNCH_METRIC_ACCENTS[tile] }))
    .filter((segment) => segment.value > 0);

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
      {header}
      <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
        <div className="relative h-[150px] w-[150px] shrink-0">
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
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">{displayedEmployeeTotal}</span>
            <span className="text-[11px] text-slate-500">Total Employees</span>
          </div>
        </div>

        <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((tile) => (
            <button
              key={tile}
              type="button"
              onClick={() => onOpenMetric(tile)}
              className="rounded-xl border border-slate-100 px-4 py-3 text-left shadow-sm transition-colors hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xl font-bold" style={{ color: PUNCH_METRIC_ACCENTS[tile] }}>
                  {displayedCounts[tile] ?? 0}
                </span>
                <Send size={15} style={{ color: PUNCH_METRIC_ACCENTS[tile] }} />
              </div>
              <p className="mt-1 truncate text-xs text-slate-500">{PUNCH_METRIC_LABELS[tile]}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
