import React from "react";

interface TDSReportPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function TDSReportPagination({
  currentPage,
  totalPages,
  onPageChange,
}: TDSReportPaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex w-full items-center justify-end gap-2 py-4">
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="rounded-md border border-[#d8dee8] bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-9 min-w-9 rounded-md px-3 text-sm ${
              currentPage === page
                ? "bg-[#8b4f40] text-white"
                : "border border-[#d8dee8] bg-white text-[#333]"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rounded-md border border-[#d8dee8] bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}