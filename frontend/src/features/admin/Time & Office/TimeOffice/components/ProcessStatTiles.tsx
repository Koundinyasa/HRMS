import {
  AlertTriangle,
  CalendarDays,
  CalendarOff,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCcw,
  Send,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { PROCESS_TILES } from "../constants/timeoffice.constants";
import type {
  ProcessSummary,
  ProcessTile,
} from "../types/timeoffice.types";

const TILE_ICONS: Record<ProcessTile, LucideIcon> = {
  timeAttendance: Users,
  nonTimeAttendance: FileText,
  missedPunch: AlertTriangle,
  shiftUnassigned: CalendarOff,
  processed: CheckCircle2,
  yetToProcess: Clock,
  reProcessEffectiveDate: RefreshCcw,
  allReProcess: TrendingUp,
};

interface ProcessStatTilesProps {
  summary: ProcessSummary;
  onOpenTile?: (tile: ProcessTile) => void;
}

export default function ProcessStatTiles({
  summary,
  onOpenTile,
}: ProcessStatTilesProps) {
  const [displayedCounts, setDisplayedCounts] = useState<Partial<Record<ProcessTile, number>>>({});
  const tileCountsKey = PROCESS_TILES.map((tile) => summary[tile.key]).join(",");

  useEffect(() => {
    const targets = Object.fromEntries(
      PROCESS_TILES.map((tile) => [tile.key, Math.max(0, Math.trunc(summary[tile.key] ?? 0))]),
    ) as Partial<Record<ProcessTile, number>>;
    const duration = 1000;
    let startTime: number | null = null;
    let frameId = 0;

    setDisplayedCounts(Object.fromEntries(PROCESS_TILES.map((tile) => [tile.key, 0])) as Partial<Record<ProcessTile, number>>);

    const animate = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayedCounts(
        Object.fromEntries(
          PROCESS_TILES.map((tile) => [tile.key, Math.round((targets[tile.key] ?? 0) * easedProgress)]),
        ) as Partial<Record<ProcessTile, number>>,
      );

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [tileCountsKey]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {PROCESS_TILES.map((tile) => {
        const Icon = TILE_ICONS[tile.key];
        const canOpen = tile.hasDrilldown || tile.actionable;

        return (
          <div
            key={tile.key}
            className={[
              "group flex min-h-[88px] min-w-0 items-center gap-3",
              "rounded-md border border-slate-200 bg-white px-3 py-2",
              "text-left shadow-sm",
            ].join(" ")}
          >
            {/* Icon */}
            <span
              className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-xl shadow-sm"
              style={{
                backgroundColor: `${tile.color}12`,
                color: tile.color,
              }}
            >
              {tile.key === "nonTimeAttendance" ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 32 32"
                  width="38"
                  height="42"
                  fill="currentColor"
                >
                  <path d="M12 5a4 4 0 0 1 8 0h4a2 2 0 0 1 2 2v19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4Zm2 0a2 2 0 0 0 4 0 2 2 0 0 0-4 0Z" />
                  <path
                    fill="white"
                    d="M11 12h10v2H11zm0 5h10v2H11zm0 5h7v2h-7z"
                  />
                </svg>
              ) : tile.key === "missedPunch" ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 32 32"
                  width="38"
                  height="38"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.2 4.8a2.1 2.1 0 0 1 3.6 0l11 19.1a2.1 2.1 0 0 1-1.8 3.1H5a2.1 2.1 0 0 1-1.8-3.1l11-19.1Z" />
                  <path d="M16 11v7" />
                  <circle cx="16" cy="22" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              ) : tile.key === "shiftUnassigned" ? (
                <CalendarDays size={31} strokeWidth={2.8} />
              ) : tile.key === "timeAttendance" ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 32 32"
                  width="32"
                  height="32"
                  fill="currentColor"
                >
                  <circle cx="16" cy="8" r="4" />
                  <circle cx="7" cy="12" r="3" />
                  <circle cx="25" cy="12" r="3" />
                  <path d="M8 24v-2a8 8 0 0 1 16 0v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z" />
                  <path d="M1 22v-1a6 6 0 0 1 6-6h.4a9.5 9.5 0 0 0-2 6v2H2a1 1 0 0 1-1-1Zm30 0a1 1 0 0 1-1 1h-3.4v-2a9.5 9.5 0 0 0-2-6h.4a6 6 0 0 1 6 6Z" />
                </svg>
              ) : (
                <Icon size={31} strokeWidth={2.5} />
              )}
            </span>

            {/* Tile label and count */}
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="whitespace-nowrap text-[13px] font-semibold leading-5 tracking-tight text-slate-800">
                {tile.label}
              </span>

              <span className="flex min-w-0 flex-nowrap items-baseline gap-x-2">
                <span
                  className="inline-block shrink-0 text-right text-[30px] font-bold leading-8 tabular-nums text-slate-900"
                  style={{ width: `${Math.max(2, String(Math.trunc(summary[tile.key] ?? 0)).length)}ch` }}
                >
                  {displayedCounts[tile.key] ?? 0}
                </span>

                <span className="whitespace-nowrap text-sm font-medium text-slate-400">
                  {tile.unit}
                </span>
              </span>
            </span>

            {/* Existing drill-down indicator */}
            {canOpen && tile.key !== "processed" && tile.key !== "yetToProcess" && (
              <button
                type="button"
                aria-label={`Open ${tile.label}`}
                onClick={() => onOpenTile?.(tile.key)}
                className="shrink-0 rounded p-1 text-sky-500 transition-colors hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <Send
                  size={23}
                  strokeWidth={1.5}
                  fill="currentColor"
                  className="transition-transform hover:translate-x-0.5 hover:-translate-y-0.5"
                />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
