import { toast } from "react-toastify";
import { useResetForgotPasswordMutation } from "../api/authApi";
import { useAppSelector } from "../../../hooks/useAppSelector";

export const useResetPassword = () => {
 
  const [resetForgotPassword] = useResetForgotPasswordMutation();

  // ✅ get employeeId saved during forgot-password step
  const employeeId = useAppSelector(
    (state) => state.auth.forgotPasswordEmployeeId
  );

  const handleResetPassword = async (
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      await resetForgotPassword({
        employeeId,
        newPassword,
        confirmPassword,
      }).unwrap();

      toast.success("Password reset successfully.");
      return true;
    } catch {
      toast.error("Failed to reset password");
      return false;
    }
  };

  return { handleResetPassword };
};
