import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  useResetPasswordMutation,
} from "../api/authApi";

export const useResetPassword =
  () => {
    const navigate =
      useNavigate();

    const [
      resetPassword,
    ] =
      useResetPasswordMutation();

    const
      handleResetPassword =
      async (
        password: string
      ) => {
        try {
          await resetPassword({
            password,
          }).unwrap();

          toast.success(
            "Password reset successful"
          );

          navigate(
            "/login"
          );
        } catch {
          toast.error(
            "Failed to reset password"
          );
        }
      };

    return {
      handleResetPassword,
    };
  };