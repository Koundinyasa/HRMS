import {
  AlertTriangle,
  ArrowUpRight,
  CalendarOff,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCcw,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PROCESS_TILES } from "../constants/timeoffice.constants";
import type { ProcessSummary, ProcessTile } from "../types/timeoffice.types";

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

export default function ProcessStatTiles({ summary, onOpenTile }: ProcessStatTilesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {PROCESS_TILES.map((tile) => {
        const Icon = TILE_ICONS[tile.key];
        return (
          <button
            key={tile.key}
            type="button"
            disabled={!tile.hasDrilldown}
            onClick={() => onOpenTile?.(tile.key)}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white shadow-sm px-4 py-3 text-left disabled:cursor-default enabled:hover:bg-slate-50 transition-colors"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${tile.color}1A`, color: tile.color }}
            >
              <Icon size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-slate-800">{summary[tile.key]}</p>
              <p className="text-xs text-slate-500 truncate">{tile.unit}</p>
              <p className="text-xs font-medium text-slate-600 truncate">{tile.label}</p>
            </div>
            {tile.hasDrilldown && <ArrowUpRight size={16} className="shrink-0 text-emerald-500" />}
          </button>
        );
      })}
    </div>
  );
}
