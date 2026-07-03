import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Eye, EyeOff, User, Lock, Smartphone, ShieldCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { loginSchema } from "../validation/loginSchema";
import type { LoginFormData } from "../validation/loginSchema";
import { useLogin } from "../hooks/useLogin";

const urbanist: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

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
    } catch (err: any) {
      const message = err?.data?.message ?? err?.response?.data?.message ?? "";
      if (message.toLowerCase().includes("captcha")) {
        setError("captchaAnswer", { type: "manual", message });
      }
    }
  };

  return (
    <div
      className="w-full flex flex-col"
      style={{
        borderRadius: "clamp(16px, 2vw, 24px)",
        border: "1px solid rgba(46,46,46,0.18)",
        boxShadow: "4px 4px 24px 8px rgba(28,32,53,0.10)",
        background: "#FFFFFF",
        padding:
          "clamp(18px, 2.5vw, 30px) clamp(20px, 5vw, 56px) clamp(16px, 2vw, 24px)",
      }}
    >
      {/* ── HRMS Badge ── */}
      <div className="flex items-center gap-2 mb-3">
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
      <div className="mb-4">
        <p
          className="uppercase mb-2"
          style={{
            ...urbanist,
            fontWeight: 500,
            fontSize: "clamp(10px, 1.1vw, 13px)",
            letterSpacing: "0.12em",
            color: "#067EF1",
          }}
        >
          Welcome Back
        </p>
        {/* <h1
          className="mb-1.5"
          style={{
            ...urbanist,
            fontWeight: 400,
            fontSize: "clamp(15px, 1.5vw, 20px)",
            lineHeight: 1.15,
            color: "#131313",
          }}
        >
          Sign in to your workspace
        </h1> */}
        <p
          style={{
            ...urbanist,
            fontWeight: 400,
            fontSize: "clamp(11px, 0.85vw, 14px)",
            color: "#6B7280",
          }}
        >
          Enter your credentials to access HRMS
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

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
              className="pl-9 h-[42px] w-full rounded-lg border-slate-200 bg-slate-50 text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:border-blue-400"
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
              className="pl-9 pr-10 h-[42px] w-full rounded-lg border-slate-200 bg-slate-50 text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:border-blue-400"
              style={{ ...urbanist, fontSize: "clamp(11px, 0.85vw, 13px)" }}
              {...register("password")}
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

        {/* ── Captcha ── */}
        <div className="flex flex-col gap-1.5">
          <Label
            style={{
              ...urbanist,
              fontWeight: 500,
              fontSize: "clamp(11px, 0.85vw, 13px)",
              color: "#131313",
            }}
          >
            Captcha <span className="text-red-500">*</span>
          </Label>

          {/* Captcha image + refresh + input all on one row — matches Figma */}
          <div className="flex items-stretch gap-2 w-full">
            {/* SVG captcha box */}
            <div
              className="rounded-lg border border-blue-100 bg-[#EEF5FE] overflow-hidden flex items-center justify-center shrink-0"
              style={{ height: 42, width: "clamp(100px, 30%, 140px)" }}
            >
              {captchaLoading ? (
                <div className="w-full h-full animate-pulse bg-blue-100" />
              ) : (
                <div
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: captcha?.svg ?? "" }}
                />
              )}
            </div>

            {/* Refresh button */}
            <button
              type="button"
              onClick={loadCaptcha}
              disabled={captchaLoading}
              className="h-[42px] w-[42px] shrink-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors disabled:opacity-60"
              title="Refresh captcha"
            >
              <RefreshCw
                size={15}
                className={captchaLoading ? "animate-spin" : ""}
              />
            </button>

            {/* Captcha input — takes remaining space */}
            <div className="relative flex-1">
              <ShieldCheck
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={15}
              />
              <Input
                placeholder="Enter Captcha code"
                className="pl-9 h-[42px] w-full rounded-lg border-slate-200 bg-slate-50 text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:border-blue-400"
                style={{ ...urbanist, fontSize: "clamp(11px, 0.85vw, 13px)" }}
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
            Case sensitive . Refresh if unclear
          </p>
          {errors.captchaAnswer && (
            <p className="text-[11px] text-red-500">
              {errors.captchaAnswer.message}
            </p>
          )}
        </div>

        {/* ── Remember me + Forgot password ── */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Checkbox id="rememberMe" className="h-4 w-4 rounded" />
            <Label
              htmlFor="rememberMe"
              className="cursor-pointer"
              style={{
                ...urbanist,
                fontWeight: 400,
                fontSize: "clamp(11px, 0.85vw, 13px)",
                color: "#374151",
              }}
            >
              Remember me
            </Label>
          </div>
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
            height: 40,
            borderRadius: 10,
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
            height: 40,
            borderRadius: 10,
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
      <p
        className="text-center mt-auto pt-4"
        style={{ ...urbanist, fontSize: 12, color: "#9CA3AF" }}
      >
        Powered by{" "}
        <span style={{ fontWeight: 700, color: "#067EF1" }}>KOUNDINYASA</span>{" "}
        Technology Services
      </p>
    </div>
  );
}