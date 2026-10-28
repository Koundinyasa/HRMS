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
  request: AssetRequest;

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

const AssetRequestCard = ({
  request,
  onView,
  onApprove,
  onReject,
}: Props) => {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            {request.requestId}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-800">
            {request.employeeName}
          </p>
        </div>

        <AssetRequestStatusBadge
          status={request.status}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-400">
            Asset
          </p>
          <p className="text-sm text-gray-700">
            {request.assetName}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Type
          </p>
          <p className="text-sm text-gray-700">
            {request.assetType}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Quantity
          </p>
          <p className="text-sm text-gray-700">
            {request.quantity}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Priority
          </p>
          <p className="text-sm text-gray-700">
            {request.priority}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => onView(request)}
          className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-600"
        >
          <Eye size={14} />
          View
        </button>

        {request.status === "Pending" && (
          <>
            <button
              type="button"
              onClick={() => onApprove(request)}
              className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-600"
            >
              <Check size={14} />
              Approve
            </button>

            <button
              type="button"
              onClick={() => onReject(request)}
              className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
            >
              <X size={14} />
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AssetRequestCard;