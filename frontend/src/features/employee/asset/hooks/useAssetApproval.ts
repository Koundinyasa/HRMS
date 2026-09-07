import { useState } from "react";
import { toast } from "react-toastify";
import { ACTION_STATUS } from "../types/assetTypes";
import {
  useApproveAssetStageMutation,
  useGetPendingAssetRequestsQuery,
} from "../api/assetApi";
function getBackendMessage(err: unknown): string | undefined {
  if (err && typeof err === "object" && "data" in err) {
    return (err as { data?: { Message?: string } }).data?.Message;
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

  const approve = async (requestId: number, stageOrder: number, remarks = "Approved") => {
    try {
      await approveAssetStage({
        requestId,
        stageOrder,
        actionStatusId: ACTION_STATUS.APPROVED,
        remarks,
      }).unwrap();
      toast.success("Request approved to the next stage.");
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to approve the request. Please try again.");
    }
  };

  const openReject = (requestId: number) => setRejectTargetId(requestId);
  const closeReject = () => setRejectTargetId(null);

  const reject = async (remarks: string, stageOrder: number) => {
    if (rejectTargetId === null) return;
    if (!remarks.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
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
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to reject the request. Please try again.");
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
