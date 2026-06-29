import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtpSchema } from "../validation/verifyOtpSchema";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { useAppSelector } from "../../../hooks/useAppSelector";

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { handleVerifyOtp } = useVerifyOtp();
  const navigate = useNavigate();

  const forgotPasswordEmployeeId = useAppSelector(s => s.auth.forgotPasswordEmployeeId);
  const remainingMinutes = useAppSelector(s => s.auth.otpRemainingMinutes ?? 0);
  const remainingSeconds = useAppSelector(s => s.auth.otpRemainingSeconds ?? 0);

  const [timeLeft, setTimeLeft] = useState(remainingMinutes * 60 + remainingSeconds);
  const [isExpired, setIsExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  useEffect(() => {
    const total = remainingMinutes * 60 + remainingSeconds;
    setTimeLeft(total);
    setIsExpired(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); setIsExpired(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [remainingMinutes, remainingSeconds]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSubmit = async () => {
    if (isExpired) return;
    const finalOtp = otp.join("");
    const result = verifyOtpSchema.safeParse({ otp: finalOtp });
    if (!result.success) return;
    const success = await handleVerifyOtp(forgotPasswordEmployeeId, finalOtp);
    if (success) navigate("/reset-password");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* OTP boxes */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={e => handleChange(e.target.value, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            className="text-center text-xl sm:text-2xl font-semibold text-slate-700 border-2 rounded-xl bg-slate-50 outline-none transition-all"
            style={{
              ...U,
              width: "clamp(38px, 13%, 52px)",
              height: "clamp(44px, 10vw, 60px)",
              borderColor: digit ? "#3B82F6" : "#E2E8F0",
              boxShadow: digit ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
            }}
          />
        ))}
      </div>

      {/* Timer row */}
      <div className="flex items-center justify-between px-1 mt-1">
        <span style={{ ...U, fontSize: "clamp(11px,0.85vw,12px)", color: "#9CA3AF" }}>
          OTP valid for 3 mins
        </span>
        <span
          style={{
            ...U,
            fontSize: "clamp(12px,0.9vw,13px)",
            fontWeight: 600,
            color: isExpired ? "#EF4444" : "#1D4ED8",
          }}
        >
          {isExpired ? "OTP Expired" : formatTime(timeLeft)}
        </span>
      </div>

      {/* Verify button */}
      <button
        onClick={handleSubmit}
        disabled={isExpired || otp.some(d => d === "")}
        className="w-full flex items-center justify-center text-white disabled:opacity-50 hover:opacity-90 active:scale-[0.99] transition-all"
        style={{ height: 44, borderRadius: 10, background: "linear-gradient(90deg,#1D4ED8,#3B82F6)", boxShadow: "0 4px 18px rgba(59,130,246,0.38)", ...U, fontSize: "clamp(12px,0.9vw,14px)", fontWeight: 600 }}>
        Verify OTP →
      </button>

      {/* Resend */}
      <p className="text-center" style={{ ...U, fontSize: "clamp(11px,0.85vw,13px)", color: "#9CA3AF" }}>
        Didn't receive the code?{" "}
        <button
          disabled={!isExpired}
          className={`font-semibold transition-colors ${isExpired ? "text-blue-600 hover:underline cursor-pointer" : "text-slate-300 cursor-not-allowed"}`}
          style={U}
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
}