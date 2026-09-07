import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { verifyOtpSchema } from "../validation/verifyOtpSchema";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { showPageLoader } from "../../employee/employeeSlice";

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // const authState = useAppSelector((state) => {
  //   console.log("Full Redux state:", state);
  //   return state.auth;
  // });

  const { handleVerifyOtp } = useVerifyOtp();
  const navigate = useNavigate();
  const { domain } = useParams();
  const dispatch = useAppDispatch();

  const forgotPasswordEmployeeId = useAppSelector(
    (state) => state.auth.forgotPasswordEmployeeId
  );

  const handleChange = (value: string, index: number) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move to next input automatically
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");

    const result = verifyOtpSchema.safeParse({ otp: finalOtp });

    if (!result.success) return;

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
  };

  return (
    <>
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
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-14 h-16 text-center text-3xl border rounded"
          />
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full mt-10 h-[50px] bg-blue-600"
      >
        Verify
      </Button>

      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>OTP is valid for 3 mins</span>
        <span>03:00</span>
      </div>

      <div className="text-right mt-4">
        <button className="text-blue-600 text-sm">
          Resend OTP
        </button>
      </div>
    </>
  );
}