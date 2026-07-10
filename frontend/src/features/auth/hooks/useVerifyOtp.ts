import { toast } from "react-toastify";
import { useVerifyOtpMutation } from "../api/authApi";

export const useVerifyOtp = () => {
  const [verifyOtp] = useVerifyOtpMutation();

  const handleVerifyOtp = async (employeeId: string, otp: string) => {
    console.log("Sending:", { employeeId, otp }); // 👈
    try {
      const res = await verifyOtp({ employeeId, otp }).unwrap();
      console.log("Success response:", res); // 👈
      toast.success("OTP verified successfully");
      return true;
    } catch (err) {
      console.error("Verify OTP error:", err); // 👈
      toast.error("Invalid OTP");
      return false;
    }
  };

  return { handleVerifyOtp };
};