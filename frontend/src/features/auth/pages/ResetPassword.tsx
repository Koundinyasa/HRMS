import { KeyRound } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import FormCard from "../components/FormCard";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <AuthLayout>
      <FormCard
        icon={<KeyRound size={22} strokeWidth={2.5} className="text-[#1E293B]" />}
        title="Set new password"
        subtitle="Your new password must be different from previously used passwords."
      >
        <ResetPasswordForm />
      </FormCard>
    </AuthLayout>
  );
}