import {
  useState,
} from "react";

import {
  Button,
} from "../../../components/ui/button";

import {
  resetPasswordSchema,
} from "../validation/resetPasswordSchema";

import {
  useResetPassword,
} from "../hooks/useResetPassword";

export default function ResetPasswordForm() {
  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const {
    handleResetPassword,
  } =
    useResetPassword();

  const handleSubmit =
    () => {
      const result =
        resetPasswordSchema.safeParse(
          {
            password,
            confirmPassword,
          }
        );

      if (
        !result.success
      ) {
        setError(
          result.error.issues[0]
            .message
        );

        return;
      }

      setError("");

      handleResetPassword(
        password
      );
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

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="
            w-full
            h-[48px]
            px-4
            rounded-lg
            border
            border-[#D8E2EC]
            bg-[#EEF5FB]
          "
        />

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

        <input
          type="password"
          value={
            confirmPassword
          }
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="
            w-full
            h-[48px]
            px-4
            rounded-lg
            border
            border-[#D8E2EC]
            bg-[#EEF5FB]
          "
        />
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
        className="
          w-full
          h-[50px]
          bg-blue-600
          hover:bg-blue-700
          rounded-xl
        "
      >
        Reset Password
      </Button>
    </div>
  );
}