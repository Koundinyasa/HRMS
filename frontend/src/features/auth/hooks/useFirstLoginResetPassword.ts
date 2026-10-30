import { toast } from "react-toastify";
import { baseApi } from "@/app/baseApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useFirstLoginResetPasswordMutation } from "../api/authApi";
import { logout } from "../authSlice";
 
export const useFirstLoginResetPassword = () => {
  const dispatch = useAppDispatch();
  const [firstLoginResetPassword] =
    useFirstLoginResetPasswordMutation();
 
  const handleFirstLoginResetPassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      await firstLoginResetPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();
 
      // The server ends every session when this password is set, so the user
      // signs in again with the new one. Make the app agree with that.
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());

      toast.success("Password reset successful");
 
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
 
  return {
    handleFirstLoginResetPassword,
  };
};