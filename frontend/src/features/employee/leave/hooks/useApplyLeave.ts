// import { toast } from "react-toastify";

// import { useApplyLeaveMutation } from "../api/leaveApi";

// import type {
//     ApplyLeavePayload,
// } from "../types/leave.types";

// export const useApplyLeave = () => {
//     const [
//         triggerApplyLeave,
//         {
//             isLoading,
//         },
//     ] = useApplyLeaveMutation();

//     const applyLeave = async (
//         payload: ApplyLeavePayload
//     ) => {
//         try {
//             const response =
//                 await triggerApplyLeave(
//                     payload
//                 ).unwrap();

//             console.log("API Response:", response);

//             toast.success(response.Message || "Leave applied successfully");

//             return response;
//         } catch (error: unknown) {
//             const apiError =
//                 error as {
//                     data?: {
//                         message?: string;
//                     };
//                 };

//             toast.error(
//                 apiError?.data?.message ??
//                 "Unable to apply leave."
//             );

//             throw error;
//         }
//     };

//     return {
//         applyLeave,
//         isSubmitting: isLoading,
//     };
// };













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

      console.log(
        "Employee Apply Leave API Response:",
        response
      );

      // Same approach used in HR apply leave
      const result = Array.isArray(response)
        ? response[0]
        : response;

      if (
        result?.StatusCode !== undefined &&
        result.StatusCode !== 200
      ) {
        toast.error(
          result.Message ||
          "Unable to apply leave."
        );

        return null;
      }

      toast.success(
        result?.Message ||
        "Leave applied successfully"
      );

      return response;

    } catch (error: unknown) {
      const apiError = error as {
        status?: number | string;
        data?:
          | {
              message?: string;
              Message?: string;
            }
          | {
              Message?: string;
            }[];
      };

      const data = apiError?.data;

      const message = Array.isArray(data)
        ? data[0]?.Message
        : data?.message ??
          data?.Message;

      console.error(
        "Employee Apply Leave Error:",
        apiError?.status,
        data
      );

      toast.error(
        message ??
        `Unable to apply leave (${apiError?.status ?? "network error"}).`
      );

      return null;
    }
  };

  return {
    applyLeave,
    isSubmitting: isLoading,
  };
};