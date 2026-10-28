// import { Button } from "@/components/ui/button";
// import React from "react";

// interface TimeOfficePaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export default function TimeOfficePagination({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: TimeOfficePaginationProps) {
//   if (totalPages <= 1) {
//     return null;
//   }

//   return (
//     <div className="mt-4 flex items-center justify-end gap-2">
//       <Button variant="ghost"
//         type="button"
//         disabled={currentPage === 1}
//         onClick={() => onPageChange(currentPage - 1)}
//         className="rounded border border-[#d1d5db] px-3 py-1.5 text-sm text-[#4b5563] hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
//       >
//         Previous
//       </Button>

//       <span className="px-2 text-sm text-[#4b5563]">
//         Page {currentPage} of {totalPages}
//       </span>

//       <Button variant="ghost"
//         type="button"
//         disabled={currentPage === totalPages}
//         onClick={() => onPageChange(currentPage + 1)}
//         className="rounded border border-[#d1d5db] px-3 py-1.5 text-sm text-[#4b5563] hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
//       >
//         Next
//       </Button>
//     </div>
//   );
// }
import { Button } from "@/components/ui/button";

interface TimeOfficePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function TimeOfficePagination({
  currentPage,
  totalPages,
  onPageChange,
}: TimeOfficePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-[34px] rounded-md border border-[#dfe3e8] bg-white px-3 font-[Urbanist] text-[12px] font-medium text-[#344054] shadow-none hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </Button>

      <span className="px-2 font-[Urbanist] text-[12px] font-medium text-[#667085]">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="ghost"
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-[34px] rounded-md border border-[#dfe3e8] bg-white px-3 font-[Urbanist] text-[12px] font-medium text-[#344054] shadow-none hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
}