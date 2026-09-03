import { useState } from "react";
 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
 
import { Button } from "@/components/ui/button";
 
import { useLeave } from "../hooks/useLeave";
import { useWithdrawLeave } from "../hooks/useWithdrawLeave";
 
export default function LeaveCancellation() {
  const {
    leaveHistory,
    historyLoading,
    refetchLeaveHistory,
  } = useLeave();
 
  const {
    withdrawLeave,
    isSubmitting,
  } = useWithdrawLeave();
 
  const [selectedLeaveId, setSelectedLeaveId] =
    useState<number | null>(null);
 
  const [reason, setReason] = useState("");
 
  // ==================================================
  // STATUS CLASS
  // ==================================================
 
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
 
      case "rejected":
        return "bg-red-100 text-red-700";
 
      case "pending":
        return "bg-yellow-100 text-yellow-700";
 
      case "withdrawn":
        return "bg-orange-100 text-orange-700";
 
      case "cancelled":
        return "bg-gray-200 text-gray-700";
 
      default:
        return "bg-slate-100 text-slate-700";
    }
  };
 
  // ==================================================
  // WITHDRAW LEAVE
  // ==================================================
 
  const handleWithdraw = async (
    leaveApplicationId: number
  ) => {
    if (!reason.trim()) {
      alert("Please enter a withdrawal reason.");
      return;
    }
 
    const response = await withdrawLeave({
      leaveApplicationId,
      actionId: 38,
      reason,
    });
 
    if (response) {
      setSelectedLeaveId(null);
      setReason("");
      refetchLeaveHistory();
    }
  };
 
  // ==================================================
  // LOADING
  // ==================================================
 
  if (historyLoading) {
    return (
      <div className="flex justify-center py-12">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200"
          style={{
            borderTopColor: "var(--primary-color)",
          }}
        />
      </div>
    );
  }
 
  // ==================================================
  // MAIN
  // ==================================================
 
  return (
    <Card className="border shadow-md">
 
      {/* ==================================================
          HEADER
      ================================================== */}
 
      <CardHeader className="pb-3">
 
        <CardTitle className="text-xl">
          Leave Cancellation
        </CardTitle>
 
        <p className="text-sm text-slate-500">
          Withdraw pending leave requests or view previously
          processed requests.
        </p>
 
      </CardHeader>
 
      {/* ==================================================
          CONTENT
      ================================================== */}
 
      <CardContent>
 
        {/* ==================================================
            EMPTY STATE
        ================================================== */}
 
        {leaveHistory.length === 0 ? (
 
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
 
            <p className="text-sm text-slate-500">
              No leave applications found.
            </p>
 
          </div>
 
        ) : (
 
          <div className="space-y-5">
 
            {/* ==================================================
                LEAVE APPLICATIONS
            ================================================== */}
 
            {leaveHistory.map((leave) => {
 
              const canWithdraw =
                leave.Status.toLowerCase() === "pending";
 
              return (
 
                <Card
                  key={leave.LeaveId}
                  className="border shadow-sm transition hover:shadow-md"
                >
 
                  <CardContent className="p-5">
 
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
 
                      {/* ==================================================
                          LEAVE DETAILS
                      ================================================== */}
 
                      <div className="space-y-3">
 
                        {/* Leave Type + Status */}
 
                        <div className="flex items-center gap-3">
 
                          {/* Leave Type */}
 
                          <span
                            className="
                              inline-flex
                              rounded-full
                              bg-blue-100
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-blue-700
                            "
                          >
                            {leave.LeaveTypeName}
                          </span>
 
                          {/* Status */}
 
                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              ${getStatusClass(leave.Status)}
                            `}
                          >
                            {leave.Status}
                          </span>
 
                        </div>
 
                        {/* ==================================================
                            DATE DETAILS
                        ================================================== */}
 
                        <div className="grid gap-3 sm:grid-cols-2">
 
                          {/* From Date */}
 
                          <div>
 
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              From Date
                            </p>
 
                            <p className="font-medium">
                              {leave.FromDate}
                            </p>
 
                          </div>
 
                          {/* To Date */}
 
                          <div>
 
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              To Date
                            </p>
 
                            <p className="font-medium">
                              {leave.ToDate}
                            </p>
 
                          </div>
 
                          {/* Reason */}
 
                          <div className="sm:col-span-2">
 
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Reason
                            </p>
 
                            <p className="font-medium">
                              {leave.Reason || "-"}
                            </p>
 
                          </div>
 
                        </div>
 
                      </div>
 
                      {/* ==================================================
                          WITHDRAW SECTION
                      ================================================== */}
 
                      <div className="min-w-[220px]">
 
                        {canWithdraw ? (
 
                          selectedLeaveId ===
                          Number(leave.LeaveId) ? (
 
                            <div className="space-y-4">
 
                              {/* Withdrawal Reason */}
 
                              <div>
 
                                <label
                                  htmlFor={`withdraw-reason-${leave.LeaveId}`}
                                  className="mb-2 block text-sm font-medium"
                                >
                                  Withdrawal Reason
                                </label>
 
                                <textarea
                                  id={`withdraw-reason-${leave.LeaveId}`}
                                  rows={4}
                                  value={reason}
                                  placeholder="Enter reason for withdrawal..."
                                  onChange={(e) =>
                                    setReason(e.target.value)
                                  }
                                  className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                  "
                                />
 
                              </div>
 
                              {/* Buttons */}
 
                              <div className="flex gap-3">
 
                                {/* Confirm */}
 
                                <Button
                                  disabled={isSubmitting}
                                  onClick={() =>
                                    handleWithdraw(
                                      Number(leave.LeaveId)
                                    )
                                  }
                                >
                                  {isSubmitting
                                    ? "Submitting..."
                                    : "Confirm Withdrawal"}
                                </Button>
 
                                {/* Cancel */}
 
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    setSelectedLeaveId(null);
                                    setReason("");
                                  }}
                                >
                                  Cancel
                                </Button>
 
                              </div>
 
                            </div>
 
                          ) : (
 
                            /* ==================================================
                               WITHDRAW BUTTON
                            ================================================== */
 
                            <Button
                              onClick={() =>
                                setSelectedLeaveId(
                                  Number(leave.LeaveId)
                                )
                              }
                              className="w-full"
                            >
                              Withdraw Leave
                            </Button>
 
                          )
 
                        ) : (
 
                          /* ==================================================
                             CANNOT WITHDRAW
                          ================================================== */
 
                          <div className="rounded-lg border border-dashed bg-slate-50 p-4 text-center">
 
                            <p className="text-sm font-medium text-slate-600">
                              This request cannot be withdrawn.
                            </p>
 
                            <p className="mt-1 text-xs text-slate-500">
                              Only leave requests with{" "}
                              <strong>Pending</strong>{" "}
                              status can be withdrawn.
                            </p>
 
                          </div>
 
                        )}
 
                      </div>
 
                    </div>
 
                  </CardContent>
 
                </Card>
 
              );
            })}
 
          </div>
 
        )}
 
      </CardContent>
 
    </Card>
  );
}
 