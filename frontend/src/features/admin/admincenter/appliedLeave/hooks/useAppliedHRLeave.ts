// frontend/src/features/admin/admincenter/appliedLeave/hooks/useAppliedHRLeave.ts

import { toast } from "react-toastify";

import { useApplyLeaveForEmployeeMutation } from "../api/appliedLeaveApi";

import type { HrApplyLeavePayload } from "../types/appliedLeave.types";

export const useAppliedHRLeave = () => {
  const [applyLeaveMutation, { isLoading }] =
    useApplyLeaveForEmployeeMutation();

  const applyLeaveForEmployee = async (payload: HrApplyLeavePayload) => {
    try {
      const response = await applyLeaveMutation(payload).unwrap();

      const result = response?.[0];

      if (result?.StatusCode !== undefined && result.StatusCode !== 200) {
        toast.error(result.Message || "Unable to apply leave");

        return null;
      }

      toast.success(result?.Message || "Leave applied successfully");

      return response;
    } catch (error: any) {
      console.error("Apply leave for employee error:", error);

      const message =
        error?.data?.message ||
        error?.message ||
        "Unable to apply leave for employee";

      toast.error(message);

      return null;
    }
  };

  return {
    applyLeaveForEmployee,
    isSubmittingForEmployee: isLoading,
  };
};
