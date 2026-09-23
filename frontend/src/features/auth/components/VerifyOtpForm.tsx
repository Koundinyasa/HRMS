// // import { useRef, useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { Button } from "../../../components/ui/button";
// // import { verifyOtpSchema } from "../validation/verifyOtpSchema";
// // import { useVerifyOtp } from "../hooks/useVerifyOtp";
// // import { useAppSelector } from "../../../hooks/useAppSelector";
// // import { useAppDispatch } from "../../../hooks/useAppDispatch";
// // import { showPageLoader } from "../../employee/employeeSlice";

// // export default function VerifyOtpForm() {
// //   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
// //   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

// //   // const authState = useAppSelector((state) => {
// //   //   console.log("Full Redux state:", state);
// //   //   return state.auth;
// //   // });

// //   const { handleVerifyOtp } = useVerifyOtp();
// //   const navigate = useNavigate();
// //   const { domain } = useParams();
// //   const dispatch = useAppDispatch();

// //   const forgotPasswordEmployeeId = useAppSelector(
// //     (state) => state.auth.forgotPasswordEmployeeId
// //   );

// //   const handleChange = (value: string, index: number) => {
// //     // Allow only numbers
// //     if (!/^\d*$/.test(value)) return;

// //     const updatedOtp = [...otp];
// //     updatedOtp[index] = value;
// //     setOtp(updatedOtp);

// //     // Move to next input automatically
// //     if (value && index < 5) {
// //       inputRefs.current[index + 1]?.focus();
// //     }
// //   };

// //   const handleKeyDown = (
// //     e: React.KeyboardEvent<HTMLInputElement>,
// //     index: number
// //   ) => {
// //     // Move to previous input on backspace
// //     if (e.key === "Backspace" && otp[index] === "" && index > 0) {
// //       inputRefs.current[index - 1]?.focus();
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     const finalOtp = otp.join("");

// //     const result = verifyOtpSchema.safeParse({ otp: finalOtp });

// //     if (!result.success) return;

// //     const success = await handleVerifyOtp(
// //       forgotPasswordEmployeeId,
// //       finalOtp
// //     );

// //     if (success) {
// //       dispatch(showPageLoader());

// //       setTimeout(() => {
// //         navigate(`/${domain}/reset-password`);
// //       }, 1000);
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="flex justify-center gap-4 mt-8">
// //         {otp.map((digit, index) => (
// //           <input
// //             key={index}
// //             ref={(el) => {
// //               inputRefs.current[index] = el;
// //             }}
// //             type="text"
// //             inputMode="numeric"
// //             maxLength={1}
// //             value={digit}
// //             onChange={(e) => handleChange(e.target.value, index)}
// //             onKeyDown={(e) => handleKeyDown(e, index)}
// //             className="w-14 h-16 text-center text-3xl border rounded"
// //           />
// //         ))}
// //       </div>

// //       <Button
// //         onClick={handleSubmit}
// //         className="w-full mt-10 h-[50px] bg-blue-600"
// //       >
// //         Verify
// //       </Button>

// //       <div className="mt-4 flex justify-between text-sm text-gray-500">
// //         <span>OTP is valid for 3 mins</span>
// //         <span>03:00</span>
// //       </div>

// //       <div className="text-right mt-4">
// //         <button className="text-blue-600 text-sm">
// //           Resend OTP
// //         </button>
// //       </div>
// //     </>
// //   );
// // }


// import { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "../../../components/ui/button";
// import { verifyOtpSchema } from "../validation/verifyOtpSchema";
// import { useVerifyOtp } from "../hooks/useVerifyOtp";
// import { useForgotPassword } from "../hooks/useForgotPassword";
// import { useAppSelector } from "../../../hooks/useAppSelector";
// import { useAppDispatch } from "../../../hooks/useAppDispatch";
// import { showPageLoader } from "../../employee/employeeSlice";
// import { setOtpExpiry } from "../authSlice";
// import { Loader2 } from "lucide-react";

// export default function VerifyOtpForm() {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isResending, setIsResending] = useState(false);

//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const { handleVerifyOtp } = useVerifyOtp();
//   const { handleForgotPassword } = useForgotPassword();

//   const navigate = useNavigate();
//   const { domain } = useParams();
//   const dispatch = useAppDispatch();

//   // Employee ID received from forgot-password API
//   const forgotPasswordEmployeeId = useAppSelector(
//     (state) => state.auth.forgotPasswordEmployeeId
//   );

//   // Email/User ID entered on Forgot Password screen
//   const forgotPasswordUserId = useAppSelector(
//     (state) => state.auth.forgotPasswordUserId
//   );

//   // OTP expiry returned by backend
//   const otpRemainingSeconds = useAppSelector(
//     (state) => state.auth.otpRemainingSeconds ?? 0
//   );

//   const [remainingSeconds, setRemainingSeconds] = useState(
//     otpRemainingSeconds
//   );

//   // --------------------------------------------------
//   // Start / continue countdown
//   // --------------------------------------------------
//   useEffect(() => {
//     setRemainingSeconds(otpRemainingSeconds);
//   }, [otpRemainingSeconds]);

//   useEffect(() => {
//     if (remainingSeconds <= 0) {
//       return;
//     }

//     const timer = setInterval(() => {
//       setRemainingSeconds((previous) => {
//         if (previous <= 1) {
//           clearInterval(timer);

//           dispatch(
//             setOtpExpiry({
//               remainingSeconds: 0,
//               remainingMinutes: 0,
//             })
//           );

//           return 0;
//         }

//         return previous - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [remainingSeconds, dispatch]);

//   // --------------------------------------------------
//   // Format timer: 03:00, 02:59, 02:58...
//   // --------------------------------------------------
//   const minutes = Math.floor(remainingSeconds / 60);
//   const seconds = remainingSeconds % 60;

//   const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
//     seconds
//   ).padStart(2, "0")}`;

//   // --------------------------------------------------
//   // OTP input
//   // --------------------------------------------------
//   const handleChange = (value: string, index: number) => {
//     // Allow only numbers
//     if (!/^\d*$/.test(value)) return;

//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);

//     // Move to next input
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   // --------------------------------------------------
//   // Backspace
//   // --------------------------------------------------
//   const handleKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     if (
//       e.key === "Backspace" &&
//       otp[index] === "" &&
//       index > 0
//     ) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   // --------------------------------------------------
//   // Verify OTP
//   // --------------------------------------------------
//   const handleSubmit = async () => {
//     const finalOtp = otp.join("");

//     const result = verifyOtpSchema.safeParse({
//       otp: finalOtp,
//     });

//     if (!result.success) {
//       return;
//     }

//     // Do not verify expired OTP
//     if (remainingSeconds <= 0) {
//       return;
//     }

//     if (!forgotPasswordEmployeeId) {
//       console.error("Employee ID is missing");
//       return;
//     }

//     setIsVerifying(true);

//     try {
//       const success = await handleVerifyOtp(
//         forgotPasswordEmployeeId,
//         finalOtp
//       );

//       if (success) {
//         dispatch(showPageLoader());

//         setTimeout(() => {
//           navigate(`/${domain}/reset-password`);
//         }, 1000);
//       }
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   // --------------------------------------------------
//   // Resend OTP
//   // --------------------------------------------------
//   const handleResendOtp = async () => {
//     if (isResending) return;

//     if (!forgotPasswordUserId) {
//       console.error("Forgot password user ID is missing");
//       return;
//     }

//     setIsResending(true);

//     try {
//       const success = await handleForgotPassword(
//         forgotPasswordUserId,
//         ""
//       );

//       if (success) {
//         // Clear previous OTP
//         setOtp(["", "", "", "", "", ""]);

//         // Reset timer using backend response already
//         // stored in Redux by handleForgotPassword().
//         const newRemainingSeconds = 180;

//         setRemainingSeconds(newRemainingSeconds);

//         dispatch(
//           setOtpExpiry({
//             remainingSeconds: newRemainingSeconds,
//             remainingMinutes: 3,
//           })
//         );

//         // Focus first OTP input
//         inputRefs.current[0]?.focus();
//       }
//     } finally {
//       setIsResending(false);
//     }
//   };

//   return (
//     <>
//       {/* OTP Inputs */}
//       <div className="flex justify-center gap-4 mt-8">
//         {otp.map((digit, index) => (
//           <input
//             key={index}
//             ref={(el) => {
//               inputRefs.current[index] = el;
//             }}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={digit}
//             disabled={isVerifying}
//             onChange={(e) =>
//               handleChange(e.target.value, index)
//             }
//             onKeyDown={(e) =>
//               handleKeyDown(e, index)
//             }
//             className="w-14 h-16 text-center text-3xl border rounded disabled:bg-gray-100"
//           />
//         ))}
//       </div>

//       {/* Verify Button */}
//       <Button
//         onClick={handleSubmit}
//         disabled={
//           isVerifying ||
//           remainingSeconds <= 0 ||
//           otp.join("").length !== 6
//         }
//         className="w-full mt-10 h-[50px] bg-blue-600 disabled:opacity-60"
//       >
//         {isVerifying ? (
//           <>
//             <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//             Verifying...
//           </>
//         ) : (
//           "Verify"
//         )}
//       </Button>

//       {/* Timer */}
//       <div className="mt-4 flex justify-between text-sm text-gray-500">
//         <span>
//           {remainingSeconds > 0
//             ? "OTP is valid for 3 mins"
//             : "OTP has expired"}
//         </span>

//         <span
//           className={
//             remainingSeconds <= 30
//               ? "text-red-500 font-medium"
//               : ""
//           }
//         >
//           {formattedTime}
//         </span>
//       </div>

//       {/* Resend OTP */}
//       <div className="text-right mt-4">
//         <button
//           type="button"
//           onClick={handleResendOtp}
//           disabled={isResending || remainingSeconds > 0}
//           className="text-blue-600 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
//         >
//           {isResending ? (
//             <span className="flex items-center gap-1">
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Resending...
//             </span>
//           ) : (
//             "Resend OTP"
//           )}
//         </button>
//       </div>
//     </>
//   );
// }


// import { useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "../../../components/ui/button";
// import { verifyOtpSchema } from "../validation/verifyOtpSchema";
// import { useVerifyOtp } from "../hooks/useVerifyOtp";
// import { useAppSelector } from "../../../hooks/useAppSelector";
// import { useAppDispatch } from "../../../hooks/useAppDispatch";
// import { showPageLoader } from "../../employee/employeeSlice";
 
// export default function VerifyOtpForm() {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
 
//   // const authState = useAppSelector((state) => {
//   //   console.log("Full Redux state:", state);
//   //   return state.auth;
//   // });
 
//   const { handleVerifyOtp } = useVerifyOtp();
//   const navigate = useNavigate();
//   const { domain } = useParams();
//   const dispatch = useAppDispatch();
 
//   const forgotPasswordEmployeeId = useAppSelector(
//     (state) => state.auth.forgotPasswordEmployeeId
//   );
 
//   const handleChange = (value: string, index: number) => {
//     // Allow only numbers
//     if (!/^\d*$/.test(value)) return;
 
//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);
 
//     // Move to next input automatically
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };
 
//   const handleKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     // Move to previous input on backspace
//     if (e.key === "Backspace" && otp[index] === "" && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };
 
//   const handleSubmit = async () => {
//     const finalOtp = otp.join("");
 
//     const result = verifyOtpSchema.safeParse({ otp: finalOtp });
 
//     if (!result.success) return;
 
//     const success = await handleVerifyOtp(
//       forgotPasswordEmployeeId,
//       finalOtp
//     );
 
//     if (success) {
//       dispatch(showPageLoader());
 
//       setTimeout(() => {
//         navigate(`/${domain}/reset-password`);
//       }, 1000);
//     }
//   };
 
//   return (
//     <>
//       <div className="flex justify-center gap-4 mt-8">
//         {otp.map((digit, index) => (
//           <input
//             key={index}
//             ref={(el) => {
//               inputRefs.current[index] = el;
//             }}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={digit}
//             onChange={(e) => handleChange(e.target.value, index)}
//             onKeyDown={(e) => handleKeyDown(e, index)}
//             className="w-14 h-16 text-center text-3xl border rounded"
//           />
//         ))}
//       </div>
 
//       <Button
//         onClick={handleSubmit}
//         className="w-full mt-10 h-[50px] bg-blue-600"
//       >
//         Verify
//       </Button>
 
//       <div className="mt-4 flex justify-between text-sm text-gray-500">
//         <span>OTP is valid for 3 mins</span>
//         <span>03:00</span>
//       </div>
 
//       <div className="text-right mt-4">
//         <button className="text-blue-600 text-sm">
//           Resend OTP
//         </button>
//       </div>
//     </>
//   );
// }
 
 
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { verifyOtpSchema } from "../validation/verifyOtpSchema";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { showPageLoader } from "../../employee/employeeSlice";
import { setOtpExpiry } from "../authSlice";
import { Loader2 } from "lucide-react";
 
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
 
  // Employee ID received from forgot-password API
  const forgotPasswordEmployeeId = useAppSelector(
    (state) => state.auth.forgotPasswordEmployeeId
  );
 
  // Email/User ID entered on Forgot Password screen
  const forgotPasswordUserId = useAppSelector(
    (state) => state.auth.forgotPasswordUserId
  );
 
  // OTP expiry returned by backend
  const otpRemainingSeconds = useAppSelector(
    (state) => state.auth.otpRemainingSeconds ?? 0
  );
 
  const [remainingSeconds, setRemainingSeconds] = useState(
    otpRemainingSeconds
  );
 
  // --------------------------------------------------
  // Start / continue countdown
  // --------------------------------------------------
  useEffect(() => {
    setRemainingSeconds(otpRemainingSeconds);
  }, [otpRemainingSeconds]);
 
  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }
 
    const timer = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
 
          dispatch(
            setOtpExpiry({
              remainingSeconds: 0,
              remainingMinutes: 0,
            })
          );
 
          return 0;
        }
 
        return previous - 1;
      });
    }, 1000);
 
    return () => clearInterval(timer);
  }, [remainingSeconds, dispatch]);
 
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
 
    if (!forgotPasswordEmployeeId) {
      console.error("Employee ID is missing");
      return;
    }
 
    setIsVerifying(true);
 
    try {
      const success = await handleVerifyOtp(
        forgotPasswordEmployeeId,
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
      console.error("Forgot password user ID is missing");
      return;
    }
 
    setIsResending(true);
 
    try {
      const success = await handleForgotPassword(
        forgotPasswordUserId,
        ""
      );
 
      if (success) {
        // Clear previous OTP
        setOtp(["", "", "", "", "", ""]);
 
        // Reset timer using backend response already
        // stored in Redux by handleForgotPassword().
        const newRemainingSeconds = 180;
 
        setRemainingSeconds(newRemainingSeconds);
 
        dispatch(
          setOtpExpiry({
            remainingSeconds: newRemainingSeconds,
            remainingMinutes: 3,
          })
        );
 
        // Focus first OTP input
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsResending(false);
    }
  };
 
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      {/* OTP Inputs */}
      <div className="flex justify-center gap-4 mt-8">
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
            className="w-14 h-16 text-center text-3xl border rounded disabled:bg-gray-100"
          />
        ))}
      </div>
 
      {/* Verify Button */}
      <Button
        type="submit"
        disabled={
          isVerifying ||
          remainingSeconds <= 0 ||
          otp.join("").length !== 6
        }
        className="w-full mt-10 h-[50px] bg-blue-600 disabled:opacity-60"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify"
        )}
      </Button>
 
      {/* Timer */}
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>
          {remainingSeconds > 0
            ? "OTP is valid for 3 mins"
            : "OTP has expired"}
        </span>
 
        <span
          className={
            remainingSeconds <= 30
              ? "text-red-500 font-medium"
              : ""
          }
        >
          {formattedTime}
        </span>
      </div>
 
      {/* Resend OTP */}
      <div className="text-right mt-4">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isResending || remainingSeconds > 0}
          className="text-blue-600 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
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
 