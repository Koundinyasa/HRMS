import { useState } from "react";

import { Button } from "@/components/ui/button";

// import Loader from "@/components/ui/loader";

import WithdrawLeaveDialog from "./WithdrawLeaveDialog";

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

  if (historyLoading) {
    return (
      <div className="flex justify-center py-10">
        {/* <Loader /> */}
      </div>
    );
  }

  const headers =
    leaveHistory?.records[0]?.fields ?? [];
  return (
    <>
      {!leaveHistory?.records.length ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-slate-500">
            No leave history available.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">

          <table className="min-w-full text-sm">

            <thead
              className="text-white"
              style={{
                background: "var(--primary-color)",
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

            <tbody>
              {leaveHistory.records.map(
                (record, index) => (
                  <tr
                    key={index}
                    className={`border-b transition hover:bg-slate-50 ${index % 2 === 0
                      ? "bg-white"
                      : "bg-slate-50/40"
                      }`}
                  >
                    {record.fields.map((field) => {
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
                                  String(field.value)
                                )}`}
                              >
                                {field.value}
                              </span>
                            </div>
                          </td>
                        );
                      }

                      if (
                        field.label ===
                        "Leave Type"
                      ) {
                        return (
                          <td
                            key={field.label}
                            className="px-5 py-4"
                          >
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              {field.value}
                            </span>
                          </td>
                        );
                      }

                      if (
                        field.label ===
                        "Action"
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
                            {actionId > 0 ? (
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
                                  background:
                                    "var(--primary-color)",
                                }}
                              >
                                Withdraw
                              </Button>
                            ) : null
                            }
                          </td>
                        );
                      }

                      return (
                        <td
                          key={field.label}
                          className="px-5 py-4"
                        >
                          {field.value ?? "-"}
                        </td>
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>

          </table>

        </div>
      )}
      <WithdrawLeaveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={selectedRecord}
        onSuccess={() => {
          refetchLeaveHistory();
          setDialogOpen(false);
          setSelectedRecord(null);
        }}
      />
    </>
  );
}
