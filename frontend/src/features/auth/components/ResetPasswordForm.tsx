import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetPasswordSchema } from "../validation/resetPasswordSchema";
import { useResetPassword } from "../hooks/useResetPassword";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { showPageLoader } from "../../employee/employeeSlice";
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
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Password
            <span className="text-red-500">
              *
            </span>
          </label>

          <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full h-[48px] px-4 pr-12 rounded-lg border border-[#D8E2EC] bg-[#EEF5FB]"
  />

  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
  >
    {showPassword ? (
      <EyeOff size={20} />
    ) : (
      <Eye size={20} />
    )}
  </button>
</div>

          <p className="text-sm text-gray-500 mt-2">
            Must be at least
            8 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Confirm Password
            <span className="text-red-500">
              *
            </span>
          </label>

          <div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full h-[48px] px-4 pr-12 rounded-lg border border-[#D8E2EC] bg-[#EEF5FB]"
  />

  <button
    type="button"
    onClick={() =>
      setShowConfirmPassword((prev) => !prev)
    }
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
  >
    {showConfirmPassword ? (
      <EyeOff size={20} />
    ) : (
      <Eye size={20} />
    )}
  </button>
</div>
        </div>

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <Button
          onClick={
            handleSubmit
          }
          className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 rounded-xl"
        >
          Reset Password
        </Button>
      </div>
    );
  }
