import { toast } from "react-toastify";
import { useFirstLoginResetPasswordMutation } from "../api/authApi";
 
export const useFirstLoginResetPassword = () => {
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
      toast.error(
        typeof data.message === "string"
          ? data.message
          : "Failed to reset password",
      );
 
      return false;
    }
  };
 
  return {
    handleFirstLoginResetPassword,
  };
};