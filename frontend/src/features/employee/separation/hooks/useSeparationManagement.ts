import { toast } from "react-toastify";

import {
  useGetSeparationStatusQuery,
  useSubmitResignationMutation,
  useWithdrawResignationMutation,
} from "../api/separationApi";

import type {
  ResignationRequest,
  WithdrawRequest,
} from "../types/separation.types";

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
    {
      isLoading: isSubmitting,
      reset: resetSubmitState,
    },
  ] = useSubmitResignationMutation();

  /**
   * Withdraw Resignation
   */
  const [
    withdrawResignation,
    {
      isLoading: isWithdrawing,
      reset: resetWithdrawState,
    },
  ] = useWithdrawResignationMutation();

  /**
   * Submit Resignation Request
   */
  const submitRequest = async (
    request: ResignationRequest
  ) => {
    try {
      const response = await submitResignation(request).unwrap();

      // Backend returns an array
      const result = Array.isArray(response)
        ? response[0]
        : response;

      if (result.ErrorCode === "400") {
        throw {
          data: {
            Message: result.Message,
          },
        };
      }
      toast.success(
        result.Message ||
        "Resignation submitted successfully."
      );

      await refetch();

      return result;
    } catch (err: any) {
      toast.error(
        err?.data?.Message ||
        err?.message ||
        "Unable to submit resignation."
      );

      throw err;
    }
  };

  /**
   * Withdraw Resignation Request
   */
  const withdrawRequest = async (
    request: WithdrawRequest
  ) => {
    try {
      const response = await withdrawResignation(
        request
      ).unwrap();

      toast.success(
        response.Message ||
        "Withdrawal request submitted successfully."
      );

      await refetch();

      return response;
    } catch (err: any) {
      toast.error(
        err?.data?.Message ||
        err?.data?.message ||
        "Unable to withdraw resignation."
      );

      throw err;
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