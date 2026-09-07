
import { useState } from "react";

import TicketCard from "./TicketCard";
import EmptyState from "./EmptyState";

import { useHelpDesk } from "../hooks/useHelpDesk";

export default function TicketStatusContent() {
  const {
    myTickets,
    ticketsLoading,
    isError,
    refetchMyTickets,
  } = useHelpDesk();

  // ==================================================
  // PAGINATION
  // ==================================================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const totalPages = Math.ceil(
    myTickets.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentTickets =
    myTickets.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // ==================================================
  // PAGE CHANGE
  // ==================================================

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-4 px-6 pb-2">



      {/* ==================================================
          LOADING
      ================================================== */}

      {ticketsLoading && (
        <div className="flex min-h-[250px] items-center justify-center">

          <p className="text-sm text-slate-500">
            Loading tickets...
          </p>

        </div>
      )}


      {/* ==================================================
          ERROR
      ================================================== */}

      {!ticketsLoading && isError && (
        <div className="rounded-xl border bg-white p-8 text-center">

          <p className="text-red-600">
            Unable to load your tickets.
          </p>

          <button
            type="button"
            onClick={() =>
              refetchMyTickets()
            }
            className="mt-4 rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
          >
            Retry
          </button>

        </div>
      )}


      {/* ==================================================
          EMPTY
      ================================================== */}

      {!ticketsLoading &&
        !isError &&
        myTickets.length === 0 && (
          <EmptyState />
        )}


      {/* ==================================================
          TICKET LIST
      ================================================== */}

      {!ticketsLoading &&
        !isError &&
        myTickets.length > 0 && (

          <>
            <div className="space-y-3">

              {currentTickets.map(
                (ticket) => (
                  <TicketCard
                    key={ticket.ID}
                    ticket={ticket}
                  />
                )
              )}

            </div>


            {/* ==================================================
                PAGINATION
            ================================================== */}

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">

                {/* Previous */}

                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(
                      currentPage - 1
                    )
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>


                {/* Page Numbers */}

                {Array.from(
                  { length: totalPages },
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
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition 
                          ${currentPage === page
                            ? "text-white"
                            : "bg-white text-slate-700 hover:bg-green-50 hover:text-green-700"
                          }`}
                        style={
                          currentPage === page
                            ? {
                              backgroundColor: "#16a34a",
                              borderColor: "#16a34a",
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
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>

              </div>
            )}

          </>
        )}

    </div>
  );
}