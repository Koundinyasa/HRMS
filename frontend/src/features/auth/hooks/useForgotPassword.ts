// import { toast } from "react-toastify";
// import { useAppDispatch } from "../../../hooks/useAppDispatch";
// import { setForgotPasswordData } from "../authSlice";
// import { useForgotPasswordMutation } from "../api/authApi";

// export const useForgotPassword = () => {
//     const dispatch = useAppDispatch();
//     const [forgotPassword] = useForgotPasswordMutation();
//     const handleForgotPassword = async (userId: string, mobileNumber: string) => {
//         try {
//             const result = await forgotPassword({ userId }).unwrap();


//             dispatch(setForgotPasswordData({ userId, mobileNumber,employeeId: result.employeeId }));
//             dispatch(setForgotPasswordData({ userId, mobileNumber, employeeId: result.employeeId }));
//             dispatch(setOtpExpiry({ remainingSeconds: result.remainingSeconds, remainingMinutes: result.remainingMinutes }));
//             toast.success("OTP sent successfully");

//             return true; // ✅ signal success to component
//         } catch (error: unknown) {
//             console.error("Forgot password error:", error);
//             toast.error("Failed to send OTP");
//             return false;
//         }
//     };

//     return {
//         handleForgotPassword,
//     };
// };



import { toast } from "react-toastify";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setForgotPasswordData, setOtpExpiry } from "../authSlice";
import { useForgotPasswordMutation } from "../api/authApi";
 
export const useForgotPassword = () => {
  const dispatch = useAppDispatch();
  const [forgotPassword] = useForgotPasswordMutation();
  const handleForgotPassword = async (userId: string, mobileNumber: string) => {
    try {
      const result = await forgotPassword({ userId }).unwrap();
 
      dispatch(
        setForgotPasswordData({
          userId,
          mobileNumber,
          employeeId: result.employeeId,
        }),
      );
 
      dispatch(
        setOtpExpiry({
          remainingSeconds: result.remainingSeconds,
          remainingMinutes: result.remainingMinutes,
        }),
      );
      toast.success("OTP sent successfully");
 
      return true; // ✅ signal success to component
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send OTP");
      return false;
    }
  };
 
  return {
    handleForgotPassword,
  };
};
 