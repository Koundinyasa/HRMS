// import {
//   useNavigate,
// } from "react-router-dom";

// import {
//   toast,
// } from "react-toastify";

// import {
//   useResetPasswordMutation,
// } from "../api/authApi";

// export const useResetPassword =
//   () => {
//     const navigate =
//       useNavigate();

//     const [
//       resetPassword,
//     ] =
//       useResetPasswordMutation();

//     const
//       handleResetPassword =
//       async (
//         password: string
//       ) => {
//         try {
//           await resetPassword({
//             password,
//           }).unwrap();

//           toast.success(
//             "Password reset successful"
//           );

//           navigate(
//             "/login"
//           );
//         } catch {
//           toast.error(
//             "Failed to reset password"
//           );
//         }
//       };

//     return {
//       handleResetPassword,
//     };
//   };



import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useResetForgotPasswordMutation } from "../api/authApi";
import { useAppSelector } from "../../../hooks/useAppSelector";

export const useResetPassword = () => {
  const navigate = useNavigate();
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

      toast.success("Password reset successful");
      return true;
    } catch {
      toast.error("Failed to reset password");
      return false;
    }
  };

  return { handleResetPassword };
};