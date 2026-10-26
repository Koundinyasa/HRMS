import { useState } from "react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

import WithdrawLeaveDialog from "../components/WithdrawLeaveDialog";

import { useLeave } from "../hooks/useLeave";

interface LeaveField {
  label: string;
  value: string | number | null;
}

interface LeaveHistoryRecord {
  fields: LeaveField[];
}

export default function LeaveHistoryTable() {
  const {
    leaveHistory,
    historyLoading,
    refetchLeaveHistory,
  } = useLeave();

  const [selectedRecord, setSelectedRecord] =
    useState<LeaveHistoryRecord | null>(null);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  // ==================================================
  // PAGINATION
  // ==================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 7;

  // ==================================================
  // STATUS CLASS
  // ==================================================

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "withdrawn":
        return "bg-orange-100 text-orange-700";

      case "cancelled":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (historyLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader />
      </div>
    );
  }

  // ==================================================
  // RECORDS
  // ==================================================

  const records =
    leaveHistory?.records ?? [];

  // ==================================================
  // PAGINATION DATA
  // ==================================================

  const totalPages = Math.ceil(
    records.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentRecords =
    records.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // ==================================================
  // HEADERS
  // ==================================================

  const headers =
    records[0]?.fields ?? [];

  // ==================================================
  // EMPTY
  // ==================================================

  if (records.length === 0) {
    return (
      <>
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-slate-500">
            No leave history available.
          </p>
        </div>
        <WithdrawLeaveDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          record={selectedRecord}
          onSuccess={() => {
            refetchLeaveHistory();
            setDialogOpen(false);
            setSelectedRecord(null);
            setCurrentPage(1);
          }}
        />
      </>
    );
  }
  return (
    <>
      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="overflow-x-auto rounded-lg border">

        <table className="min-w-full text-sm">

          {/* ==================================================
              HEADER
          ================================================== */}

          <thead
            className="text-white"
            style={{
              backgroundColor: "#7C3AED",
            }}
          >
            <tr>

              {headers.map((field) => (
                <th
                  key={field.label}
                  className={`px-5 py-4 font-semibold ${field.label === "Status"
                    ? "w-36 text-center"
                    : field.label === "Action"
                      ? "w-36 text-center"
                      : "text-left"
                    }`}
                >
                  {field.label}
                </th>
              ))}

            </tr>
          </thead>

          {/* ==================================================
              BODY
          ================================================== */}

          <tbody>

            {currentRecords.map(
              (record, index) => (

                <tr
                  key={startIndex + index}
                  className={`border-b transition hover:bg-slate-50 ${index % 2 === 0
                    ? "bg-white"
                    : "bg-slate-50/40"
                    }`}
                >

                  {record.fields.map(
                    (field) => {

                      // ======================================
                      // STATUS
                      // ======================================

                      if (
                        field.label === "Status"
                      ) {
                        return (
                          <td
                            key={field.label}
                            className="w-36 px-5 py-4"
                          >
                            <div className="flex justify-center">
                              <span
                                className={`inline-flex min-w-[90px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                  String(
                                    field.value
                                  )
                                )}`}
                              >
                                {field.value}
                              </span>
                            </div>
                          </td>
                        );
                      }

                      // ======================================
                      // LEAVE TYPE
                      // ======================================

                      if (
                        field.label ===
                        "Leave Type"
                      ) {
                        return (
                          <td
                            key={field.label}
                            className="px-5 py-4"
                          >
                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                              {field.value}
                            </span>
                          </td>
                        );
                      }

                      // ======================================
                      // ACTION
                      // ======================================

                      if (
                        field.label === "Action"
                      ) {
                        const actionId =
                          Number(
                            field.value
                          );
                        return (
                          <td
                            key={field.label}
                            className="w-36 px-5 py-4 text-center"
                          >
                            {actionId > 0 && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRecord(
                                    record
                                  );
                                  setDialogOpen(
                                    true
                                  );
                                }}
                                style={{
                                  backgroundColor: "#7C3AED",
                                }}
                              >
                                Withdraw
                              </Button>
                            )}
                          </td>
                        );
                      }

                      // ======================================
                      // NORMAL FIELD
                      // ======================================

                      return (
                        <td
                          key={field.label}
                          className="px-5 py-4"
                        >
                          {field.value ?? "-"}
                        </td>
                      );
                    }
                  )}

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      {/* ==================================================
          PAGINATION
      ================================================== */}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">

          {/* PREVIOUS */}

          <button
            type="button"
            onClick={() =>
              setCurrentPage(
                (page) => page - 1
              )
            }
            disabled={currentPage === 1}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {/* PAGE NUMBERS */}

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
                    setCurrentPage(page)
                  }
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${currentPage === page
                    ? "text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  style={
                    currentPage === page
                      ? {
                        backgroundColor:
                          "#7C3AED",
                        borderColor:
                          "#7C3AED",
                      }
                      : {}
                  }
                >
                  {page}
                </button>
              );
            }
          )}

          {/* NEXT */}

          <button
            type="button"
            onClick={() =>
              setCurrentPage(
                (page) => page + 1
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

      {/* ==================================================
          WITHDRAW DIALOG
      ================================================== */}

      <WithdrawLeaveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={selectedRecord}
        onSuccess={() => {
          refetchLeaveHistory();

          setDialogOpen(false);

          setSelectedRecord(null);

          // Return to first page after withdrawal
          setCurrentPage(1);
        }}
      />
    </>
  );
}


