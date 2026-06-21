// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   RefreshCw,
//   Eye,
//   EyeOff,
//   User,
//   Lock,
//   Smartphone,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Card, CardContent } from "@/components/ui/card";

// import { loginSchema } from "../validation/loginSchema";
// import type { LoginFormData } from "../validation/loginSchema";
// import { useLogin } from "../hooks/useLogin";

// export default function LoginForm() {
//   const { captcha, captchaLoading, loadCaptcha, login } = useLogin();
//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     mode: "onChange",
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       await login(data);
//     } catch (err: any) {
//       const message = err?.response?.data?.message ?? "";
//       if (message.toLowerCase().includes("captcha")) {
//         setError("captcha", { type: "manual", message });
//       }
//     }
//   };

//   return (
//     <Card className="w-full max-w-[600px] rounded-2xl border-0 shadow-2xl bg-white">
//       <CardContent className="px-10 py-5 flex flex-col min-h-[600px]">

//         {/* HRMS Badge + Header — side by side to save vertical space */}
//         <div className="flex items-center gap-2 mb-3">
//           <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
//             <User className="w-3.5 h-3.5 text-white" />
//           </div>
//           <span className="font-bold text-xs text-slate-800 tracking-widest uppercase">
//             HRMS
//           </span>
//         </div>

//         {/* Header */}
//         <div className="mb-3">
//           <p className="text-blue-500 uppercase text-[9px] font-bold tracking-[3px] mb-0.5">
//             Welcome Back
//           </p>
//           <h1 className="text-lg font-semibold text-slate-800 leading-tight">
//             Sign in to your workspace
//           </h1>
//           <p className="text-slate-400 text-[11px] mt-0.5">
//             Enter your credentials to access HRMS
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">

//           {/* Username */}
//           <div className="space-y-1">
//             <Label htmlFor="userId" className="text-[11px] font-medium text-slate-700">
//               Username <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
//               <Input
//                 id="userId"
//                 type="text"
//                 placeholder="username@koundinyasa.tech"
//                 className="pl-8 h-8 text-xs bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-blue-400 placeholder:text-slate-400"
//                 {...register("userId")}
//               />
//             </div>
//             {errors.userId && (
//               <p className="text-[10px] text-red-500">{errors.userId.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="space-y-1">
//             <Label htmlFor="password" className="text-[11px] font-medium text-slate-700">
//               Password <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 className="pl-8 pr-9 h-8 text-xs bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-blue-400 placeholder:text-slate-400"
//                 {...register("password")}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((p) => !p)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//               >
//                 {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="text-[10px] text-red-500">{errors.password.message}</p>
//             )}
//           </div>

//           {/* Captcha */}
//           <div className="space-y-1">
//             <Label className="text-[11px] font-medium text-slate-700">
//               Captcha <span className="text-red-500">*</span>
//             </Label>

//             {/* SVG display + refresh */}
//             <div className="flex gap-2 items-stretch">
//               <div
//                 className="flex-1 rounded-lg border border-blue-100 bg-blue-50 overflow-hidden flex items-center justify-center"
//                 style={{ height: "36px" }}
//               >
//                 {captchaLoading ? (
//                   <div className="w-full h-full animate-pulse bg-blue-100" />
//                 ) : (
//                   <div
//                     className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
//                     dangerouslySetInnerHTML={{ __html: captcha?.svg ?? "" }}
//                   />
//                 )}
//               </div>
//               <button
//                 type="button"
//                 onClick={loadCaptcha}
//                 disabled={captchaLoading}
//                 className="h-9 w-9 shrink-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors"
//               >
//                 <RefreshCw className={`h-3.5 w-3.5 ${captchaLoading ? "animate-spin" : ""}`} />
//               </button>
//             </div>

//             <Input
//               placeholder="Enter Captcha code"
//               className="h-8 text-xs bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-blue-400 placeholder:text-slate-400"
//               {...register("captcha")}
//             />
//             <p className="text-[10px] text-slate-400">Case sensitive . Refresh if unclear</p>
//             {errors.captcha && (
//               <p className="text-[10px] text-red-500">{errors.captcha.message}</p>
//             )}
//           </div>

//           {/* Remember + Forgot */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-1.5">
//               <Checkbox id="rememberMe" className="h-3.5 w-3.5" />
//               <Label htmlFor="rememberMe" className="text-[11px] text-slate-600 cursor-pointer font-normal">
//                 Remember me
//               </Label>
//             </div>
//             <button type="button" className="text-[11px] font-medium text-blue-500 hover:text-blue-600">
//               Forgot password?
//             </button>
//           </div>

//           {/* Sign In */}
//           <Button
//             type="submit"
//             className="w-full h-9 rounded-lg text-xs font-semibold bg-blue-500 hover:bg-blue-600"
//             disabled={isSubmitting || captchaLoading}
//           >
//             {isSubmitting ? "Signing In..." : "Sign In →"}
//           </Button>

//           {/* OR divider */}
//           <div className="flex items-center gap-3">
//             <div className="flex-1 h-px bg-slate-200" />
//             <span className="text-[10px] text-slate-400">or</span>
//             <div className="flex-1 h-px bg-slate-200" />
//           </div>

//           {/* Mobile OTP */}
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full h-9 rounded-lg text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
//           >
//             <Smartphone className="mr-2 h-3.5 w-3.5" />
//             Sign in with Mobile OTP
//           </Button>

//         </form>

//         {/* Footer */}
//         <p className="text-center text-[10px] text-slate-400 mt-auto pt-4">
//           Powered by{" "}
//           <span className="font-bold text-blue-500">KOUNDINYASA</span>{" "}
//           Technology Services
//         </p>

//       </CardContent>
//     </Card>
//   );
// }

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Eye, EyeOff, User, Lock, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { loginSchema } from "../validation/loginSchema";
import type { LoginFormData } from "../validation/loginSchema";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const { captcha, captchaLoading, loadCaptcha, login } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
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
      const message = err?.response?.data?.message ?? "";
      if (message.toLowerCase().includes("captcha")) {
        setError("captchaAnswer", { type: "manual", message });
      }
    }
  };

  const urbanist = { fontFamily: "Urbanist, sans-serif" };

  return (
    <div
      className="w-full flex flex-col"
      style={{
        minHeight: "min(927px, 90vh)",
        borderRadius: "24px",
        border: "1px solid rgba(46,46,46,0.50)",
        boxShadow: "4px 4px 12px 8px rgba(28,32,53,0.149)",
        background: "#FFFFFF",
        padding: "clamp(24px, 4vw, 40px) clamp(20px, 5vw, 62px) clamp(20px, 3vw, 36px)",
      }}
    >
      {/* HRMS Badge */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-xs text-slate-800 tracking-widest uppercase">
          HRMS
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <p
          className="uppercase mb-2"
          style={{
            ...urbanist,
            fontWeight: 300,
            fontSize: "clamp(10px, 1.5vw, 15px)",
            lineHeight: "100%",
            color: "#067EF1",
          }}
        >
          Welcome Back
        </p>
        <h1
          className="mb-2"
          style={{
            ...urbanist,
            fontWeight: 300,
            fontSize: "clamp(15px, 2.5vw, 24px)",
            lineHeight: "110%",
            color: "#131313",
          }}
        >
          Sign in to your workspace
        </h1>
        <p
          style={{
            ...urbanist,
            fontWeight: 300,
            fontSize: "clamp(10px, 1vw, 15px)",
            lineHeight: "100%",
            color: "#2E2E2E",
          }}
        >
          Enter your credentials to access HRMS
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="userId"
            style={{ ...urbanist, fontWeight: 400, fontSize: "clamp(10px, 1vw, 12px)", color: "#131313" }}
          >
            Username <span className="text-red-500">*</span>
          </Label>
          <div className="relative w-full h-[41px]">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="userId"
              type="text"
              placeholder="username@koundinyasa.tech"
              className="pl-9 h-full w-full rounded-lg border-slate-200 bg-slate-50 focus-visible:ring-blue-400"
              style={{ ...urbanist, fontSize: "clamp(18px, 0.7vw, 10px)", color: "rgba(98,98,98,0.80)" }}
              {...register("userId")}
            />
          </div>
          {errors.userId && (
            <p className="text-[11px] text-red-500">{errors.userId.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="password"
            style={{ ...urbanist, fontWeight: 400, fontSize: "clamp(10px, 1vw, 12px)", color: "#131313" }}
          >
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative w-full h-[41px]">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-9 pr-10 h-full w-full rounded-lg border-slate-200 bg-slate-50 focus-visible:ring-blue-400"
              style={{ ...urbanist, fontSize: "clamp(10px, 0.7vw, 12px)", color: "rgba(98,98,98,0.80)" }}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Captcha */}
        <div className="flex flex-col gap-1.5">
          <Label
            style={{ ...urbanist, fontWeight: 400, fontSize: "clamp(10px, 1vw, 12px)", color: "#131313" }}
          >
            Captcha <span className="text-red-500">*</span>
          </Label>

          <div className="flex gap-2 items-stretch w-full">
            <div
              className="flex-1 rounded-lg border border-blue-100 bg-blue-50 overflow-hidden flex items-center justify-center"
              style={{ height: "41px" }}
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
            <button
              type="button"
              onClick={loadCaptcha}
              disabled={captchaLoading}
              className="h-[41px] w-[41px] shrink-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${captchaLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="relative w-full h-[41px]">
            <Input
              placeholder="Enter Captcha code"
              className="h-full w-full rounded-lg border-slate-200 bg-slate-50 focus-visible:ring-blue-400"
              style={{ ...urbanist, fontSize: "clamp(10px, 1vw, 12px)", color: "rgba(98,98,98,0.80)" }}
              {...register("captchaAnswer")}
            />
          </div>
          <p className="text-[11px] text-slate-400">Case sensitive . Refresh if unclear</p>
          {errors.captchaAnswer && (
            <p className="text-[11px] text-red-500">{errors.captchaAnswer.message}</p>
          )}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Checkbox id="rememberMe" className="h-4 w-4" />
            <Label
              htmlFor="rememberMe"
              className="cursor-pointer font-normal"
              style={{ ...urbanist, fontSize: "clamp(10px, 1vw, 12px)", color: "#2E2E2E" }}
            >
              Remember me
            </Label>
          </div>
          <button
            type="button"
            style={{ ...urbanist, fontSize: "clamp(10px, 0.7vw, 12px)", fontWeight: 500, color: "#067EF1" }}
            onClick={()=>navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In */}
        <button
          type="submit"
          disabled={isSubmitting || captchaLoading}
          className="w-full flex items-center justify-center text-white font-semibold transition-opacity disabled:opacity-70"
          style={{
            height: "42px",
            borderRadius: "10px",
            background: "linear-gradient(90deg, #1D4ED8 0%, #3B82F6 100%)",
            boxShadow: "0px 2px 12px 0px rgba(59,130,246,0.35)",
            ...urbanist,
            fontSize: "clamp(10px, 1vw, 12px)",
          }}
        >
          {isSubmitting ? "Signing In..." : "Sign In →"}
        </button>

        {/* OR divider */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Mobile OTP */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 transition-colors hover:bg-slate-50"
          style={{
            height: "42px",
            borderRadius: "10px",
            border: "0.67px solid #2E2E2E",
            background: "#FFFFFF",
            ...urbanist,
            fontSize: "clamp(10px, 1vw, 12px)",
            fontWeight: 500,
            color: "#2E2E2E",
          }}
        >
          <Smartphone className="h-4 w-4 shrink-0" />
          Sign in with Mobile OTP
        </button>

      </form>

      {/* Powered by */}
      <p
        className="text-center mt-auto pt-5"
        style={{ ...urbanist, fontSize: "12px", color: "#6B7280" }}
      >
        Powered by{" "}
        <span style={{ fontWeight: 700, color: "#067EF1" }}>KOUNDINYASA</span>{" "}
        Technology Services
      </p>
    </div>
  );
}