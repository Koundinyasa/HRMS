import {
  X,
} from "lucide-react";

import type {
  AssetRequest,
} from "../types/assetRequest.types";

import AssetRequestDetails from "./AssetRequestDetails";

interface Props {
  request: AssetRequest | null;

  onClose: () => void;
}

const AssetRequestModal = ({
  request,
  onClose,
}: Props) => {
  if (!request) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Asset Request Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-6">
          <AssetRequestDetails
            request={request}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetRequestModal;