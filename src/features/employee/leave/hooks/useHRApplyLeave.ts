import { toast } from "react-toastify";
import { useHrApplyLeaveMutation } from "../api/leaveApi";
import type { HrApplyLeavePayload } from "../types/leave.types";

export const useHrApplyLeave = () => {
  const [triggerHrApplyLeave, { isLoading }] = useHrApplyLeaveMutation();

  const hrApplyLeave = async (payload: HrApplyLeavePayload) => {
    try {
      const response = await triggerHrApplyLeave(payload).unwrap();

      const result = (
        Array.isArray(response) ? response[0] : response
      ) as
        | {
            StatusCode?: number;
            Message?: string;
            message?: string;
          }
        | undefined;

      if (
        result?.StatusCode !== undefined &&
        result.StatusCode !== 200
      ) {
        toast.error(
          result.Message ||
            result.message ||
            "Unable to apply leave for employee.",
        );

        return null;
      }

      toast.success(
        result?.Message ||
          result?.message ||
          "Leave applied successfully",
      );

      return response;
    } catch (error: unknown) {
      const apiError = error as {
        status?: number | string;
        data?:
          | { message?: string; Message?: string }
          | { Message?: string }[];
      };

      const data = apiError?.data;

      const message = Array.isArray(data)
        ? data[0]?.Message
        : data?.message ??
          (data as { Message?: string } | undefined)?.Message;

      console.error(
        "HR apply leave failed:",
        apiError?.status,
        data,
      );

      toast.error(
        message ??
          `Unable to apply leave for employee (${
            apiError?.status ?? "network error"
          }).`,
      );

      throw error;
    }
  };

  return {
    hrApplyLeave,
    isSubmittingForEmployee: isLoading,
  };
};