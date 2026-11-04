import {
  History,
  Search,
} from "lucide-react";

interface HelpdeskRequestsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onRefresh: () => void;
  disableActions?: boolean;
}

const HelpdeskRequestsFilters = ({
  search,
  onSearchChange,
  onApprove,
  onReject,
  onRefresh,
  disableActions = true,
}: HelpdeskRequestsFiltersProps) => {
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
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
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
            className="h-10 rounded-md bg-green-600 px-5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Approve
          </button>

          <button
            type="button"
            disabled={disableActions}
            onClick={onReject}
            className="h-10 rounded-md bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
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

export default HelpdeskRequestsFilters;