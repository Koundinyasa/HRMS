import { useEffect } from "react";
import { KeyRound } from "lucide-react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { hidePageLoader } from "@/features/employee/employeeSlice";

import AuthLayout from "../components/AuthLayout";
import FormCard from "../components/FormCard";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPassword() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hidePageLoader());
  }, [dispatch]);

  return (
    <AuthLayout>
      <FormCard
        icon={
          <KeyRound
            size={22}
            strokeWidth={2.5}
            className="text-[#1E293B]"
          />
        }
        title="Set new password"
        subtitle="Your new password must be different from your previous one."
      >
        <ResetPasswordForm />
      </FormCard>
    </AuthLayout>
  );
}