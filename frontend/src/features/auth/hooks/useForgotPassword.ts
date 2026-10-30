import { toast } from "react-toastify";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setForgotPasswordData, setOtpExpiry } from "../authSlice";
import { useForgotPasswordMutation } from "../api/authApi";

// The server's message for a failed request, if it sent one.
const serverMessage = (error: unknown): string | null => {
  const data = (error as { data?: { message?: unknown } } | null)?.data;
  return typeof data?.message === "string" ? data.message : null;
};

export const useForgotPassword = () => {
  const dispatch = useAppDispatch();
  const [forgotPassword] = useForgotPasswordMutation();

  const handleForgotPassword = async (userId: string) => {
    try {
      const result = await forgotPassword({ userId }).unwrap();

      dispatch(setForgotPasswordData({ userId }));
      dispatch(
        setOtpExpiry({
          remainingSeconds: result.remainingSeconds,
          remainingMinutes: result.remainingMinutes,
        }),
      );
      // The server gives the same answer for every user ID, so do not claim
      // that an OTP was definitely sent.
      toast.success(
        "If this user ID is registered, an OTP has been sent to its e-mail address.",
      );

      return true;
    } catch (error: unknown) {
      toast.error(serverMessage(error) ?? "Failed to send OTP");
      return false;
    }
  };

  return {
    handleForgotPassword,
  };
};
