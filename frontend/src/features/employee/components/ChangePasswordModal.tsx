import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Eye,
  EyeOff,
  KeyRound,
  X,
} from "lucide-react";

import { toast } from "react-toastify";

import { useChangePasswordMutation } from "@/features/auth/api/authApi";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    changePassword,
    {
      isLoading: isChangingPassword,
    },
  ] = useChangePasswordMutation();

  // =========================
  // Reset Form
  // =========================

  useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open]);

  // =========================
  // Close Modal
  // =========================

  const handleClose = () => {
    if (isChangingPassword) {
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    onClose();
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!currentPassword.trim()) {
      toast.error(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword.trim()) {
      toast.error(
        "Please enter your new password."
      );
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error(
        "Please confirm your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New password and confirm password do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from current password."
      );
      return;
    }

    try {
      const response = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      if (response.success) {
        toast.success(
          response.message ||
            "Password changed successfully."
        );

        handleClose();
      } else {
        toast.error(
          response.message ||
            "Failed to change password."
        );
      }
    } catch (error: any) {
      console.error(
        "Change password error:",
        error
      );

      const message =
        error?.data?.message ||
        error?.error ||
        "Failed to change password. Please try again.";

      toast.error(message);
    }
  };

  // =========================
  // Don't Render
  // =========================

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isChangingPassword
        ) {
          handleClose();
        }
      }}
    >
      <div
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-xl
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* =========================
            Header
        ========================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-5
            py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-blue-50
                text-blue-600
              "
            >
              <KeyRound
                size={20}
                strokeWidth={2}
              />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                  text-[#1E3A5F]
                "
              >
                Change Password
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Update your account password
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isChangingPassword}
            className="
              rounded-md
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =========================
            Form
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >
          {/* Current Password */}

          <div>
            <label
              htmlFor="currentPassword"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Current Password
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div className="relative">
              <input
                id="currentPassword"
                name="currentPassword"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
                placeholder="Enter current password"
                autoComplete="current-password"
                disabled={isChangingPassword}
                className="
                  h-11
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  px-3
                  pr-11
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:bg-slate-50
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    (value) => !value
                  )
                }
                disabled={isChangingPassword}
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  text-slate-400
                  hover:text-slate-600
                "
              >
                {showCurrentPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}

          <div>
            <label
              htmlFor="newPassword"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              New Password
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                placeholder="Enter new password"
                autoComplete="new-password"
                disabled={isChangingPassword}
                className="
                  h-11
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  px-3
                  pr-11
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:bg-slate-50
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    (value) => !value
                  )
                }
                disabled={isChangingPassword}
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  text-slate-400
                  hover:text-slate-600
                "
              >
                {showNewPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}

          <div>
            <label
              htmlFor="confirmPassword"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Confirm Password
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Confirm new password"
                autoComplete="new-password"
                disabled={isChangingPassword}
                className="
                  h-11
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  px-3
                  pr-11
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:bg-slate-50
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (value) => !value
                  )
                }
                disabled={isChangingPassword}
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  text-slate-400
                  hover:text-slate-600
                "
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Password Match */}

          {confirmPassword.length > 0 && (
            <>
              {newPassword !== confirmPassword ? (
                <p className="text-xs text-red-500">
                  Passwords do not match.
                </p>
              ) : (
                <p className="text-xs text-green-600">
                  Passwords match.
                </p>
              )}
            </>
          )}

          {/* Buttons */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              pt-2
              sm:flex-row
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isChangingPassword}
              className="
                rounded-md
                border
                border-slate-300
                px-5
                py-2.5
                text-sm
                font-medium
                text-slate-600
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="
                rounded-md
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isChangingPassword
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}