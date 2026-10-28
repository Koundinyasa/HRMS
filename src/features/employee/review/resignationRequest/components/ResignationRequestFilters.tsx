import { History, Search } from "lucide-react";

interface ResignationRequestFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onRefresh: () => void;
  disableActions?: boolean;
}

const ResignationRequestFilters = ({
  search,
  onSearchChange,
  onApprove,
  onReject,
  onRefresh,
  disableActions = true,
}: ResignationRequestFiltersProps) => {
  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-[290px]">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search employee"
              className="h-10 w-full rounded-md border-0 bg-slate-100 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-2 lg:justify-end">
          <button
            type="button"
            disabled={disableActions}
            onClick={onApprove}
            className={`h-10 rounded-md border px-5 text-sm font-medium transition disabled:cursor-not-allowed ${
              disableActions
                ? "border-slate-200 bg-slate-200 text-slate-400"
                : "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
            }`}
          >
            Approve
          </button>

          <button
            type="button"
            disabled={disableActions}
            onClick={onReject}
            className={`h-10 rounded-md border px-5 text-sm font-medium transition disabled:cursor-not-allowed ${
              disableActions
                ? "border-slate-200 bg-slate-200 text-slate-400"
                : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            Reject
          </button>

          <button
            type="button"
            onClick={onRefresh}
            title="Refresh"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-md text-blue-400 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <History size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResignationRequestFilters;