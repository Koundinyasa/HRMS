import { useState } from "react";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema } from "../validation/forgotPasswordSchema";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { showPageLoader } from "../../employee/employeeSlice";

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

const inputCls =
  "w-full h-[44px] rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none pl-9 pr-4 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all";

export default function ForgotPasswordForm() {
  const [userId, setUserId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { domain } = useParams();

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
  dispatch(showPageLoader());

  setTimeout(() => {
    navigate(`/${domain}/verify-otp`);
  }, 1000);
}
};

  return (
    <div className="flex flex-col gap-4">
      {/* Email ID */}
      <div className="flex flex-col gap-1.5">
        <label style={{ ...U, fontWeight: 500, fontSize: "clamp(11px,0.85vw,13px)", color: "#1E293B" }}>
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

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 rounded-xl"
      >
        Send OTP
      </button>

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