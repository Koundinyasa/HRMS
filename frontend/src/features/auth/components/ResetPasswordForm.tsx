import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema } from "../validation/resetPasswordSchema";
import { useResetPassword } from "../hooks/useResetPassword";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { showPageLoader } from "../../employee/employeeSlice";

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { handleResetPassword } = useResetPassword();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { domain } = useParams();


  const handleSubmit = async () => {
    const result = resetPasswordSchema.safeParse({ password, confirmPassword });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");

    const success = await handleResetPassword(
      password,
      confirmPassword
    );

    if (success) {
      dispatch(showPageLoader());

      setTimeout(() => {
        navigate(`/${domain}/login`);
      }, 1000);
    }
  };

  return (
      <div className="mt-7 space-y-3">
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-slate-800" style={U}>
            Password
            <span className="text-red-500">
              *
            </span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="h-[36px] w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-[13px] text-slate-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              style={U}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500" style={U}>
            At least 8 characters, with an uppercase letter, a lowercase
            letter, a number and a special character (@ $ ! % * ? &)
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-slate-800" style={U}>
            Confirm Password
            <span className="text-red-500">
              *
            </span>
          </label>

          <div className="relative">

            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              className="h-[36px] w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-[13px] text-slate-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              style={U}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-[12px] text-red-500" style={U}>
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-1 h-[36px] w-full rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white transition-opacity hover:opacity-90"
          style={{ ...U, fontSize: "clamp(12px, 0.9vw, 14px)", fontWeight: 600 }}
        >
          Reset Password
        </button>
      </div>
    );
}
