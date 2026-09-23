// import { toast } from "react-toastify";
// import { useResetForgotPasswordMutation } from "../api/authApi";
// import { useAppSelector } from "../../../hooks/useAppSelector";

// export const useResetPassword = () => {
 
//   const [resetForgotPassword] = useResetForgotPasswordMutation();

//   // ✅ get employeeId saved during forgot-password step
//   const employeeId = useAppSelector(
//     (state) => state.auth.forgotPasswordEmployeeId
//   );

//   const handleResetPassword = async (
//     newPassword: string,
//     confirmPassword: string
//   ) => {
//     try {
//       await resetForgotPassword({
//         employeeId,
//         newPassword,
//         confirmPassword,
//       }).unwrap();

//       toast.success("Password reset successfully.");
//       return true;
//     } catch {
//       toast.error("Failed to reset password");
//       return false;
//     }
//   };

//   return { handleResetPassword };
// };


import { toast } from "react-toastify";
import { useResetForgotPasswordMutation } from "../api/authApi";
import { useAppSelector } from "../../../hooks/useAppSelector";
 
export const useResetPassword = () => {
 
  const [resetForgotPassword] = useResetForgotPasswordMutation();
 
  // ✅ get employeeId saved during forgot-password step
  const employeeId = useAppSelector(
    (state) => state.auth.forgotPasswordEmployeeId
  );
  const userId = useAppSelector(
    (state) => state.auth.forgotPasswordUserId
  );
 
  const handleResetPassword = async (
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      await resetForgotPassword({
        employeeId,
        userId,
        newPassword,
        confirmPassword,
      }).unwrap();
 
      toast.success("Password reset successfully.");
      return true;
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to reset password"
      );
      return false;
    }
  };
 
  return { handleResetPassword };
};
 
 
