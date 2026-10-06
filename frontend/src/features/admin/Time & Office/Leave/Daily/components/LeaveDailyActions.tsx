import { FileSpreadsheet, RotateCcw } from "lucide-react";

interface LeaveDailyActionsProps {
  onExport?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
}

const LeaveDailyActions = ({
  onExport,
  onRefresh,
  loading = false,
}: LeaveDailyActionsProps) => {
  return (
    <div className="flex items-center gap-2 font-[Urbanist]">
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Refresh"
          title="Refresh"
        >
          <RotateCcw size={16} />
        </button>
      )}

      {onExport && (
        <button
          type="button"
          onClick={onExport}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Export to Excel"
          title="Export to Excel"
        >
          <FileSpreadsheet size={17} />
        </button>
      )}
    </div>
  );
};

export default LeaveDailyActions;