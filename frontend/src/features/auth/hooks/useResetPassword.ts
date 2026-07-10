import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useResetForgotPasswordMutation } from "../api/authApi";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store";

export const useResetPassword = () => {
  const navigate = useNavigate();
  const [resetForgotPassword] = useResetForgotPasswordMutation();

  // ✅ Redux first, sessionStorage as fallback
  const employeeIdFromRedux = useAppSelector(
    (state: RootState) => state.auth.forgotPasswordEmployeeId
  );
  const employeeId = employeeIdFromRedux || sessionStorage.getItem("hrms_employeeId") || "";

  const handleResetPassword = async (
    newPassword: string,
    confirmPassword: string
  ) => {
    if (!employeeId) {
      toast.error("Session expired. Please start over.");
      navigate("/forgot-password");
      return false;
    }

    try {
      await resetForgotPassword({
        employeeId,
        newPassword,
        confirmPassword,
      }).unwrap();

      toast.success("Password reset successful");
      return true;
    } catch {
      toast.error("Failed to reset password");
      return false;
    }
  };

  return { handleResetPassword };
};