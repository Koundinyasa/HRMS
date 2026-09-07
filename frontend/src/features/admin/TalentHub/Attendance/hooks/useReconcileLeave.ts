import { useUpdateReconcileLeaveMutation } from "../api/attendanceApi";

export const useReconcileLeave = () => {
  const [updateReconcileLeave, { data, isLoading, isSuccess, isError, error, reset }] =
    useUpdateReconcileLeaveMutation();

  return {
    updateReconcileLeave,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  };
};