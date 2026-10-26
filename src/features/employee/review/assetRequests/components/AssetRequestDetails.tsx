import type {
  AssetRequest,
} from "../types/assetRequest.types";

import AssetRequestStatusBadge from "./AssetRequestStatusBadge";

interface Props {
  request: AssetRequest;
}

const AssetRequestDetails = ({
  request,
}: Props) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">
            Request ID
          </p>

          <p className="text-lg font-semibold text-blue-600">
            {request.requestId}
          </p>
        </div>

        <AssetRequestStatusBadge
          status={request.status}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-400">
            Employee
          </p>
          <p className="mt-1 text-sm font-medium text-gray-800">
            {request.employeeName}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-400">
            Employee Code
          </p>
          <p className="mt-1 text-sm font-medium text-gray-800">
            {request.employeeCode || "-"}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-400">
            Asset Type
          </p>
          <p className="mt-1 text-sm font-medium text-gray-800">
            {request.assetType}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-400">
            Asset Name
          </p>
          <p className="mt-1 text-sm font-medium text-gray-800">
            {request.assetName}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-400">
            Quantity
          </p>
          <p className="mt-1 text-sm font-medium text-gray-800">
            {request.quantity}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-400">
            Priority
          </p>
          <p className="mt-1 text-sm font-medium text-gray-800">
            {request.priority}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3 sm:col-span-2">
          <p className="text-xs text-gray-400">
            Requested Date
          </p>
          <p className="mt-1 text-sm font-medium text-gray-800">
            {request.requestedDate}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3 sm:col-span-2">
          <p className="text-xs text-gray-400">
            Reason
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-700">
            {request.reason}
          </p>
        </div>

        {request.remarks && (
          <div className="rounded-lg bg-gray-50 p-3 sm:col-span-2">
            <p className="text-xs text-gray-400">
              Remarks
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-700">
              {request.remarks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetRequestDetails;