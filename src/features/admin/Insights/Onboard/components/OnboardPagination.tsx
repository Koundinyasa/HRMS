




interface OnboardPaginationProps {
  currentPage: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export default function OnboardPagination({
  currentPage,
  rowsPerPage,
  totalItems,
  onPageChange,
}: OnboardPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const end = Math.min(currentPage * rowsPerPage + 1, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
      <span className="text-xs text-slate-500">
        Showing 1 to {end} of {totalItems} entries
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 disabled:opacity-40"
        >
          Previous
        </button>

        {Array.from({ length: Math.min(totalPages, 2) }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`h-7 w-7 rounded-md text-xs font-medium ${
              p === currentPage
                ? "bg-[#814A3C] text-white"
                : "border border-slate-300 bg-white text-slate-600"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}