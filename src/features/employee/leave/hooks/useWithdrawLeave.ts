import { toast } from "react-toastify";

import { useWithdrawLeaveMutation } from "../api/leaveApi";

import type {
  WithdrawLeavePayload,
} from "../types/leave.types";

export const useWithdrawLeave =
  () => {
    const [
      triggerWithdraw,
      {
        isLoading,
      },
    ] =
      useWithdrawLeaveMutation();

    const withdrawLeave =
      async (
        payload: WithdrawLeavePayload
      ) => {
        try {
          const response =
            await triggerWithdraw(
              payload
            ).unwrap();

          toast.success(
            response[0].Message
          );

          return response;
        } catch (
          error: unknown
        ) {
          const apiError =
            error as {
              data?: {
                message?: string;
              };
            };

          toast.error(
            apiError?.data
              ?.message ??
              "Unable to withdraw leave."
          );

          throw error;
        }
      };

    return {
  withdrawLeave,
  isWithdrawing: isLoading,
};
  };

