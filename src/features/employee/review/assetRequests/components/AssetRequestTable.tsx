import {
  Check,
  Eye,
  X,
} from "lucide-react";

import type {
  AssetRequest,
} from "../types/assetRequest.types";

import AssetRequestStatusBadge from "./AssetRequestStatusBadge";

interface Props {
  requests: AssetRequest[];

  onView: (
    request: AssetRequest
  ) => void;

  onApprove: (
    request: AssetRequest
  ) => void;

  onReject: (
    request: AssetRequest
  ) => void;
}

const AssetRequestTable = ({
  requests,
  onView,
  onApprove,
  onReject,
}: Props) => {
  return (
    <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full">
          <thead>
            <tr className="border-b border-blue-100 bg-blue-50/70">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Request ID
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Employee
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Asset
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
                Qty
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Priority
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Requested Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Status
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-sm text-gray-500"
                >
                  No asset requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-gray-100 transition hover:bg-blue-50/30"
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-blue-600">
                      {request.requestId}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {request.employeeName}
                      </p>

                      {request.employeeCode && (
                        <p className="text-xs text-gray-400">
                          {request.employeeCode}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">
                      {request.assetName}
                    </p>

                    <p className="text-xs text-gray-400">
                      {request.assetType}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-center text-sm text-gray-700">
                    {request.quantity}
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">
                      {request.priority}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {request.requestedDate}
                  </td>

                  <td className="px-5 py-4">
                    <AssetRequestStatusBadge
                      status={request.status}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onView(request)
                        }
                        title="View"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        <Eye size={16} />
                      </button>

                      {request.status ===
                        "Pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              onApprove(request)
                            }
                            title="Approve"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                          >
                            <Check size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onReject(request)
                            }
                            title="Reject"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetRequestTable;