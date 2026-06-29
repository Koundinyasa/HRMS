import { useState } from "react";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema } from "../validation/forgotPasswordSchema";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordForm() {
  const [userId, setUserId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { handleForgotPassword } = useForgotPassword();


  const handleSubmit = async () => {
  const result = forgotPasswordSchema.safeParse({ userId });

  if (!result.success) {
    setError(result.error.issues[0].message);
    return;
  }

  setError("");

  const success = await handleForgotPassword(userId, mobileNumber);
  
  if (success) {
    navigate("/verify-otp");
  }
};

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email ID <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          value={userId}
          onChange={(e) =>
            setUserId(e.target.value)
          }
          placeholder="username@koundinyasa.tech"
          className="w-full h-[48px] px-4 rounded-lg border border-[#D8E2EC] bg-[#EEF5FB] outline-none"
        />
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile No{" "}
          <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          value={mobileNumber}
          onChange={(e) =>
            setMobileNumber(
              e.target.value
            )
          }
          placeholder="+91 98458xxxxx"
          className="w-full h-[48px] px-4 rounded-lg border border-[#D8E2EC] bg-[#EEF5FB] outline-none"
        />
      </div> */}

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 rounded-xl"
      >
        Send OTP
      </Button>

      <div className="mt-auto pt-30 text-center text-sm text-gray-500">
        Powered by
        <span className="text-blue-600 ml-1 font-semibold">
          KOUNDINYASA
        </span>
        <span className="ml-1">
          Technology Services
        </span>
      </div>
    </div>
  );
}