import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { forgotPasswordSchema } from "../validation/forgotPasswordSchema";
import { useForgotPassword } from "../hooks/useForgotPassword";

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

const inputCls =
  "w-full h-[44px] rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none pl-9 pr-4 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all";

export default function ForgotPasswordForm() {
  const [userId, setUserId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { handleForgotPassword } = useForgotPassword();

  const handleSubmit = async () => {
    // mobileNumber is optional — only pass it if filled
    const payload = mobileNumber.trim()
      ? { userId, mobileNumber }
      : { userId };

    const result = forgotPasswordSchema.safeParse(payload);
    if (!result.success) { setError(result.error.issues[0].message); return; }

    setError("");
    const success = await handleForgotPassword(userId, mobileNumber);
    if (success) navigate("/verify-otp");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Email ID */}
      <div className="flex flex-col gap-1.5">
        <label style={{ ...U, fontWeight: 500, fontSize: "clamp(11px,0.85vw,13px)", color: "#1E293B" }}>
          Email ID <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            value={userId}
            onChange={e => { setUserId(e.target.value); if (error) setError(""); }}
            placeholder="username@koundinyasa.tech"
            className={inputCls}
            style={U}
          />
        </div>
      </div>

      {/* Mobile No — optional */}
      <div className="flex flex-col gap-1.5">
        <label style={{ ...U, fontWeight: 500, fontSize: "clamp(11px,0.85vw,13px)", color: "#1E293B" }}>
          Mobile No{" "}
          <span className="text-slate-400 font-normal text-xs">(optional)</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            value={mobileNumber}
            onChange={e => setMobileNumber(e.target.value)}
            placeholder="+91 98458xxxxx"
            className={inputCls}
            style={U}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full flex items-center justify-center text-white hover:opacity-90 active:scale-[0.99] transition-all mt-1"
        style={{
          height: 44,
          borderRadius: 10,
          background: "linear-gradient(90deg,#1D4ED8,#3B82F6)",
          boxShadow: "0 4px 18px rgba(59,130,246,0.38)",
          ...U,
          fontSize: "clamp(12px,0.9vw,14px)",
          fontWeight: 600,
        }}
      >
        Send OTP →
      </button>

      <p className="text-center text-xs text-slate-400 mt-1" style={U}>
        Remember your password?{" "}
        <a href="/login" className="text-blue-600 font-semibold hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}