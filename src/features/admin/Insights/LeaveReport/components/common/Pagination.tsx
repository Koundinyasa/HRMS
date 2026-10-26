








// common/Pagination.tsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ROWS_PER_PAGE_OPTIONS } from "../../constants/leaveReport.constants";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startRow = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalCount);

  return (
    <div className="font-[Urbanist] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2 px-4 py-3 bg-white border-t border-[#8B5A2B] text-sm text-gray-600">
      <div className="font-[Urbanist] flex items-center gap-2">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="font-[Urbanist] border border-[#8B5A2B] rounded-md px-2 py-1 text-sm outline-none"
        >
          {ROWS_PER_PAGE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <span>
        {startRow} to {endRow} of {totalCount}
      </span>

      <div className="font-[Urbanist] flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="font-[Urbanist] p-1 rounded disabled:opacity-30 hover:bg-gray-100 transition-colors"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="font-[Urbanist] p-1 rounded disabled:opacity-30 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-[Urbanist] px-2">{page}</span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="font-[Urbanist] p-1 rounded disabled:opacity-30 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="font-[Urbanist] p-1 rounded disabled:opacity-30 hover:bg-gray-100 transition-colors"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}