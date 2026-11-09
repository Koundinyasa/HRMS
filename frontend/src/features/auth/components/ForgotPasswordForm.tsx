import { useState } from "react";
import type { FormEvent } from "react";
import { forgotPasswordSchema } from "../validation/forgotPasswordSchema";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { showPageLoader } from "../../employee/employeeSlice";
import { Loader2 } from "lucide-react";

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

export default function ForgotPasswordForm() {
  const [userId, setUserId] = useState("");
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
      const success = await handleForgotPassword(userId.trim());

      if (success) {
        dispatch(showPageLoader());

        setTimeout(() => {
          navigate(`/${domain}/verify-otp`);
        }, 1000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 flex flex-col gap-3"
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
          className="h-[36px] w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-600 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          style={{ ...U, fontSize: "clamp(11px, 0.85vw, 13px)" }}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500" style={U}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-[36px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        style={{ ...U, fontSize: "clamp(12px, 0.9vw, 14px)", fontWeight: 600 }}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending OTP...
          </>
        ) : (
          "Send OTP"
        )}
      </button>

    </form>
  );
}
