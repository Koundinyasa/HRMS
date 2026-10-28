import { toast } from "react-toastify";

import {
  useGetSeparationStatusQuery,
  useSubmitResignationMutation,
  useWithdrawResignationMutation,
} from "../api/separationApi";

import type {
  ApiResponse,
  ResignationRequest,
  WithdrawRequest,
} from "../types/separation.types";

const isErrorResult = (result: unknown): result is ApiResponse => {
  if (!result || typeof result !== "object") return false;

  const response = result as Record<string, unknown>;
  const code = Number(response.ErrorCode ?? response.StatusCode);
  if (!Number.isNaN(code) && code >= 400) return true;

  const message = String(response.Message ?? response.message ?? "");
  return /^\s*(validation\s*error|error)\b/i.test(message);
};

export const useSeparationManagement = () => {
  /**
   * Fetch Separation Status
   */
  const {
    data: separationStatus,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetSeparationStatusQuery();

  /**
   * Submit Resignation
   */
  const [
    submitResignation,
    { isLoading: isSubmitting, reset: resetSubmitState },
  ] = useSubmitResignationMutation();

  /**
   * Withdraw Resignation
   */
  const [
    withdrawResignation,
    { isLoading: isWithdrawing, reset: resetWithdrawState },
  ] = useWithdrawResignationMutation();

  /**
   * Submit Resignation Request
   */
  const submitRequest = async (request: ResignationRequest) => {
    try {
      const response = await submitResignation(request).unwrap();

      // Backend returns an array
      const result = Array.isArray(response) ? response[0] : response;

      if (isErrorResult(result)) {
        throw {
          data: {
            Message: result.Message,
          },
        };
      }
      toast.success(result.Message || "Resignation submitted successfully.");

      await refetch();

      return result;
    } catch (error: unknown) {
      const errorRecord =
        error && typeof error === "object"
          ? (error as Record<string, unknown>)
          : {};
      const data =
        errorRecord.data && typeof errorRecord.data === "object"
          ? (errorRecord.data as Record<string, unknown>)
          : {};
      const message = data.Message ?? errorRecord.message;
      toast.error(
        typeof message === "string" && message
          ? message
          : "Unable to submit resignation.",
      );

      throw error;
    }
  };

  /**
   * Withdraw Resignation Request
   */
 
const withdrawRequest = async (request: WithdrawRequest) => {
  try {
    const rawResponse: unknown =
      await withdrawResignation(request).unwrap();

    const response = Array.isArray(rawResponse)
      ? rawResponse[0]
      : rawResponse;

    if (!response || typeof response !== "object") {
      throw new Error("Invalid withdrawal response.");
    }

    const responseData = response as Record<string, unknown>;

    if (isErrorResult(responseData)) {
      throw {
        data: {
          Message:
            responseData.Message ?? responseData.message,
        },
      };
    }

    const successMessage =
      typeof responseData.Message === "string"
        ? responseData.Message
        : typeof responseData.message === "string"
          ? responseData.message
          : "Withdrawal request submitted successfully.";

    toast.success(successMessage);

    await refetch();

    return responseData;
  } catch (error: unknown) {
    const errorRecord =
      error && typeof error === "object"
        ? (error as Record<string, unknown>)
        : {};

    const data =
      errorRecord.data && typeof errorRecord.data === "object"
        ? (errorRecord.data as Record<string, unknown>)
        : {};

    const message = data.Message ?? data.message ?? errorRecord.message;

    toast.error(
      typeof message === "string" && message
        ? message
        : "Unable to withdraw resignation.",
    );

    throw error;
  }
};


  /**
   * Refresh Status
   */
  const refreshStatus = async () => {
    await refetch();
  };

  return {
    /**
     * Status Data
     */
    separationStatus,

    /**
     * Loading States
     */
    isLoading,
    isFetching,
    isError,

    /**
     * API Error
     */
    error,

    /**
     * Mutation States
     */
    isSubmitting,
    isWithdrawing,

    /**
     * Actions
     */
    submitRequest,
    withdrawRequest,
    refreshStatus,

    /**
     * Reset Mutation States
     */
    resetSubmitState,
    resetWithdrawState,
  };
};
