import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyOtpSchema } from "../validation/verifyOtpSchema";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { showPageLoader } from "../../employee/employeeSlice";
import { Loader2 } from "lucide-react";

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { handleVerifyOtp } = useVerifyOtp();
  const { handleForgotPassword } = useForgotPassword();

  const navigate = useNavigate();
  const { domain } = useParams();
  const dispatch = useAppDispatch();

  // Email/User ID entered on Forgot Password screen
  const forgotPasswordUserId = useAppSelector(
    (state) => state.auth.forgotPasswordUserId
  );

  // When the current OTP expires (set by the forgot-password / resend call)
  const otpExpiresAt = useAppSelector((state) => state.auth.otpExpiresAt);

  // --------------------------------------------------
  // Countdown: always worked out from the expiry time, so a resend (new
  // expiry) restarts it and a throttled background tab cannot drift.
  // --------------------------------------------------
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    if (otpExpiresAt <= Date.now()) return;

    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= otpExpiresAt) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [otpExpiresAt]);

  const remainingSeconds = Math.max(0, Math.ceil((otpExpiresAt - now) / 1000));

  // --------------------------------------------------
  // Format timer: 03:00, 02:59, 02:58...
  // --------------------------------------------------
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  // --------------------------------------------------
  // OTP input
  // --------------------------------------------------
  const handleChange = (value: string, index: number) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // --------------------------------------------------
  // Backspace
  // --------------------------------------------------
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // --------------------------------------------------
  // Verify OTP
  // --------------------------------------------------
  const handleSubmit = async () => {
    const finalOtp = otp.join("");

    const result = verifyOtpSchema.safeParse({
      otp: finalOtp,
    });

    if (!result.success) {
      return;
    }

    // Do not verify expired OTP
    if (remainingSeconds <= 0) {
      return;
    }

    // The user ID lives only in memory, so a page reload loses it.
    if (!forgotPasswordUserId) {
      toast.error("Your reset session has expired. Please start again.");
      navigate(`/${domain}/forgot-password`);
      return;
    }

    setIsVerifying(true);

    try {
      const success = await handleVerifyOtp(
        forgotPasswordUserId,
        finalOtp
      );

      if (success) {
        dispatch(showPageLoader());

        setTimeout(() => {
          navigate(`/${domain}/reset-password`);
        }, 1000);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // --------------------------------------------------
  // Resend OTP
  // --------------------------------------------------
  const handleResendOtp = async () => {
    if (isResending) return;

    if (!forgotPasswordUserId) {
      toast.error("Your reset session has expired. Please start again.");
      navigate(`/${domain}/forgot-password`);
      return;
    }

    setIsResending(true);

    try {
      const success = await handleForgotPassword(forgotPasswordUserId);

      if (success) {
        // Clear previous OTP. The timer restarts by itself: handleForgotPassword()
        // has already stored the new expiry from the server in Redux.
        setOtp(["", "", "", "", "", ""]);

        // Focus first OTP input
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      className="mt-7"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      {/* OTP Inputs */}
      <div className="mt-2 flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={isVerifying}
            onChange={(e) =>
              handleChange(e.target.value, index)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, index)
            }
            className="h-12 min-w-0 max-w-12 flex-1 rounded-lg border border-slate-300 text-center text-xl text-[#17244f] outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:bg-slate-100 sm:h-[52px]"
            style={U}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        type="submit"
        disabled={
          isVerifying ||
          remainingSeconds <= 0 ||
          otp.join("").length !== 6
        }
        className="mt-7 flex h-[36px] w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ ...U, fontSize: "clamp(12px, 0.9vw, 14px)", fontWeight: 600 }}
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify"
        )}
      </button>

      {/* Timer */}
      <div
        className="mt-3 flex justify-between text-[11px] text-slate-500"
        style={U}
      >
        <span>
          {remainingSeconds > 0
            ? "OTP is valid for 3 mins"
            : "OTP has expired"}
        </span>

        <span className={remainingSeconds <= 30 ? "font-medium text-red-500" : ""}>
          {formattedTime}
        </span>
      </div>

      {/* Resend OTP */}
      <div className="mt-3 text-right">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isResending || remainingSeconds > 0}
          className="text-[11px] text-[#3158db] disabled:cursor-not-allowed disabled:text-slate-400"
          style={U}
        >
          {isResending ? (
            <span className="flex items-center gap-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Resending...
            </span>
          ) : (
            "Resend OTP"
          )}
        </button>
      </div>
    </form>
  );
}
