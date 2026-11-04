import { toast } from "react-toastify";
import { useResetForgotPasswordMutation } from "../api/authApi";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { clearForgotPassword } from "../authSlice";

export const useResetPassword = () => {
  const dispatch = useAppDispatch();
  const [resetForgotPassword] = useResetForgotPasswordMutation();

  // Who is resetting is decided by the server from the cookie it set when the
  // OTP was verified, so only the new password is sent.
  const handleResetPassword = async (
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      await resetForgotPassword({
        newPassword,
        confirmPassword,
      }).unwrap();

      dispatch(clearForgotPassword());
      toast.success("Password reset successfully.");
      return true;
    } catch (error: unknown) {
      const errorRecord =
        error && typeof error === "object"
          ? (error as Record<string, unknown>)
          : {};
      const data =
        errorRecord.data && typeof errorRecord.data === "object"
          ? (errorRecord.data as Record<string, unknown>)
          : {};
      // Validation errors from the server arrive as a list of messages.
      const serverMessage = Array.isArray(data.message)
        ? data.message.filter((m): m is string => typeof m === "string").join(" ")
        : data.message;
      toast.error(
        typeof serverMessage === "string" && serverMessage
          ? serverMessage
          : "Failed to reset password",
      );
      return false;
    }
  };

  return { handleResetPassword };
};
