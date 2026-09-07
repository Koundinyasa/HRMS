import { toast } from "react-toastify";
 
import { useHrApplyLeaveMutation } from "../api/leaveApi";
 
import type {
    HrApplyLeavePayload,
} from "../types/leave.types";
 
export const useHrApplyLeave = () => {
    const [
        triggerHrApplyLeave,
        {
            isLoading,
        },
    ] = useHrApplyLeaveMutation();
 
    const hrApplyLeave = async (
        payload: HrApplyLeavePayload
    ) => {
        try {
            const response =
                await triggerHrApplyLeave(
                    payload
                ).unwrap();
 
            const result = response?.[0];
 
            // Success comes back as [{NotificationId}] with no StatusCode; the
            // SP only sets StatusCode when it is rejecting the request.
            if (result?.StatusCode !== undefined && result.StatusCode !== 200) {
                toast.error(result.Message || "Unable to apply leave for employee.");
                return null;
            }
 
            toast.success(result?.Message || "Leave applied successfully");
 
            return response;
        } catch (error: unknown) {
            // The API answers in three shapes: {message}, [{Message}] from the
            // stored procedure, or no body at all on a network failure.
            const apiError = error as {
                status?: number | string;
                data?:
                | { message?: string; Message?: string }
                | { Message?: string }[];
            };
 
            const data = apiError?.data;
 
            const message = Array.isArray(data)
                ? data[0]?.Message
                : data?.message ?? (data as { Message?: string })?.Message;
 
            console.error("HR apply leave failed:", apiError?.status, data);
 
            toast.error(
                message ??
                `Unable to apply leave for employee (${apiError?.status ?? "network error"}).`
            );
 
            throw error;
        }
    };
 
    return {
        hrApplyLeave,
        isSubmittingForEmployee: isLoading,
    };
};
