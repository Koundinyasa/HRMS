import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFirstLoginResetPasswordMutation } from "../api/authApi";
 
export const useFirstLoginResetPassword = () => {
  const navigate = useNavigate();
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
    } catch (err: any) {
      toast.error(
        err?.data?.message ?? "Failed to reset password"
      );
 
      return false;
    }
  };
 
  return {
    handleFirstLoginResetPassword,
  };
};