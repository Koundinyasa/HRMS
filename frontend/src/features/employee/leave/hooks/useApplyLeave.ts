import { toast } from "react-toastify";

import { useApplyLeaveMutation } from "../api/leaveApi";

import type {
    ApplyLeavePayload,
} from "../types/leave.types";

export const useApplyLeave = () => {
    const [
        triggerApplyLeave,
        {
            isLoading,
        },
    ] = useApplyLeaveMutation();

    const applyLeave = async (
        payload: ApplyLeavePayload
    ) => {
        try {
            const response =
                await triggerApplyLeave(
                    payload
                ).unwrap();

            console.log("API Response:", response);

            toast.success(response.Message || "Leave applied successfully");

            return response;
        } catch (error: unknown) {
            const apiError =
                error as {
                    data?: {
                        message?: string;
                    };
                };

            toast.error(
                apiError?.data?.message ??
                "Unable to apply leave."
            );

            throw error;
        }
    };

    return {
        applyLeave,
        isSubmitting: isLoading,
    };
};