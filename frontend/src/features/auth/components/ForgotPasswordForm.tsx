// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { forgotPasswordSchema } from "../validation/forgotPasswordSchema";
// // import { useForgotPassword } from "../hooks/useForgotPassword";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { useAppDispatch } from "../../../hooks/useAppDispatch";
// // import { showPageLoader } from "../../employee/employeeSlice";

// // const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

// // const inputCls =
// //   "w-full h-[44px] rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none pl-9 pr-4 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all";

// // export default function ForgotPasswordForm() {
// //   const [userId, setUserId] = useState("");
// //   const [mobileNumber, setMobileNumber] = useState("");
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();
// //   const dispatch = useAppDispatch();
// //   const { domain } = useParams();

// //   const { handleForgotPassword } = useForgotPassword();


// //   const handleSubmit = async () => {
// //   const result = forgotPasswordSchema.safeParse({ userId });

// //   if (!result.success) {
// //     setError(result.error.issues[0].message);
// //     return;
// //   }

// //   setError("");

// //   const success = await handleForgotPassword(userId, mobileNumber);
  
// //   if (success) {
// //   dispatch(showPageLoader());

// //   setTimeout(() => {
// //     navigate(`/${domain}/verify-otp`);
// //   }, 1000);
// // }
// // };

// //   return (
// //     <div className="flex flex-col gap-4">
// //       {/* Email ID */}
// //       <div className="flex flex-col gap-1.5">
// //         <label style={{ ...U, fontWeight: 500, fontSize: "clamp(11px,0.85vw,13px)", color: "#1E293B" }}>
// //           Email ID <span className="text-red-500">*</span>
// //         </label>

// //         <input
// //           type="text"
// //           value={userId}
// //           onChange={(e) =>
// //             setUserId(e.target.value)
// //           }
// //           placeholder="username@koundinyasa.tech"
// //           className="w-full h-[48px] px-4 rounded-lg border border-[#D8E2EC] bg-[#EEF5FB] outline-none"
// //         />
// //       </div>

// //       {error && <p className="text-red-500 text-xs">{error}</p>}

// //       <button
// //         onClick={handleSubmit}
// //         className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 rounded-xl"
// //       >
// //         Send OTP
// //       </button>

// //       <div className="mt-auto pt-30 text-center text-sm text-gray-500">
// //         Powered by
// //         <span className="text-blue-600 ml-1 font-semibold">
// //           KOUNDINYASA
// //         </span>
// //         <span className="ml-1">
// //           Technology Services
// //         </span>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { forgotPasswordSchema } from "../validation/forgotPasswordSchema";
// import { useForgotPassword } from "../hooks/useForgotPassword";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAppDispatch } from "../../../hooks/useAppDispatch";
// import { showPageLoader } from "../../employee/employeeSlice";
// import { Loader2 } from "lucide-react";
 
// const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };
 
// const inputCls =
//   "w-full h-[44px] rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none pl-9 pr-4 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all";
 
// export default function ForgotPasswordForm() {
//   const [userId, setUserId] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { domain } = useParams();
 
//   const { handleForgotPassword } = useForgotPassword();
 
//   const handleSubmit = async () => {
//     const result = forgotPasswordSchema.safeParse({ userId });
 
//     if (!result.success) {
//       setError(result.error.issues[0].message);
//       return;
//     }
 
//     setError("");
//     setIsLoading(true);
 
//     try {
//       const success = await handleForgotPassword(userId, mobileNumber);
 
//       if (success) {
//         dispatch(showPageLoader());
 
//         setTimeout(() => {
//           navigate(`/${domain}/verify-otp`);
//         }, 1000);
//       }
//     } catch (error) {
//       console.error("Forgot password error:", error);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   return (
//     <div className="flex flex-col gap-4">
//       {/* Email ID */}
//       <div className="flex flex-col gap-1.5">
//         <label
//           style={{
//             ...U,
//             fontWeight: 500,
//             fontSize: "clamp(11px,0.85vw,13px)",
//             color: "#1E293B",
//           }}
//         >
//           Email ID <span className="text-red-500">*</span>
//         </label>
 
//         <input
//           type="text"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           placeholder="username@koundinyasa.tech.com"
//           disabled={isLoading}
//           className="w-full h-[48px] px-4 rounded-lg border border-[#D8E2EC] bg-[#EEF5FB] outline-none"
//         />
//       </div>
 
//       {error && <p className="text-red-500 text-xs">{error}</p>}
 
//       <button
//         onClick={handleSubmit}
//         disabled={isLoading}
//         className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
//       >
//         {isLoading ? (
//           <>
//             <Loader2 className="w-5 h-5 animate-spin" />
//             Sending OTP...
//           </>
//         ) : (
//           "Send OTP"
//         )}
//       </button>
 
//       <div className="mt-auto pt-30 text-center text-sm text-gray-500">
//         Powered by
//         <span className="text-blue-600 ml-1 font-semibold">KOUNDINYASA</span>
//         <span className="ml-1">Technology Services</span>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { forgotPasswordSchema } from "../validation/forgotPasswordSchema";
// import { useForgotPassword } from "../hooks/useForgotPassword";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAppDispatch } from "../../../hooks/useAppDispatch";
// import { showPageLoader } from "../../employee/employeeSlice";
 
// const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };
 
// const inputCls =
//   "w-full h-[44px] rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none pl-9 pr-4 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all";
 
// export default function ForgotPasswordForm() {
//   const [userId, setUserId] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { domain } = useParams();
 
//   const { handleForgotPassword } = useForgotPassword();
 
 
//   const handleSubmit = async () => {
//   const result = forgotPasswordSchema.safeParse({ userId });
 
//   if (!result.success) {
//     setError(result.error.issues[0].message);
//     return;
//   }
 
//   setError("");
 
//   const success = await handleForgotPassword(userId, mobileNumber);
 
//   if (success) {
//   dispatch(showPageLoader());
 
//   setTimeout(() => {
//     navigate(`/${domain}/verify-otp`);
//   }, 1000);
// }
// };
 
//   return (
//     <div className="flex flex-col gap-4">
//       {/* Email ID */}
//       <div className="flex flex-col gap-1.5">
//         <label style={{ ...U, fontWeight: 500, fontSize: "clamp(11px,0.85vw,13px)", color: "#1E293B" }}>
//           Email ID <span className="text-red-500">*</span>
//         </label>
 
//         <input
//           type="text"
//           value={userId}
//           onChange={(e) =>
//             setUserId(e.target.value)
//           }
//           placeholder="username@koundinyasa.tech"
//           className="w-full h-[48px] px-4 rounded-lg border border-[#D8E2EC] bg-[#EEF5FB] outline-none"
//         />
//       </div>
 
//       {error && <p className="text-red-500 text-xs">{error}</p>}
 
//       <button
//         onClick={handleSubmit}
//         className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 rounded-xl"
//       >
//         Send OTP
//       </button>
 
//       <div className="mt-auto pt-30 text-center text-sm text-gray-500">
//         Powered by
//         <span className="text-blue-600 ml-1 font-semibold">
//           KOUNDINYASA
//         </span>
//         <span className="ml-1">
//           Technology Services
//         </span>
//       </div>
//     </div>
//   );
// }
 
 
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema } from "../validation/forgotPasswordSchema";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { showPageLoader } from "../../employee/employeeSlice";
import { Loader2 } from "lucide-react";
 
const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };
 
const inputCls =
  "w-full h-[44px] rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none pl-9 pr-4 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all";
 
export default function ForgotPasswordForm() {
  const [userId, setUserId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { domain } = useParams();
 
  const { handleForgotPassword } = useForgotPassword();
 
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
 
    const result = forgotPasswordSchema.safeParse({ userId });
 
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
 
    setError("");
    setIsLoading(true);
 
    try {
      const success = await handleForgotPassword(userId, mobileNumber);
 
      if (success) {
        dispatch(showPageLoader());
 
        setTimeout(() => {
          navigate(`/${domain}/verify-otp`);
        }, 1000);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      {/* Email ID */}
      <div className="flex flex-col gap-1.5">
        <label
          style={{
            ...U,
            fontWeight: 500,
            fontSize: "clamp(11px,0.85vw,13px)",
            color: "#1E293B",
          }}
        >
          Email ID <span className="text-red-500">*</span>
        </label>
 
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="username@koundinyasa.tech.com"
          disabled={isLoading}
          className="w-full h-[48px] px-4 rounded-lg border border-[#D8E2EC] bg-[#EEF5FB] outline-none"
        />
      </div>
 
      {error && <p className="text-red-500 text-xs">{error}</p>}
 
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending OTP...
          </>
        ) : (
          "Send OTP"
        )}
      </button>
 
      <div className="mt-auto pt-30 text-center text-sm text-gray-500">
        Powered by
        <span className="text-blue-600 ml-1 font-semibold">KOUNDINYASA</span>
        <span className="ml-1">Technology Services</span>
      </div>
    </form>
  );
}
 