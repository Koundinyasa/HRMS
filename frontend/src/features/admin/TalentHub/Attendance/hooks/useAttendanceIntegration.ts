import { usePostAttendanceIntegrationMutation } from "../api/attendanceApi";

export const useAttendanceIntegration = () => {
  const [saveAttendanceIntegration, { data, isLoading, isSuccess, isError, error, reset }] =
    usePostAttendanceIntegrationMutation();

  return {
    saveAttendanceIntegration,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  };
};