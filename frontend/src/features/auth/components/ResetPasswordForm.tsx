import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { resetPasswordSchema } from "../validation/resetPasswordSchema";
import { useResetPassword } from "../hooks/useResetPassword";
import type { RootState } from "../../../app/store";
import { useAppSelector } from "../../../hooks/useAppSelector";

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

function PasswordInput({
  id, value, onChange, placeholder,
}: { id: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[44px] rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none pl-9 pr-10 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
        style={U}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { handleResetPassword } = useResetPassword();
  const navigate = useNavigate();

  // ✅ read from Redux, fall back to sessionStorage if Redux is empty
  const domainFromRedux = useAppSelector(state => state.domain.domain);
  const domain = domainFromRedux || sessionStorage.getItem("hrms_domain") || "";

  const loginPath = domain ? `/${domain}/login` : "/login";

  const handleSubmit = async () => {
    const result = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) { setError(result.error.issues[0].message); return; }
    setError("");
    const success = await handleResetPassword(password, confirmPassword);
    if (success) navigate(loginPath);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* New Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          style={{ ...U, fontWeight: 500, fontSize: "clamp(11px,0.85vw,13px)", color: "#1E293B" }}
        >
          New Password <span className="text-red-500">*</span>
        </label>
        <PasswordInput
          id="password"
          value={password}
          onChange={v => { setPassword(v); if (error) setError(""); }}
          placeholder="Enter new password"
        />
        <p style={{ ...U, fontSize: 11, color: "#9CA3AF" }}>Must be at least 8 characters</p>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          style={{ ...U, fontWeight: 500, fontSize: "clamp(11px,0.85vw,13px)", color: "#1E293B" }}
        >
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={v => { setConfirmPassword(v); if (error) setError(""); }}
          placeholder="Re-enter new password"
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {/* Submit */}
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
        Reset Password →
      </button>

      {/* Back to sign in */}
      <p className="text-center text-xs text-slate-400 mt-1" style={U}>
        Back to{" "}
        <button
          type="button"
          onClick={() => navigate(loginPath)}
          className="text-blue-600 font-semibold hover:underline"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", ...U, fontSize: "inherit" }}
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
