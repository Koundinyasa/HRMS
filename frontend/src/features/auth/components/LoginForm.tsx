import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Eye, EyeOff, User, Lock, Smartphone, ShieldCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginSchema } from "../validation/loginSchema";
import type { LoginFormData } from "../validation/loginSchema";
import { useLogin } from "../hooks/useLogin";

const urbanist: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };
const inputCls =
  "h-[36px] w-full rounded-lg border-slate-300 bg-white text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:border-blue-400";

export default function LoginForm() {
  const { captcha, captchaLoading, loadCaptcha, login } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { domain } = useParams();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error: unknown) {
      const errorRecord =
        error && typeof error === "object"
          ? (error as Record<string, unknown>)
          : {};
      const response =
        errorRecord.response && typeof errorRecord.response === "object"
          ? (errorRecord.response as Record<string, unknown>)
          : {};
      const dataValue = errorRecord.data ?? response.data;
      const data =
        dataValue && typeof dataValue === "object"
          ? (dataValue as Record<string, unknown>)
          : {};
      const message =
        typeof data.message === "string" ? data.message : "";
      if (message.toLowerCase().includes("captcha")) {
        setError("captchaAnswer", { type: "manual", message });
      }
    }
  };

  return (
    <div
      className="flex w-full flex-col lg:h-full lg:min-h-0"
      style={{
        background: "transparent",
        padding: 0,
      }}
    >
      {/* ── HRMS Badge ── */}
      <div className="mb-9 flex items-center gap-2 lg:mb-0">
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)",
          }}
        >
          <User className="text-white" size={16} />
        </div>
        <span
          className="tracking-widest uppercase"
          style={{
            ...urbanist,
            fontWeight: 700,
            fontSize: 11,
            color: "#1E293B",
            // letterSpacing: "0.30em",
          }}
        >
          HRMS
        </span>
      </div>

      {/* ── Header ── */}
      <div className="mb-3 lg:mt-[clamp(88px,20vh,150px)]">
        <p
          className="mb-3 flex items-center gap-2 uppercase"
          style={{
            ...urbanist,
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "#3158db",
          }}
        >
          <span className="h-px w-5 bg-rose-400" />
          Welcome back
        </p>
        <h1
          className="mb-2 text-[clamp(40px,3.2vw,52px)] font-bold leading-[1] tracking-tight text-[#17244f]"
          style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
        >
          Sign in to <span className="text-[#3158db]">HRMS</span>
        </h1>
        <p
          style={{
            ...urbanist,
            fontWeight: 400,
            fontSize: 13,
            color: "#64748b",
          }}
        >
          Enter your credentials to access HRMS.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">

        {/* ── Username ── */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="userId"
            style={{
              ...urbanist,
              fontWeight: 500,
              fontSize: "clamp(11px, 0.85vw, 13px)",
              color: "#131313",
            }}
          >
            Username <span className="text-red-500">*</span>
          </Label>
          <div className="relative w-full">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={15}
            />
            <Input
              id="userId"
              type="text"
              placeholder="username@koundinyasa.tech"
              className="pl-9 h-[36px] w-full rounded-lg border-slate-300 bg-white text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:border-blue-400"
              style={{ ...urbanist, fontSize: "clamp(11px, 0.85vw, 13px)" }}
              {...register("userId")}
            />
          </div>
          {errors.userId && (
            <p className="text-[11px] text-red-500">{errors.userId.message}</p>
          )}
        </div>

        {/* ── Password ── */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="password"
            style={{
              ...urbanist,
              fontWeight: 500,
              fontSize: "clamp(11px, 0.85vw, 13px)",
              color: "#131313",
            }}
          >
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative w-full">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={15}
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-9 pr-10 h-[36px] w-full rounded-lg border-slate-300 bg-white text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:border-blue-400"
              style={{ ...urbanist, fontSize: "clamp(11px, 0.85vw, 13px)" }}
              {...register("password")}
              onPaste={(event) => event.preventDefault()}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-500">{errors.password.message}</p>
          )}
        </div>

     
        {/* Captcha */}
        <div className="flex flex-col gap-1.5">
          <Label
            style={{
              ...urbanist,
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
                height: 36,
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

            {/* Refresh Button */}
            <button
              type="button"
              onClick={loadCaptcha}
              disabled={captchaLoading}
              title="Refresh captcha"
              className="h-[36px] w-[36px] shrink-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors disabled:opacity-60"
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
                  ...urbanist,
                  fontSize: "clamp(11px,0.85vw,13px)",
                }}
                {...register("captchaAnswer")}
              />
            </div>
          </div>

          <p
            style={{
              ...urbanist,
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

        {/* ── Forgot password ── */}
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={() => navigate(`/${domain}/forgot-password`)}
            style={{
              ...urbanist,
              fontSize: "clamp(11px, 0.85vw, 13px)",
              fontWeight: 500,
              color: "#067EF1",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            Forgot password?
          </button>
        </div>

        {/* ── Sign In button ── */}
        <button
          type="submit"
          disabled={isSubmitting || captchaLoading}
          className="w-full flex items-center justify-center text-white font-semibold transition-opacity disabled:opacity-70 hover:opacity-90"
          style={{
            height: 36,
            borderRadius: 9999,
            background: "linear-gradient(90deg, #1D4ED8 0%, #3B82F6 100%)",
            boxShadow: "0px 2px 16px 0px rgba(59,130,246,0.40)",
            ...urbanist,
            fontSize: "clamp(12px, 0.9vw, 14px)",
            fontWeight: 600,
          }}
        >
          {isSubmitting ? "Signing In…" : "Sign In →"}
        </button>

        {/* ── OR divider ── */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-slate-200" />
          <span
            style={{
              ...urbanist,
              fontSize: 11,
              color: "#9CA3AF",
            }}
          >
            or
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* ── Sign in with Mobile OTP ── */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 transition-colors hover:bg-slate-50"
          style={{
            height: 36,
            borderRadius: 9999,
            border: "1px solid #D1D5DB",
            background: "#FFFFFF",
            ...urbanist,
            fontSize: "clamp(12px, 0.9vw, 14px)",
            fontWeight: 500,
            color: "#374151",
          }}
        >
          <Smartphone size={15} className="shrink-0" />
          Sign in with Mobile OTP
        </button>
      </form>

      {/* ── Powered by footer ── */}
      <p className="mt-4 pt-1 text-left lg:mt-auto" style={{ ...urbanist, fontSize: 10, color: "#64748b" }}>
        Powered by <strong className="text-[#17244f]">KOUNDINYASA</strong>{" "}
        Technology Services
      </p>
    </div>
  );
}
