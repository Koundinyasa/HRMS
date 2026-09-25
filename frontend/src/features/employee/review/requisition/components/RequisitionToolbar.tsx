import { Search, History } from "lucide-react";
import type {
  RequisitionToolbarProps,
} from "../types/requisition.types";
export default function RequisitionToolbar({
  search,
  onSearchChange,
  onApprove,
  onReject,
  onHistory,
  hasSelection,
  approved = false,
}: RequisitionToolbarProps) {
  return (
    <div className="relative flex min-h-[74px] flex-col items-stretch justify-between gap-3 rounded-md border border-black bg-white px-4 py-3 md:flex-row md:items-center font-[Urbanist]">
      <div className="hidden md:block md:w-1/3 font-[Urbanist]" />

      <div className="flex h-10 w-full items-center gap-3 rounded-md bg-[#e9eaec] px-4 md:absolute md:left-1/2 md:w-[300px] md:-translate-x-1/2 font-[Urbanist]">
        <Search
          size={18}
          className="shrink-0 text-[#91a6c7] font-[Urbanist]"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search employee"
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-[Urbanist]"
        />
      </div>

      <div className="flex items-center justify-end gap-2 md:ml-auto font-[Urbanist]">
        <button
          type="button"
          onClick={onApprove}
          disabled={!hasSelection}
          className={`h-[42px] rounded-md border px-4 text-sm transition disabled:cursor-not-allowed ${
            approved
              ? "border-green-600 bg-green-600 text-white"
              : hasSelection
              ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
              : "border-slate-200 bg-[#e1e1e1] text-[#9ca3af]"
          }`}
        >
          Approve
        </button>

        <button
          type="button"
          onClick={onReject}
          disabled={!hasSelection}
          className={`h-[42px] rounded-md border px-4 text-sm transition disabled:cursor-not-allowed ${
            hasSelection
              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              : "border-slate-200 bg-[#e1e1e1] text-[#9ca3af]"
          }`}
        >
          Reject
        </button>

        <button
          type="button"
          onClick={onHistory}
          title="Leave history"
          aria-label="Leave history"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#91a6c7] hover:bg-slate-100 font-[Urbanist]"
        >
          <History size={23} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}