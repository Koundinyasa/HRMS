import { usePostAttendanceConfigurationMutation } from "../api/attendanceApi";

export const useAttendanceConfiguration = () => {
  const [createAttendanceConfiguration, { data, isLoading, isSuccess, isError, error, reset }] =
    usePostAttendanceConfigurationMutation();

  return {
    createAttendanceConfiguration, 
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  };
};