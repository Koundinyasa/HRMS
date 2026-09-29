import { useState } from "react";
import { toast } from "react-toastify";
import { ACTION_STATUS } from "../types/assetTypes";
import {
  useApproveAssetStageMutation,
  useGetPendingAssetRequestsQuery,
} from "../api/assetApi";
function getBackendMessage(err: unknown): string | undefined {
  if (!err || typeof err !== "object" || !("data" in err)) {
    return undefined;
  }

  const data = err.data;
  if (!data || typeof data !== "object") return undefined;

  const response = data as {
    Message?: unknown;
    message?: unknown;
    errors?: unknown;
  };
  const message = response.Message ?? response.message;
  if (typeof message === "string" && message.trim()) return message;

  if (Array.isArray(response.errors)) {
    const firstError = response.errors.find(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
    if (firstError) return firstError;
  }

  return undefined;
}
export const useAssetApproval = () => {
  const {
  data: pendingResponse,
  isLoading,
  isError,
} = useGetPendingAssetRequestsQuery();
const pendingSection =
  pendingResponse?.sections.find(
    (section) => section.title === "Pending Asset Requests"
  ) ?? null;

const requests = pendingSection?.records ?? [];

  const [approveAssetStage, { isLoading: isApproving }] = useApproveAssetStageMutation();

  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const approve = async (
    requestId: number,
    stageOrder: number,
    remarks = "Approved",
  ): Promise<boolean> => {
    try {
      await approveAssetStage({
        requestId,
        stageOrder,
        actionStatusId: ACTION_STATUS.APPROVED,
        remarks,
      }).unwrap();
      toast.success("Request approved to the next stage.");
      return true;
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to approve the request. Please try again.");
      return false;
    }
  };

  const openReject = (requestId: number) => setRejectTargetId(requestId);
  const closeReject = () => setRejectTargetId(null);

  const reject = async (remarks: string, stageOrder: number): Promise<boolean> => {
    if (rejectTargetId === null) return false;
    if (!remarks.trim()) {
      toast.error("Please provide a reason for rejection.");
      return false;
    }
    setIsRejecting(true);
    try {
      await approveAssetStage({
        requestId: rejectTargetId,
        stageOrder,
        actionStatusId: ACTION_STATUS.REJECTED,
        remarks,
      }).unwrap();
      toast.success("Request rejected.");
      closeReject();
      return true;
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to reject the request. Please try again.");
      return false;
    } finally {
      setIsRejecting(false);
    }
  };
  return {
    requests,
    isLoading,
    isError,
    isApproving,
    isRejecting,
    approve,
    rejectTargetId,
    openReject,
    closeReject,
    reject,
  };
};
