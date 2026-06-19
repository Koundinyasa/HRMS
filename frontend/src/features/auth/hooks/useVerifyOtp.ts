import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useVerifyOtpMutation,
} from "../api/authApi";

export const useVerifyOtp = () => {
  const navigate = useNavigate();

  const [verifyOtp] =
    useVerifyOtpMutation();

  const handleVerifyOtp =
    async (
      employeeId: string,
      otp: string
    ) => {
      try {
        await verifyOtp({
          employeeId,
          otp,
        }).unwrap();

        toast.success(
          "OTP verified successfully"
        );

        navigate("/reset-password");
      } catch {
        toast.error(
          "Invalid OTP"
        );
      }
    };

  return {
    handleVerifyOtp,
  };
};