import { ChevronLeft, ChevronRight } from "lucide-react";

interface LeaveDailyPaginationProps {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
}

const LeaveDailyPagination = ({
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
}: LeaveDailyPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-2 py-3 font-[Urbanist]">
      <p className="text-[12px] font-normal leading-[16px] text-slate-500">
        Showing {(pageNumber - 1) * pageSize + 1}–
        {Math.min(pageNumber * pageSize, totalCount)} of {totalCount}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(pageNumber - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        <span className="px-2 text-[12px] font-medium leading-[16px] text-slate-600">
          {pageNumber} / {totalPages}
        </span>

        <button
          type="button"
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default LeaveDailyPagination;