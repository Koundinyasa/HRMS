import { useMemo, useState } from "react";
import { History } from "lucide-react";

import RequisitionNavbar from "../../requisition/components/RequisitionNavbar";
import RequisitionToolbar from "../../requisition/components/RequisitionToolbar";
import { useAssetApproval } from "../../../asset/hooks/useAssetApproval";
import type { AssetRecord } from "../../../asset/types/assetTypes";

function getFieldValue(record: AssetRecord, label: string) {
  return record.fields.find((field) => field.label === label)?.value;
}

export default function AssetRequestsApprovalPage() {
  const {
    requests,
    isLoading,
    isError,
    approve,
    openReject,
    rejectTargetId,
    closeReject,
    reject,
    isApproving,
    isRejecting,
  } = useAssetApproval();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejectionRequest, setRejectionRequest] =
    useState<AssetRecord | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState("");

  const visibleRequests = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return requests;

    return requests.filter((request) =>
      [
        getFieldValue(request, "RequestID"),
        getFieldValue(request, "EmployeeName"),
        getFieldValue(request, "EmployeeCode"),
        getFieldValue(request, "AssetName"),
        getFieldValue(request, "Remarks"),
      ].some((field) => String(field ?? "").toLowerCase().includes(value)),
    );
  }, [requests, search]);

  const getRequestId = (request: AssetRecord) =>
    Number(getFieldValue(request, "RequestID") ?? 0);

  const getStageOrder = (request: AssetRecord) =>
    Number(getFieldValue(request, "CurrentStageOrder") ?? 0);

  const toggleSelect = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = visibleRequests.map(getRequestId);
    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    setSelectedIds((current) =>
      allSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...current, ...visibleIds])),
    );
  };

  const updateSelected = async (action: "approve" | "reject") => {
    if (selectedIds.length === 0) return;

    if (action === "reject") {
      const request = requests.find((item) =>
        selectedIds.includes(getRequestId(item)),
      );
      if (!request) return;

      openReject(getRequestId(request));
      setRejectionRequest(request);
      setRejectionRemarks(String(getFieldValue(request, "Remarks") ?? ""));
      return;
    }

    try {
      for (const id of selectedIds) {
        const request = requests.find((item) => getRequestId(item) === id);
        if (request) {
          const wasApproved = await approve(id, getStageOrder(request));
          if (!wasApproved) return;
        }
      }

      setSelectedIds([]);
      setApproved(true);
    } catch (error) {
      console.error(`Failed to ${action} asset requests.`, error);
    }
  };

  const submitRejection = async () => {
    if (!rejectionRequest) return;

    try {
      const wasRejected = await reject(
        rejectionRemarks,
        getStageOrder(rejectionRequest),
      );
      if (!wasRejected) return;

      setSelectedIds([]);
      setRejectionRequest(null);
      setRejectionRemarks("");
    } catch (error) {
      console.error("Failed to reject asset requests.", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f9] p-4 sm:p-5 md:p-[26px]">
      <div className="mx-auto w-full space-y-3">
        <RequisitionNavbar title="Asset Requests" />
        <RequisitionToolbar
          search={search}
          onSearchChange={setSearch}
          onApprove={() => void updateSelected("approve")}
          onReject={() => void updateSelected("reject")}
          onHistory={() => setShowHistory((current) => !current)}
          hasSelection={selectedIds.length > 0}
          approved={approved}
        />

        {showHistory && (
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <History size={18} />
            Asset request history
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="ml-2 text-sky-600"
            >
              Close
            </button>
          </div>
        )}

        {isError && (
          <div role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            Failed to load asset requests.
          </div>
        )}

        {isLoading ? (
          <div className="rounded-md bg-white p-5 text-center text-sm text-slate-500">
            Loading asset requests...
          </div>
        ) : (
          <AssetRequestsTable
            requests={visibleRequests}
            selectedIds={selectedIds}
            onSelectAll={toggleSelectAll}
            onSelect={toggleSelect}
            isApproving={isApproving}
          />
        )}
      </div>

      {rejectionRequest && rejectTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="asset-reject-title"
            className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2
                  id="asset-reject-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Reject Asset Request
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Please review the asset details before rejecting this request.
                </p>
              </div>
              <button
                type="button"
                onClick={closeReject}
                aria-label="Close rejection dialog"
                className="text-2xl leading-none text-slate-900 hover:text-slate-500"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ReadOnlyField
                label="Asset Type"
                value={getDisplayField(rejectionRequest, "AssetType")}
              />
              <ReadOnlyField
                label="Request ID"
                value={getDisplayField(rejectionRequest, "RequestID")}
              />
              <ReadOnlyField
                label="Employee Name"
                value={getDisplayField(rejectionRequest, "EmployeeName")}
              />
              <ReadOnlyField
                label="Date"
                value={getDisplayField(rejectionRequest, "RequestDate")}
              />
              <ReadOnlyField
                label="Asset Name"
                value={getDisplayField(rejectionRequest, "AssetName")}
              />
              <ReadOnlyField
                label="Quantity"
                value={getDisplayField(rejectionRequest, "Quantity")}
              />
            </div>

            <label
              htmlFor="asset-rejection-remarks"
              className="mt-5 block text-sm font-medium text-slate-800"
            >
              Remarks
            </label>
            <textarea
              id="asset-rejection-remarks"
              value={rejectionRemarks}
              onChange={(event) => setRejectionRemarks(event.target.value)}
              rows={5}
              placeholder="Enter rejection remarks..."
              className="mt-1 w-full resize-none rounded-md border border-slate-900/80 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-400 pt-5">
              <button
                type="button"
                onClick={closeReject}
                className="rounded-md border border-slate-900 px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => void submitRejection()}
                disabled={isRejecting}
                className="rounded-md bg-violet-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRejecting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-slate-800">{label}</p>
      <div className="rounded-md border border-slate-900/80 bg-slate-50 px-3 py-3 text-sm text-slate-800">
        {value}
      </div>
    </div>
  );
}

function getDisplayField(record: AssetRecord, label: string) {
  const value = getFieldValue(record, label);
  return value === null || value === undefined || value === ""
    ? "—"
    : String(value);
}

function AssetRequestsTable({
  requests,
  selectedIds,
  onSelectAll,
  onSelect,
}: {
  requests: AssetRecord[];
  selectedIds: number[];
  onSelectAll: () => void;
  onSelect: (id: number) => void;
  isApproving: boolean;
}) {
  const allSelected =
    requests.length > 0 &&
    requests.every((request) =>
      selectedIds.includes(Number(getFieldValue(request, "RequestID") ?? 0)),
    );

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="min-w-[900px] w-full">
        <thead>
          <tr className="bg-[#d5e9f7] text-left text-sm text-slate-800">
            <th className="px-3 py-4">Request ID</th>
            <th className="px-3 py-4">Employee Name</th>
            <th className="px-3 py-4">Asset Name</th>
            <th className="px-3 py-4">Asset Type</th>
            <th className="px-3 py-4">Date</th>
            <th className="px-3 py-4">Quantity</th>
            <th className="px-3 py-4">Reason</th>
            <th className="px-3 py-4 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                aria-label="Select all asset requests"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-12 text-center text-sm text-slate-400">
                No asset requests found
              </td>
            </tr>
          ) : (
            requests.map((request) => {
              const requestId = Number(getFieldValue(request, "RequestID") ?? 0);
              return (
              <tr key={requestId} className="border-t border-slate-800/70 text-sm text-slate-800">
                <td className="px-3 py-4">{requestId}</td>
                <td className="px-3 py-4">{String(getFieldValue(request, "EmployeeName") ?? "—")}</td>
                <td className="px-3 py-4">{String(getFieldValue(request, "AssetName") ?? "—")}</td>
                <td className="px-3 py-4">{String(getFieldValue(request, "AssetType") ?? "—")}</td>
                <td className="px-3 py-4">{String(getFieldValue(request, "RequestDate") ?? "—")}</td>
                <td className="px-3 py-4">{String(getFieldValue(request, "Quantity") ?? "—")}</td>
                <td className="px-3 py-4">{String(getFieldValue(request, "Remarks") ?? "—")}</td>
                <td className="px-3 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(requestId)}
                    onChange={() => onSelect(requestId)}
                    aria-label={`Select asset request ${requestId}`}
                  />
                </td>
              </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
