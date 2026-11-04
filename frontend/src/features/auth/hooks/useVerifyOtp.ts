import { toast } from "react-toastify";
import { useVerifyOtpMutation } from "../api/authApi";

export const useVerifyOtp = () => {
  const [verifyOtp] = useVerifyOtpMutation();

  const handleVerifyOtp = async (userId: string, otp: string) => {
    try {
      await verifyOtp({ userId, otp }).unwrap();
      toast.success("OTP verified successfully");
      return true;
    } catch (error: unknown) {
      // 400 "Invalid or expired OTP." / 429 "Too many incorrect OTP attempts..."
      const data = (error as { data?: { message?: unknown } } | null)?.data;
      toast.error(typeof data?.message === "string" ? data.message : "Invalid OTP");
      return false;
    }
  };

  return { handleVerifyOtp };
};
