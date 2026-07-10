import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Eye, EyeOff, User, Lock, Smartphone, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema } from "../validation/loginSchema";
import type { LoginFormData } from "../validation/loginSchema";
import { useLogin } from "../hooks/useLogin";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { baseApi } from "@/app/baseApi"; 

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

const inputCls =
  "h-[44px] rounded-lg border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:border-blue-400";

export default function LoginForm() {
  const { captcha, captchaLoading, loadCaptcha, login } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema), mode: "onChange" });

  const onSubmit = async (data: LoginFormData) => {
    try {
      dispatch(baseApi.util.resetApiState()); // ✅ clear any stale cache from a previous session before logging in
      await login(data);
    } catch (err: any) {
      const msg = err?.data?.message ?? err?.response?.data?.message ?? "";
      if (msg.toLowerCase().includes("captcha"))
        setError("captchaAnswer", { type: "manual", message: msg });
    }
  };

  return (
    <div
      className="w-full flex flex-col bg-white"
      style={{
        borderRadius: "clamp(20px, 2vw, 28px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.11), 0 1px 3px rgba(0,0,0,0.05)",
        padding: "clamp(24px, 3vw, 36px) clamp(20px, 4vw, 40px) clamp(20px, 2.5vw, 28px)",
      }}
    >
      {/* HRMS badge */}
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="flex items-center justify-center shrink-0"
          style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#1D4ED8,#3B82F6)" }}
        >
          <User className="text-white" size={16} />
        </div>
        <span style={{ ...U, fontWeight: 700, fontSize: 11, color: "#1E293B", letterSpacing: "0.25em" }}>
          HRMS
        </span>
      </div>
      <div className="mb-5">
        <h1 style={{ ...U, fontWeight: 500, fontSize: "clamp(17px,1.7vw,22px)", color: "#0F172A", lineHeight: 1.2 }}>
          Sign in to your workspace
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="userId" style={{ ...U, fontWeight: 500, fontSize: "clamp(11px,0.85vw,13px)", color: "#1E293B" }}>
            Username <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input id="userId" type="text" placeholder="username@koundinyasatech.com"
              className={`pl-9 ${inputCls}`} style={{ ...U, fontSize: "clamp(11px,0.85vw,13px)" }}
              {...register("userId")} />
          </div>
          {errors.userId && <p className="text-[11px] text-red-500">{errors.userId.message}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" style={{ ...U, fontWeight: 500, fontSize: "clamp(11px,0.85vw,13px)", color: "#1E293B" }}>
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password"
              className={`pl-9 pr-10 ${inputCls}`} style={{ ...U, fontSize: "clamp(11px,0.85vw,13px)" }}
              {...register("password")} />
            <button type="button" onClick={() => setShowPassword(p => !p)} tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-red-500">{errors.password.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label
            style={{
              ...U,
              fontWeight: 500,
              fontSize: "clamp(11px,0.85vw,13px)",
              color: "#1E293B",
            }}
          >
            Captcha <span className="text-red-500">*</span>
          </Label>

          <div className="flex items-center gap-2">
            {/* Captcha Image */}
            <div
              className="rounded-lg border border-blue-100 bg-[#EEF5FE] overflow-hidden flex items-center justify-center shrink-0"
              style={{
                width: 120,
                height: 44,
              }}
            >
              {captchaLoading ? (
                <div className="w-full h-full animate-pulse bg-blue-100" />
              ) : captcha?.image ? (
                <img
                  src={captcha.image}
                  alt="Captcha"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs text-gray-400">
                  No Captcha
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={loadCaptcha}
              disabled={captchaLoading}
              title="Refresh captcha"
              className="h-[44px] w-[44px] shrink-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={captchaLoading ? "animate-spin" : ""}
              />
            </button>

            {/* Captcha Input */}
            <div className="relative flex-1">
              <ShieldCheck
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />

              <Input
                placeholder="Enter captcha"
                className={`pl-9 ${inputCls}`}
                style={{
                  ...U,
                  fontSize: "clamp(11px,0.85vw,13px)",
                }}
                {...register("captchaAnswer")}
              />
            </div>
          </div>
          <p
            style={{
              ...U,
              fontSize: 11,
              color: "#9CA3AF",
            }}
          >
            Case sensitive · Refresh if unclear
          </p>

          {errors.captchaAnswer && (
            <p className="text-[11px] text-red-500">
              {errors.captchaAnswer.message}
            </p>
          )}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="rememberMe" className="h-4 w-4 rounded border-slate-300" />
            <Label htmlFor="rememberMe" className="cursor-pointer"
              style={{ ...U, fontWeight: 400, fontSize: "clamp(11px,0.85vw,13px)", color: "#374151" }}>
              Remember me
            </Label>
          </div>
          <button type="button" onClick={() => navigate("/forgot-password")}
            className="hover:underline transition-all"
            style={{ ...U, fontSize: "clamp(11px,0.85vw,13px)", fontWeight: 500, color: "#067EF1", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
            Forgot password?
          </button>
        </div>

        <button type="submit" disabled={isSubmitting || captchaLoading}
          className="w-full flex items-center justify-center text-white disabled:opacity-70 hover:opacity-90 active:scale-[0.99] transition-all"
          style={{ height: 44, borderRadius: 10, background: "linear-gradient(90deg,#1D4ED8,#3B82F6)", boxShadow: "0 4px 18px rgba(59,130,246,0.38)", ...U, fontSize: "clamp(12px,0.9vw,14px)", fontWeight: 600, letterSpacing: "0.02em" }}>
          {isSubmitting ? "Signing In…" : "Sign In →"}
        </button>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span style={{ ...U, fontSize: 11, color: "#9CA3AF" }}>or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Mobile OTP */}
        <button type="button"
          className="w-full flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.99] transition-all"
          style={{ height: 44, borderRadius: 10, border: "1px solid #D1D5DB", background: "#FFFFFF", ...U, fontSize: "clamp(12px,0.9vw,14px)", fontWeight: 500, color: "#374151" }}>
          <Smartphone size={14} className="text-slate-500" />
          Sign in with Mobile OTP
        </button>
      </form>

      {/* Powered by */}
      <p className="text-center mt-5 pt-4 border-t border-slate-100" style={{ ...U, fontSize: 11, color: "#9CA3AF" }}>
        Powered by <span style={{ fontWeight: 700, color: "#067EF1" }}>KOUNDINYASA</span> Technology Services
      </p>
    </div>
  );
}