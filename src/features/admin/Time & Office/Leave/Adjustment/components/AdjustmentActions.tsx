import {
  CalendarDays,
  Filter,
  Plus,
  Trash2,
} from "lucide-react";

interface AdjustmentActionsProps {
  month?: string;
  onMonthChange?: (value: string) => void;
  onDelete?: () => void;
  onAddNew?: () => void;
  onFilter?: () => void;
  hasSelection?: boolean;
}

const AdjustmentActions = ({
  month = "",
  onMonthChange,
  onDelete,
  onAddNew,
  onFilter,
  hasSelection = false,
}: AdjustmentActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-2 font-[Urbanist]">
      {/* Month / Year */}
      <div className="relative">
        <CalendarDays
          size={15}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="month"
          value={month}
          onChange={(event) => onMonthChange?.(event.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white pl-9 pr-3 text-[13px] font-medium text-slate-600 outline-none focus:border-[#9a5547]"
        />
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        disabled={!hasSelection}
        className="flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 size={15} strokeWidth={1.8} />
        Delete
      </button>

      {/* Add New Record */}
      <button
        type="button"
        onClick={onAddNew}
        className="flex h-9 items-center gap-1.5 rounded-md bg-[#9a5547] px-3 text-[13px] font-semibold text-white transition hover:bg-[#7f4234]"
      >
        <Plus size={15} strokeWidth={2} />
        Add New Record
      </button>

      {/* Filter */}
      <button
        type="button"
        onClick={onFilter}
        className="flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
      >
        <Filter size={15} strokeWidth={1.8} />
        Filter
      </button>
    </div>
  );
};

export default AdjustmentActions;