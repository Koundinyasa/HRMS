import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { AssetRecord } from "../types/assetTypes";
import { useAssetApproval } from "../hooks/useAssetApproval";
import AssetNavbar from "../components/AssetNavbar";

function getFieldValue(record: AssetRecord, label: string) {
  return record.fields.find((field) => field.label === label)?.value;
}

function RejectModal({
  onCancel,
  onConfirm,
  isSubmitting,
}: {
  onCancel: () => void;
  onConfirm: (remarks: string) => void;
  isSubmitting: boolean;
}) {
  const [remarks, setRemarks] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4"
      onClick={onCancel}
    >
      <Card
        className="w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Reject Request</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0"
            onClick={onCancel}
          >
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <label
            htmlFor="reject-remarks"
            className="text-sm font-medium"
          >
            Reason for rejection
          </label>
          <textarea
            id="reject-remarks"
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Explain why this request is being rejected"
            className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
        </CardContent>
        <CardContent className="flex justify-end gap-2 pt-0">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => onConfirm(remarks)}
          >
            {isSubmitting ? "Rejecting..." : "Reject Request"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
export default function AssetApproval() {
  const {
    requests,
    isLoading,
    isError,
    isApproving,
    approve,
    rejectTargetId,
    openReject,
    closeReject,
    reject,
    isRejecting,
  } = useAssetApproval();
  const rejectTarget =
    requests.find(
      (record) =>
        Number(getFieldValue(record, "RequestID")) === rejectTargetId
    ) ?? null;

  return (
    <div className="space-y-5">
      <AssetNavbar />

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Asset Approvals
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and action pending asset requests through the approval hierarchy.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>

          <CardDescription>
            Approve moves a request to its next stage; reject stops it and records a reason.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Loading requests...
            </p>
          )}
          {isError && (
            <p className="py-10 text-center text-sm text-red-600">
              Unable to load asset requests. Please try again.
            </p>
          )}
          {!isLoading && !isError && requests.length === 0 && (
            <div className="py-10 text-center">
              <h3 className="font-medium">
                No pending requests
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                All submitted requests have been fully processed.
              </p>
            </div>
          )}
          {!isLoading && !isError && requests.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="px-3 py-3 font-medium">
                      Employee
                    </th>

                    <th className="px-3 py-3 font-medium">
                      Asset
                    </th>

                    <th className="px-3 py-3 font-medium">
                      Remarks
                    </th>

                    <th className="px-3 py-3 font-medium">
                      Status
                    </th>

                    <th className="px-3 py-3 font-medium">
                      Awaiting
                    </th>

                    <th className="px-3 py-3" />
                  </tr>
                </thead>

                <tbody>                  {requests.map((record, index) => {
                  const requestId = Number(
                    getFieldValue(record, "RequestID")
                  );

                  const employeeName = String(
                    getFieldValue(record, "EmployeeName") ?? "—"
                  );

                  const employeeCode = String(
                    getFieldValue(record, "EmployeeCode") ?? "—"
                  );

                  const assetName = String(
                    getFieldValue(record, "AssetName") ?? "—"
                  );

                  const remarks = String(
                    getFieldValue(record, "Remarks") ?? "—"
                  );

                  const requestStatus = String(
                    getFieldValue(record, "RequestStatus") ?? "Pending"
                  );

                  const currentStage = Number(
                    getFieldValue(record, "CurrentStageOrder") ?? 0
                  );

                  return (
                    <tr
                      key={requestId || index}
                      className="border-b last:border-0"
                    >
                      <td className="px-3 py-3">
                        {employeeName}
                        <span className="block text-xs text-muted-foreground">
                          {employeeCode}
                        </span>
                      </td>

                      <td className="px-3 py-3 font-medium">
                        {assetName}
                      </td>

                      <td
                        className="max-w-[220px] truncate px-3 py-3"
                        title={remarks}
                      >
                        {remarks}
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {requestStatus}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-muted-foreground">
                        {`Approval Level ${currentStage}`}
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            className="gap-1.5"
                            disabled={isApproving}
                            onClick={() =>
                              approve(requestId, currentStage)
                            }
                          >
                            <Check size={14} />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
                            onClick={() =>
                              openReject(requestId)
                            }
                          >
                            <X size={14} />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {rejectTargetId !== null && rejectTarget && (
        <RejectModal
          onCancel={closeReject}
          onConfirm={(remarks) =>
            reject(
              remarks,
              Number(
                getFieldValue(
                  rejectTarget,
                  "CurrentStageOrder"
                ) ?? 0
              )
            )
          }
          isSubmitting={isRejecting}
        />
      )}
    </div>
  );
}