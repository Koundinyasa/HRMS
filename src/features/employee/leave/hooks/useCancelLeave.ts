import { useWithdrawLeaveMutation } from "../api/leaveApi";

export function useCancelLeave() {
  const [cancelLeave, { isLoading }] =
    useWithdrawLeaveMutation();

  return {
    cancelLeave,
    isCancelling: isLoading,
  };
}

