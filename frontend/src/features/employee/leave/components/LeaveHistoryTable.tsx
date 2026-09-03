import { useState } from "react";


import { Button } from "@/components/ui/button";

import WithdrawLeaveDialog from "./WithdrawLeaveDialog";



import type {
  LeaveHistoryRecord,
  LeaveHistoryTableProps,
} from "../types/leave.types";



export default function LeaveHistoryTable({
  section,
  loading = false,
  refetchLeaveHistory,
}: {
  section: any;
  loading?: boolean;
  refetchLeaveHistory?: () => void;
}) {
  const leaveHistory = section;
  const historyLoading = loading;

  const [selectedRecord, setSelectedRecord] =
    useState<LeaveHistoryRecord | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  // ==================================================
  // PAGINATION
  // ==================================================

  const [currentPage, setCurrentPage] = useState(1);

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
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200"
          style={{
            borderTopColor: "purple",
          }}
        />
      </div>
    );
  }

  // ==================================================
  // RECORDS
  // ==================================================

  const records = leaveHistory?.records ?? [];

  // ==================================================
  // PAGINATION DATA
  // ==================================================

  const totalPages = Math.ceil(
    records.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentRecords = records.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ==================================================
  // HEADERS
  // ==================================================

  const headers = records[0]?.fields ?? [];

  // ==================================================
  // EMPTY STATE
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

  // ==================================================
  // TABLE
  // ==================================================

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">

          {/* ==================================================
              TABLE HEADER
          ================================================== */}

          <thead
            className="text-white"
            style={{
              background: "#7A5BED",
            }}
          >
            <tr>
              {headers.map((field) => (
                <th
                  key={field.label}
                  className={`whitespace-nowrap px-5 py-4 font-semibold ${field.label === "Status"
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
              TABLE BODY
          ================================================== */}

          <tbody>
            {currentRecords.map((record, index) => (
              <tr
                key={startIndex + index}
                className={`border-b transition hover:bg-slate-50 ${index % 2 === 0
                  ? "bg-white"
                  : "bg-slate-50/40"
                  }`}
              >
                {record.fields.map((field) => {

                  // ==========================================
                  // STATUS
                  // ==========================================

                  if (field.label === "Status") {
                    return (
                      <td
                        key={field.label}
                        className="w-36 whitespace-nowrap px-5 py-4"
                      >
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex min-w-[90px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              String(field.value)
                            )}`}
                          >
                            {field.value}
                          </span>
                        </div>
                      </td>
                    );
                  }

                  // ==========================================
                  // LEAVE TYPE
                  // ==========================================

                  if (field.label === "Leave Type") {
                    return (
                      <td
                        key={field.label}
                        className="whitespace-nowrap px-5 py-4"
                      >
                        <span
                          className="
    inline-flex
    rounded-full
    !bg-purple-100
    px-3
    py-1
    text-xs
    font-semibold
    !text-purple-700
  "
                        >
                          {field.value}
                        </span>
                      </td>
                    );
                  }

                  // ==========================================
                  // ACTION
                  // ==========================================

                  if (field.label === "Action") {
                    const actionId = Number(field.value);

                    return (
                      <td
                        key={field.label}
                        className="w-36 whitespace-nowrap px-5 py-4 text-center"
                      >
                        {actionId > 0 && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(record);
                              setDialogOpen(true);
                            }}
                            className="!bg-[#7c3aed] !text-white hover:!bg-[#6d28d9]"
                          >
                            Withdraw
                          </Button>
                        )}
                      </td>
                    );
                  }

                  // ==========================================
                  // NORMAL FIELD
                  // ==========================================

                  return (
                    <td
                      key={field.label}
                      className="whitespace-nowrap px-5 py-4"
                    >
                      {field.value ?? "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ==================================================
          PAGINATION
      ================================================== */}

      {totalPages > 1 && (
        <div
          className="
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-1
            px-1
            sm:gap-2
          "
        >

          {/* ==================================================
              PREVIOUS
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setCurrentPage(
                (page) => Math.max(1, page - 1)
              )
            }
            disabled={currentPage === 1}
            className="
        shrink-0
        rounded-lg
        border
        px-3
        py-2
        text-sm
        font-medium
        transition
        hover:bg-slate-50
        disabled:cursor-not-allowed
        disabled:opacity-50
        sm:px-4
      "
          >
            Previous
          </button>

          {/* ==================================================
              PAGE 1
          ================================================== */}

          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`
  h-9
  w-9
  shrink-0
  rounded-lg
  border
  text-sm
  font-medium
  transition
  ${currentPage === 1
                ? "!bg-[#7c3aed] !border-[#7c3aed] !text-white"
                : "bg-white text-slate-700 hover:bg-slate-50"
              }
`}
          >
            1
          </button>

          {/* ==================================================
              PAGE 2
          ================================================== */}

          {totalPages >= 2 && (
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className={`
  h-9
  w-9
  shrink-0
  rounded-lg
  border
  text-sm
  font-medium
  transition
  ${currentPage === 2
                  ? "!bg-[#7c3aed] !border-[#7c3aed] !text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50"
                }
`}
            >
              2
            </button>
          )}

          {/* ==================================================
              NEXT
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setCurrentPage(
                (page) => Math.min(totalPages, page + 1)
              )
            }
            disabled={
              currentPage === totalPages
            }
            className="
              shrink-0
        rounded-lg
        border
        px-3
        py-2
        text-sm
        font-medium
        transition
        hover:bg-slate-50
        disabled:cursor-not-allowed
        disabled:opacity-50
        sm:px-4
            "
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

          setCurrentPage(1);
        }}
      />
    </>
  );
}
