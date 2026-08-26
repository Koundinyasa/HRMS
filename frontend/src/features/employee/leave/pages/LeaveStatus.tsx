import { useState } from "react";
 
import LeaveStatusCard from "../components/LeaveStatusCard";
 
import { useLeave } from "../hooks/useLeave";
 
export default function LeaveStatus() {
  const {
    leaveStatus,
    statusLoading,
  } = useLeave();
 
  // ==================================================
  // PAGINATION
  // ==================================================
 
  const [currentPage, setCurrentPage] = useState(1);
 
  const itemsPerPage = 3;
 
  // ==================================================
  // SORT LEAVE STATUS
  // ==================================================
 
  const sortedLeaveStatus = [...leaveStatus].sort(
    (a, b) => {
 
      // Parse AppliedDate (DD-MM-YYYY)
      const parseAppliedDate = (date: string) => {
        const [
          day,
          month,
          year,
        ] = date
          .split("-")
          .map(Number);
 
        return new Date(
          year,
          month - 1,
          day
        ).getTime();
      };
 
      // First compare AppliedDate
      const appliedDateDiff =
        parseAppliedDate(b.AppliedDate) -
        parseAppliedDate(a.AppliedDate);
 
      if (appliedDateDiff !== 0) {
        return appliedDateDiff;
      }
 
      // If AppliedDate is same,
      // compare FromDate
      return (
        new Date(b.FromDate).getTime() -
        new Date(a.FromDate).getTime()
      );
    }
  );
 
  // ==================================================
  // TOTAL PAGES
  // ==================================================
 
  const totalPages = Math.ceil(
    sortedLeaveStatus.length /
      itemsPerPage
  );
 
  // ==================================================
  // CURRENT PAGE DATA
  // ==================================================
 
  const startIndex =
    (currentPage - 1) *
    itemsPerPage;
 
  const currentLeaves =
    sortedLeaveStatus.slice(
      startIndex,
      startIndex + itemsPerPage
    );
 
  // ==================================================
  // PAGE CHANGE
  // ==================================================
 
  const handlePageChange = (
    page: number
  ) => {
    setCurrentPage(page);
  };
 
  // ==================================================
  // LOADING
  // ==================================================
 
  if (statusLoading) {
    return (
      <div className="flex justify-center py-12">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200"
          style={{
            borderTopColor:
              "var(--primary-color)",
          }}
        />
      </div>
    );
  }
 
  // ==================================================
  // EMPTY
  // ==================================================
 
  if (leaveStatus.length === 0) {
    return (
      <div className="space-y-6">
 
        <div className="rounded-lg border border-dashed py-12 text-center">
 
          <p className="text-slate-500">
            No leave requests found.
          </p>
 
        </div>
 
      </div>
    );
  }
 
  // ==================================================
  // UI
  // ==================================================
 
  return (
    <div className="space-y-2">
 
      {/* ==========================================
          LEAVE CARDS
      ========================================== */}
 
      <div className="space-y-2">
 
        {currentLeaves.map(
          (leave, index) => (
            <LeaveStatusCard
              key={leave.Id}
              leave={leave}
              defaultExpanded={
                currentPage === 1 &&
                index === 0
              }
            />
          )
        )}
 
      </div>
 
      {/* ==========================================
          PAGINATION
      ========================================== */}
 
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-1">
 
          {/* Previous */}
 
          <button
            type="button"
            onClick={() =>
              handlePageChange(
                currentPage - 1
              )
            }
            disabled={
              currentPage === 1
            }
            className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
 
          {/* Page Numbers */}
 
          {Array.from(
            {
              length: totalPages,
            },
            (_, index) => {
 
              const page =
                index + 1;
 
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    handlePageChange(page)
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                    currentPage === page
                      ? "text-white"
                      : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  style={
                    currentPage === page
                      ? {
                          backgroundColor:
                            "var(--primary-color)",
                          borderColor:
                            "var(--primary-color)",
                        }
                      : {}
                  }
                >
                  {page}
                </button>
              );
            }
          )}
 
          {/* Next */}
 
          <button
            type="button"
            onClick={() =>
              handlePageChange(
                currentPage + 1
              )
            }
            disabled={
              currentPage === totalPages
            }
            className="rounded-lg border px-3 py-1.5 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
 
        </div>
      )}
 
    </div>
  );
}
 